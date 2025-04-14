"use client";
import { Separator } from "@/components/ui/separator";
import { User } from "@prisma/client";
import { ImageIcon, Smile, Video } from "lucide-react";
import React, { useState } from "react";
import AddPostElement from "./AddPostElement";
import { cn } from "@/lib/utils";

const AddPost = ({
  currentUser,
  type = "HOME",
  queryKey,
}: {
  currentUser: User;
  type?: "HOME" | "PROFILE";
  queryKey: string[];
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-center w-full">
      <div
        className={cn(
          "p-4 bg-white dark:bg-zinc-900 sm:shadow-md shadow-sm flex flex-col gap-4 w-full",
          type === "HOME"
            ? "md:w-[93%] sm:w-[85%] lg:w-full sm:rounded-lg"
            : "md:rounded-md"
        )}
      >
        <AddPostElement
          queryKey={queryKey}
          currentUser={currentUser}
          open={open}
          setOpen={setOpen}
        />
        <Separator />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <Video className="text-rose-500" />
            <span
              className="text-zinc-500 dark:text-zinc-400"
              onClick={() => setOpen(true)}
            >
              Video
            </span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <ImageIcon className="text-emerald-500" />
            <span
              className="text-zinc-500 dark:text-zinc-400"
              onClick={() => setOpen(true)}
            >
              Photo
            </span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Smile className="text-yellow-500" />
            <span
              className="text-zinc-500 dark:text-zinc-400"
              onClick={() => setOpen(true)}
            >
              Feeling
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
