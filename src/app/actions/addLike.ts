"use server";

import { db } from "@/lib/db";
import getCurrentUserId from "../getActions/getCurrentUserId";
import { Notification } from "@prisma/client";

export const likePost = async (postId: string, postUserId: string) => {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) throw new Error("Unauthorized");

  if (!postId) throw new Error("Post Id is missing");

  if (!postUserId) throw new Error("PostUser Id is missing");

  const isLike = await db.like.findFirst({
    where: {
      userId: currentUserId,
      postId,
    },
  });

  if (isLike) {
    await db.like.delete({
      where: { id: isLike.id },
    });
    return { success: "You unliked" };
  } else {
    await db.like.create({
      data: {
        userId: currentUserId,
        postId,
      },
    });

    let notification: Notification | null = null;

    if (currentUserId !== postUserId) {
      const isNotification = await db.notification.findFirst({
        where: {
          receiverId: postUserId,
          senderId: currentUserId,
          findId: postId,
          notificationType: "LIKE",
        },
      });

      if (!isNotification) {
        notification = await db.notification.create({
          data: {
            findId: postId,
            senderId: currentUserId,
            receiverId: postUserId,
            link: `/?postId=${postId}`,
            message: "like your post",
            notificationType: "LIKE",
          },
          include: { sender: true },
        });
      }
    }

    return { success: "You liked", notification };
  }
};
