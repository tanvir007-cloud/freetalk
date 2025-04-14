import { auth } from "@/auth/auth";
import Avatar from "@/components/Avatar";
import { buttonVariants } from "@/components/ui/button";
import { db } from "@/lib/db";
import { formatNumber } from "@/lib/helper";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const ProfileCard = async () => {
  const session = await auth();

  if (!session?.user?.email) return null;

  const currentUser = await db.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      cover: true,
      image: true,
      name: true,
      _count: { select: { friendUsers: true, myUsers: true } },
    },
  });

  if (!currentUser) return redirect("/login");

  const totalFriends =
    (currentUser._count.myUsers || 0) + (currentUser._count.friendUsers || 0);

  const friends = await db.friend.findMany({
    where: {
      OR: [{ userId: currentUser.id }, { friendId: currentUser.id }],
    },
    select: {
      userId: true,
      user: { select: { image: true, id: true } },
      friend: { select: { image: true, id: true } },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const myFriends = friends.map((f) =>
    f.userId === currentUser.id ? f.friend : f.user
  );

  return (
    <div className="p-4 bg-white dark:bg-zinc-900 rounded-md shadow-md flex flex-col gap-1">
      <div>
        <div className="relative h-20 flex flex-col items-center">
          {currentUser.cover ? (
            <Image
              src={currentUser.cover}
              fill
              sizes="1"
              alt=""
              className="rounded-md object-cover"
            />
          ) : (
            <div className="h-full w-full dark:bg-zinc-950 bg-zinc-200 rounded-md" />
          )}
          <div className="absolute -bottom-6">
            <Avatar
              src={currentUser.image || ""}
              className="size-14 ring-3 ring-white dark:ring-zinc-900"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center mt-7">
          <span className="capitalize font-semibold">{currentUser.name}</span>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {myFriends.map((friend) => (
                <Avatar
                  key={friend.id}
                  src={friend.image || ""}
                  className="size-6 ring-2 ring-white dark:ring-zinc-900"
                />
              ))}
            </div>
            <span className="-tracking-tighter font-thin text-zinc-600 dark:text-zinc-400">
              {totalFriends > 0 ? `${formatNumber(totalFriends)} ` : "No "}
              Friends
            </span>
          </div>
          <Link
            href={`/profile/${currentUser.id}`}
            className={buttonVariants({
              className: "w-full mt-2",
              size: "sm",
              variant: "outline",
            })}
          >
            My Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
