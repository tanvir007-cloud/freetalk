import { db } from "@/lib/db";
import { Friend } from "@prisma/client";
import { NextResponse } from "next/server";

const FRIEND_BATCH = 10;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cursor = searchParams.get("cursor");

    let friends: (Friend & {
      friend: { name: string; id: string; image: string | null };
      user: { name: string; id: string; image: string | null };
    })[] = [];

    if (cursor) {
      friends = await db.friend.findMany({
        take: FRIEND_BATCH,
        skip: 1,
        cursor: { id: cursor },
        where: {
          OR: [{ userId }, { friendId: userId }],
        },
        include: {
          friend: { select: { name: true, id: true, image: true } },
          user: { select: { name: true, id: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      friends = await db.friend.findMany({
        take: FRIEND_BATCH,
        where: {
          OR: [{ userId }, { friendId: userId }],
        },
        include: {
          friend: { select: { name: true, id: true, image: true } },
          user: { select: { name: true, id: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    let nextCursor = null;

    if (friends.length === FRIEND_BATCH) {
      nextCursor = friends[FRIEND_BATCH - 1].id;
    }

    const myFriends = friends.map((friend) =>
      friend.userId === userId
        ? { ...friend.friend, createdAt: friend.createdAt }
        : { ...friend.user, createdAt: friend.createdAt }
    );

    return NextResponse.json({
      myFriends,
      nextCursor,
    });
  } catch (error: any) {
    console.log("[FRIEND_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
