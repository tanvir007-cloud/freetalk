import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useTransition } from "react";
import { suggestType } from "./AllFriendRequest";
import { addFriend, removeSuggestFriend } from "@/app/actions/friendAction";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const FriendSuggestItem = ({
  suggestUser,
  userId,
}: {
  suggestUser: suggestType;
  userId: string;
}) => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAddFriend = (receiverId: string) => {
    startTransition(async () => {
      const data = await addFriend(userId, receiverId);
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        setMessage("You send friend request");
      }
    });
  };

  const handleRemove = (receiverId: string) => {
    startTransition(async () => {
      const data = await removeSuggestFriend(userId, receiverId);
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["suggestUser", userId] });
      }
    });
  };

  return (
    <div className="flex md:flex-col items-center flex-row md:w-56 md:border border-zinc-200 dark:border-zinc-800 rounded-md md:shadow-sm md:bg-white md:dark:bg-zinc-950 gap-4 md:gap-0 h-24 md:h-auto">
      <Link
        href={`/profile/${suggestUser.id}`}
        className="relative md:w-full aspect-square h-full md:size-auto"
      >
        <Image
          src={suggestUser.image || "/avater.jpg"}
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
        <h1 className="truncate text-lg font-semibold">{suggestUser.name}</h1>
        <div
          className={`flex md:flex-col flex-row md:gap-2 sm:gap-4 gap-3 ${
            message && "hidden md:flex"
          }`}
        >
          <Button
            onClick={() => handleAddFriend(suggestUser.id)}
            className={`w-full ${message && "opacity-0 pointer-events-none"}`}
            size={"sm"}
            disabled={isPending}
          >
            Add friend
          </Button>
          <Button
            onClick={() => handleRemove(suggestUser.id)}
            className="w-full"
            size={"sm"}
            variant={"destructive"}
            disabled={isPending || !!message}
          >
            {message ? message : "Remove"}
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

export default FriendSuggestItem;
