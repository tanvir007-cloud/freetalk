import React from "react";
import { Skeleton } from "../ui/skeleton";

const FriendSkeleton = () => {
  return (
    <div className="flex md:flex-col items-center flex-row md:w-56 md:border border-zinc-200 dark:border-zinc-800 rounded-md md:shadow-sm md:bg-white md:dark:bg-zinc-950 gap-4 md:gap-0 h-24 md:h-auto">
      <div className="relative md:w-full aspect-square h-full md:size-auto">
        <Skeleton className="md:rounded-t-md rounded-full md:rounded-none w-full h-full" />
      </div>
      <div className="flex flex-col gap-y-3 md:p-2 w-full tracking-wide">
        <Skeleton className="h-6 w-3/4 rounded-full" />
        <div className="flex md:flex-col flex-row md:gap-2 sm:gap-4 gap-3 w-full">
          <Skeleton className="md:h-9 w-full h-5 rounded-full md:rounded-md" />
          <Skeleton className="md:h-9 w-full h-5 rounded-full md:rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default FriendSkeleton;
