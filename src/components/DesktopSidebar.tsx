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

const DesktopSidebar = () => {
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
    <aside className="hidden md:flex fixed left-0 top-16 bottom-0 w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex flex-col py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-6 py-3 space-x-3 hover:bg-gray-50 ${
              pathname === item.href
                ? "text-purple-600 bg-purple-50"
                : "text-gray-600"
            }`}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default DesktopSidebar;
