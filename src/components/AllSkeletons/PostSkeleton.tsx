import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

const PostSkeleton = ({ type }: { type?: "HOME" }) => {
  return (
    <div
      className={cn(
        "bg-white dark:bg-zinc-900 shadow-md flex flex-col w-full",
        type === "HOME"
          ? "md:w-[93%] sm:w-[85%] lg:w-full sm:rounded-lg"
          : "rounded-md"
      )}
    >
      <div className="flex flex-col gap-1 p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="rounded-full min-h-10 min-w-10" />
          <div className="flex flex-col gap-1 w-full">
            <Skeleton className="rounded-full w-1/4 h-2.5" />
            <Skeleton className="rounded-full w-1/3 h-2.5" />
          </div>
        </div>
        <div className="h-44 w-full mb-2" />
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-3 w-1/5 rounded-md" />
          <Skeleton className="h-3 w-1/5 rounded-md" />
          <Skeleton className="h-3 w-1/5 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
