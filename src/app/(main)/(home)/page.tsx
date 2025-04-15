import AddPost from "./components/AddPost";
import Feed from "./components/Feed";
import LeftMenu from "./components/LeftMenu";
import RightMenu from "./components/RightMenu";
import Stories from "./components/Stories";
import getCurrentUser from "@/app/getActions/getCurrentUser";
import { Fragment } from "react";
import { db } from "@/lib/db";
import { PostType } from "@/lib/zodValidation";
import { isValidObjectId } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import SinglePost from "./components/SinglePost";
import { Post, User } from "@prisma/client";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ postId: string | undefined }>;
}): Promise<Metadata | void> {
  const { postId } = await searchParams;

  if (!postId) return;

  let post: (Post & { user: User }) | null = null;

  if (isValidObjectId(postId)) {
    post = await db.post.findUnique({
      where: { id: postId },
      include: { user: true },
    });
  }

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post does not exist.",
    };
  }

  const postTitle =
    post.desc?.slice(0, 60) || `${post.user.name} shared a photo`;
  const postDescription =
    post.desc || `${post.user.name} shared an image on Freetalk.`;
  const postImage = post.image || "/default-post-image.png";

  return {
    title: `${post.user.name} - ${postTitle}`,
    description: postDescription,
    keywords: `Freetalk, ${post.user.name}, Social Media, Post, Friends`,
    alternates: {
      canonical: `https://freetalk-whdr.onrender.com/?postId=${postId}`,
    },
    openGraph: {
      title: `${post.user.name} - ${postTitle}`,
      description: postDescription,
      url: `https://freetalk-whdr.onrender.com/?postId=${postId}`,
      siteName: "Freetalk",
      images: [
        {
          url: postImage,
          width: 1200,
          height: 630,
          alt: postTitle,
        },
      ],
      type: "article",
      authors: [post.user.name],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.user.name} - ${postTitle}`,
      description: postDescription,
      images: [postImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { postId } = await searchParams;

  const currentUser = await getCurrentUser();

  if (!currentUser) return "/login";

  let post: PostType | null = null;

  if (postId) {
    if (isValidObjectId(postId)) {
      const friends = await db.friend.findMany({
        where: {
          OR: [{ userId: currentUser.id }, { friendId: currentUser.id }],
        },
        select: { userId: true, friendId: true },
      });

      const friendIds = friends.map((item) =>
        item.userId === currentUser.id ? item.friendId : item.userId
      );

      post = await db.post.findFirst({
        where: { id: postId },
        include: {
          user: true,
          sharePost: {
            include: {
              user: true,
            },
          },
          _count: { select: { likes: true, comments: true, sharedBy: true } },
          likes: {
            orderBy: { createdAt: "desc" },
            include: { user: true },
            take: 2,
            where: {
              userId: {
                in: [
                  currentUser.id,
                  ...(
                    await db.like.findMany({
                      where: {
                        userId: {
                          in: friendIds,
                          not: currentUser.id,
                        },
                      },
                      select: { userId: true },
                      take: 1,
                      orderBy: { createdAt: "desc" },
                    })
                  ).map((like) => like.userId),
                ],
              },
            },
          },
        },
      });
    }
  }

  return (
    <Fragment>
      {postId && <SinglePost currentUser={currentUser} post={post} />}
      <div
        className={cn(
          "flex md:pt-6 sm:pt-3 lg:gap-3",
          postId &&
            "md:h-[calc(100vh-56px)] h-[calc(100vh-5.3rem)] overflow-hidden"
        )}
      >
        <div className="hidden lg:block w-[25.5%]">
          <LeftMenu />
        </div>
        <div className="lg:w-[44%] md:w-[60%] w-full flex justify-center">
          <div className="flex flex-col md:gap-6 sm:gap-3 gap-2 w-full">
            <AddPost
              currentUser={currentUser}
              queryKey={["posts", currentUser.id]}
            />
            <Stories currentUser={currentUser} />
            <Feed
              currentUser={currentUser}
              type="HOME"
              apiUrl={`/api/posts`}
              queryKey={["posts", currentUser.id]}
            />
          </div>
        </div>
        <div className="hidden md:block lg:w-[29%] md:w-[40%]">
          <RightMenu currentUser={currentUser} />
        </div>
      </div>

      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post ? post.desc : "Post Not Found",
            description: post
              ? post.desc
              : "The requested post does not exist.",
            image: post
              ? post.image
              : "https://yourfacebookclone.com/default-post-image.png",
            author: {
              "@type": "Person",
              name: post?.user.name || "Unknown Author",
            },
            publisher: {
              "@type": "Organization",
              name: "Facebook Clone",
              logo: "https://yourfacebookclone.com/icons8-facebook-logo-color-152.png",
            },
            datePublished: post?.createdAt || new Date().toISOString(),
            dateModified: post?.updatedAt || new Date().toISOString(),
            url: postId ? `https://yourfacebookclone.com/post/${postId}` : "",
            sameAs: [
              "https://twitter.com/yourusername",
              "https://linkedin.com/in/yourusername",
            ],
          }),
        }}
      />
    </Fragment>
  );
}
