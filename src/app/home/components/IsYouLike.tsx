import { likePost } from "@/app/actions/addLike";
import { useZustandStore } from "@/hooks/use-zustand-store";
import { cn } from "@/lib/utils";
import { socket } from "@/socket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { Dispatch, SetStateAction } from "react";
import { BiLike, BiSolidLike } from "react-icons/bi";

const IsYouLike = ({
  postId,
  isLike,
  addOptimisticCount,
  setState,
  queryKey,
  postUserId,
  currentUserId,
}: {
  postUserId: string;
  postId: string;
  isLike: boolean;
  addOptimisticCount: (action: "like") => void;
  setState: Dispatch<
    SetStateAction<{
      likeCount: number;
      isLike: boolean;
      shareCount: number;
    }>
  >;
  queryKey: string[];
  currentUserId: string | undefined;
}) => {
  const queryClient = useQueryClient();
  const { setLoginOpen } = useZustandStore();

  const { mutate: togglePostLike, isPending } = useMutation({
    mutationFn: async ({
      postId,
      postUserId,
    }: {
      postId: string;
      postUserId: string;
    }) => {
      return await likePost(postId, postUserId);
    },
    onSuccess: (data) => {
      if (data.notification) {
        socket.emit("sendNotification", data.notification);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const handleLike = (postId: string) => {
    addOptimisticCount("like");
    if (isPending) return;
    togglePostLike({ postId, postUserId });
    setState((prev) => ({
      ...prev,
      likeCount: prev.isLike ? prev.likeCount - 1 : prev.likeCount + 1,
      isLike: !prev.isLike,
    }));
  };

  return (
    <form
      action={() => (currentUserId ? handleLike(postId) : setLoginOpen(true))}
    >
      <button
        className={cn(
          "flex items-center gap-2 text-sm  dark:hover:bg-zinc-800 dark:text-zinc-400 text-zinc-600 hover:bg-zinc-200 px-4 py-1 rounded-sm transition cursor-pointer"
        )}
        type="submit"
      >
        {isLike ? (
          <BiSolidLike className="text-2xl" />
        ) : (
          <BiLike className="text-2xl" />
        )}
        <span>Like</span>
      </button>
    </form>
  );
};

export default IsYouLike;
