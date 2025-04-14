import { usePostQuery } from "@/hooks/use-post-query";
import { cn } from "@/lib/utils";
import { ReplyCommentType } from "@/lib/zodValidation";
import { Loader2 } from "lucide-react";
import React, { Dispatch, RefObject, SetStateAction, useEffect } from "react";
import CommentBodyItem from "./CommentBodyItem";
import { User } from "@prisma/client";

const MainReplyComment = ({
  paramValue,
  setMainReplyLoader,
  openMainReply,
  setIsMainShowReply,
  setMainOpen,
  addOptimisticReplyMainComment,
  optimisticMainReplyComment,
  setReplyMainCommentState,
  currentUser,
  isMainShowReply,
  setReplyToState,
  postUserId,
  mainOpen,
  mainReplyCommentBoxRef,
  mainReplyFirstCommentRef,
  previousQueryKey,
}: {
  paramValue: string;
  setMainReplyLoader: Dispatch<SetStateAction<boolean>>;
  openMainReply: boolean;
  setMainOpen: Dispatch<SetStateAction<boolean>>;
  setIsMainShowReply: Dispatch<SetStateAction<boolean>>;
  optimisticMainReplyComment: {
    commentCount: number;
    comments: ReplyCommentType[];
  };
  addOptimisticReplyMainComment: (
    action: (pendingState: {
      commentCount: number;
      comments: ReplyCommentType[];
    }) => { commentCount: number; comments: ReplyCommentType[] }
  ) => void;
  setReplyMainCommentState: Dispatch<
    SetStateAction<{
      commentCount: number;
      comments: ReplyCommentType[];
    }>
  >;
  currentUser: User;
  isMainShowReply: boolean;
  setReplyToState: Dispatch<
    SetStateAction<{
      commentId: string | null;
      userName: string;
      commentUserId: string | null;
    }>
  >;
  postUserId: string;
  mainOpen: boolean;
  mainReplyCommentBoxRef: RefObject<HTMLDivElement | null>;
  mainReplyFirstCommentRef: RefObject<HTMLDivElement | null>;
  previousQueryKey: string[];
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    usePostQuery({
      apiUrl: "/api/replyAllComment",
      queryKey: ["replyAllComment", paramValue],
      paramValue,
      paramKey: "commentId",
    });

  useEffect(() => {
    setReplyMainCommentState((prev) => ({
      ...prev,
      comments: data?.pages?.flatMap((page) => page.replyComments) || [],
    }));
  }, [data, setReplyMainCommentState]);

  useEffect(() => {
    if (status === "pending") {
      setMainReplyLoader(true);
    } else if (openMainReply && status === "success") {
      setMainOpen(true);
      setIsMainShowReply(true);
      setMainReplyLoader(false);
    }
  }, [
    openMainReply,
    status,
    setMainOpen,
    setIsMainShowReply,
    setMainReplyLoader,
  ]);

  if (status === "pending") {
    return null;
  }
  return (
    <div className="flex flex-col relative">
      <div className="absolute h-full w-0.5 dark:bg-zinc-700 left-3.5 bg-zinc-300" />
      {optimisticMainReplyComment.comments.map(
        (replyMainComment: ReplyCommentType, index: number) => (
          <div
            className="relative pt-1"
            key={replyMainComment.id}
            ref={index === 0 ? mainReplyFirstCommentRef : undefined}
          >
            <div className="absolute h-[25px] w-[30px] -top-px left-3.5 border-b-2 dark:border-zinc-700 border-zinc-300 border-l-2 rounded-bl-2xl" />
            <div
              className={cn(
                "flex flex-col ml-12",
                replyMainComment.id.startsWith("temp-") &&
                  "bg-zinc-300/50 dark:bg-zinc-700/30 animate-pulse"
              )}
            >
              <CommentBodyItem
                previousQueryKey={previousQueryKey}
                addOptimisticComment={addOptimisticReplyMainComment}
                comment={replyMainComment}
                currentUser={currentUser}
                isShowReply={isMainShowReply}
                open={mainOpen}
                optimisticReplyComment={optimisticMainReplyComment}
                postUserId={postUserId}
                queryKey={["replyAllComment", paramValue]}
                setCommentState={setReplyMainCommentState}
                setOpen={setMainOpen}
                type="MAINREPLYCOMMENT"
                setReplyToState={setReplyToState}
                mainReplyCommentBoxRef={mainReplyCommentBoxRef}
              />
            </div>
          </div>
        )
      )}
      {!!hasNextPage && (
        <h1
          className="ml-12 my-1 dark:text-zinc-400 text-zinc-600 cursor-pointer flex items-center gap-2"
          onClick={() => fetchNextPage()}
        >
          View more replies
          {isFetchingNextPage && <Loader2 size={16} className="animate-spin" />}
        </h1>
      )}
    </div>
  );
};

export default MainReplyComment;
