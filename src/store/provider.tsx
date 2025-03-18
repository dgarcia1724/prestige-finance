"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { ReduxPersist } from "@/components/ReduxPersist";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ReduxPersist>{children}</ReduxPersist>
    </Provider>
  );
}
