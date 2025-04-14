import React, { useState, useTransition } from "react";
import { friendType } from "./AllFriendRequest";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  confirmFriendRequest,
  rejectFriendRequest,
} from "@/app/actions/friendAction";
import toast from "react-hot-toast";

const FriendRequestItem = ({
  friendRequest,
}: {
  friendRequest: friendType;
}) => {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleConfirm = (senderId: string, receiverId: string) => {
    startTransition(async () => {
      const data = await confirmFriendRequest(senderId, receiverId);

      if (data.error) {
        toast.error(data.error)
      }

      if (data.success) {
        setMessage("We are now friends");
      }
    });
  };

  const handleReject = (senderId: string, receiverId: string) => {
    startTransition(async () => {
      const data = await rejectFriendRequest(senderId, receiverId);

      if (data.error) {
        toast.error(data.error)
      }

      if (data.success) {
        setMessage(data.success);
      }
    });
  };
  
  return (
    <div className="flex md:flex-col items-center flex-row md:w-56 md:border border-zinc-200 dark:border-zinc-800 rounded-md md:shadow-sm md:bg-white md:dark:bg-zinc-950 gap-4 md:gap-0 h-24 md:h-auto">
      <Link
        href={`/profile/${friendRequest.senderId}`}
        className="relative md:w-full aspect-square h-full md:size-auto"
      >
        <Image
          src={friendRequest.sender.image || "/avater.jpg"}
          className="md:rounded-t-md rounded-full md:rounded-none object-cover"
          alt=""
          fill
          sizes="1"
        />
      </Link>
      <div
        className={`flex flex-col md:p-2 w-full tracking-wide ${
          !message && "gap-y-3"
        }`}
      >
        <h1 className="truncate text-lg font-semibold">
          {friendRequest.sender.name}
        </h1>
        <div
          className={`flex md:flex-col flex-row md:gap-2 sm:gap-4 gap-3 ${
            message && "hidden md:flex"
          }`}
        >
          <Button
            className={`w-full ${message && "opacity-0 pointer-events-none"}`}
            size={"sm"}
            onClick={() =>
              handleConfirm(friendRequest.receiverId, friendRequest.senderId)
            }
            disabled={isPending}
          >
            Confirm
          </Button>
          <Button
            onClick={() =>
              handleReject(friendRequest.receiverId, friendRequest.senderId)
            }
            className="w-full"
            size={"sm"}
            variant={"destructive"}
            disabled={isPending || !!message}
          >
            {message ? message : "Reject"}
          </Button>
        </div>
        <h1
          className={`text-sm dark:text-zinc-400 text-zinc-600 ${
            message ? "md:hidden" : "hidden"
          }`}
        >
          {message}
        </h1>
      </div>
    </div>
  );
};

export default FriendRequestItem;
