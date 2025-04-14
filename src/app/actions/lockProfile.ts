"use server";

import { db } from "@/lib/db";
import { LockProfileType } from "@prisma/client";

const lockProfile = async (
  type: LockProfileType,
  isCurrentUserProfile: boolean,
  userId: string
) => {
  if (!type) return { error: "Type is missing." };

  if (!isCurrentUserProfile)
    return { error: "Only profile author can change." };

  if (!userId) return { error: "User ID is missing." };

  await db.user.update({
    where: { id: userId },
    data: {
      lockProfile: type,
    },
  });

  return {
    success:
      type === "ALL" || type === "FRIENDS"
        ? "Your profile has been locked"
        : "Your profile unlocked.",
  };
};

export default lockProfile;
