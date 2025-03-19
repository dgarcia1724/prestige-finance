"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { selectAccount } from "@/store/slices/accountSlice";
import { useState } from "react";

export default function SendPage() {
  const dispatch = useDispatch();
  const { accounts, selectedAccountId } = useSelector(
    (state: RootState) => state.account
  );
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // Get the selected account
  const selectedAccount = accounts.find((acc) => acc.id === selectedAccountId);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));
  };

  if (!selectedAccount) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Send Money</h1>
          <p className="text-gray-500">
            Please select an account to send money from
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Send Money</h1>
        <p className="text-gray-500">Send money to friends and family</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Account Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            From Account
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => dispatch(selectAccount(account.id))}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                  selectedAccountId === account.id
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 hover:border-purple-200"
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-900">
                    {account.type}
                  </span>
                  <span className="text-sm text-gray-500">
                    •••• {account.accountNumber.slice(-4)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(account.balance)}
                  </span>
                  <span className="text-xs text-gray-500 block">Available</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Send Money Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Email
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="Enter recipient's email"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-2 pl-7 border rounded-lg"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a note"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <button className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer">
            Send Money
          </button>
        </div>
      </div>
    </div>
  );
}
