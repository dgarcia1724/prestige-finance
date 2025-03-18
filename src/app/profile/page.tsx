"use client";

import { useSearchParams } from "next/navigation";
import { user } from "@/data/user";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { deposit, withdraw } from "@/store/slices/accountSlice";
import { useState } from "react";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("id");
  const dispatch = useDispatch();
  const { accounts, selectedAccountId } = useSelector(
    (state: RootState) => state.account
  );
  const [amount, setAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState<
    "deposit" | "withdraw" | null
  >(null);

  // If no account ID is provided, use the selected account
  const account = accountId
    ? accounts.find((acc) => acc.id === accountId)
    : accounts.find((acc) => acc.id === selectedAccountId);

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

  const handleTransaction = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    if (transactionType === "deposit") {
      dispatch(deposit({ accountId: account.id, amount: numAmount }));
    } else if (transactionType === "withdraw") {
      dispatch(withdraw({ accountId: account.id, amount: numAmount }));
    }

    setAmount("");
    setShowModal(false);
    setTransactionType(null);
  };

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
                <button
                  onClick={() => {
                    setTransactionType("deposit");
                    setShowModal(true);
                  }}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                >
                  Deposit
                </button>
                <button
                  onClick={() => {
                    setTransactionType("withdraw");
                    setShowModal(true);
                  }}
                  className="flex-1 bg-white text-purple-600 border border-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
                >
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

      {/* Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">
              {transactionType === "deposit" ? "Deposit" : "Withdraw"}
            </h2>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <div className="flex gap-4">
              <button
                onClick={handleTransaction}
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setTransactionType(null);
                  setAmount("");
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
