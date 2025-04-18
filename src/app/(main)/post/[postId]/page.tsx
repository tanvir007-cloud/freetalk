import getCurrentUser from "@/app/getActions/getCurrentUser";
import { db } from "@/lib/db";
import { isValidObjectId } from "@/lib/helper";
import { PostType } from "@/lib/zodValidation";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React, { Fragment } from "react";
import { cn } from "@/lib/utils";
import Script from "next/script";
import SinglePost from "@/app/home/components/SinglePost";
import HomePageElement from "@/app/home/components/HomePageElement";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postId: string }>;
}): Promise<Metadata> {
  const { postId } = await params;
  const url =
    process.env.NEXT_PUBLIC_BASE_URL || "https://freetalk-whdr.onrender.com";
  const defaultImage = `${url}/opengraph.png`;

  if (!postId) {
    return {
      title: "Post Not Found",
      description: "The requested post does not exist.",
      metadataBase: new URL(url),
    };
  }

  let post:
    | ({ desc: string | null; image: string | null } & {
        user: { name: string };
      })
    | null = null;

  if (isValidObjectId(postId)) {
    post = await db.post.findUnique({
      where: { id: postId },
      select: { desc: true, image: true, user: { select: { name: true } } },
    });
  }

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post does not exist.",
      metadataBase: new URL(url),
    };
  }

  const postTitle =
    post.desc?.slice(0, 60) || `${post.user.name} shared a post`;
  const postDescription =
    post.desc || `${post.user.name} shared content on Freetalk.`;
  const postImage = post.image || defaultImage;

  return {
    title: `${post.user.name} - ${postTitle}`,
    description: postDescription,
    keywords: ["Freetalk", post.user.name, "social media", "post"],
    metadataBase: new URL(url),
    alternates: {
      canonical: `${url}/post/${postId}`,
    },
    openGraph: {
      title: `${post.user.name} - ${postTitle}`,
      description: postDescription,
      url: `${url}/post/${postId}`,
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
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.user.name} - ${postTitle}`,
      description: postDescription,
      images: [postImage],
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

const PostPage = async ({
  params,
}: {
  params: Promise<{ postId: string }>;
}) => {
  const { postId } = await params;

  if (!postId) return redirect("/");

  const url =
    process.env.NEXT_PUBLIC_BASE_URL || "https://freetalk-whdr.onrender.com";
  const defaultImage = `${url}/opengraph.png`;

  const currentUser = await getCurrentUser();

  let post: PostType | null = null;

  if (isValidObjectId(postId)) {
    if (currentUser) {
      const friends = await db.friend.findMany({
        where: {
          OR: [{ userId: currentUser.id }, { friendId: currentUser.id }],
        },
        select: { userId: true, friendId: true },
      });

      const friendIds = friends.map((item) =>
        item.userId === currentUser.id ? item.friendId : item.userId
      );

      post = await db.post.findUnique({
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
    } else {
      const foundPost = await db.post.findUnique({
        where: { id: postId },
        include: {
          user: true,
          sharePost: {
            include: {
              user: true,
            },
          },
          _count: {
            select: { likes: true, comments: true, sharedBy: true },
          },
        },
      });

      if (foundPost) {
        post = {
          ...(foundPost as PostType),
          likes: [
            {
              createdAt: new Date(),
              commentId: null,
              id: "",
              postId: null,
              userId: "",
              user: { name: "" },
            },
          ],
        };
      }
    }
  }

  return (
    <Fragment>
      <SinglePost currentUser={currentUser} post={post} />
      {/* Structured Data (JSON-LD) */}
      <Script
        id={`post-jsonId-${postId}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post?.desc || "Post Not Found",
            description: post?.desc || "The requested post does not exist.",
            image: post?.image || defaultImage,
            author: {
              "@type": "Person",
              name: post?.user?.name || "Unknown Author",
            },
            publisher: {
              "@type": "Organization",
              name: "Freetalk",
              logo: {
                "@type": "ImageObject",
                url: `${url}/icons8-facebook-logo-color-152.png`,
              },
            },
            datePublished: post?.createdAt || new Date().toISOString(),
            dateModified: post?.updatedAt || new Date().toISOString(),
            url: postId ? `${url}/post/${postId}` : "",
          }),
        }}
      />

      {currentUser && (
        <div
          className={cn(
            "md:h-[calc(100vh-56px)] h-[calc(100vh-5.3rem)] overflow-hidden"
          )}
        >
          <HomePageElement currentUser={currentUser} />
        </div>
      )}
    </Fragment>
  );
};

export default PostPage;
