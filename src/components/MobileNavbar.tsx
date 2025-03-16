"use client";

import {
  BanknotesIcon,
  UserCircleIcon,
  PaperAirplaneIcon,
  ClockIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNavbar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Accounts",
      href: "/accounts",
      icon: BanknotesIcon,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: UserCircleIcon,
    },
    {
      name: "Send",
      href: "/send",
      icon: PaperAirplaneIcon,
    },
    {
      name: "Transactions",
      href: "/transactions",
      icon: ClockIcon,
    },
    {
      name: "More",
      href: "/more",
      icon: Bars3Icon,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white shadow-lg md:hidden">
      <div className="flex h-full items-center justify-around px-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center justify-center space-y-1"
          >
            <item.icon
              className={`h-6 w-6 ${
                pathname === item.href ? "text-purple-600" : "text-gray-600"
              }`}
            />
            <span
              className={`text-xs ${
                pathname === item.href ? "text-purple-600" : "text-gray-600"
              }`}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavbar;
