import { render, screen, fireEvent, act, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import SendPage from "../page";
import accountReducer from "@/store/slices/accountSlice";
import { accounts } from "@/data/accounts";
import { friends } from "@/data/friends";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  ),
}));

const createTestStore = (accountId = "acc_001") => {
  return configureStore({
    reducer: {
      account: accountReducer,
    },
    preloadedState: {
      account: {
        accounts,
        selectedAccountId: accountId,
      },
    },
  });
};

describe("SendPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays account selection", () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <SendPage />
      </Provider>
    );

    expect(screen.getByText("From Account")).toBeInTheDocument();
    accounts.forEach((account) => {
      expect(screen.getByText(account.type)).toBeInTheDocument();
      expect(
        screen.getByText(
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(Math.abs(account.balance))
        )
      ).toBeInTheDocument();
    });
  });

  it("handles friend selection and search", async () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <SendPage />
      </Provider>
    );

    // Test friend search
    const searchInput = screen.getByPlaceholderText("Search friends by name");
    fireEvent.change(searchInput, { target: { value: "Sarah" } });

    // Check if friend is displayed
    expect(screen.getByText("Sarah Chen")).toBeInTheDocument();

    // Select a friend
    fireEvent.click(screen.getByText("Sarah Chen"));

    // Check if amount input is enabled
    const amountInput = screen.getByPlaceholderText("0.00");
    expect(amountInput).toBeInTheDocument();
  });

  it("handles transaction review and confirmation", async () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <SendPage />
      </Provider>
    );

    // Select a friend and enter amount
    fireEvent.click(screen.getByText(friends[0].name));
    const amountInput = screen.getByPlaceholderText("0.00");
    fireEvent.change(amountInput, { target: { value: "100" } });

    // Wait for the button to be enabled
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const reviewButton = screen.getByRole("button", { name: "Review & Send" });
    fireEvent.click(reviewButton);

    // Wait for review modal to appear
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Check review modal content
    expect(
      screen.getByRole("heading", { name: "Review Transaction" })
    ).toBeInTheDocument();

    // Use a more specific query for the friend's name in the review modal
    const reviewModal = screen
      .getByRole("heading", { name: "Review Transaction" })
      .closest("div");
    if (!reviewModal) throw new Error("Review modal not found");
    expect(within(reviewModal).getByText(friends[0].name)).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument();

    // Confirm transaction
    fireEvent.click(screen.getByRole("button", { name: "Confirm & Send" }));

    // Wait for success screen
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Check success screen
    expect(screen.getByText("Money Sent Successfully!")).toBeInTheDocument();
    expect(screen.getByText("Send Another Payment")).toBeInTheDocument();
  });

  it("handles navigation after successful transaction", async () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <SendPage />
      </Provider>
    );

    // Select a friend and enter amount
    fireEvent.click(screen.getByText(friends[0].name));
    const amountInput = screen.getByPlaceholderText("0.00");
    fireEvent.change(amountInput, { target: { value: "100" } });

    // Wait for the button to be enabled
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const reviewButton = screen.getByRole("button", { name: "Review & Send" });
    fireEvent.click(reviewButton);

    // Wait for review modal to appear
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Confirm transaction
    fireEvent.click(screen.getByRole("button", { name: "Confirm & Send" }));

    // Wait for success screen
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Test navigation buttons
    fireEvent.click(screen.getByText("Return to Accounts"));
    fireEvent.click(screen.getByText("View Transaction History"));
  });
});
