import { Post, User } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { formatMainPageDate } from "@/lib/helper";
import { cn } from "@/lib/utils";
import Image from "next/image";

const PostAvatar = ({
  type = "POST",
  post,
}: {
  post: Post & { user: User };
  type?: "SHAREPOST" | "POST";
}) => {
  return (
    <div
      className={cn("flex items-start gap-2", type === "SHAREPOST" && "px-4")}
    >
      <Link href={`/profile/${post.user.id}`}>
        <div
          className={cn(
            "aspect-square overflow-hidden rounded-full relative",
            type === "POST" ? "size-10" : "size-8"
          )}
        >
          <Image
            src={post.user.image || "/avater.jpg"}
            alt="avatar"
            fill
            sizes="1"
          />
        </div>
      </Link>
      <div className="flex flex-col">
        <div className="text-wrap leading-3">
          <Link
            href={`/profile/${post.user.id}`}
            className="pr-1 hover:underline transition"
          >
            {post.user.name}
          </Link>
          <span className="text-sm text-zinc-500 tracking-wide">
            {post.postType === "PROFILE"
              ? "update his profile picture"
              : post.postType === "COVER" && "update his cover photo"}
          </span>
        </div>
        <span className="text-sm text-zinc-500 dark:text-zinc-400/70">
          {formatMainPageDate(post.updatedAt)}
        </span>
      </div>
    </div>
  );
};

export default PostAvatar;
