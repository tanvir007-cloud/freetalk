"use server";

import { db } from "@/lib/db";
import getCurrentUserId from "../getActions/getCurrentUserId";

export const commentLike = async (commentId: string) => {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) return { error: "Unauthorized" };

  if (!commentId) return { error: "Comment ID is missing" };

  const isLike = await db.like.findFirst({
    where: {
      userId: currentUserId,
      commentId,
    },
    select: { id: true },
  });

  if (isLike) {
    await db.like.delete({ where: { id: isLike.id } });
  } else {
    await db.like.create({
      data: {
        userId: currentUserId,
        commentId,
      },
    });
  }

  return { success: "like updated" };
};
