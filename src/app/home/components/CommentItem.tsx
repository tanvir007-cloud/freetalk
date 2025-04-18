import { User } from "@prisma/client";
import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  startTransition,
  useEffect,
  useState,
} from "react";
import { CommentType } from "@/lib/zodValidation";
import { dummyComment } from "@/lib/helper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema as formSchema } from "@/lib/zodValidation";
import CommentBox from "./CommentBox";
import { createReplyComment } from "@/app/actions/createComment";
import ReplyComment from "./ReplyComment";
import UseComment from "@/hooks/use-comment";
import { useQueryClient } from "@tanstack/react-query";
import CommentBody from "./CommentBody";
import { socket } from "@/socket";
import toast from "react-hot-toast";

const CommentItem = ({
  currentUser,
  comment,
  postUserId,
  postId,
  queryKey,
  addOptimisticComment,
  setCommentState,
  previousQueryKey,
}: {
  currentUser: User;
  comment: CommentType;
  postUserId: string;
  postId: string;
  queryKey: string[];
  addOptimisticComment: (
    action: (pendingState: {
      commentCount: number;
      comments: CommentType[];
    }) => { commentCount: number; comments: CommentType[] }
  ) => void;
  setCommentState: Dispatch<
    SetStateAction<{
      commentCount: number;
      comments: CommentType[];
    }>
  >;
  previousQueryKey: string[];
}) => {
  const queryClient = useQueryClient();
  const [isShowReply, setIsShowReply] = useState(false);
  const [open, setOpen] = useState(false);
  const [openReply, setOpenReply] = useState(false);
  const [replyLoader, setReplyLoader] = useState(false);
  const {
    addOptimisticComment: addOptimisticReplyComment,
    optimisticComment: optimisticReplyComment,
    setCommentState: setReplyCommentState,
  } = UseComment({ initialCommentCount: comment._count.replies });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { newComment } = dummyComment({
      comment: values.comment,
      currentUser,
      commentUserName: comment.user.name,
    });

    startTransition(() => {
      addOptimisticReplyComment((prev) => ({
        ...prev,
        commentCount: prev.commentCount + 1,
        comments: [newComment, ...prev.comments],
      }));
      if(!openReply){
        setOpenReply(true)
      }
    });

    const data = await createReplyComment(
      values,
      postId,
      comment.id,
      comment.userId
    );

    if (data.success) {
      setReplyCommentState((prev) => ({
        ...prev,
        commentCount: prev.commentCount + 1,
        comments: [data.replyComment, ...prev.comments],
      }));
      if (data.notification) {
        socket.emit("sendNotification", data.notification);
      }
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["replyComment", comment.id] });
      form.reset();
    }

    if (data.error) {
      setReplyCommentState((prev) => ({
        ...prev,
        commentCount: prev.commentCount - 1,
        comments: prev.comments,
      }));
      toast.error(data.error)
    }
  };

  useEffect(() => {
    if (currentUser && open && comment.userId !== currentUser.id) {
      form.setValue("comment", `${comment.user.name} `);
    }
  }, [open,comment.user.name,comment.userId,currentUser,form]);

  return (
    <Fragment>
      <CommentBody
        previousQueryKey={previousQueryKey}
        addOptimisticComment={addOptimisticComment}
        comment={comment}
        currentUser={currentUser}
        isShowReply={isShowReply}
        open={open}
        optimisticReplyComment={optimisticReplyComment}
        postUserId={postUserId}
        queryKey={queryKey}
        replyLoader={replyLoader}
        setCommentState={setCommentState}
        setOpen={setOpen}
        setOpenReply={setOpenReply}
        type="COMMENT"
      />
      {openReply && (
        <ReplyComment
          postId={postId}
          setReplyLoader={setReplyLoader}
          optimisticReplyComment={optimisticReplyComment}
          addOptimisticReplyComment={addOptimisticReplyComment}
          setReplyCommentState={setReplyCommentState}
          setIsShowReply={setIsShowReply}
          setOpen={setOpen}
          paramValue={comment.id}
          openReply={openReply}
          postUserId={postUserId}
          currentUser={currentUser}
        />
      )}
      {open && (
        <div className="relative pt-2">
          <div className="absolute h-[25px] w-7 -top-px left-4 border-b-2 dark:border-zinc-700 border-zinc-300 border-l-2 rounded-bl-2xl" />
          <CommentBox
            className="ml-12"
            avatarSize="size-7"
            placeholder={`Reply to ${
              comment.userId === currentUser.id ? "you" : comment.user.name
            }...`}
            currentUser={currentUser}
            form={form}
            onSubmit={onSubmit}
            open={!isShowReply && open}
          />
        </div>
      )}
    </Fragment>
  );
};

export default CommentItem;
