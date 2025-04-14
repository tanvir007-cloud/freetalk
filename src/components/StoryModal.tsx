"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import NextImage from "next/image";
import Avatar from "./Avatar";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Loader2,
  Trash,
  XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Story } from "@prisma/client";
import { formateCommentDate } from "@/lib/helper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteStory } from "@/app/actions/createStory";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Progress } from "./ui/progress";

export default function StoryModal({
  stories,
  selectedStory,
  setSelectedStory,
  currentUserId,
}: {
  stories: (Story & {
    user: {
      name: string;
      id: string;
      image: string | null;
    };
  })[];
  selectedStory: string | null;
  setSelectedStory: (id: string | null) => void;
  currentUserId: string;
}) {
  const queryClient = useQueryClient();
  const [isPending, startTrangition] = useTransition();
  const [open, setOpen] = useState(false);
  const index = stories.findIndex((s) => s.id === selectedStory);
  const story = stories[index];
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number | null;
    height: number | null;
  }>({ width: null, height: null });

  const isStoryOwner = story.userId === currentUserId;

  useEffect(() => {
    if (!story) return;

    setProgress(0);
    if (!paused) {
      timerRef.current = setTimeout(() => {
        if (index < stories.length - 1) {
          setSelectedStory(stories[index + 1].id);
        } else {
          setSelectedStory(null);
        }
      }, 5000);

      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressIntervalRef.current!);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
    };
  }, [selectedStory, paused, index, setSelectedStory, stories, story]);

  const handlePauseToggle = () => {
    setPaused((prev) => {
      const newState = !prev;
      return newState;
    });
  };

  const handleNext = () => {
    if (index < stories.length - 1) setSelectedStory(stories[index + 1].id);
  };

  const handlePrev = () => {
    if (index > 0) setSelectedStory(stories[index - 1].id);
  };

  useEffect(() => {
    if (story) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [story]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ height: img.height, width: img.width });
    };
    img.src = story.image;
  }, [story.image]);

  useEffect(() => {
    if (open) {
      setPaused(true);
    } else {
      setPaused(false);
    }
  }, [open]);

  const handleDelete = (id: string) => {
    startTrangition(async () => {
      const data = await deleteStory(id, isStoryOwner);
      if (data.success) {
        setSelectedStory(null);
        setOpen(false);
        queryClient.invalidateQueries({ queryKey: ["story", currentUserId] });
      }
      if (data.error) toast.error(data.error);
    });
  };

  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="flex items-center w-[98%] sm:w-120 absolute justify-between">
        <button
          className={cn(
            "dark:sm:bg-zinc-800 sm:bg-zinc-400 p-2 border sm:border-0 border-zinc-400 rounded-full transition-colors dark:sm:hover:bg-zinc-700 sm:hover:bg-zinc-200 cursor-pointer z-20 bg-zinc-950/20",
            index === 0 && "opacity-0 pointer-events-none"
          )}
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
        >
          <ChevronLeft className="sm:text-zinc-800 dark:text-zinc-200 text-zinc-200" />
        </button>
        <button
          className={cn(
            "dark:sm:bg-zinc-800 sm:bg-zinc-400 p-2 border sm:border-0 border-zinc-400 rounded-full transition-colors dark:sm:hover:bg-zinc-700 sm:hover:bg-zinc-200 cursor-pointer z-20 bg-zinc-950/20",
            index === stories.length - 1 && "opacity-0 pointer-events-none"
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
        >
          <ChevronRight className="sm:text-zinc-800 dark:text-zinc-200 text-zinc-200" />
        </button>
      </div>
      <div className="relative sm:w-80 sm:h-auto aspect-[9/16] h-full w-full flex justify-center sm:rounded-md overflow-hidden">
        <div
          className="h-full w-full flex items-center justify-center relative"
          onClick={handlePauseToggle}
        >
          <NextImage src={story.image} alt="" fill />
          <div className="absolute inset-0 backdrop-blur-3xl" />
          {imageDimensions.width && imageDimensions.height && (
            <NextImage
              src={story.image}
              alt=""
              width={imageDimensions.width}
              height={imageDimensions.height}
              className="z-10"
            />
          )}
        </div>
        <div className="absolute top-4 flex flex-col gap-3 w-[calc(100%-1rem)]">
          <Progress value={progress} className="w-full" />
          <div className="flex items-center justify-between gap-x-2">
            <div className="flex items-center gap-x-2">
              <Link href={`/profile/${story.user.id}`}>
                <Avatar
                  src={story.user.image || "/avater.jpg"}
                  className="size-9"
                />
              </Link>
              <div className="flex flex-col items-start text-white -space-y-1">
                <Link
                  href={`/profile/${story.user.id}`}
                  className="capitalize font-medium text-lg line-clamp-1"
                >
                  {story.user.name}
                </Link>
                <span className="text-sm">
                  {formateCommentDate(story.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-x-1">
              {isStoryOwner && (
                <DropdownMenu onOpenChange={(open) => setPaused(open)}>
                  <DropdownMenuTrigger>
                    <EllipsisVertical className="cursor-pointer text-zinc-300 transition-colors hover:text-white" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div onClick={() => setOpen(true)}>
                      <DropdownMenuItem>
                        <Trash />
                        Delete
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <XIcon
                className="cursor-pointer text-zinc-300 transition-colors hover:text-white"
                onClick={() => setSelectedStory(null)}
              />
            </div>
          </div>
        </div>
      </div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={() => handleDelete(story.id)} disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
