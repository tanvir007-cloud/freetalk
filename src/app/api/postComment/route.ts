import getCurrentUserId from "@/app/getActions/getCurrentUserId";
import { db } from "@/lib/db";
import { Comment } from "@prisma/client";
import { NextResponse } from "next/server";

const POST_COMMENT_BATCH = 10;

export async function GET(req: Request) {
  try {
    const currentUserId = await getCurrentUserId();
    const { searchParams } = new URL(req.url);

    if (!currentUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cursor = searchParams.get("cursor");
    const postId = searchParams.get("postId");

    if (!postId) {
      return new NextResponse("Post ID missing", { status: 401 });
    }

    const post = await db.post.findUnique({
      where: { id: postId, deletePost: false },
      select: { userId: true },
    });

    if (!post) return new NextResponse("Post not found", { status: 401 });

    let comments: Comment[] = [];
    let nextCursor = null;

    if (!cursor) {
      const userComments = await db.comment.findMany({
        take: POST_COMMENT_BATCH,
        where: { postId, userId: post.userId, deleteComment: false },
        include: {
          user: true,
          _count: {
            select: {
              likes: true,
              replies: { where: { deleteComment: false } },
            },
          },
          likes: {
            where: {
              userId: currentUserId,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const userCommentCount = userComments.length;
      const remainingCommentCount = POST_COMMENT_BATCH - userCommentCount;

      let extraComments: Comment[] = [];

      if (remainingCommentCount > 0) {
        extraComments = await db.comment.findMany({
          take: remainingCommentCount,
          where: { postId, NOT: { userId: post.userId }, deleteComment: false },
          include: {
            user: true,
            _count: {
              select: {
                likes: true,
                replies: { where: { deleteComment: false } },
              },
            },
            likes: {
              where: {
                userId: currentUserId,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });
      }

      comments = [...userComments, ...extraComments];

      if (comments.length === POST_COMMENT_BATCH) {
        nextCursor = comments[POST_COMMENT_BATCH - 1].id;
      }
    } else {
      comments = await db.comment.findMany({
        take: POST_COMMENT_BATCH,
        skip: 1,
        cursor: { id: cursor },
        where: { postId, NOT: { userId: post.userId }, deleteComment: false },
        include: {
          user: true,
          _count: {
            select: {
              likes: true,
              replies: { where: { deleteComment: false } },
            },
          },
          likes: {
            where: {
              userId: currentUserId,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      if (comments.length === POST_COMMENT_BATCH) {
        nextCursor = comments[POST_COMMENT_BATCH - 1].id;
      }
    }

    return NextResponse.json({
      comments,
      nextCursor,
    });
  } catch (error: any) {
    console.log("[POST_LIKE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
