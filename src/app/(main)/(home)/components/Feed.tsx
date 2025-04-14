"use client";
import React, { useEffect, useState } from "react";
import Post from "./Post";
import { User } from "@prisma/client";
import { usePostQuery } from "@/hooks/use-post-query";
import { PostType } from "@/lib/zodValidation";
import InfiniteScroll from "react-infinite-scroll-component";
import PostSkeleton from "@/components/AllSkeletons/PostSkeleton";
import { socket } from "@/socket";

const Feed = ({
  currentUser,
  type,
  apiUrl,
  queryKey,
  paramKey,
  paramValue,
}: {
  currentUser: User;
  type?: "HOME";
  queryKey: string[];
  apiUrl: string;
  paramKey?: string;
  paramValue?: string;
}) => {
  const [allPosts, setAllPosts] = useState<PostType[]>([]);
  const { data, fetchNextPage, hasNextPage, status } = usePostQuery({
    apiUrl,
    queryKey,
    paramKey,
    paramValue,
  });

  useEffect(() => {
    setAllPosts(data?.pages?.flatMap((page) => page.posts) || []);
  }, [data]);

  useEffect(() => {
    socket.on("receivePost", (newPost: PostType) => {
      setAllPosts((prevPosts) => [newPost, ...prevPosts]);
    });

    return () => {
      socket.off("receivePost");
    };
  }, []);

  if (status === "pending") {
    return (
      <div className="flex flex-col sm:gap-6 gap-2 items-center justify-center">
        <PostSkeleton type={type} />
      </div>
    );
  }

  if (!hasNextPage && allPosts.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <h1 className="text-2xl font-bold">No post here 😐😐</h1>
      </div>
    );
  }
  return (
    <InfiniteScroll
      dataLength={allPosts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<PostSkeleton type={type} />}
      className="flex items-center justify-center md:gap-6 sm:gap-3 gap-2 flex-col"
    >
      {allPosts.map((post: PostType) => (
        <Post
          currentUser={currentUser}
          type={type}
          post={post}
          key={post.id}
          queryKey={queryKey}
        />
      ))}
    </InfiniteScroll>
  );
};

export default Feed;
