import React, { Fragment } from "react";
import getCurrentUser from "@/app/getActions/getCurrentUser";
import { notFound } from "next/navigation";
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { LockKeyhole, MessageCircleMore, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import TabsElement from "../components/TabsElement";
import { db } from "@/lib/db";
import { formatNumber } from "@/lib/helper";
import EditCoverPhoto from "./components/EditCoverPhoto";
import EditProfilePhoto from "./components/EditProfilePhoto";
import { cn } from "@/lib/utils";
import ActionFriends from "./components/ActionFriends";
import Link from "next/link";
import EditProfile from "./components/EditProfile";
import { Metadata } from "next";
import friendCheck from "@/hooks/use-friend-check";
import AddStory from "@/app/home/components/AddStory";
import Script from "next/script";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ profileId: string }>;
}): Promise<Metadata> {
  const { profileId } = await params;
  const url =
    process.env.NEXT_PUBLIC_BASE_URL || "https://freetalk-whdr.onrender.com";

  const profileUser = await db.user.findUnique({
    where: { id: profileId },
    select: { name: true, image: true, id: true },
  });

  if (!profileUser) return { title: "Profile Not Found" };

  const fallbackImage = `${url}/avater.jpg`;
  const profileUrl = `${url}/profile/${profileUser.id}`;

  return {
    title: `${profileUser.name} | Freetalk`,
    description: `View ${profileUser.name}'s profile on Freetalk. Connect with friends, share updates, and explore content.`,
    keywords: [profileUser.name, "Freetalk", "social media", "profile"],
    metadataBase: new URL(url),
    alternates: {
      canonical: profileUrl,
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `${profileUser.name} | Freetalk`,
      description: `View ${profileUser.name}'s profile on Freetalk. Connect with friends, share updates, and explore content.`,
      url: profileUrl,
      siteName: "Freetalk",
      images: [
        {
          url: profileUser.image || fallbackImage,
          width: 1200,
          height: 630,
          alt: `${profileUser.name}'s Profile`,
        },
      ],
      type: "profile",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${profileUser.name} | Freetalk`,
      description: `View ${profileUser.name}'s profile on Freetalk. Connect with friends, share updates, and explore content.`,
      images: [profileUser.image || fallbackImage],
    },
  };
}

const ProfilePage = async ({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) => {
  const { profileId } = await params;
  const url =
    process.env.NEXT_PUBLIC_BASE_URL || "https://freetalk-whdr.onrender.com";
  const currentUser = await getCurrentUser();

  let isCurrentUserProfile = false;

  if (currentUser) {
    isCurrentUserProfile = currentUser.id === profileId;
  }

  const profileUser = await db.user.findUnique({
    where: { id: profileId },
  });

  if (!profileUser) return notFound();

  const totalFriends = await db.friend.count({
    where: {
      OR: [{ userId: profileUser.id }, { friendId: profileUser.id }],
    },
  });

  const friends = await db.friend.findMany({
    where: {
      OR: [{ userId: profileUser.id }, { friendId: profileUser.id }],
    },
    include: {
      user: { select: { image: true, id: true } },
      friend: { select: { image: true, id: true } },
    },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  const myFriends = friends.map((f) =>
    f.userId === profileUser.id ? f.friend : f.user
  );

  let status:
    | "Friends"
    | "Cancel request"
    | "Confirm"
    | "Add friend"
    | undefined;

  if (!isCurrentUserProfile && currentUser) {
    status = await friendCheck(currentUser.id, profileUser.id);
  }

  let isLockProfile = false;

  if (isCurrentUserProfile) {
    isLockProfile = false;
  } else if (profileUser.lockProfile === "ALL") {
    isLockProfile = isCurrentUserProfile ? false : true;
  } else if (profileUser.lockProfile === "FRIENDS") {
    isLockProfile = myFriends.some((friend) => friend.id === profileUser.id)
      ? false
      : true;
  } else {
    isLockProfile = false;
  }

  return (
    <Fragment>
      <Script
        id={`profile-jsonId-${profileId}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: profileUser.name,
            image: profileUser.image || `${url}/avater.jpg`,
            url: `${url}/profile/${profileUser.id}`,
          }),
        }}
      />
      <div className="flex w-full justify-center">
        <div className="w-full">
          <div className="flex flex-col">
            <EditCoverPhoto
              isLockProfile={isLockProfile}
              profileUser={profileUser}
              isCurrentUserProfile={isCurrentUserProfile}
            />
            <div className="bg-white dark:bg-zinc-900 flex justify-center">
              <div className={`max-w-5xl w-full md:px-7 px-4 relative pb-4`}>
                <div className="flex md:gap-4 md:items-start md:flex-row flex-col items-center">
                  <EditProfilePhoto
                    userProfile={profileUser}
                    isCurrentUserProfile={isCurrentUserProfile}
                  />
                  <div className="flex flex-col md:w-full md:mt-3 items-center md:items-start mt-20 gap-1 md:gap-0 w-full">
                    <span className="text-3xl font-semibold">
                      {profileUser.name}
                    </span>
                    <span className="dark:text-zinc-400 text-zinc-500">
                      {totalFriends > 0
                        ? `${formatNumber(totalFriends)} `
                        : "No "}{" "}
                      Friends
                    </span>
                    <div className="w-full flex items-center md:justify-between flex-col md:flex-row md:gap-0 gap-4 mt-1 md:mt-0">
                      <div
                        className={cn(
                          "-space-x-1.5",
                          myFriends.length > 0 ? "flex" : "hidden md:flex"
                        )}
                      >
                        {myFriends.map((friend) => (
                          <Link href={`/profile/${friend.id}`} key={friend.id}>
                            <Avatar
                              src={friend.image || ""}
                              className="size-8 ring-2 ring-white dark:ring-zinc-900"
                            />
                          </Link>
                        ))}
                      </div>

                      {currentUser &&
                        (isCurrentUserProfile ? (
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <AddStory currentUser={profileUser}>
                              <Button className="w-full sm:w-auto">
                                <Plus />
                                Add to story
                              </Button>
                            </AddStory>
                            <EditProfile
                              profileUser={profileUser}
                              isCurrentUserProfile={isCurrentUserProfile}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <ActionFriends
                              profileUserName={profileUser.name}
                              status={status}
                              currentUserId={currentUser.id}
                              profileUserId={profileUser.id}
                            />
                            <Button className="w-full sm:w-auto">
                              <MessageCircleMore />
                              Message
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                {!isLockProfile && (
                  <Separator className="mt-5 md:mt-0 bg-zinc-300 dark:bg-zinc-700" />
                )}
              </div>
            </div>
            {isLockProfile ? (
              <div className="flex items-center justify-center py-10 flex-col gap-2 text-blue-600 dark:text-blue-500">
                <LockKeyhole size={150} />
                <h1 className="text-2xl font-bold">
                  This profile has been locked.
                </h1>
              </div>
            ) : (
              <div className="flex justify-center">
                <TabsElement
                  currentUser={currentUser}
                  isCurrentUserProfile={isCurrentUserProfile}
                  profileUser={profileUser}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProfilePage;
