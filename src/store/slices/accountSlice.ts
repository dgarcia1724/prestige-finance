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
  },
});

export const { selectAccount, deposit, withdraw, setAccountState } =
  accountSlice.actions;
export default accountSlice.reducer;
