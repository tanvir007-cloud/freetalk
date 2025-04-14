"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { Fragment, useState } from "react";
import GetAllMyFriends from "./GetAllMyFriends";

const AllMyFriends = ({
  profileUserId,
  isCurrentUserProfile,
}: {
  profileUserId: string;
  isCurrentUserProfile: boolean;
}) => {
  const [search, setSearch] = useState("");
  return (
    <div className="w-full bg-white shadow-md dark:bg-zinc-900 p-4 md:rounded-md flex flex-col gap-6">
      <div className="flex items-center justify-between gap-x-4">
        <h1 className="text-2xl font-bold">Friends</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <input
              autoComplete="off"
              type="text"
              className={cn(
                "outline-hidden rounded-full pr-3 pl-8 py-2 dark:bg-zinc-800 bg-zinc-200/50"
              )}
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-2 pointer-events-none" size={20} />
          </div>
          {isCurrentUserProfile && (
            <Fragment>
              <Link
                href={"/friends"}
                className={buttonVariants({
                  variant: "ghost",
                  className: "hidden md:flex",
                })}
              >
                Friend requests
              </Link>
              <Link
                href={"/friends"}
                className={buttonVariants({
                  variant: "ghost",
                  className: "hidden md:flex",
                })}
              >
                Find friends
              </Link>
            </Fragment>
          )}
        </div>
      </div>
      <GetAllMyFriends profileUserId={profileUserId} search={search} />
    </div>
  );
};

export default AllMyFriends;
