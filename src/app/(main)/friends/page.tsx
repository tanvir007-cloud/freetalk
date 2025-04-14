import React from "react";
import AllFriendRequest from "./components/AllFriendRequest";
import getCurrentUser from "@/app/getActions/getCurrentUser";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Friends | Freetalk",
    description:
      "View and manage all your friend requests on Freetalk. Accept or reject friend requests easily.",
    alternates: {
      canonical: "https://yourfreetalk.com/friends",
    },
    openGraph: {
      title: "Friend Requests | Freetalk",
      description:
        "View and manage all your friend requests on Freetalk. Accept or reject friend requests easily.",
      url: "https://yourfreetalk.com/friends",
      siteName: "Freetalk",
      type: "website",
      images: [
        {
          url: "https://yourfreetalk.com/meta-image.jpg",
          width: 1200,
          height: 630,
          alt: "Freetalk Friend Requests",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Friend Requests | Freetalk",
      description:
        "View and manage all your friend requests on Freetalk. Accept or reject friend requests easily.",
      images: ["https://yourfreetalk.com/meta-image.jpg"],
    },
  };
}


const FriendPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return redirect("/login");

  return (
    <div className="flex w-full justify-center px-4 py-4">
      <div className="w-full max-w-[44.9rem] flex flex-col gap-5 md:gap-7">
        <AllFriendRequest currentUser={currentUser} />
      </div>
    </div>
  );
};

export default FriendPage;

