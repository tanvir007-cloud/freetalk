"use server";

import { postSchema as formSchema } from "@/lib/zodValidation";
import { z } from "zod";
import { db } from "@/lib/db";
import getCurrentUserId from "../getActions/getCurrentUserId";

export const createPost = async (values: z.infer<typeof formSchema>) => {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) return { error: "Unauthorized" };

  const validatedFields = formSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalied credentials" };
  }

  if (!values.desc && !values.image)
    return { error: "Post title or image at least 1 is required" };

  const friends = await db.friend.findMany({
    where: { OR: [{ userId: currentUserId }, { friendId: currentUserId }] },
    select: { userId: true, friendId: true },
  });

  const friendIds = friends.map((item) =>
    item.userId === currentUserId ? item.friendId : item.userId
  );

  const newPost = await db.post.create({
    data: { ...values, userId: currentUserId },
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

  if (values && values.image) {
    await db.postPhoto.create({
      data: {
        userId: currentUserId,
        postImage: values.image,
      },
    });
  }

  return { success: "Post created", newPost };
};
