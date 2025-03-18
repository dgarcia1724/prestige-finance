import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { accounts } from "@/data/accounts";

interface Account {
  id: string;
  type: string;
  accountNumber: string;
  balance: number;
}

interface AccountState {
  accounts: Account[];
  selectedAccountId: string | null;
}

// Load initial state from localStorage or use default
const loadState = (): AccountState => {
  if (typeof window === "undefined") {
    return {
      accounts: accounts,
      selectedAccountId: accounts[0]?.id || null,
    };
  }

  try {
    const serializedState = localStorage.getItem("accountState");
    if (serializedState === null) {
      return {
        accounts: accounts,
        selectedAccountId: accounts[0]?.id || null,
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Error loading state from localStorage:", err);
    return {
      accounts: accounts,
      selectedAccountId: accounts[0]?.id || null,
    };
  }
};

const initialState: AccountState = loadState();

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    selectAccount: (state, action: PayloadAction<string>) => {
      state.selectedAccountId = action.payload;
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("accountState", JSON.stringify(state));
      }
    },
    deposit: (
      state,
      action: PayloadAction<{ accountId: string; amount: number }>
    ) => {
      const account = state.accounts.find(
        (acc) => acc.id === action.payload.accountId
      );
      if (account) {
        account.balance += action.payload.amount;
        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("accountState", JSON.stringify(state));
        }
      }
    },
    withdraw: (
      state,
      action: PayloadAction<{ accountId: string; amount: number }>
    ) => {
      const account = state.accounts.find(
        (acc) => acc.id === action.payload.accountId
      );
      if (account) {
        account.balance -= action.payload.amount;
        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("accountState", JSON.stringify(state));
        }
      }
    },
  },
});

export const { selectAccount, deposit, withdraw } = accountSlice.actions;
export default accountSlice.reducer;
