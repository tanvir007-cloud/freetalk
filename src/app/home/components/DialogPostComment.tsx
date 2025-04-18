"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@prisma/client";
import { MessageCircle } from "lucide-react";
import React, { Dispatch, Fragment, SetStateAction } from "react";
import Comment from "./Comment";
import { CommentType, PostType } from "@/lib/zodValidation";
import LikeSkeleton from "@/components/AllSkeletons/LikeSkeleton";

interface DialogPostCommentProps {
  currentUser: User;
  post: PostType;
  open: boolean;
  queryKey: string[];
  setOpen: Dispatch<SetStateAction<boolean>>;
  isLike: boolean;
  addOptimisticCount: (action: "like") => void;
  setState: Dispatch<
    SetStateAction<{
      likeCount: number;
      isLike: boolean;
      shareCount: number;
    }>
  >;
  setCommentState: Dispatch<
    SetStateAction<{
      commentCount: number;
      comments: CommentType[];
    }>
  >;
  likeCount: number;
  shareCount: number;
  addOptimisticComment: (
    action: (pendingState: {
      commentCount: number;
      comments: CommentType[];
    }) => { commentCount: number; comments: CommentType[] }
  ) => void;
  optimisticComment: { commentCount: number; comments: CommentType[] };
}

const DialogPostComment = ({
  currentUser,
  post,
  open,
  queryKey,
  setOpen,
  addOptimisticCount,
  isLike,
  likeCount,
  setState,
  shareCount,
  addOptimisticComment,
  optimisticComment,
  setCommentState,
}: DialogPostCommentProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center gap-2 text-sm dark:text-zinc-400 text-zinc-600 dark:hover:bg-zinc-800 hover:bg-zinc-200 px-4 py-1 rounded-sm transition">
        <MessageCircle />
        <span>Comment</span>
      </DialogTrigger>
      <DialogContent className="p-0 pt-6 sm:max-h-[90vh] max-h-screen max-w-xl gap-0">
        <Comment
          queryKey={queryKey}
          setCommentState={setCommentState}
          optimisticComment={optimisticComment}
          addOptimisticComment={addOptimisticComment}
          addOptimisticCount={addOptimisticCount}
          isLike={isLike}
          likeCount={likeCount}
          setState={setState}
          shareCount={shareCount}
          open={open}
          currentUser={currentUser}
          post={post}
          paramKey="postId"
          apiUrl="/api/postComment"
          pendingChildren={
            <Fragment>
              <DialogTitle className="py-3.5 border-b border-zinc-200 dark:border-zinc-800" />
              <div className="p-4">
                <LikeSkeleton type="Pending" />
              </div>
            </Fragment>
          }
        >
          <DialogTitle className="text-center capitalize pb-4">
            {post.user.name}&apos;s Posts
          </DialogTitle>
        </Comment>
      </DialogContent>
    </Dialog>
  );
};

export default DialogPostComment;
