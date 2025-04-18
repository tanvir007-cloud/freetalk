import React, { Dispatch, Fragment, SetStateAction } from "react";
import { User } from "@prisma/client";
import { ReplyCommentType } from "@/lib/zodValidation";
import { Loader } from "lucide-react";
import CommentBodyItem from "./CommentBodyItem";
import { cn } from "@/lib/utils";

interface CommentBodyProps {
  currentUser: User;
  comment: any;
  postUserId: string;
  addOptimisticComment: (
    action: (pendingState: { commentCount: number; comments: any[] }) => {
      commentCount: number;
      comments: any[];
    }
  ) => void;
  setCommentState: Dispatch<
    SetStateAction<{
      commentCount: number;
      comments: any[];
    }>
  >;
  optimisticReplyComment: {
    commentCount: number;
    comments: ReplyCommentType[];
  };
  replyLoader: boolean;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setOpenReply: Dispatch<SetStateAction<boolean>>;
  isShowReply: boolean;
  queryKey: string[];
  type: "COMMENT" | "REPLYCOMMENT";
  setReplyToState?: Dispatch<
    SetStateAction<{
      commentId: string | null;
      userName: string;
      commentUserId: string | null;
    }>
  >;
  previousQueryKey: string[];
}

const CommentBody = ({
  currentUser,
  comment,
  postUserId,
  addOptimisticComment,
  setCommentState,
  optimisticReplyComment,
  replyLoader,
  open,
  setOpen,
  setOpenReply,
  isShowReply,
  queryKey,
  type,
  setReplyToState,
  previousQueryKey,
}: CommentBodyProps) => {
  return (
    <Fragment>
      <CommentBodyItem
        previousQueryKey={previousQueryKey}
        setReplyToState={setReplyToState}
        addOptimisticComment={addOptimisticComment}
        comment={comment}
        currentUser={currentUser}
        isShowReply={isShowReply}
        open={open}
        optimisticReplyComment={optimisticReplyComment}
        postUserId={postUserId}
        queryKey={queryKey}
        setCommentState={setCommentState}
        setOpen={setOpen}
        type={type}
      />
      {!isShowReply && optimisticReplyComment.commentCount > 0 && (
        <div className="relative pt-1">
          <h1
            className="ml-12 dark:text-zinc-400 text-zinc-600 cursor-pointer flex items-center gap-x-1"
            onClick={() => setOpenReply(true)}
          >
            View {optimisticReplyComment.commentCount} reply
            {replyLoader && (
              <Loader
                className="dark:text-zinc-400 text-zinc-600 animate-spin"
                size={20}
              />
            )}
          </h1>
          <div
            className={cn(
              "absolute h-[18px] border-b-2 dark:border-zinc-700 border-zinc-300 border-l-2 rounded-bl-2xl -top-px",
              type === "REPLYCOMMENT" ? "left-3.5 w-[30px]" : "w-7 left-4"
            )}
          />
          {open && (
            <div
              className={cn(
                "absolute dark:bg-zinc-700 bg-zinc-300 h-[calc(100%)] w-0.5 top-0",
                type === "REPLYCOMMENT" ? "left-3.5" : "left-4"
              )}
            />
          )}
        </div>
      )}
    </Fragment>
  );
};

export default CommentBody;
