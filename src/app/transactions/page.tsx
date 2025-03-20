"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useState } from "react";

export default function TransactionsPage() {
  const { accounts, selectedAccountId } = useSelector(
    (state: RootState) => state.account
  );
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showAmountFilter, setShowAmountFilter] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startAmount, setStartAmount] = useState("");
  const [endAmount, setEndAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Get the selected account
  const selectedAccount = accounts.find((acc) => acc.id === selectedAccountId);

  // Get unique categories from transactions
  const categories = selectedAccount
    ? [...new Set(selectedAccount.transactions.map((t) => t.category))]
    : [];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Filter transactions by date range, amount range, and category
  const filteredTransactions = selectedAccount?.transactions.filter(
    (transaction) => {
      // Date filtering
      if (startDate || endDate) {
        const transactionDate = new Date(transaction.date);
        if (startDate && endDate) {
          if (
            !(
              transactionDate >= new Date(startDate) &&
              transactionDate <= new Date(endDate)
            )
          ) {
            return false;
          }
        } else if (startDate) {
          if (!(transactionDate >= new Date(startDate))) {
            return false;
          }
        } else if (endDate) {
          if (!(transactionDate <= new Date(endDate))) {
            return false;
          }
        }
      }

      // Amount filtering
      if (startAmount || endAmount) {
        const amount = Math.abs(transaction.amount);
        if (startAmount && endAmount) {
          if (!(amount >= Number(startAmount) && amount <= Number(endAmount))) {
            return false;
          }
        } else if (startAmount) {
          if (!(amount >= Number(startAmount))) {
            return false;
          }
        } else if (endAmount) {
          if (!(amount <= Number(endAmount))) {
            return false;
          }
        }
      }

      // Category filtering
      if (selectedCategory && transaction.category !== selectedCategory) {
        return false;
      }

      return true;
    }
  );

  if (!selectedAccount) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Transaction History
          </h1>
          <p className="text-gray-500">
            Please select an account to view its transactions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Transaction History
        </h1>
        <p className="text-gray-500">
          View transactions for your {selectedAccount.type}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedAccount.type}
              </h2>
              <p className="text-gray-500">
                Account Number: •••• {selectedAccount.accountNumber.slice(-4)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDateFilter(!showDateFilter)}
                className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
              >
                Filter by Date
              </button>
              <button
                onClick={() => setShowAmountFilter(!showAmountFilter)}
                className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
              >
                Filter by Amount
              </button>
              <button
                onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
              >
                Filter by Category
              </button>
            </div>
          </div>
        </div>

        {showDateFilter && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="start-date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date
                </label>
                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="end-date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  End Date
                </label>
                <input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {showAmountFilter && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="min-amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Minimum Amount
                </label>
                <input
                  id="min-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={startAmount}
                  onChange={(e) => setStartAmount(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter minimum amount"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="max-amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Maximum Amount
                </label>
                <input
                  id="max-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={endAmount}
                  onChange={(e) => setEndAmount(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter maximum amount"
                />
              </div>
            </div>
          </div>
        )}

        {showCategoryFilter && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Description
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Category
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions?.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {transaction.category}
                  </td>
                  <td
                    className={`py-3 px-4 text-sm text-right ${
                      transaction.amount < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {transaction.amount < 0 ? "-" : "+"}
                    {formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
