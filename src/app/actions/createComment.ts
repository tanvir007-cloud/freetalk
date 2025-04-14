"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { commentSchema } from "@/lib/zodValidation";
import getCurrentUserId from "../getActions/getCurrentUserId";
import { Notification } from "@prisma/client";

export const createComment = async (
  values: z.infer<typeof commentSchema>,
  postId: string,
  autherUserId: string
) => {
  const validatedFields = commentSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Missing data" };

  const { comment } = validatedFields.data;

  const currentUserId = await getCurrentUserId();

  if (!currentUserId) return { error: "Unauthorized" };

  if (!postId) return { error: "Post ID is missing" };

  const postComment = await db.comment.create({
    data: {
      userId: currentUserId,
      postId,
      desc: comment,
    },
    include: {
      user: true,
      _count: { select: { likes: true, replies: true } },
      likes: {
        where: {
          userId: currentUserId,
        },
      },
    },
  });

  let notification: Notification | null = null;

  if (autherUserId !== currentUserId) {
    const isNotification = await db.notification.findFirst({
      where: {
        receiverId: autherUserId,
        senderId: currentUserId,
        findId: postId,
        notificationType: "COMMENT",
      },
    });

    if (!isNotification) {
      notification = await db.notification.create({
        data: {
          findId: postId,
          senderId: currentUserId,
          receiverId: autherUserId,
          link: `/?postId=${postId}&commentId=${postComment.id}`,
          message: "comment your post",
          notificationType: "COMMENT",
        },
        include: { sender: true },
      });
    }
  }

  return { success: "Comment added", comment: postComment, notification };
};

export const createReplyComment = async (
  values: z.infer<typeof commentSchema>,
  postId: string,
  commentId: string,
  commentAutherId: string
) => {
  const validatedFields = commentSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Missing data" };

  const { comment } = validatedFields.data;

  const currentUserId = await getCurrentUserId();

  if (!currentUserId) return { error: "Unauthorized" };

  if (!postId) return { error: "Post ID is missing" };

  const replyComment = await db.comment.create({
    data: {
      replyToId: commentId,
      userId: currentUserId,
      desc: comment,
    },
    include: {
      user: true,
      _count: { select: { likes: true, replies: true } },
      likes: {
        where: {
          userId: currentUserId,
        },
      },
      replyTo: { select: { user: { select: { name: true } } } },
    },
  });

  let notification: Notification | null = null;

  if (commentAutherId !== currentUserId) {
    const isNotification = await db.notification.findFirst({
      where: {
        receiverId: commentAutherId,
        senderId: currentUserId,
        findId: commentId,
        notificationType: "COMMENT",
      },
    });

    if (!isNotification) {
      notification = await db.notification.create({
        data: {
          findId: commentId,
          senderId: currentUserId,
          receiverId: commentAutherId,
          link: `/?postId=${postId}&commentId=${commentId}`,
          message: "reply your comment",
          notificationType: "COMMENT",
        },
        include: { sender: true },
      });
    }
  }

  return { success: "You replied", replyComment, notification };
};

export const editComment = async (
  values: z.infer<typeof commentSchema>,
  commentId: string,
  isCommentAuthor: boolean,
  currentUserId: string
) => {
  if (!isCommentAuthor) return { error: "Only comment owner edit comment" };

  const validatedFields = commentSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Missing data" };

  const { comment } = validatedFields.data;

  const isCommentHave = await db.comment.findUnique({
    where: { id: commentId },
  });

  if (!isCommentHave) return { error: "Comment not found" };

  const updateComment = await db.comment.update({
    where: { id: commentId },
    data: {
      desc: comment,
      isEdited: true,
    },
    include: {
      user: true,
      _count: { select: { likes: true, replies: true } },
      likes: {
        where: {
          userId: currentUserId,
        },
      },
      replyTo: { select: { user: { select: { name: true } } } },
    },
  });

  return { success: "Comment updated", comment: updateComment };
};

export const createReplyMainComment = async (
  values: z.infer<typeof commentSchema>,
  postId: string,
  commentId: string | null,
  replyCommentId: string,
  commentAutherId: string
) => {
  const validatedFields = commentSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Missing data" };

  const { comment } = validatedFields.data;

  const currentUserId = await getCurrentUserId();

  if (!currentUserId) return { error: "Unauthorized" };

  if (!postId) return { error: "Post ID is missing" };

  if (!replyCommentId) return { error: "ReplyCommentId is missing" };

  const replyComment = await db.comment.create({
    data: {
      parentReplyCommentId: replyCommentId,
      replyToId: commentId ? commentId : replyCommentId,
      userId: currentUserId,
      desc: comment,
    },
    include: {
      user: true,
      _count: { select: { likes: true, replies: true } },
      likes: {
        where: {
          userId: currentUserId,
        },
      },
      replyTo: { select: { user: { select: { name: true } } } },
    },
  });

  let notification: Notification | null = null;

  if (commentAutherId !== currentUserId) {
    const isNotification = await db.notification.findFirst({
      where: {
        receiverId: commentAutherId,
        senderId: currentUserId,
        findId: commentId ? commentId : replyCommentId,
        notificationType: "COMMENT",
      },
    });

    if (!isNotification) {
      notification = await db.notification.create({
        data: {
          findId: commentId ? commentId : replyCommentId,
          senderId: currentUserId,
          receiverId: commentAutherId,
          link: `/?postId=${postId}&commentId=${replyCommentId}`,
          message: "reply your comment",
          notificationType: "COMMENT",
        },
        include: { sender: true },
      });
    }
  }

  return { success: "You replied", replyComment, notification };
};

export const deleteComment = async (
  commentId: string,
  isCommentAuthor: boolean
) => {
  if (!commentId) return { error: "Comment ID missing" };
  if (!isCommentAuthor) return { error: "Only comment owner edit comment" };

  await db.comment.update({
    where: { id: commentId },
    data: { deleteComment: true },
  });
  return { success: "Comment deleted", commentId };
};
