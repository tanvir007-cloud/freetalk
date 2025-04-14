import React, { Fragment } from "react";
import { FaUserPlus } from "react-icons/fa";
import { usePostQuery } from "@/hooks/use-post-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { LikeType } from "@/lib/zodValidation";
import LikeSkeleton from "@/components/AllSkeletons/LikeSkeleton";
import { DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PostAllLikes = ({
  apiUrl,
  paramKey,
  paramValue,
  queryKey,
  count,
  userId,
}: {
  queryKey: string;
  apiUrl: string;
  paramKey: string;
  paramValue: string;
  count: number;
  userId: string;
}) => {
  const { data, fetchNextPage, hasNextPage, status } = usePostQuery({
    apiUrl,
    queryKey: [queryKey, paramValue],
    paramKey,
    paramValue,
  });

  const allLikes = data?.pages?.flatMap((page) => page.likes) || [];

  if (status === "pending") {
    return (
      <Fragment>
        <DialogTitle className="py-3.5 border-b border-zinc-200 dark:border-zinc-800" />
        <div className="px-4 pb-4">
          <LikeSkeleton type="Pending" />
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <DialogTitle className="text-center">All People ({count})</DialogTitle>
      <ScrollArea className="sm:max-h-[60.7vh] max-h-[70.7vh] px-4 sm:min-h-[60.7vh] min-h-[70.7vh]">
        <InfiniteScroll
          dataLength={allLikes.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<LikeSkeleton />}
          className="flex flex-col gap-4 pb-2"
        >
          {allLikes.map((like: LikeType) => (
            <div key={like.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar src={like.user.image || ""} className="size-10" />
                <h1 className="capitalize">{like.user.name}</h1>
              </div>
              <Button
                variant={"outline"}
                className={cn(userId === like.userId && "hidden")}
              >
                <FaUserPlus />
                Add friend
              </Button>
            </div>
          ))}
        </InfiniteScroll>
      </ScrollArea>
    </Fragment>
  );
};

export default PostAllLikes;
