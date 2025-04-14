import getCurrentUserId from "@/app/getActions/getCurrentUserId";
import { db } from "@/lib/db";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";

const SUGGEST_USER_BATCH = 10;

export async function GET(req: Request) {
  try {
    const currentUserId = await getCurrentUserId();
    const { searchParams } = new URL(req.url);

    if (!currentUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cursor = searchParams.get("cursor");

    const noSuggestUser = await db.noSuggest.findMany({
      where: { userId: currentUserId },
      select: { noSuggestId: true },
    });

    const friends = await db.friend.findMany({
      where: {
        OR: [{ userId: currentUserId }, { friendId: currentUserId }],
      },
      select: { friendId: true, userId: true },
    });

    const friendRequests = await db.friendRequest.findMany({
      where: {
        OR: [{ receiverId: currentUserId }, { senderId: currentUserId }],
      },
      select: { senderId: true, receiverId: true },
    });

    const excludeUserIds = [
      currentUserId,
      ...noSuggestUser.map((user) => user.noSuggestId),
      ...friends.map((friend) =>
        friend.userId === currentUserId ? friend.friendId : friend.userId
      ),
      ...friendRequests.map((friendRequest) => friendRequest.senderId),
      ...friendRequests.map((friendRequest) => friendRequest.receiverId),
    ];

    let suggestUsers: User[] = [];

    if (cursor) {
      suggestUsers = await db.user.findMany({
        take: SUGGEST_USER_BATCH,
        skip: 1,
        cursor: { id: cursor },
        where: {
          NOT: { id: { in: excludeUserIds } },
        },
      });
    } else {
      suggestUsers = await db.user.findMany({
        take: SUGGEST_USER_BATCH,
        where: {
          NOT: { id: { in: excludeUserIds } },
        },
      });
    }

    let nextCursor = null;

    if (suggestUsers.length === SUGGEST_USER_BATCH) {
      nextCursor = suggestUsers[SUGGEST_USER_BATCH - 1].id;
    }

    return NextResponse.json({
      suggestUsers,
      nextCursor,
    });
  } catch (error: any) {
    console.log("[FRIEND_REQUEST_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
