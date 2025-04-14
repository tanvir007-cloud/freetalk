import React from "react";
import FriendRequests from "./FriendRequests";
import Birthdays from "./Birthdays";
import Ad from "./Ad";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@prisma/client";
import { db } from "@/lib/db";

const RightMenu = async ({ currentUser }: { currentUser: User }) => {
  const friendRequests = await db.friendRequest.findMany({
    take: 5,
    where: {
      receiverId: currentUser.id,
    },
    include: { sender: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="fixed top-14 h-full px-2">
      <ScrollArea className="flex flex-col mt-6 w-full h-[88%] rounded-md">
        <div className="flex flex-col gap-6">
          <FriendRequests friendRequests={friendRequests} />
          <Birthdays />
          <Ad />
        </div>
      </ScrollArea>
    </div>
  );
};

export default RightMenu;
