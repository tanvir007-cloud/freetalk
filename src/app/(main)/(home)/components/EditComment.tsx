import { zodResolver } from "@hookform/resolvers/zod";
import React, {
  Dispatch,
  SetStateAction,
  startTransition,
  useEffect,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { commentSchema as formSchema } from "@/lib/zodValidation";
import { editComment } from "@/app/actions/createComment";
import CommentBoxItem from "./CommentBoxItem";
import { User } from "@prisma/client";
import { dummyComment } from "@/lib/helper";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const EditComment = ({
  commentId,
  isCommentAuthor,
  setIsEdit,
  isEdit,
  previousValue,
  currentUser,
  addOptimisticComment,
  setCommentState,
  commentUserName,
  queryKey,
}: {
  commentId: string;
  isCommentAuthor: boolean;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  isEdit: boolean;
  previousValue: string;
  currentUser: User;
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
  commentUserName?: string;
  queryKey: string[];
}) => {
  const queryClient = useQueryClient();
  const EditCommentForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  const loading = EditCommentForm.formState.isSubmitting;

  const onEditSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsEdit(false);
    const { newComment } = dummyComment({
      comment: values.comment,
      currentUser,
      commentUserName,
    });

    startTransition(() => {
      addOptimisticComment((prev) => ({
        ...prev,
        comments: prev.comments.map((comment) =>
          comment.id === commentId ? newComment : comment
        ),
      }));
      queryClient.invalidateQueries({ queryKey });
    });

    const data = await editComment(
      values,
      commentId,
      isCommentAuthor,
      currentUser.id
    );

    if (data.success) {
      setCommentState((prev) => ({
        ...prev,
        comments: prev.comments.map((comment) =>
          comment.id === data.comment.id ? data.comment : comment
        ),
      }));
    }

    if (data.error) {
      setCommentState((prev) => ({
        ...prev,
        comments: prev.comments,
      }));
      toast.error(data.error)
    }
  };

  useEffect(() => {
    if (isEdit) EditCommentForm.setValue("comment", previousValue);
  }, [isEdit,EditCommentForm,previousValue]);

  return (
    <div className="flex flex-col gap-0.5 w-full">
      <CommentBoxItem
        open={isEdit}
        loading={loading}
        form={EditCommentForm}
        onSubmit={onEditSubmit}
        placeholder="Edit comment..."
      />
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        Press Esc to{" "}
        <span
          className="hover:underline cursor-pointer text-blue-600 dark:text-blue-500"
          onClick={() => setIsEdit(false)}
        >
          Cancel
        </span>
      </p>
    </div>
  );
};

export default EditComment;
