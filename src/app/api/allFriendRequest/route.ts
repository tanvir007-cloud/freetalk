import getCurrentUserId from "@/app/getActions/getCurrentUserId";
import { db } from "@/lib/db";
import { FriendRequest } from "@prisma/client";
import { NextResponse } from "next/server";

const FRIEND_REQUEST_BATCH = 10;

export async function GET(req: Request) {
  try {
    const currentUserId = await getCurrentUserId();
    const { searchParams } = new URL(req.url);

    if (!currentUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cursor = searchParams.get("cursor");

    let friendRequests: FriendRequest[] = [];

    const friendRequestCount = await db.friendRequest.count({
      where: { receiverId: currentUserId },
    });

    if (cursor) {
      friendRequests = await db.friendRequest.findMany({
        take: FRIEND_REQUEST_BATCH,
        skip: 1,
        cursor: { id: cursor },
        where: {
          receiverId: currentUserId,
        },
        include: { sender: true },
        orderBy: { createdAt: "desc" },
      });
    } else {
      friendRequests = await db.friendRequest.findMany({
        take: FRIEND_REQUEST_BATCH,
        where: {
          receiverId: currentUserId,
        },
        include: { sender: true },
        orderBy: { createdAt: "desc" },
      });
    }

    let nextCursor = null;

    if (friendRequests.length === FRIEND_REQUEST_BATCH) {
      nextCursor = friendRequests[FRIEND_REQUEST_BATCH - 1].id;
    }

    return NextResponse.json({
      friendRequestCount,
      friendRequests,
      nextCursor,
    });
  } catch (error: any) {
    console.log("[FRIEND_REQUEST_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
