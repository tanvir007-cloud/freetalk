import getCurrentUserId from "@/app/getActions/getCurrentUserId";
import { db } from "@/lib/db";
import { Post } from "@prisma/client";
import { NextResponse } from "next/server";

const MY_POST_BATCH = 10;
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const profileUserId = searchParams.get("userId");
    const currentUserId = await getCurrentUserId();

    if (!currentUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!profileUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cursor = searchParams.get("cursor");

    const friends = await db.friend.findMany({
      where: { OR: [{ userId: currentUserId }, { friendId: currentUserId }] },
      select: { userId: true, friendId: true },
    });

    const friendIds = friends.map((item) =>
      item.userId === currentUserId ? item.friendId : item.userId
    );

    let posts: Post[] = [];

    if (cursor) {
      posts = await db.post.findMany({
        take: MY_POST_BATCH,
        skip: 1,
        cursor: { id: cursor },
        where: { userId: profileUserId, deletePost: false },
        include: {
          user: true,
          sharePost: {
            include: {
              user: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: { where: { deleteComment: false } },
              sharedBy: true,
            },
          },
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
        orderBy: { createdAt: "desc" },
      });
    } else {
      posts = await db.post.findMany({
        take: MY_POST_BATCH,
        where: { userId: profileUserId, deletePost: false },
        include: {
          user: true,
          sharePost: {
            include: {
              user: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: { where: { deleteComment: false } },
              sharedBy: true,
            },
          },
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
        orderBy: { createdAt: "desc" },
      });
    }

    let nextCursor = null;

    if (posts.length === MY_POST_BATCH) {
      nextCursor = posts[MY_POST_BATCH - 1].id;
    }

    return NextResponse.json({
      posts,
      nextCursor,
    });
  } catch (error: any) {
    console.log("[POST_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
