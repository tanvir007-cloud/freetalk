"use server";

import { db } from "@/lib/db";
import getCurrentUserId from "../getActions/getCurrentUserId";

export const MarkRead = async () => {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Unauthorized" };

  await db.notification.updateMany({
    where: { receiverId: userId, isRead: false },
    data: {
      isRead: true,
    },
  });

  return { success: "Notifications marked as read" };
};

export const newNotificationCount = async () => {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Unauthorized" };

  const count = await db.notification.count({
    where: { receiverId: userId, isRead: false },
  });

  return { count };
};
