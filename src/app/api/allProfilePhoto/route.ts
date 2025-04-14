import { db } from "@/lib/db";
import { ProfilePhoto } from "@prisma/client";
import { NextResponse } from "next/server";

const PROFILE_PHOTO_BATCH = 12;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const profileUserId = searchParams.get("profileUserId");

  if (!profileUserId) {
    return new NextResponse("profileUser ID missing.", { status: 401 });
  }

  const cursor = searchParams.get("cursor");

  let profilePhotos: ProfilePhoto[] = [];

  if (cursor) {
    profilePhotos = await db.profilePhoto.findMany({
      take: PROFILE_PHOTO_BATCH,
      skip: 1,
      cursor: { id: cursor },
      where: { userId: profileUserId },
      orderBy: { createdAt: "desc" },
    });
  } else {
    profilePhotos = await db.profilePhoto.findMany({
      take: PROFILE_PHOTO_BATCH,
      where: { userId: profileUserId },
      orderBy: { createdAt: "desc" },
    });
  }

  let nextCursor = null;

  if (profilePhotos.length === PROFILE_PHOTO_BATCH) {
    nextCursor = profilePhotos[PROFILE_PHOTO_BATCH - 1].id;
  }

  return NextResponse.json({
    profilePhotos,
    nextCursor,
  });
}
