"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { selectAccount, withdraw } from "@/store/slices/accountSlice";
import { useState, useEffect } from "react";
import { friends } from "@/data/friends";
import { useSearchParams, useRouter } from "next/navigation";

export default function SendPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accounts, selectedAccountId } = useSelector(
    (state: RootState) => state.account
  );
  const [selectedFriend, setSelectedFriend] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  // Get the selected account
  const selectedAccount = accounts.find((acc) => acc.id === selectedAccountId);

  // Handle friend parameter from URL
  useEffect(() => {
    const friendId = searchParams.get("friend");
    if (friendId) {
      setSelectedFriend(friendId);
    }
  }, [searchParams]);

  // Auto-hide error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));
  };

  // Filter friends based on search query
  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleReview = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (numAmount > Math.abs(selectedAccount.balance)) {
      setError("Insufficient funds");
      return;
    }

    setShowReviewModal(true);
  };

  const handleConfirmSend = () => {
    const numAmount = parseFloat(amount);
    if (selectedAccountId) {
      dispatch(withdraw({ accountId: selectedAccountId, amount: numAmount }));
      setShowReviewModal(false);
      setShowSuccessScreen(true);
    }
  };

  const selectedFriendData = friends.find((f) => f.userId === selectedFriend);

  if (showSuccessScreen) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Money Sent Successfully!
            </h1>
            <p className="text-gray-500">
              Your payment of {formatCurrency(parseFloat(amount))} has been sent
              to {selectedFriendData?.name}
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                setShowSuccessScreen(false);
                setAmount("");
                setDescription("");
                setSelectedFriend("");
              }}
              className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
            >
              Send Another Payment
            </button>
            <button
              onClick={() => router.push("/accounts")}
              className="w-full bg-white text-purple-600 border border-purple-600 px-4 py-3 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
            >
              Return to Accounts
            </button>
            <button
              onClick={() => router.push("/transactions")}
              className="w-full bg-white text-purple-600 border border-purple-600 px-4 py-3 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
            >
              View Transaction History
            </button>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Friend Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Friend
          </label>

          {/* Selected Friend Display */}
          {selectedFriend && (
            <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={selectedFriendData?.profileImage}
                    alt={`${selectedFriendData?.name}'s profile picture`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Selected Friend</p>
                  <p className="font-medium text-gray-900">
                    {selectedFriendData?.name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedFriend("");
                    setError("");
                  }}
                  className="ml-auto p-1 hover:bg-purple-100 rounded-full transition-colors cursor-pointer"
                >
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search friends by name"
            className="w-full p-2 border rounded-lg mb-2"
          />
          <div className="max-h-48 overflow-y-auto border rounded-lg">
            {filteredFriends.map((friend) => (
              <button
                key={friend.userId}
                onClick={() => {
                  setSelectedFriend(friend.userId);
                  setError("");
                }}
                className={`w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                  selectedFriend === friend.userId
                    ? "bg-purple-50 border-purple-200"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <img
                      src={friend.profileImage}
                      alt={`${friend.name}'s profile picture`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <span className="font-medium text-gray-900">
                    {friend.name}
                  </span>
                </div>
                {selectedFriend === friend.userId && (
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
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
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
              placeholder="0.00"
              className={`w-full p-2 pl-7 border rounded-lg ${
                error ? "border-red-500" : ""
              }`}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Description Input */}
        <div className="mb-6">
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

        {/* Review Button */}
        <button
          onClick={handleReview}
          className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedFriend || !amount || parseFloat(amount) <= 0}
        >
          Review & Send
        </button>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Review Transaction</h2>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={selectedFriendData?.profileImage}
                    alt={`${selectedFriendData?.name}'s profile picture`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sending to</p>
                  <p className="font-medium text-gray-900">
                    {selectedFriendData?.name}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatCurrency(parseFloat(amount))}
                </p>
              </div>

              {description && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Note</p>
                  <p className="font-medium text-gray-900">{description}</p>
                </div>
              )}

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">From Account</p>
                <p className="font-medium text-gray-900">
                  {selectedAccount.type} ••••{" "}
                  {selectedAccount.accountNumber.slice(-4)}
                </p>
                <p className="text-sm text-gray-500">
                  Available: {formatCurrency(selectedAccount.balance)}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleConfirmSend}
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
              >
                Confirm & Send
              </button>
              <button
                onClick={() => setShowReviewModal(false)}
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
