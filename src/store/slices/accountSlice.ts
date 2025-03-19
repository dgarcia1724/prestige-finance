import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { accounts } from "@/data/accounts";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
}

interface Account {
  id: string;
  type: string;
  accountNumber: string;
  balance: number;
  transactions: Transaction[];
}

interface AccountState {
  accounts: Account[];
  selectedAccountId: string | null;
}

interface AddTransactionPayload {
  accountId: string;
  transaction: Omit<Transaction, "id">;
}

const initialState: AccountState = {
  accounts: accounts,
  selectedAccountId: accounts[0]?.id || null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    selectAccount: (state, action: PayloadAction<string>) => {
      state.selectedAccountId = action.payload;
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
      }
    },
    setAccountState: (state, action: PayloadAction<AccountState>) => {
      state.accounts = action.payload.accounts;
      state.selectedAccountId = action.payload.selectedAccountId;
    },
    addTransaction: (state, action: PayloadAction<AddTransactionPayload>) => {
      const account = state.accounts.find(
        (acc) => acc.id === action.payload.accountId
      );
      if (account) {
        const newTransaction = {
          ...action.payload.transaction,
          id: Date.now().toString(), // Generate a unique ID
        };
        account.transactions.unshift(newTransaction); // Add to beginning of array
      }
    },
  },
});

export const {
  selectAccount,
  deposit,
  withdraw,
  setAccountState,
  addTransaction,
} = accountSlice.actions;
export default accountSlice.reducer;
