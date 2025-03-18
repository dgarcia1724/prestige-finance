"use client";

import { useSearchParams } from "next/navigation";
import { accounts } from "@/data/accounts";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("id");

  const account = accounts.find((acc) => acc.id === accountId);

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Account Not Found</h1>
        <p className="text-gray-500">
          The requested account could not be found.
        </p>
      </div>
    );
  }

  const formattedBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.abs(account.balance));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Account Profile
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {account.type}
              </h2>
              <p className="text-gray-500">
                Account Number: •••• {account.accountNumber.slice(-4)}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-500">Current Balance</p>
              <p
                className={`text-3xl font-bold ${
                  account.balance < 0 ? "text-red-600" : "text-gray-900"
                }`}
              >
                {formattedBalance}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Account Details
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  Status: <span className="font-medium">Active</span>
                </p>
                <p className="text-gray-600">
                  Type: <span className="font-medium">{account.type}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
