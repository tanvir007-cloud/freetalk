"use server";

import { db } from "@/lib/db";
import { infoSchema } from "@/lib/zodValidation";
import { z } from "zod";

export const updateCoverPhoto = async ({
  isCurrentUserProfile,
  userId,
  values,
  type,
}: {
  values: { cover: string };
  isCurrentUserProfile: boolean;
  userId: string;
  type: "UPLOAD" | "REMOVE";
}) => {
  if (!isCurrentUserProfile)
    return { error: "You can update only your profile" };

  if (!userId) return { error: "User ID is missing" };

  if (type === "UPLOAD" && values.cover === "") {
    return { error: "Cover image is required." };
  }

  if (type === "REMOVE") {
    const isCoverHave = await db.user.findUnique({
      where: { id: userId },
    });

    if (isCoverHave && isCoverHave.cover === "") {
      return { error: "Please upload cover photo first." };
    }
  }

  await db.user.update({
    where: { id: userId },
    data: values,
  });

  if (type === "UPLOAD") {
    await db.profilePhoto.create({
      data: {
        userId,
        profileImage: values.cover,
      },
    });

    await db.post.create({
      data: {
        userId,
        image: values.cover,
        postType: "COVER",
      },
    });
  }

  return {
    success: type === "UPLOAD" ? "Cover photo updated" : "Cover photo removed",
  };
};

export const updateProfilePhoto = async ({
  isCurrentUserProfile,
  userId,
  values,
  coverImage,
}: {
  values: { image: string; bio: string };
  isCurrentUserProfile: boolean;
  userId: string;
  coverImage: string | null;
}) => {
  if (!isCurrentUserProfile)
    return { error: "You can update only your profile" };

  if (!userId) return { error: "User ID is missing" };

  if (values.image === "") {
    return { error: "Profile image is required" };
  }

  await db.user.update({
    where: { id: userId },
    data: values,
  });

  await db.profilePhoto.create({
    data: {
      userId,
      profileImage: values.image,
    },
  });

  await db.post.create({
    data: {
      userId,
      profileImage: values.image,
      desc: values.bio,
      image: coverImage,
      postType: "PROFILE",
    },
  });

  return { success: "Profile photo updated" };
};

export const updateBio = async ({
  bio,
  isCurrentUserProfile,
  userId,
}: {
  isCurrentUserProfile: boolean;
  userId: string;
  bio: string;
}) => {
  if (!isCurrentUserProfile)
    return { error: "You can update only your profile" };

  if (!userId) return { error: "User ID is missing" };

  await db.user.update({
    where: { id: userId },
    data: { bio },
  });

  return { success: "Intro added" };
};

export const updateUserInfo = async (
  values: z.infer<typeof infoSchema>,
  isCurrentUserProfile: boolean,
  userId: string
) => {
  const validatedFields = infoSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalied data" };

  if (!isCurrentUserProfile)
    return { error: "You can update only your profile" };

  if (!userId) return { error: "User ID is missing" };

  await db.user.update({
    where: { id: userId },
    data: values,
  });

  return { success: "User info updated" };
};
