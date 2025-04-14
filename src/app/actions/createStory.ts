"use server";

import { db } from "@/lib/db";

const createStory = async (currentUserId: string, image: string) => {
  if (!currentUserId) return { error: "Unauthorized" };

  if (!image) return { error: "Image is required" };
  await db.story.create({
    data: {
      image,
      userId: currentUserId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  return { success: "Story created" };
};

export const deleteStory = async (storyId: string, isStoryOwner: boolean) => {
  if (!isStoryOwner) return { error: "Only story owner can delete story" };

  await db.story.delete({
    where: { id: storyId },
  });

  return { success: "Story deleted" };
};

export default createStory;
