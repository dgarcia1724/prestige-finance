import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ProfilePage from "../page";
import accountReducer from "@/store/slices/accountSlice";
import { accounts } from "@/data/accounts";
import { user } from "@/data/user";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(`id=${accounts[0].id}`),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    className,
    sizes,
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img src={src} alt={alt} className={className} sizes={sizes} />
  ),
}));

// Create a test store with a specific account
const createTestStore = (accountId = accounts[0].id) => {
  const initialState = {
    accounts: accounts,
    selectedAccountId: accountId,
  };

  return configureStore({
    reducer: {
      account: accountReducer,
    },
    preloadedState: {
      account: initialState,
    },
  });
};

describe("ProfilePage", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    // Reset timers
    jest.useRealTimers();
  });

  it("displays user information correctly", () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <ProfilePage />
      </Provider>
    );

    expect(screen.getByText(user.name)).toBeInTheDocument();
    expect(screen.getByText(user.email)).toBeInTheDocument();
  });

  it("displays account information correctly", () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <ProfilePage />
      </Provider>
    );

    const account = accounts[0];
    expect(
      screen.getByRole("heading", { name: account.type })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Account Number:", { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(Math.abs(account.balance))
      )
    ).toBeInTheDocument();
  });

  it("handles deposit transaction correctly", async () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <ProfilePage />
      </Provider>
    );

    // Open deposit modal
    fireEvent.click(screen.getByRole("button", { name: "Deposit" }));
    expect(
      screen.getByRole("heading", { name: "Deposit" })
    ).toBeInTheDocument();

    // Enter amount and confirm
    const input = screen.getByPlaceholderText("Enter amount");
    fireEvent.change(input, { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    // Modal should close
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "Deposit" })
      ).not.toBeInTheDocument();
    });

    // Check if balance was updated
    const newBalance = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(accounts[0].balance + 100));
    expect(screen.getByText(newBalance)).toBeInTheDocument();
  });

  it("handles withdraw transaction correctly", async () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <ProfilePage />
      </Provider>
    );

    // Open withdraw modal
    fireEvent.click(screen.getByRole("button", { name: "Withdraw" }));
    expect(
      screen.getByRole("heading", { name: "Withdraw" })
    ).toBeInTheDocument();

    // Enter amount and confirm
    const input = screen.getByPlaceholderText("Enter amount");
    fireEvent.change(input, { target: { value: "50" } });
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    // Modal should close
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "Withdraw" })
      ).not.toBeInTheDocument();
    });

    // Check if balance was updated
    const newBalance = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(accounts[0].balance - 50));
    expect(screen.getByText(newBalance)).toBeInTheDocument();
  });

  it("shows error for insufficient funds", async () => {
    jest.useFakeTimers();
    const store = createTestStore();
    render(
      <Provider store={store}>
        <ProfilePage />
      </Provider>
    );

    // Open withdraw modal
    fireEvent.click(screen.getByRole("button", { name: "Withdraw" }));

    // Enter amount larger than balance
    const input = screen.getByPlaceholderText("Enter amount");
    fireEvent.change(input, { target: { value: "1000000" } });
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    // Check error message
    expect(screen.getByText("Insufficient funds")).toBeInTheDocument();

    // Fast forward 3 seconds
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    // Error should disappear
    expect(screen.queryByText("Insufficient funds")).not.toBeInTheDocument();
  });

  it("closes modal when clicking outside", () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <ProfilePage />
      </Provider>
    );

    // Open modal
    fireEvent.click(screen.getByRole("button", { name: "Deposit" }));
    expect(
      screen.getByRole("heading", { name: "Deposit" })
    ).toBeInTheDocument();

    // Click outside modal
    fireEvent.click(screen.getByTestId("modal-overlay"));

    // Modal should close
    expect(
      screen.queryByRole("heading", { name: "Deposit" })
    ).not.toBeInTheDocument();
  });

  it("closes modal when pressing Escape", () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <ProfilePage />
      </Provider>
    );

    // Open modal
    fireEvent.click(screen.getByRole("button", { name: "Deposit" }));
    expect(
      screen.getByRole("heading", { name: "Deposit" })
    ).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(document, { key: "Escape" });

    // Modal should close
    expect(
      screen.queryByRole("heading", { name: "Deposit" })
    ).not.toBeInTheDocument();
  });
});
