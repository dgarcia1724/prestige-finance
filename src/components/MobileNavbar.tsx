"use client";

import {
  BanknotesIcon,
  UserCircleIcon,
  PaperAirplaneIcon,
  ClockIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

const MobileNavbar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white shadow-lg md:hidden">
      <div className="flex h-full items-center justify-around px-4">
        <button className="flex flex-col items-center justify-center space-y-1">
          <BanknotesIcon className="h-6 w-6 text-gray-600" />
          <span className="text-xs text-gray-600">Accounts</span>
        </button>

        <button className="flex flex-col items-center justify-center space-y-1">
          <UserCircleIcon className="h-6 w-6 text-gray-600" />
          <span className="text-xs text-gray-600">Profile</span>
        </button>

        <button className="flex flex-col items-center justify-center space-y-1">
          <PaperAirplaneIcon className="h-6 w-6 text-gray-600" />
          <span className="text-xs text-gray-600">Send</span>
        </button>

        <button className="flex flex-col items-center justify-center space-y-1">
          <ClockIcon className="h-6 w-6 text-gray-600" />
          <span className="text-xs text-gray-600">Transactions</span>
        </button>

        <button className="flex flex-col items-center justify-center space-y-1">
          <Bars3Icon className="h-6 w-6 text-gray-600" />
          <span className="text-xs text-gray-600">More</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileNavbar;
