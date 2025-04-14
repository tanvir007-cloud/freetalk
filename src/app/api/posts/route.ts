import getCurrentUserId from "@/app/getActions/getCurrentUserId";
import { db } from "@/lib/db";
import { Post } from "@prisma/client";
import { NextResponse } from "next/server";

const POST_BATCH = 10;

export async function GET(req: Request) {
  try {
    const currentUserId = await getCurrentUserId();
    const { searchParams } = new URL(req.url);
    if (!currentUserId) {
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

    const userIds = new Set([currentUserId, ...friendIds]);

    const count = await db.post.count({
      where: { userId: { in: Array.from(userIds) } },
    });

    let posts: Post[] = [];

    if (cursor) {
      posts = await db.post.findMany({
        take: POST_BATCH,
        skip: 1,
        cursor: { id: cursor },
        where:
          count > 10
            ? { userId: { in: Array.from(userIds) }, deletePost: false }
            : { deletePost: false },
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
        take: POST_BATCH,
        where:
          count > 10
            ? { userId: { in: Array.from(userIds) } }
            : { deletePost: false },
        include: {
          sharePost: {
            include: {
              user: true,
            },
          },
          user: true,
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

    if (posts.length === POST_BATCH) {
      nextCursor = posts[POST_BATCH - 1].id;
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
