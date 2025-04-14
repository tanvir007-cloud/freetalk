import { db } from "@/lib/db";
import { Like } from "@prisma/client";
import { NextResponse } from "next/server";

const POST_LIKE_BATCH = 10;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const postId = searchParams.get("postId");

    if (!postId) {
      return new NextResponse("Post ID missing", { status: 401 });
    }

    let likes: Like[] = [];

    if (cursor) {
      likes = await db.like.findMany({
        take: POST_LIKE_BATCH,
        skip: 1,
        cursor: { id: cursor },
        where: { postId },
        include: {
          user: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      likes = await db.like.findMany({
        take: POST_LIKE_BATCH,
        where: { postId },
        include: {
          user: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }

    let nextCursor = null;

    if (likes.length === POST_LIKE_BATCH) {
      nextCursor = likes[POST_LIKE_BATCH - 1].id;
    }

    return NextResponse.json({
      likes,
      nextCursor,
    });
  } catch (error: any) {
    console.log("[POST_LIKE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
