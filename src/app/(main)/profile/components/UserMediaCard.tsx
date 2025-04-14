import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const UserMediaCard = async ({ userId }: { userId: string }) => {
  const postPhotos = await db.postPhoto.findMany({
    where: { userId },
    take: 9,
  });

  if (postPhotos.length === 0) return null;

  return (
    <div
      className={cn(
        "p-4 bg-white dark:bg-zinc-900 md:rounded-md shadow-md flex flex-col gap-4"
      )}
    >
      <div className="flex items-center justify-between font-medium">
        <span className="text-zinc-500 dark:text-zinc-400 text-xl font-semibold">
          Photos
        </span>
        <TabsList className="dark:bg-transparent p-0 bg-transparent">
          <TabsTrigger
            value="photos"
            className="text-blue-600 text-sm hover:underline transition"
          >
            See all
          </TabsTrigger>
        </TabsList>
      </div>
      <div className={cn("grid grid-cols-3 gap-2")}>
        {postPhotos.map((photo) => (
          <div
            key={photo.id}
            className={cn("relative aspect-square size-full")}
          >
            <Image
              src={photo.postImage}
              alt=""
              fill
              sizes="1"
              className="rounded-sm object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserMediaCard;
