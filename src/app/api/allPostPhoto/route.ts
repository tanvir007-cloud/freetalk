import { db } from "@/lib/db";
import { PostPhoto } from "@prisma/client";
import { NextResponse } from "next/server";

const POST_PHOTO_BATCH = 12;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const profileUserId = searchParams.get("profileUserId");

  if (!profileUserId) {
    return new NextResponse("profileUser ID missing.", { status: 401 });
  }

  const cursor = searchParams.get("cursor");

  let recentPhotos: PostPhoto[] = [];

  if (cursor) {
    recentPhotos = await db.postPhoto.findMany({
      take: POST_PHOTO_BATCH,
      skip: 1,
      cursor: { id: cursor },
      where: { userId: profileUserId },
      orderBy: { createdAt: "desc" },
    });
  } else {
    recentPhotos = await db.postPhoto.findMany({
      take: POST_PHOTO_BATCH,
      where: { userId: profileUserId },
      orderBy: { createdAt: "desc" },
    });
  }

  let nextCursor = null;

  if (recentPhotos.length === POST_PHOTO_BATCH) {
    nextCursor = recentPhotos[POST_PHOTO_BATCH - 1].id;
  }

  return NextResponse.json({
    recentPhotos,
    nextCursor,
  });
}
