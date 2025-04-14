"use client";
import getStory from "@/app/getActions/getStory";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import AddStory from "./AddStory";
import StoryElement from "./StoryElement";

const Stories = ({ currentUser }: { currentUser: User }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["story", currentUser.id],
    queryFn: async () => {
      return await getStory(currentUser.id);
    },
  });

  const stories = data ?? [];

  const checkScrollButtons = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setShowLeftArrow(scrollLeft > 0);

    setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
  };

  const scroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: offset,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const current = scrollRef.current;
    if (!current) return;
    current.addEventListener("scroll", checkScrollButtons);
    return () => current.removeEventListener("scroll", checkScrollButtons);
  }, []);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full md:w-[93%] lg:w-full sm:w-[85%] relative flex items-center">
        <div className="absolute flex items-center justify-between w-full px-3">
          <button
            className={cn(
              "z-20 bg-white hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition p-2 rounded-full cursor-pointer ease-in-out opacity-100",
              !showLeftArrow && "opacity-0 pointer-events-none"
            )}
            onClick={(e) => {
              e.stopPropagation();
              scroll(-400);
            }}
          >
            <ChevronLeft className="text-zinc-700 dark:text-zinc-400" />
          </button>
          <button
            className={cn(
              "z-20 bg-white hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition p-2 rounded-full cursor-pointer ease-in-out opacity-100",
              !showRightArrow && "opacity-0 pointer-events-none"
            )}
            onClick={(e) => {
              e.stopPropagation();
              scroll(400);
            }}
          >
            <ChevronRight />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scroll-smooth scrollbar-none"
        >
          <AddStory currentUser={currentUser}>
            <div className="h-52 w-28 relative flex flex-col rounded-lg cursor-pointer group overflow-hidden shrink-0">
              <div className="absolute h-full w-full bg-zinc-950/15 transition-opacity opacity-0 group-hover:opacity-100 rounded-lg z-10" />

              <div className="relative h-full w-full rounded-lg">
                <Image
                  src={currentUser.image || "/avater.jpg"}
                  alt=""
                  fill
                  sizes="1"
                  className="rounded-t-lg object-cover group-hover:scale-103 transition-transform transform ease-in-out duration-300"
                />
              </div>

              <div className="h-[33%] bg-white dark:bg-zinc-900 w-full rounded-b-lg flex flex-col justify-between items-center relative border border-t-0 border-zinc-200 dark:border-0 group-hover:border-zinc-50">
                <div className="flex items-center justify-center rounded-full bg-blue-600 p-1.5 ring-4 ring-white dark:ring-zinc-900 absolute -top-4">
                  <Plus className="text-white" />
                </div>
                <h1 className="font-medium absolute bottom-1.5">
                  Create story
                </h1>
              </div>
            </div>
          </AddStory>
          <StoryElement currentUserId={currentUser.id} isLoading={isLoading} stories={stories}/>
        </div>
      </div>
    </div>
  );
};

export default Stories;
