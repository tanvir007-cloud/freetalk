"use server";

import { z } from "zod";
import { shareSchema as formSchema } from "@/lib/zodValidation";
import { db } from "@/lib/db";
import getCurrentUserId from "../getActions/getCurrentUserId";
import { Notification } from "@prisma/client";

const createSharePost = async (
  values: z.infer<typeof formSchema>,
  shareId: string,
  mainPostId: string,
  postUserId: string
) => {
  const validatedFields = formSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalied credentials" };

  if (!shareId) return { error: "Share ID is missing" };

  const currentUserId = await getCurrentUserId();

  if (!currentUserId) return { error: "Unauthorized" };

  const friends = await db.friend.findMany({
    where: { OR: [{ userId: currentUserId }, { friendId: currentUserId }] },
    select: { userId: true, friendId: true },
  });

  const friendIds = friends.map((item) =>
    item.userId === currentUserId ? item.friendId : item.userId
  );

  const newSharePost = await db.post.create({
    data: {
      desc: values.desc,
      userId: currentUserId,
      shareId,
      mainPostId,
    },
    include: {
      sharePost: {
        include: {
          user: true,
        },
      },
      user: true,
      _count: { select: { likes: true, comments: true, sharedBy: true } },
      likes: {
        include: { user: true },
        where: {
          userId: {
            in: [
              currentUserId,
              ...(
                await db.like.findMany({
                  take: 1,
                  orderBy: { createdAt: "desc" },
                  where: { userId: { in: friendIds } },
                  select: { userId: true },
                })
              ).map((like) => like.userId),
            ],
          },
        },
      },
    },
  });

  let notification: Notification | null = null;

  if (postUserId !== currentUserId) {
    const isNotification = await db.notification.findFirst({
      where: {
        receiverId: postUserId,
        senderId: currentUserId,
        findId: mainPostId,
        notificationType: "SHARE",
      },
    });

    if (!isNotification) {
      notification = await db.notification.create({
        data: {
          findId: mainPostId,
          senderId: currentUserId,
          receiverId: postUserId,
          link: `/?postId=${mainPostId}`,
          message: "share your post",
          notificationType: "SHARE",
        },
        include: { sender: true },
      });
    }
  }

  return { success: "Post shared", notification, newSharePost };
};

export default createSharePost;
