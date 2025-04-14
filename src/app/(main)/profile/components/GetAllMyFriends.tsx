"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { usePostQuery } from "@/hooks/use-post-query";
import { useSearchQuery } from "@/hooks/use-search-query";
import { formatDate } from "@/lib/helper";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const GetAllMyFriends = ({
  profileUserId,
  search,
}: {
  profileUserId: string;
  search: string;
}) => {
  const { data, fetchNextPage, hasNextPage, status } = usePostQuery({
    apiUrl: "/api/allFriend",
    queryKey: ["allFriend", profileUserId],
    paramKey: "userId",
    paramValue: profileUserId,
  });

  const {
    data: searchData,
    fetchNextPage: searchFetchNextPage,
    hasNextPage: searchHasNextPage,
    status: searchStatus,
  } = useSearchQuery({
    apiUrl: "/api/friendSearch",
    queryKey: ["friendSearch", profileUserId],
    paramKey: "userId",
    paramValue: profileUserId,
    searchKey: "searchText",
    searchValue: search,
  });

  const allMyFriends = data?.pages?.flatMap((page) => page.myFriends) || [];

  const allSearchFriends =
    searchData?.pages?.flatMap((page) => page.myFriends) || [];

  return (
    <Fragment>
      {search !== "" ? (
        searchStatus === "pending" ? (
          <div className="grid md:grid-cols-2 grid-cols-1 md:gap-4 gap-y-5">
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="aspect-square size-16 rounded-md" />
                <div className="flex flex-col gap-2 w-full">
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : allSearchFriends.length === 0 && !hasNextPage ? (
          <div className="w-full flex items-center justify-center pb-5">
            <h1 className="text-2xl font-bold dark:text-zinc-400 text-zinc-600">
              No results for: {search}
            </h1>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={allSearchFriends.length}
            next={searchFetchNextPage}
            hasMore={!!searchHasNextPage}
            loader={
              <div className="grid md:grid-cols-2 grid-cols-1 md:gap-4 gap-y-5">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="aspect-square size-16 rounded-md" />
                    <div className="flex flex-col gap-2 w-full">
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            }
            className="grid md:grid-cols-2 grid-cols-1 md:gap-4 gap-y-5"
          >
            {allSearchFriends.map(
              (myFriend: {
                name: string;
                id: string;
                image: string | null;
                createdAt: Date;
              }) => (
                <FriendElement myFriend={myFriend} key={myFriend.id} />
              )
            )}
          </InfiniteScroll>
        )
      ) : status === "pending" ? (
        <div className="grid md:grid-cols-2 grid-cols-1 md:gap-4 gap-y-5">
          {Array.from({ length: 2 }, (_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="aspect-square size-16 rounded-md" />
              <div className="flex flex-col gap-2 w-full">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : allMyFriends.length === 0 && !hasNextPage ? (
        <div className="w-full flex items-center justify-center pb-5">
          <h1 className="text-2xl font-bold dark:text-zinc-400 text-zinc-600">
            No friends yet 😐😐
          </h1>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={allMyFriends.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={
            <div className="grid md:grid-cols-2 grid-cols-1 md:gap-4 gap-y-5">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="aspect-square size-16 rounded-md" />
                  <div className="flex flex-col gap-2 w-full">
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          }
          className="grid md:grid-cols-2 grid-cols-1 md:gap-4 gap-y-5"
        >
          {allMyFriends.map(
            (myFriend: {
              name: string;
              id: string;
              image: string | null;
              createdAt: Date;
            }) => (
              <FriendElement myFriend={myFriend} key={myFriend.id} />
            )
          )}
        </InfiniteScroll>
      )}
    </Fragment>
  );
};

const FriendElement = ({
  myFriend,
}: {
  myFriend: {
    name: string;
    id: string;
    image: string | null;
    createdAt: Date;
  };
}) => {
  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/profile/${myFriend.id}`}
        className="relative aspect-square size-16"
      >
        <Image
          src={myFriend.image || "/avater.jpg"}
          alt=""
          sizes="1"
          fill
          className="rounded-md"
        />
      </Link>
      <div className="flex flex-col">
        <h1>{myFriend.name}</h1>
        <p className="text-sm text-zinc-500">
          Friend from {formatDate(myFriend.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default GetAllMyFriends;
