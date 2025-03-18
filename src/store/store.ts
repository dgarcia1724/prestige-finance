import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./slices/accountSlice";
import { accounts } from "@/data/accounts";

export const store = configureStore({
  reducer: {
    account: accountReducer,
  },
  preloadedState: {
    account: {
      accounts: accounts,
      selectedAccountId: accounts[0]?.id || null,
    },
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
