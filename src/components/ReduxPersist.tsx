"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function ReduxPersist({ children }: { children: React.ReactNode }) {
  const accountState = useSelector((state: RootState) => state.account);
  const [, setStoredState] = useLocalStorage("accountState", accountState);

  useEffect(() => {
    setStoredState(accountState);
  }, [accountState, setStoredState]);

  return <>{children}</>;
}
