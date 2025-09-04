import Avatar from "@/components/Avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, {
  Dispatch,
  Fragment,
  RefObject,
  SetStateAction,
  useState,
} from "react";
import EditComment from "./EditComment";
import { GiMicrophone } from "react-icons/gi";
import Trim from "@/components/Trim";
import { scrolling,formatCommentDate } from "@/lib/helper";
import IsCommentLike from "./IsCommentLike";
import { User } from "@prisma/client";
import EditAndDeleteMenu from "./Edit&DeleteMenu";
import { ReplyCommentType } from "@/lib/zodValidation";

const CommentBodyItem = ({
  addOptimisticComment,
  comment,
  currentUser,
  postUserId,
  setCommentState,
  queryKey,
  type,
  isShowReply,
  optimisticReplyComment,
  open,
  setOpen,
  setReplyToState,
  mainReplyCommentBoxRef,
  previousQueryKey,
}: {
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
  queryKey: string[];
  type: "COMMENT" | "REPLYCOMMENT" | "MAINREPLYCOMMENT";
  isShowReply: boolean;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setReplyToState?: Dispatch<
    SetStateAction<{
      commentId: string | null;
      userName: string;
      commentUserId: string | null;
    }>
  >;
  mainReplyCommentBoxRef?: RefObject<HTMLDivElement | null>;
  previousQueryKey: string[];
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const isAuthor = comment.userId === postUserId;
  const isCommentAuthor = currentUser.id === comment.userId;

  let parts: string[] = [];

  if (
    (type === "REPLYCOMMENT" || type === "MAINREPLYCOMMENT") &&
    comment.desc &&
    comment.replyTo?.user?.name
  ) {
    parts = comment.desc.split(
      new RegExp(`(${comment.replyTo.user.name})`, "gi")
    );
  }
  return (
    <div className="flex items-start gap-2 relative pt-1">
      <Link href={`/profile/${comment.user.id}`}>
        <Avatar
          src={comment.user.image || ""}
          className={cn(type === "COMMENT" ? "size-8" : "size-7")}
        />
      </Link>

      {isEdit ? (
        <EditComment
          addOptimisticComment={addOptimisticComment}
          setCommentState={setCommentState}
          currentUser={currentUser}
          previousValue={comment.desc}
          queryKey={queryKey}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          commentId={comment.id}
          isCommentAuthor={isCommentAuthor}
        />
      ) : (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex flex-col rounded-2xl bg-zinc-200 dark:bg-zinc-900 px-3 py-1"
              )}
            >
              {isAuthor && (
                <div className="text-xs flex items-center gap-1 dark:text-zinc-400 text-zinc-600">
                  <GiMicrophone />
                  <span>Author</span>
                </div>
              )}
              <div className="text-sm font-semibold flex items-center gap-x-1">
                <Link
                  href={`/profile/${comment.user.id}`}
                  className="hover:underline underline-offset-1 transition"
                >
                  {comment.user.name}
                </Link>
                {comment.isEdited && (
                  <span className="text-xs font-normal text-zinc-500">
                    (Edited)
                  </span>
                )}
              </div>
              {(type === "REPLYCOMMENT" || type === "MAINREPLYCOMMENT") &&
              parts.length > 0 ? (
                <div className="text-wrap leading-3">
                  {parts.map((part: string, index: number) =>
                    part.toLowerCase() ===
                    comment.replyTo.user.name.toLowerCase() ? (
                      <span key={index} className="font-bold text-base">
                        {part}
                      </span>
                    ) : (
                      <Trim
                        key={index}
                        text={part}
                        length={90}
                        className="text-base"
                      />
                    )
                  )}
                </div>
              ) : (
                <span>
                  <Trim text={comment.desc} length={90} className="text-base" />
                </span>
              )}
            </div>
            {isCommentAuthor && (
              <EditAndDeleteMenu
                previousQueryKey={previousQueryKey}
                setCommentState={setCommentState}
                queryKey={queryKey}
                commentId={comment.id}
                setIsEdit={setIsEdit}
                isCommentAuthor={isCommentAuthor}
              />
            )}
          </div>
          <div className="flex items-center gap-4 ml-3">
            {comment.id.startsWith("temp-") ? (
              <span>sending...</span>
            ) : (
              <Fragment>
                <span className="text-sm text-zinc-600 dark:text-zinc-400 order-1">
                  {formatCommentDate(comment.createdAt)}
                </span>
                <IsCommentLike
                  queryKey={queryKey}
                  comment={comment}
                  currentUserId={currentUser.id}
                />
                <span
                  className="text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer hover:underline underline-offset-2 order-3"
                  onClick={() => {
                    setOpen(true);
                    if (
                      (type === "MAINREPLYCOMMENT" ||
                        type === "REPLYCOMMENT") &&
                      setReplyToState !== undefined
                    ) {
                      setReplyToState((prev) => ({
                        ...prev,
                        commentId: comment.id,
                        commentUserId: comment.userId,
                        userName: comment.user.name,
                      }));
                      if (mainReplyCommentBoxRef !== undefined) {
                        scrolling(mainReplyCommentBoxRef);
                      }
                    }
                  }}
                >
                  Reply
                </span>
              </Fragment>
            )}
          </div>
        </div>
      )}
      {type !== "MAINREPLYCOMMENT" &&
        ((!isShowReply && optimisticReplyComment.commentCount > 0) || open) && (
          <div
            className={cn(
              "absolute dark:bg-zinc-700 bg-zinc-300",
              type === "REPLYCOMMENT"
                ? "h-[calc(100%-36px)] w-0.5 top-9 left-3.5"
                : "h-[calc(100%-40px)] w-0.5 top-10 left-4"
            )}
          />
        )}
    </div>
  );
};

export default CommentBodyItem;
