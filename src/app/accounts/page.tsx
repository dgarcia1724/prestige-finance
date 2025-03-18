"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import AccountCard from "@/components/AccountCard";

export default function AccountsPage() {
  const { accounts } = useSelector((state: RootState) => state.account);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Accounts</h1>
        <p className="text-gray-500">
          View and manage all your accounts in one place
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            id={account.id}
            type={account.type}
            balance={account.balance}
            accountNumber={account.accountNumber}
          />
        ))}
      </div>
    </div>
  );
}
