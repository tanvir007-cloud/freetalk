"use client";

import { usePostQuery } from "@/hooks/use-post-query";
import { FriendRequest, User } from "@prisma/client";
import InfiniteScroll from "react-infinite-scroll-component";
import FriendRequestItem from "./FriendRequestItem";
import { Fragment } from "react";
import FriendSuggestItem from "./FriendSuggestItem";
import FriendSkeleton from "@/components/AllSkeletons/FriendSkeleton";

export type friendType = FriendRequest & { sender: User };
export type suggestType = User;

const AllFriendRequest = ({ currentUser }: { currentUser: User }) => {
  const { data, fetchNextPage, hasNextPage, status } = usePostQuery({
    apiUrl: "/api/allFriendRequest",
    queryKey: ["friendRequests", currentUser.id],
  });

  const {
    data: suggestData,
    fetchNextPage: suggestFetchNextPage,
    hasNextPage: suggestHasNextPage,
    status: suggestStatus,
  } = usePostQuery({
    apiUrl: "/api/allSuggestUser",
    queryKey: ["suggestUser", currentUser.id],
  });

  if (status === "pending" || suggestStatus === "pending")
    return (
      <div className="flex md:flex-row flex-col md:items-center md:flex-wrap md:gap-5 gap-4 md:mt-10">
        {Array.from({ length: 3 }, (_, i) => (
          <FriendSkeleton key={i} />
        ))}
      </div>
    );

  const friendRequests =
    data?.pages?.flatMap((page) => page.friendRequests) || [];

  const suggestUsers =
    suggestData?.pages?.flatMap((page) => page.suggestUsers) || [];

  const friendRequestCount = data?.pages?.flatMap(
    (page) => page.friendRequestCount
  );

  if (
    friendRequests.length === 0 &&
    !hasNextPage &&
    suggestUsers.length === 0 &&
    !suggestHasNextPage
  ) {
    return <div className="md:h-[calc(100vh-5.5rem)] h-[calc(100vh-7.3rem)] w-full flex items-center justify-center">
      <h1 className="text-3xl font-bold text-center">No one send you friend request 😐😐</h1>
    </div>;
  }

  return (
    <Fragment>
      {friendRequests.length !== 0 && !hasNextPage && (
        <div
          className={`flex flex-col gap-4 border-zinc-200 dark:border-zinc-800 md:pb-7 pb-5 ${
            suggestUsers.length !== 0 && !suggestHasNextPage && "border-b"
          }`}
        >
          <h1 className="text-2xl font-bold">
            Friend Request (
            <span className="text-red-600 dark:text-red-500">
              {friendRequestCount}
            </span>
            )
          </h1>
          <InfiniteScroll
            dataLength={friendRequests.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={
              <div className="flex md:flex-row flex-col md:items-center md:flex-wrap md:gap-5 gap-4">
                {Array.from({ length: 3 }, (_, i) => (
                  <FriendSkeleton key={i} />
                ))}
              </div>
            }
            className="flex md:flex-row flex-col md:items-center md:flex-wrap md:gap-5 gap-4"
          >
            {friendRequests.map((friendRequest: friendType) => (
              <FriendRequestItem
                friendRequest={friendRequest}
                key={friendRequest.id}
              />
            ))}
          </InfiniteScroll>
        </div>
      )}
      {suggestUsers.length !== 0 && !suggestHasNextPage && (
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">People you may know</h1>
          <InfiniteScroll
            dataLength={suggestUsers.length}
            next={suggestFetchNextPage}
            hasMore={!!suggestHasNextPage}
            loader={
              <div className="flex md:flex-row flex-col md:items-center md:flex-wrap md:gap-5 gap-4">
                {Array.from({ length: 3 }, (_, i) => (
                  <FriendSkeleton key={i} />
                ))}
              </div>
            }
            className="flex md:flex-row flex-col md:items-center md:flex-wrap md:gap-5 gap-4"
          >
            {suggestUsers.map((suggestUser: suggestType) => (
              <FriendSuggestItem
                userId={currentUser.id}
                suggestUser={suggestUser}
                key={suggestUser.id}
              />
            ))}
          </InfiniteScroll>
        </div>
      )}
    </Fragment>
  );
};

export default AllFriendRequest;
