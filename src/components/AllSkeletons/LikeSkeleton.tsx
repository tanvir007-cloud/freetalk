import React, { Fragment } from "react";
import { Skeleton } from "../ui/skeleton";

const LikeSkeleton = ({ type }: { type?: "Pending" }) => {
  return (
    <Fragment>
      {type === "Pending" ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="rounded-full h-4 w-1/2" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 rounded-full w-10/12" />
            <Skeleton className="h-3 rounded-full w-4/6" />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 w-full">
          <Skeleton className="min-h-10 min-w-10 rounded-full" />
          <Skeleton className="w-1/2 h-[18px] rounded-full" />
        </div>
      )}
    </Fragment>
  );
};

export default LikeSkeleton;
