"use client";

import { useSearchParams } from "next/navigation";
import { user } from "@/data/user";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { deposit, withdraw, selectAccount } from "@/store/slices/accountSlice";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("id");
  const dispatch = useDispatch();
  const { accounts, selectedAccountId } = useSelector(
    (state: RootState) => state.account
  );
  const [amount, setAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [transactionType, setTransactionType] = useState<
    "deposit" | "withdraw" | null
  >(null);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
        setTransactionType(null);
        setAmount("");
        setError("");
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showModal]);

  // Auto-hide error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const closeModal = () => {
    setShowModal(false);
    setTransactionType(null);
    setAmount("");
    setError("");
  };

  // If an account ID is provided in the URL, use it and update selected account
  useEffect(() => {
    if (accountId) {
      dispatch(selectAccount(accountId));
    }
  }, [accountId, dispatch]);

  // If no account ID is provided and no account is selected, select the first account
  useEffect(() => {
    if (!accountId && !selectedAccountId && accounts.length > 0) {
      dispatch(selectAccount(accounts[0].id));
    }
  }, [accountId, selectedAccountId, accounts, dispatch]);

  // Get the current account
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
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (transactionType === "deposit") {
      dispatch(deposit({ accountId: account.id, amount: numAmount }));
      closeModal();
    } else if (transactionType === "withdraw") {
      if (numAmount > Math.abs(account.balance)) {
        setError("Insufficient funds");
        return;
      }
      dispatch(withdraw({ accountId: account.id, amount: numAmount }));
      closeModal();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Error Notification */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

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
                    setError("");
                  }}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                >
                  Deposit
                </button>
                <button
                  onClick={() => {
                    setTransactionType("withdraw");
                    setShowModal(true);
                    setError("");
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
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">
              {transactionType === "deposit" ? "Deposit" : "Withdraw"}
            </h2>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
              placeholder="Enter amount"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <div className="flex gap-4">
              <button
                onClick={handleTransaction}
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!amount || parseFloat(amount) <= 0}
              >
                Confirm
              </button>
              <button
                onClick={closeModal}
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
