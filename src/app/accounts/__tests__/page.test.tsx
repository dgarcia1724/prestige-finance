import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import AccountsPage from "../page";
import accountReducer from "@/store/slices/accountSlice";
import { accounts } from "@/data/accounts";

// Create a test store
const createTestStore = (
  initialState = { accounts, selectedAccountId: accounts[0]?.id || null }
) => {
  return configureStore({
    reducer: {
      account: accountReducer,
    },
    preloadedState: {
      account: initialState,
    },
  });
};

describe("AccountsPage", () => {
  it("renders the accounts page title", () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <AccountsPage />
      </Provider>
    );

    expect(screen.getByText("Your Accounts")).toBeInTheDocument();
    expect(
      screen.getByText("View and manage all your accounts in one place")
    ).toBeInTheDocument();
  });

  it("renders all accounts from the store", () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <AccountsPage />
      </Provider>
    );

    // Check if all accounts are rendered
    accounts.forEach((account) => {
      expect(screen.getByText(account.type)).toBeInTheDocument();
    });
  });

  it("renders the correct number of account cards", () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <AccountsPage />
      </Provider>
    );

    const accountCards = screen.getAllByRole("button");
    expect(accountCards).toHaveLength(accounts.length);
  });
});
