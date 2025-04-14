"use client";
import Avatar from "@/components/Avatar";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { commentSchema as formSchema } from "@/lib/zodValidation";
import React, { Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import CommentBoxItem from "./CommentBoxItem";

const CommentBox = ({
  className,
  currentUser,
  form,
  onSubmit,
  placeholder,
  open,
  avatarSize,
  replyToState,
  setReplyToState,
  isYou,
}: {
  currentUser: User;
  className?: string;
  avatarSize?: string;
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
  placeholder?: string;
  open?: boolean;
  replyToState?: {
    commentId: string | null;
    userName: string;
    commentUserId: string | null;
  };
  setReplyToState?: Dispatch<
    SetStateAction<{
      commentId: string | null;
      userName: string;
      commentUserId: string | null;
    }>
  >;
  isYou?: boolean;
}) => {
  const loading = form.formState.isSubmitting;
  return (
    <div className={cn("flex items-start gap-2 mb-2", className)}>
      <Avatar
        src={currentUser?.image || ""}
        className={cn("size-8", avatarSize)}
      />
      <div className="w-full flex flex-col gap-0.5">
        {replyToState !== undefined &&
          setReplyToState !== undefined &&
          replyToState.commentId &&
          replyToState.commentUserId &&
          replyToState.userName && (
            <h1 className="text-xs font-light ml-1 dark:text-zinc-300">
              Replying to{" "}
              <span className="font-semibold dark:text-white capitalize">
                {isYou !== undefined && isYou ? "You" : replyToState.userName}
              </span>{" "}
              .{" "}
              <span
                className="font-semibold dark:text-zinc-400 cursor-pointer"
                onClick={() =>
                  setReplyToState((prev) => ({
                    ...prev,
                    commentId: null,
                    commentUserId: null,
                    userName: "",
                  }))
                }
              >
                Cancel
              </span>
            </h1>
          )}
        <CommentBoxItem
          form={form}
          loading={loading}
          onSubmit={onSubmit}
          open={open}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default CommentBox;
