"use server";

import { db } from "@/lib/db";

const deleteNotification = async (notificationId: string) => {
  if (!notificationId) return { error: "Notification ID not found." };

  await db.notification.delete({
    where: { id: notificationId },
  });
  return { success: "Notification deleted." };
};

export default deleteNotification;
