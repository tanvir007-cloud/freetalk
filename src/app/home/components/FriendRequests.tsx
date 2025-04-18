"use client";
import Avatar from "@/components/Avatar";
import { Check, X } from "lucide-react";
import Link from "next/link";
import React, { useTransition } from "react";
import {
  confirmFriendRequest,
  rejectFriendRequest,
} from "@/app/actions/friendAction";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { friendType } from "@/app/(main)/friends/components/AllFriendRequest";

const FriendRequests = ({
  friendRequests,
}: {
  friendRequests: friendType[];
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  if (friendRequests.length === 0) return null;

  const handleConfirm = (senderId: string, receiverId: string) => {
    startTransition(async () => {
      const data = await confirmFriendRequest(senderId, receiverId);

      if (data.error) {
        toast.error(data.error);
      }

      if (data.success) {
        router.refresh();
        toast.success(data.success);
      }
    });
  };

  const handleReject = (senderId: string, receiverId: string) => {
    startTransition(async () => {
      const data = await rejectFriendRequest(senderId, receiverId);

      if (data.error) {
        toast.error(data.error);
      }

      if (data.success) {
        toast.success(data.success);
        router.refresh();
      }
    });
  };

  return (
    <div className="p-4 bg-white dark:bg-zinc-900 rounded-md shadow-md flex flex-col gap-4">
      <div className="flex items-center justify-between font-medium">
        <span className="text-zinc-500 dark:text-zinc-400">
          Friend Requests
        </span>
        <Link
          href={"/friends"}
          className="text-blue-600 text-sm hover:underline transition"
        >
          See all
        </Link>
      </div>
      {friendRequests.map((friendRequest) => (
        <div
          className="flex items-center justify-between"
          key={friendRequest.id}
        >
          <div className="flex items-center gap-2">
            <Link href={`/profile/${friendRequest.senderId}`}>
              <Avatar
                src={friendRequest.sender.image || ""}
                className="size-8"
              />
            </Link>
            <span className="text-sm">{friendRequest.sender.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="bg-blue-600 rounded-full p-[2px] transition cursor-pointer hover:bg-blue-700 text-white disabled:opacity-50"
              disabled={isPending}
              onClick={() =>
                handleConfirm(friendRequest.receiverId, friendRequest.senderId)
              }
            >
              <Check size={13} />
            </button>
            <button
              className="rounded-full p-[2px] transition dark:bg-zinc-600 dark:hover:bg-zinc-700 bg-zinc-300 hover:bg-zinc-400/70 cursor-pointer dark:text-rose-500 text-zinc-500 disabled:opacity-50"
              disabled={isPending}
              onClick={() =>
                handleReject(friendRequest.receiverId, friendRequest.senderId)
              }
            >
              <X size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequests;
