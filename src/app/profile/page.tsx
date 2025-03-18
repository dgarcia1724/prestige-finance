"use client";

import { useSearchParams } from "next/navigation";
import { accounts } from "@/data/accounts";
import { user } from "@/data/user";
import Image from "next/image";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("id");

  // If no account ID is provided, use the first account as default
  const account = accountId
    ? accounts.find((acc) => acc.id === accountId)
    : accounts[0];

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
        <div className="flex items-center gap-6 mb-8">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src={user.profileImage}
              alt={`${user.name}'s profile picture`}
              fill
              className="object-cover"
              sizes="96px"
              priority
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

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
              <div className="flex gap-4 mt-4">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Deposit
                </button>
                <button className="flex-1 bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                  Withdraw
                </button>
              </div>
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
