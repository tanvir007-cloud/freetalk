"use server";

import { db } from "@/lib/db";
import { Story } from "@prisma/client";

const getStory = async (currentUserId: string) => {
  const friends = await db.friend.findMany({
    where: {
      OR: [{ userId: currentUserId }, { friendId: currentUserId }],
    },
    select: { userId: true, friendId: true },
  });

  const friendIds = friends.map((item) =>
    item.userId === currentUserId ? item.friendId : item.userId
  );

  const friendAndSelfIds = [...friendIds, currentUserId];

  let stories: (Story & {
    user: { id: string; image: string | null; name: string };
  })[] = [];

  const friendAndSelfStories = await db.story.findMany({
    where: {
      userId: { in: friendAndSelfIds },
      expiresAt: { gt: new Date() },
    },
    include: {
      user: { select: { id: true, image: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const friendStoryCount = friendAndSelfStories.length;

  let otherStories: (Story & {
    user: { id: string; image: string | null; name: string };
  })[] = [];

  if (friendStoryCount < 20) {
    const remaining = 20 - friendStoryCount;

    otherStories = await db.story.findMany({
      where: {
        userId: { notIn: friendAndSelfIds },
      },
      include: {
        user: { select: { id: true, image: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: remaining,
    });
  }

  stories = [...friendAndSelfStories, ...otherStories];

  return stories;
};

export default getStory;
