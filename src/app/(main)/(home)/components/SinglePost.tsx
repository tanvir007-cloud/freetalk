"use client";
import { buttonVariants } from "@/components/ui/button";
import { LinkIcon, X } from "lucide-react";
import React, { Fragment } from "react";
import Comment from "./Comment";
import LikeSkeleton from "@/components/AllSkeletons/LikeSkeleton";
import { PostType } from "@/lib/zodValidation";
import { User } from "@prisma/client";
import UseGlobal from "@/hooks/use-global";
import Link from "next/link";

const SinglePost = ({
  currentUser,
  post,
}: {
  post: PostType | null;
  currentUser: User;
}) => {
  return (
    <div className="fixed inset-0 h-screen w-screen flex items-center justify-center z-50">
      <Link
        href={"/"}
        className="h-full w-full bg-black/60 dark:bg-black/60 absolute cursor-default"
      />
      <div className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 sm:rounded-lg pt-6 sm:max-h-[90vh] max-h-screen max-w-xl relative">
        {post ? (
          <PostFunction currentUser={currentUser} post={post} />
        ) : (
          <div>
            <h1 className="text-center capitalize pb-4 text-lg font-semibold leading-none tracking-tight">
              Post
            </h1>
            <div className="sm:h-[65.6vh] h-[75.8vh] border-t dark:border-zinc-800 border-zinc-200 flex items-center justify-center">
              <div className="flex flex-col px-16 items-center gap-y-6 mb-8">
                <LinkIcon
                  size={80}
                  className="text-zinc-700 dark:text-zinc-300"
                />
                <div className="flex flex-col items-center">
                  <h1 className="text-xl font-semibold text-center text-zinc-700 dark:text-zinc-300">
                    This page isn&apos;t available right now
                  </h1>
                  <p className="text-center text-zinc-600 dark:text-zinc-400">
                    This may be because of a technical error that we&apos;re
                    working to get fixed. Try reloading this page.
                  </p>
                  <Link
                    href={"/"}
                    className={buttonVariants({
                      variant: "default",
                      className: "mt-5",
                    })}
                  >
                    Go to News Feed{" "}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        <Link
          href={"/"}
          className="absolute dark:bg-zinc-800 bg-zinc-200 rounded-full p-1 top-3 right-3 cursor-pointer transition dark:hover:bg-zinc-700 hover:bg-zinc-300 text-zinc-700 dark:text-zinc-300"
        >
          <X />
        </Link>
      </div>
    </div>
  );
};

const PostFunction = ({
  post,
  currentUser,
}: {
  post: PostType;
  currentUser: User;
}) => {
  const {
    addOptimisticComment,
    addOptimisticCount,
    optimisticComment,
    optimisticCount,
    setCommentState,
    setState,
    state,
  } = UseGlobal({ currentUserId: currentUser.id, post });
  return (
    <Comment
      pendingChildren={
        <Fragment>
          <h1 className="py-3.5 border-b border-zinc-200 dark:border-zinc-800" />
          <div className="p-4">
            <LikeSkeleton type="Pending" />
          </div>
        </Fragment>
      }
      currentUser={currentUser}
      post={post}
      paramKey="postId"
      apiUrl="/api/postComment"
      queryKey={["posts", currentUser.id]}
      addOptimisticComment={addOptimisticComment}
      addOptimisticCount={addOptimisticCount}
      optimisticComment={optimisticComment}
      setCommentState={setCommentState}
      setState={setState}
      shareCount={state.shareCount}
      isLike={optimisticCount.isLike}
      likeCount={optimisticCount.likeCount}
    >
      <h1 className="text-center capitalize pb-4 text-lg font-semibold leading-none tracking-tight">
        {post.user.name}&apos;s Posts
      </h1>
    </Comment>
  );
};

export default SinglePost;
