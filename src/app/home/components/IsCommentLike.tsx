import { commentLike } from "@/app/actions/createCommentLike";
import { formatNumber } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { CommentType } from "@/lib/zodValidation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, {
  Fragment,
  startTransition,
  useOptimistic,
  useState,
} from "react";
import { AiFillLike } from "react-icons/ai";

const IsCommentLike = ({
  comment,
  currentUserId,
  queryKey,
}: {
  comment: CommentType;
  currentUserId: string;
  queryKey: string[];
}) => {
  const queryClient = useQueryClient();
  const isLike = comment.likes.some(
    (comment) => comment.userId === currentUserId
  );
  const [state, setState] = useState({
    likeCount: comment._count.likes,
    isLike: isLike,
  });
  const [optimisticCommentLike, addOptimisticCommentLike] =
    useOptimistic(state);

  const { mutate: toggleCommentLike, isPending } = useMutation({
    mutationFn: async (commentId: string) => {
      await commentLike(commentId);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const handleLike = (commentId: string) => {
    startTransition(() => {
      addOptimisticCommentLike((prev) => ({
        isLike: !prev.isLike,
        likeCount: prev.isLike ? prev.likeCount - 1 : prev.likeCount + 1,
      }));
    });

    if (isPending) return;
    toggleCommentLike(commentId);
    setState((prev) => ({
      ...prev,
      isLike: !prev.isLike,
      likeCount: prev.isLike ? prev.likeCount - 1 : prev.likeCount + 1,
    }));
  };

  return (
    <Fragment>
      <form action={() => handleLike(comment.id)} className="order-2">
        <button
          type="submit"
          className={cn(
            "text-sm cursor-pointer hover:underline underline-offset-2 transition",
            optimisticCommentLike.isLike
              ? "text-blue-700 dark:text-blue-600"
              : "text-zinc-600 dark:text-zinc-400"
          )}
        >
          Like
        </button>
      </form>
      <div
        className={cn(
          "text-sm text-zinc-600 dark:text-zinc-400 items-center gap-1 order-4",
          optimisticCommentLike.likeCount === 0 ? "hidden" : "flex"
        )}
      >
        {formatNumber(optimisticCommentLike.likeCount)}
        <span className="bg-blue-600 rounded-full p-[1px]">
          <AiFillLike className="text-white" />
        </span>
      </div>
    </Fragment>
  );
};

export default IsCommentLike;
