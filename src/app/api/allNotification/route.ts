import getCurrentUserId from "@/app/getActions/getCurrentUserId";
import { db } from "@/lib/db";
import { Notification } from "@prisma/client";
import { NextResponse } from "next/server";

const NOTIFICATION_BATCH = 10;

export async function GET(req: Request) {
  try {
    const currentUserId = await getCurrentUserId();
    const { searchParams } = new URL(req.url);

    if (!currentUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const cursor = searchParams.get("cursor");

    let notification: Notification[] = [];

    if (cursor) {
      notification = await db.notification.findMany({
        take: NOTIFICATION_BATCH,
        skip: 1,
        cursor: { id: cursor },
        where: {
          receiverId: currentUserId,
        },
        include: { sender: true },
        orderBy: { createdAt: "desc" },
      });
    } else {
      notification = await db.notification.findMany({
        take: NOTIFICATION_BATCH,
        where: {
          receiverId: currentUserId,
        },
        include: { sender: true },
        orderBy: { createdAt: "desc" },
      });
    }

    let nextCursor = null;

    if (notification.length === NOTIFICATION_BATCH) {
      nextCursor = notification[NOTIFICATION_BATCH - 1].id;
    }

    return NextResponse.json({
      notification,
      nextCursor,
    });
  } catch (error: any) {
    console.log("[NOTIFICATION_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
