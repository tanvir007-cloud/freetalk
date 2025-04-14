import { useOptimistic, useState } from "react";

const UseComment = ({
  initialCommentCount,
}: {
  initialCommentCount: number;
}) => {
  const [commentState, setCommentState] = useState({
    commentCount: initialCommentCount,
    comments: [] as any[],
  });
  const [optimisticComment, addOptimisticComment] = useOptimistic(commentState);

  return { setCommentState, optimisticComment, addOptimisticComment };
};

export default UseComment;
