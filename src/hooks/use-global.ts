import { PostType } from "@/lib/zodValidation";
import { useOptimistic, useState } from "react";
import UseComment from "./use-comment";

const UseGlobal = ({
  currentUserId,
  post,
}: {
  post: PostType;
  currentUserId: string|undefined;
}) => {
  const isLike = post.likes.some((like) => like.userId === currentUserId);

  const { addOptimisticComment, optimisticComment, setCommentState } =
    UseComment({ initialCommentCount: post._count.comments });

  const [state, setState] = useState({
    likeCount: post._count.likes,
    isLike: isLike,
    shareCount: post._count.sharedBy,
  });

  const [optimisticCount, addOptimisticCount] = useOptimistic(
    state,
    (prev, type: "like") => {
      if (type === "like") {
        return {
          ...prev,
          likeCount: prev.isLike ? prev.likeCount - 1 : prev.likeCount + 1,
          isLike: !prev.isLike,
        };
      }
      return prev;
    }
  );

  return {
    optimisticComment,
    optimisticCount,
    addOptimisticCount,
    addOptimisticComment,
    setCommentState,
    setState,
    state,
  };
};

export default UseGlobal;
