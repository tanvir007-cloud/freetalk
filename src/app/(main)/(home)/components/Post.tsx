import { User } from "@prisma/client";
import React, { useState } from "react";
import PostMainPart from "./PostMainPart";
import DialogPostComment from "./DialogPostComment";
import { cn } from "@/lib/utils";
import { PostType } from "@/lib/zodValidation";
import SharePostDialog from "@/components/SharePostDialog";
import IsYouLike from "./IsYouLike";
import UseGlobal from "@/hooks/use-global";

const Post = ({
  currentUser,
  type,
  post,
  queryKey,
}: {
  currentUser: User;
  type?: "HOME";
  post: PostType;
  queryKey: string[];
}) => {
  const [open, setOpen] = useState(false);

  const {
    addOptimisticComment,
    addOptimisticCount,
    optimisticComment,
    optimisticCount,
    setCommentState,
    setState,
    state,
  } = UseGlobal({ currentUserId: currentUser.id, post });

  return (
    <div
      className={cn(
        "bg-white dark:bg-zinc-900 sm:shadow-md shadow-sm flex flex-col w-full",
        type === "HOME"
          ? "md:w-[93%] sm:w-[85%] lg:w-full sm:rounded-lg"
          : "md:rounded-md"
      )}
    >
      <div className="flex flex-col gap-1">
        <PostMainPart
          currentUser={currentUser}
          post={post}
          open={open}
          setOpen={setOpen}
          likeCount={optimisticCount.likeCount}
          shareCount={state.shareCount}
          isYouLike={optimisticCount.isLike}
          commentCount={optimisticComment.commentCount}
        />
        <div className="flex items-center justify-evenly mb-1 gap-2">
          <IsYouLike
            postUserId={post.userId}
            queryKey={queryKey}
            addOptimisticCount={addOptimisticCount}
            setState={setState}
            postId={post.id}
            isLike={optimisticCount.isLike}
          />
          <DialogPostComment
            queryKey={queryKey}
            setCommentState={setCommentState}
            addOptimisticComment={addOptimisticComment}
            optimisticComment={optimisticComment}
            addOptimisticCount={addOptimisticCount}
            isLike={optimisticCount.isLike}
            likeCount={optimisticCount.likeCount}
            setState={setState}
            shareCount={state.shareCount}
            currentUser={currentUser}
            post={post}
            open={open}
            setOpen={setOpen}
          />
          <SharePostDialog
            postUserId={post.userId}
            setState={setState}
            currentUser={currentUser}
            postId={post.sharePost?.id || post.id}
            mainPostId={post.id}
          />
        </div>
      </div>
    </div>
  );
};

export default Post;
