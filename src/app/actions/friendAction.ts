"use server";

import { db } from "@/lib/db";

export const rejectFriendRequest = async (
  senderId: string,
  receiverId: string
) => {
  if (!senderId) return { error: "Sender ID is missing" };

  if (!receiverId) return { error: "Receiver ID is missing" };

  const isFriendRequest = await db.friendRequest.findFirst({
    where: {
      senderId: receiverId,
      receiverId: senderId,
    },
  });

  if (!isFriendRequest) return { error: "You can't reject request" };

  await db.friendRequest.delete({
    where: { id: isFriendRequest.id },
  });

  return { success: "Reject friend request" };
};

export const addFriend = async (senderId: string, receiverId: string) => {
  if (!senderId) return { error: "Sender ID is missing" };

  if (!receiverId) return { error: "Receiver ID is missing" };

  await db.friendRequest.create({
    data: {
      senderId,
      receiverId,
    },
  });

  return { success: "You send friend request" };
};

export const cancelRequest = async (senderId: string, receiverId: string) => {
  if (!senderId) return { error: "Sender ID is missing" };

  if (!receiverId) return { error: "Receiver ID is missing" };

  const isFriendRequest = await db.friendRequest.findFirst({
    where: {
      senderId,
      receiverId,
    },
  });

  if (!isFriendRequest) {
    return { error: "Send friend request first." };
  }

  await db.friendRequest.deleteMany({
    where: {
      senderId,
      receiverId,
    },
  });

  return { success: "Cancel friend request" };
};

export const confirmFriendRequest = async (
  senderId: string,
  receiverId: string
) => {
  if (!senderId) return { error: "Sender ID is missing" };

  if (!receiverId) return { error: "Receiver ID is missing" };

  const isFriendRequest = await db.friendRequest.findFirst({
    where: {
      senderId: receiverId,
      receiverId: senderId,
    },
  });

  if (!isFriendRequest) {
    return { error: "You can't confirm this request." };
  }

  await db.friend.create({
    data: {
      userId: senderId,
      friendId: receiverId,
    },
  });

  await db.friendRequest.deleteMany({
    where: { id: isFriendRequest.id },
  });

  return { success: "You accept friend request" };
};

export const unFriend = async (senderId: string, receiverId: string) => {
  if (!senderId) return { error: "Sender ID is missing" };

  if (!receiverId) return { error: "Receiver ID is missing" };

  const isFriend = await db.friend.findFirst({
    where: {
      OR: [
        { userId: senderId, friendId: receiverId },
        { userId: receiverId, friendId: senderId },
      ],
    },
  });

  if (!isFriend) return { error: "This user not your friend" };

  await db.friend.delete({
    where: { id: isFriend.id },
  });

  return { success: "You unfriend your friend" };
};

export const removeSuggestFriend = async (
  senderId: string,
  receiverId: string
) => {
  if (!senderId) return { error: "Sender ID is missing" };

  if (!receiverId) return { error: "Receiver ID is missing" };

  const isNoSuggest = await db.noSuggest.findFirst({
    where: { userId: senderId, noSuggestId: receiverId },
  });

  if (isNoSuggest) return { error: "You can't remove." };

  await db.noSuggest.create({
    data: {
      userId: senderId,
      noSuggestId: receiverId,
    },
  });

  return { success: "Suggest user removed" };
};
