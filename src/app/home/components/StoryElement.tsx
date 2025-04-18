import Avatar from "@/components/Avatar";
import StoryModal from "@/components/StoryModal";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Story } from "@prisma/client";
import Image from "next/image";
import React, { Fragment, useState } from "react";

const StoryElement = ({
  currentUserId,
  isLoading,
  stories,
  className,
  type = "HOME",
}: {
  currentUserId: string;
  isLoading: boolean;
  stories: (Story & {
    user: {
      id: string;
      image: string | null;
      name: string;
    };
  })[];
  className?: string;
  type?: "HOME" | "PROFILE";
}) => {
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  return (
    <Fragment>
      {isLoading
        ? Array.from({ length: 3 }, (_, i) => (
            <Skeleton
              className={cn("h-52 w-28 rounded-lg shrink-0", className)}
              key={i}
            />
          ))
        : stories.map((story) => (
            <div
              onClick={() => setSelectedStory(story.id)}
              className={cn(
                "cursor-pointer relative h-52 w-28 rounded-lg border border-zinc-200 dark:border-none group overflow-hidden shrink-0 bg-white dark:bg-zinc-900",
                className
              )}
              key={story.id}
            >
              <div className="absolute h-full w-full bg-zinc-950/15 transition-opacity opacity-0 group-hover:opacity-100 rounded-lg z-10" />

              <Image
                src={story.image}
                alt=""
                fill
                sizes="1"
                priority
                className="rounded-lg object-cover group-hover:scale-103 transition-transform transform ease-in-out duration-300"
              />
              {type === "HOME" && (
                <Fragment>
                  <h1 className="absolute bottom-1 z-10 line-clamp-2 font-semibold left-1.5 text-white">
                    {story.user.name}
                  </h1>

                  <div className="absolute top-3 left-2 z-10">
                    <Avatar
                      src={story.user.image || "/avater.jpg"}
                      className="size-6 ring-2 ring-blue-600"
                    />
                  </div>
                </Fragment>
              )}
            </div>
          ))}

      {selectedStory && (
        <StoryModal
          stories={stories}
          selectedStory={selectedStory}
          setSelectedStory={setSelectedStory}
          currentUserId={currentUserId}
        />
      )}
    </Fragment>
  );
};

export default StoryElement;
