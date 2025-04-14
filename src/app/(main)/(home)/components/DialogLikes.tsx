import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { formatNumber } from "@/lib/helper";
import React from "react";
import { HiThumbUp } from "react-icons/hi";
import PostAllLikes from "./PostAllLikes";
import { cn } from "@/lib/utils";
import { PostType } from "@/lib/zodValidation";
import { User } from "@prisma/client";

const DialogLikes = ({
  count,
  post,
  currentUser,
  isYouLike,
}: {
  count: number;
  post: PostType;
  currentUser: User;
  isYouLike: boolean;
}) => {
  const isMyFriend = post.likes.filter(
    (like) => like.userId !== currentUser.id
  );
  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          "flex items-end relative cursor-pointer",
          count === 0 && "hidden"
        )}
      >
        <HiThumbUp className="text-2xl dark:text-zinc-400 text-zinc-600" />
        <span className="dark:text-zinc-400 relative -bottom-[3px] text-zinc-600 hover:underline transition px-1">
          {isYouLike && count === 1
            ? currentUser.name
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
      </DialogTrigger>
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
    </Dialog>
  );
};

export default DialogLikes;
