import { usePostQuery } from "@/hooks/use-post-query";
import { dummyComment, scrolling } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { ReplyCommentType } from "@/lib/zodValidation";
import { User } from "@prisma/client";
import { Loader2 } from "lucide-react";
import React, {
  Dispatch,
  SetStateAction,
  startTransition,
  useEffect,
  useRef,
  useState,
} from "react";
import CommentBody from "./CommentBody";
import { createReplyMainComment } from "@/app/actions/createComment";
import UseComment from "@/hooks/use-comment";
import MainReplyComment from "./MainReplyComment";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { commentSchema as formSchema } from "@/lib/zodValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import CommentBox from "./CommentBox";
import { socket } from "@/socket";
import toast from "react-hot-toast";

const ReplyComment = ({
  openReply,
  paramValue,
  setOpen,
  setIsShowReply,
  currentUser,
  postUserId,
  addOptimisticReplyComment,
  setReplyCommentState,
  optimisticReplyComment,
  setReplyLoader,
  postId,
}: {
  openReply: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setIsShowReply: Dispatch<SetStateAction<boolean>>;
  paramValue: string;
  currentUser: User;
  postUserId: string;
  optimisticReplyComment: {
    commentCount: number;
    comments: ReplyCommentType[];
  };
  addOptimisticReplyComment: (
    action: (pendingState: {
      commentCount: number;
      comments: ReplyCommentType[];
    }) => { commentCount: number; comments: ReplyCommentType[] }
  ) => void;
  setReplyCommentState: Dispatch<
    SetStateAction<{
      commentCount: number;
      comments: ReplyCommentType[];
    }>
  >;
  setReplyLoader: Dispatch<SetStateAction<boolean>>;
  postId: string;
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    usePostQuery({
      apiUrl: "/api/replyComment",
      queryKey: ["replyComment", paramValue],
      paramValue,
      paramKey: "commentId",
    });

  useEffect(() => {
    setReplyCommentState((prev) => ({
      ...prev,
      comments: data?.pages?.flatMap((page) => page.replyComments) || [],
    }));
  }, [data,setReplyCommentState]);

  useEffect(() => {
    if (status === "pending") {
      setReplyLoader(true);
    } else if (openReply && status === "success") {
      setOpen(true);
      setIsShowReply(true);
      setReplyLoader(false);
    }
  }, [openReply, status,setIsShowReply,setOpen,setReplyLoader]);

  if (status === "pending") {
    return null;
  }

  return (
    <div className="flex flex-col relative">
      <div className="absolute h-full w-0.5 dark:bg-zinc-700 left-4 bg-zinc-300" />
      {optimisticReplyComment.comments.map((replyComment: ReplyCommentType) => (
        <ReplyCommentItem
          postId={postId}
          setReplyCommentState={setReplyCommentState}
          addOptimisticReplyComment={addOptimisticReplyComment}
          paramValue={paramValue}
          key={replyComment.id}
          replyComment={replyComment}
          currentUser={currentUser}
          postUserId={postUserId}
        />
      ))}
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

const ReplyCommentItem = ({
  replyComment,
  currentUser,
  postUserId,
  paramValue,
  addOptimisticReplyComment,
  setReplyCommentState,
  postId,
}: {
  replyComment: ReplyCommentType;
  currentUser: User;
  postUserId: string;
  paramValue: string;
  addOptimisticReplyComment: (
    action: (pendingState: {
      commentCount: number;
      comments: ReplyCommentType[];
    }) => { commentCount: number; comments: ReplyCommentType[] }
  ) => void;
  setReplyCommentState: Dispatch<
    SetStateAction<{
      commentCount: number;
      comments: ReplyCommentType[];
    }>
  >;
  postId: string;
}) => {
  const mainReplyCommentBoxRef = useRef<HTMLDivElement>(null);
  const mainReplyFirstCommentRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  const [isMainShowReply, setIsMainShowReply] = useState(false);
  const [mainOpen, setMainOpen] = useState(false);
  const [openMainReply, setOpenMainReply] = useState(false);
  const [replyMainLoader, setReplyMainLoader] = useState(false);
  const {
    addOptimisticComment: addOptimisticMainReplyComment,
    optimisticComment: optimisticMainReplyComment,
    setCommentState: setReplyMainCommentState,
  } = UseComment({ initialCommentCount: replyComment._count.parentReplies });
  const [replyToState, setReplyToState] = useState<{
    commentId: string | null;
    userName: string;
    commentUserId: string | null;
  }>({
    commentId: null,
    userName: "",
    commentUserId: null,
  });

  const isYou = replyToState.commentUserId === currentUser.id;

  useEffect(() => {
    if (!isYou) form.setValue("comment", `${replyToState.userName}`);
  }, [replyToState.commentId,form,isYou,replyToState.userName]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const { newComment } = dummyComment({
      comment: values.comment,
      currentUser,
      commentUserName: replyToState.userName
        ? replyToState.userName
        : replyComment.user.name,
    });

    startTransition(() => {
      addOptimisticMainReplyComment((prev) => ({
        ...prev,
        commentCount: prev.commentCount + 1,
        comments: [newComment, ...prev.comments],
      }));
      scrolling(mainReplyFirstCommentRef, "center");
      if(!openMainReply){
        setOpenMainReply(true)
      }
    });

    const data = await createReplyMainComment(
      values,
      postId,
      replyToState.commentId,
      replyComment.id,
      replyToState.commentUserId
        ? replyToState.commentUserId
        : replyComment.userId
    );

    if (data.success) {
      setReplyMainCommentState((prev) => ({
        ...prev,
        commentCount: prev.commentCount + 1,
        comments: [data.replyComment, ...prev.comments],
      }));
      if (data.notification) {
        socket.emit("sendNotification", data.notification);
      }
      queryClient.invalidateQueries({
        queryKey: ["replyComment", paramValue],
      });
      queryClient.invalidateQueries({
        queryKey: ["replyAllComment", replyComment.id],
      });
      toast.success(data.success)
      form.reset();
    }

    if (data.error) {
      setReplyMainCommentState((prev) => ({
        ...prev,
        commentCount: prev.commentCount - 1,
        comments: prev.comments,
      }));
      toast.error(data.error)
    }
  };

  return (
    <div className="relative pt-1">
      <div className="absolute h-[25px] w-7 -top-px left-4 border-b-2 dark:border-zinc-700 border-zinc-300 border-l-2 rounded-bl-2xl" />
      <div
        className={cn(
          "flex flex-col ml-12",
          replyComment.id.startsWith("temp-") &&
            "bg-zinc-300/50 dark:bg-zinc-700/30 animate-pulse"
        )}
      >
        <CommentBody
          previousQueryKey={["comments", postId]}
          optimisticReplyComment={optimisticMainReplyComment}
          setReplyToState={setReplyToState}
          isShowReply={isMainShowReply}
          open={mainOpen}
          replyLoader={replyMainLoader}
          setOpen={setMainOpen}
          setOpenReply={setOpenMainReply}
          addOptimisticComment={addOptimisticReplyComment}
          comment={replyComment}
          currentUser={currentUser}
          postUserId={postUserId}
          type="REPLYCOMMENT"
          setCommentState={setReplyCommentState}
          queryKey={["replyComment", paramValue]}
        />

        {openMainReply && (
          <MainReplyComment
            previousQueryKey={["replyComment", paramValue]}
            mainReplyFirstCommentRef={mainReplyFirstCommentRef}
            mainReplyCommentBoxRef={mainReplyCommentBoxRef}
            addOptimisticReplyMainComment={addOptimisticMainReplyComment}
            currentUser={currentUser}
            isMainShowReply={isMainShowReply}
            mainOpen={mainOpen}
            openMainReply={openMainReply}
            optimisticMainReplyComment={optimisticMainReplyComment}
            paramValue={replyComment.id}
            postUserId={postUserId}
            setIsMainShowReply={setIsMainShowReply}
            setMainOpen={setMainOpen}
            setMainReplyLoader={setReplyMainLoader}
            setReplyMainCommentState={setReplyMainCommentState}
            setReplyToState={setReplyToState}
          />
        )}

        {mainOpen && (
          <div ref={mainReplyCommentBoxRef} className="relative pt-2">
            <div className="absolute h-[25px] w-[30px] -top-px left-3.5 border-b-2 dark:border-zinc-700 border-zinc-300 border-l-2 rounded-bl-2xl" />
            <CommentBox
              className="ml-12"
              currentUser={currentUser}
              form={form}
              onSubmit={handleSubmit}
              avatarSize="size-7"
              isYou={isYou}
              open={mainOpen}
              replyToState={replyToState}
              setReplyToState={setReplyToState}
              placeholder="Reply to..."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReplyComment;
