import getCurrentUserId from "@/app/getActions/getCurrentUserId";
import { db } from "@/lib/db";
import { Comment } from "@prisma/client";
import { NextResponse } from "next/server";

const REPLY_COMMENT_BATCH = 10;
export async function GET(req: Request) {
  try {
    const currentUserId = await getCurrentUserId();
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const commentId = searchParams.get("commentId");

    if (!currentUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!commentId)
      return new NextResponse("Comment ID missing", { status: 401 });

    let replyComments: Comment[] = [];

    if (cursor) {
      replyComments = await db.comment.findMany({
        take: REPLY_COMMENT_BATCH,
        skip: 1,
        cursor: { id: cursor },
        where: {
          replyToId: commentId,
          deleteComment: false,
        },
        include: {
          user: true,
          _count: {
            select: {
              likes: true,
              replies: { where: { deleteComment: false } },
              parentReplies: { where: { deleteComment: false } },
            },
          },
          likes: {
            where: {
              userId: currentUserId,
            },
          },
          replyTo: { select: { user: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      replyComments = await db.comment.findMany({
        take: REPLY_COMMENT_BATCH,
        where: {
          replyToId: commentId,
          deleteComment: false,
        },
        include: {
          user: true,
          _count: {
            select: {
              likes: true,
              replies: { where: { deleteComment: false } },
              parentReplies: { where: { deleteComment: false } },
            },
          },
          likes: {
            where: {
              userId: currentUserId,
            },
          },
          replyTo: { select: { user: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    let nextCursor = null;

    if (replyComments.length === REPLY_COMMENT_BATCH) {
      nextCursor = replyComments[REPLY_COMMENT_BATCH - 1].id;
    }

    return NextResponse.json({
      replyComments,
      nextCursor,
    });
  } catch (error: any) {
    console.log("[REPLY_COMMENT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
