import Trim from "@/components/Trim";
import { cn } from "@/lib/utils";
import { Post } from "@prisma/client";
import Image from "next/image";
import React, { Fragment } from "react";

const PostDesign = ({
  post,
  type = "POST",
}: {
  post: Post;
  type?: "POST" | "SHAREPOST";
}) => {
  return (
    <Fragment>
      {post.desc && (
        <div className={cn("px-4", type === "SHAREPOST" && "mb-1.5")}>
          <Trim
            text={post.desc}
            className="text-base text-zinc-800 dark:text-zinc-300"
            length={400}
          />
        </div>
      )}
      {post.postType === "PROFILE" ? (
        <div className="min-h-[22rem] w-full relative">
          {post.image && (
            <div className="relative w-full min-h-48">
              <Image
                src={post.image}
                alt="post image"
                sizes="1"
                fill
                className="object-cover"
              />
            </div>
          )}
          {post.profileImage && (
            <div className="absolute size-full flex items-center justify-center top-0">
              <div className="relative aspect-square size-80">
                <Image
                  src={post.profileImage}
                  alt="profile image"
                  fill
                  sizes="1"
                  className="rounded-full ring-4 dark:ring-zinc-900 ring-white"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <Fragment>
          {post.image && (
            <div
              className={cn(
                "w-full relative",
                post.postType === "COVER"
                  ? "min-h-72"
                  : type === "SHAREPOST"
                  ? "min-h-80"
                  : "min-h-[22rem]"
              )}
            >
              <Image
                src={post.image}
                fill
                alt="post image"
                className={cn(
                  "object-cover",
                  type === "SHAREPOST" && "rounded-b-xl"
                )}
                sizes="1"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default PostDesign;
