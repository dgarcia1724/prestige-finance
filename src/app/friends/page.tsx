"use client";

import { friends } from "@/data/friends";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FriendsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Friends</h1>
        <p className="text-gray-500">Send money to your friends and family</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {friends.map((friend) => (
            <div
              key={friend.userId}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-purple-200 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={friend.profileImage}
                    alt={`${friend.name}'s profile picture`}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <h2 className="font-medium text-gray-900">{friend.name}</h2>
                  <p className="text-sm text-gray-500">ID: {friend.userId}</p>
                </div>
              </div>
              <button
                onClick={() => router.push(`/send?friend=${friend.userId}`)}
                className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
              >
                Send Money
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
