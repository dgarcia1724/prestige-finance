import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import TransactionsPage from "../page";
import accountReducer from "@/store/slices/accountSlice";
import { accounts } from "@/data/accounts";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

const createTestStore = (accountId?: string) => {
  return configureStore({
    reducer: {
      account: accountReducer,
    },
    preloadedState: {
      account: {
        accounts,
        selectedAccountId: accountId || null,
      },
    },
  });
};

describe("TransactionsPage", () => {
  it("displays message when no account is selected", () => {
    const store = createTestStore();
    render(
      <Provider store={store}>
        <TransactionsPage />
      </Provider>
    );

    expect(screen.getByText("Transaction History")).toBeInTheDocument();
    expect(
      screen.getByText("Please select an account to view its transactions")
    ).toBeInTheDocument();
  });

  it("displays transactions for selected account", () => {
    const store = createTestStore("acc_001");
    render(
      <Provider store={store}>
        <TransactionsPage />
      </Provider>
    );

    // Check header
    expect(screen.getByText("Transaction History")).toBeInTheDocument();
    expect(
      screen.getByText("View transactions for your Checking Account")
    ).toBeInTheDocument();

    // Check account info
    expect(screen.getByText("Checking Account")).toBeInTheDocument();
    expect(screen.getByText("Account Number: •••• 4567")).toBeInTheDocument();

    // Check filter buttons
    expect(screen.getByText("Filter by Date")).toBeInTheDocument();
    expect(screen.getByText("Filter by Amount")).toBeInTheDocument();
    expect(screen.getByText("Filter by Category")).toBeInTheDocument();

    // Check if transactions are displayed
    const selectedAccount = accounts[0];
    selectedAccount.transactions.forEach((transaction) => {
      expect(screen.getByText(transaction.description)).toBeInTheDocument();
      // Use getAllByText for categories since they can appear multiple times
      expect(screen.getAllByText(transaction.category).length).toBeGreaterThan(
        0
      );
    });
  });

  it("filters transactions by date", async () => {
    const store = createTestStore("acc_001");
    render(
      <Provider store={store}>
        <TransactionsPage />
      </Provider>
    );

    // Open date filter
    fireEvent.click(screen.getByText("Filter by Date"));

    // Wait for the filter form to appear and find inputs by label text
    await waitFor(() => {
      const startDateInput = screen.getByLabelText("Start Date");
      const endDateInput = screen.getByLabelText("End Date");
      expect(startDateInput).toBeInTheDocument();
      expect(endDateInput).toBeInTheDocument();

      // Set date range
      fireEvent.change(startDateInput, { target: { value: "2024-01-01" } });
      fireEvent.change(endDateInput, { target: { value: "2024-12-31" } });
    });

    // Wait for filtered transactions to be displayed
    await waitFor(() => {
      const selectedAccount = accounts[0];
      selectedAccount.transactions
        .filter((t) => {
          const date = new Date(t.date);
          return (
            date >= new Date("2024-01-01") && date <= new Date("2024-12-31")
          );
        })
        .forEach((transaction) => {
          expect(screen.getByText(transaction.description)).toBeInTheDocument();
        });
    });
  });

  it("filters transactions by amount", async () => {
    const store = createTestStore("acc_001");
    render(
      <Provider store={store}>
        <TransactionsPage />
      </Provider>
    );

    // Open amount filter
    fireEvent.click(screen.getByText("Filter by Amount"));

    // Wait for the filter form to appear and find inputs by label text
    await waitFor(() => {
      const minAmountInput = screen.getByLabelText("Minimum Amount");
      const maxAmountInput = screen.getByLabelText("Maximum Amount");
      expect(minAmountInput).toBeInTheDocument();
      expect(maxAmountInput).toBeInTheDocument();

      // Set amount range
      fireEvent.change(minAmountInput, { target: { value: "100" } });
      fireEvent.change(maxAmountInput, { target: { value: "1000" } });
    });

    // Wait for filtered transactions to be displayed
    await waitFor(() => {
      const selectedAccount = accounts[0];
      selectedAccount.transactions
        .filter((t) => {
          const amount = Math.abs(t.amount);
          return amount >= 100 && amount <= 1000;
        })
        .forEach((transaction) => {
          expect(screen.getByText(transaction.description)).toBeInTheDocument();
        });
    });
  });

  it("filters transactions by category", async () => {
    const store = createTestStore("acc_001");
    render(
      <Provider store={store}>
        <TransactionsPage />
      </Provider>
    );

    // Open category filter
    fireEvent.click(screen.getByText("Filter by Category"));

    // Get unique categories
    const selectedAccount = accounts[0];
    const categories = [
      ...new Set(selectedAccount.transactions.map((t) => t.category)),
    ];

    // Wait for the filter form to appear and find select by label text
    await waitFor(() => {
      const categorySelect = screen.getByLabelText("Category");
      expect(categorySelect).toBeInTheDocument();

      // Select a category
      fireEvent.change(categorySelect, { target: { value: categories[0] } });
    });

    // Wait for filtered transactions to be displayed
    await waitFor(() => {
      selectedAccount.transactions
        .filter((t) => t.category === categories[0])
        .forEach((transaction) => {
          expect(screen.getByText(transaction.description)).toBeInTheDocument();
        });
    });
  });
});
