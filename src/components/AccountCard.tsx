"use client";

interface AccountCardProps {
  type: string;
  balance: number;
  accountNumber: string;
}

const AccountCard = ({ type, balance, accountNumber }: AccountCardProps) => {
  // Format account number to show only last 4 digits
  const maskedNumber = `•••• ${accountNumber.slice(-4)}`;

  // Format balance with currency
  const formattedBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.abs(balance));

  // Get card theme based on account type
  const getCardTheme = (type: string) => {
    switch (type) {
      case "Checking Account":
        return {
          gradient: "from-blue-600 to-blue-400",
          bgGradient: "bg-gradient-to-r from-blue-50 to-white",
          icon: "💳",
        };
      case "Savings Account":
        return {
          gradient: "from-emerald-600 to-emerald-400",
          bgGradient: "bg-gradient-to-r from-emerald-50 to-white",
          icon: "💰",
        };
      case "Credit Card":
        return {
          gradient: "from-purple-600 to-violet-400",
          bgGradient: "bg-gradient-to-r from-purple-50 to-white",
          icon: "✨",
        };
      case "Student Account":
        return {
          gradient: "from-pink-600 to-rose-400",
          bgGradient: "bg-gradient-to-r from-pink-50 to-white",
          icon: "📚",
        };
      case "Investment Account":
        return {
          gradient: "from-amber-600 to-yellow-400",
          bgGradient: "bg-gradient-to-r from-amber-50 to-white",
          icon: "📈",
        };
      case "Business Checking":
        return {
          gradient: "from-indigo-600 to-blue-400",
          bgGradient: "bg-gradient-to-r from-indigo-50 to-white",
          icon: "💼",
        };
      default:
        return {
          gradient: "from-gray-600 to-gray-400",
          bgGradient: "bg-gradient-to-r from-gray-50 to-white",
          icon: "🏦",
        };
    }
  };

  const theme = getCardTheme(type);

  return (
    <div
      className={`relative w-full rounded-xl shadow-sm border border-gray-100 overflow-hidden ${theme.bgGradient} transition-transform hover:scale-[1.02] cursor-pointer`}
    >
      <div className="p-5">
        {/* Card Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">{theme.icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{type}</h3>
              <p className="text-sm text-gray-500">{maskedNumber}</p>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              balance < 0
                ? "bg-red-50 text-red-600"
                : "bg-green-50 text-green-600"
            }`}
          >
            {balance < 0 ? "Due" : "Available"}
          </div>
        </div>

        {/* Balance */}
        <div className="mt-4">
          <p className="text-sm text-gray-500">Balance</p>
          <p
            className={`text-2xl font-bold ${
              balance < 0 ? "text-red-600" : "text-gray-900"
            }`}
          >
            {formattedBalance}
          </p>
        </div>
      </div>

      {/* Gradient Bar at Bottom */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${theme.gradient}`} />
    </div>
  );
};

export default AccountCard;
