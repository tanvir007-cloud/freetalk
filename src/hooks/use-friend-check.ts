import { db } from "@/lib/db";

const friendCheck = async (userId: string, targetUserId: string) => {
  const requestStatus = await db.friendRequest.findFirst({
    where: {
      OR: [
        { senderId: userId, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: userId },
      ],
    },
  });

  if (requestStatus) {
    return requestStatus.senderId === userId ? "Cancel request" : "Confirm";
  }

  const isFriend = await db.friend.findFirst({
    where: {
      OR: [
        { userId, friendId: targetUserId },
        { userId: targetUserId, friendId: userId },
      ],
    },
  });

  return isFriend ? "Friends" : "Add friend";
};

export default friendCheck;
