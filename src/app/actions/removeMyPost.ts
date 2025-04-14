"use server";

import { db } from "@/lib/db";

const removeMyPost = async (isPostAuther: boolean, postId: string) => {
  if (!isPostAuther) return { error: "You can delete only your post." };

  if (!postId) return { error: "Post ID missing." };

  await db.post.update({
    where: { id: postId },
    data: { deletePost: true },
  });

  return { success: "Post deleted" };
};

export default removeMyPost;
