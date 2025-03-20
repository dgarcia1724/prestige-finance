"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setAccountState } from "@/store/slices/accountSlice";

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

export function ReduxPersist({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const accountState = useSelector((state: RootState) => state.account);
  const dispatch = useDispatch();

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem("accountState");
      if (savedState) {
        const parsedState = JSON.parse(savedState) as AccountState;
        dispatch(setAccountState(parsedState));
      }
    } catch (error) {
      console.error("Error loading state from localStorage:", error);
    }
    setIsHydrated(true);
  }, [dispatch]);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("accountState", JSON.stringify(accountState));
    }
  }, [accountState, isHydrated]);

  // Don't render anything until hydration is complete
  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
}
