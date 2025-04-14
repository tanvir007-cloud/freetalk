import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const UserFriendCard = async ({ userId }: { userId: string }) => {
  const friends = await db.friend.findMany({
    where: {
      OR: [{ userId }, { friendId: userId }],
    },
    include: {
      friend: { select: { name: true, id: true, image: true } },
      user: { select: { name: true, id: true, image: true } },
    },
    take: 9,
    orderBy: { createdAt: "desc" },
  });

  if (friends.length === 0) return null;

  const myFriends = friends.map((friend) =>
    friend.userId === userId ? friend.friend : friend.user
  );

  return (
    <div
      className={cn(
        "p-4 bg-white dark:bg-zinc-900 md:rounded-md shadow-md flex flex-col gap-4"
      )}
    >
      <div className="flex items-center justify-between font-medium">
        <span className="text-zinc-500 dark:text-zinc-400 text-xl font-semibold">
          Friends
        </span>
        <TabsList className="dark:bg-transparent p-0 bg-transparent">
          <TabsTrigger
            value="friends"
            className="text-blue-600 text-sm hover:underline transition"
          >
            See all
          </TabsTrigger>
        </TabsList>
      </div>
      <div className={cn("grid grid-cols-3 gap-2")}>
        {myFriends.map((friend) => (
          <div className="flex flex-col gap-1" key={friend.id}>
            <Link href={`/profile/${friend.id}`}>
              <div
                className={cn(
                  "relative aspect-square size-full cursor-pointer"
                )}
              >
                <Image
                  src={friend.image || "/avater.jpg"}
                  alt=""
                  fill
                  sizes="1"
                  className="rounded-sm object-cover"
                />
              </div>
            </Link>
            <h1 className="text-sm capitalize">{friend.name}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserFriendCard;
