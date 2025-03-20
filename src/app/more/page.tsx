"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MorePage() {
  const pathname = usePathname();

  const sections = [
    {
      title: "Account Management",
      links: [
        { name: "All Accounts", href: "/accounts" },
        { name: "Transaction History", href: "/transactions" },
        { name: "Profile", href: "/profile" },
        { name: "Send Money", href: "/send" },
        { name: "Friends", href: "/friends" },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">More</h1>
        <p className="text-gray-500">
          Quick access to all your account features
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div
            key={section.title}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {section.title}
            </h2>
            <div className="space-y-2">
              {section.links.map((link) => {
                // Ensure pathname exists and matches exactly
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? "bg-purple-50 text-purple-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">{link.name}</span>
                    <svg
                      data-testid="chevron-icon"
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 5l7 7-7 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
