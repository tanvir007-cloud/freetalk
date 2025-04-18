"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { formatNumber } from "@/lib/helper";
import React, { useState } from "react";
import { HiThumbUp } from "react-icons/hi";
import PostAllLikes from "./PostAllLikes";
import { cn } from "@/lib/utils";
import { PostType } from "@/lib/zodValidation";
import { Like, User } from "@prisma/client";
import { useZustandStore } from "@/hooks/use-zustand-store";

const DialogLikes = ({
  count,
  post,
  currentUser,
  isYouLike,
}: {
  count: number;
  post: PostType;
  currentUser: User | null;
  isYouLike: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const { setLoginOpen } = useZustandStore();
  let isMyFriend: (Like & { user: {name:string} })[] = [];
  if (currentUser) {
    isMyFriend = post.likes.filter((like) => like.userId !== currentUser.id);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          "flex items-end relative cursor-pointer",
          count === 0 && "hidden"
        )}
        onClick={() => (currentUser ? setOpen(true) : setLoginOpen(true))}
      >
        <HiThumbUp className="text-2xl dark:text-zinc-400 text-zinc-600" />
        <span className="dark:text-zinc-400 relative -bottom-[3px] text-zinc-600 hover:underline transition px-1">
          {isYouLike && count === 1
            ? currentUser && currentUser.name
            : isYouLike && isMyFriend[0] && count === 2
            ? `You,${isMyFriend[0].user.name}`
            : isYouLike && isMyFriend[0]
            ? `You,${isMyFriend[0].user.name} and ${formatNumber(
                count - 2
              )} others`
            : isMyFriend[0] && count === 1
            ? isMyFriend[0].user.name
            : isMyFriend[0] && count > 1
            ? `${isMyFriend[0].user.name} and ${formatNumber(count - 1)} others`
            : isYouLike && count > 1
            ? `You and ${formatNumber(count - 1)} others`
            : formatNumber(count)}
        </span>
      </div>
      {currentUser && (
        <DialogContent className="sm:max-h-[70vh] max-h-[80vh] md:max-w-xl p-0 pt-6">
          <PostAllLikes
            userId={currentUser.id}
            count={count}
            paramKey="postId"
            paramValue={post.id}
            queryKey="likes"
            apiUrl="/api/postLike"
          />
        </DialogContent>
      )}
    </Dialog>
  );
};

export default DialogLikes;
