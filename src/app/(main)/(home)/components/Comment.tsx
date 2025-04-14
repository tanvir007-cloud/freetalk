"use client";
import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  startTransition,
  useEffect,
  useRef,
} from "react";
import CommentItem from "./CommentItem";
import { User } from "@prisma/client";
import { usePostQuery } from "@/hooks/use-post-query";
import { FaCaretDown } from "react-icons/fa";
import SharePostDialog from "@/components/SharePostDialog";
import { Loader2, MessageCircle, WifiOff } from "lucide-react";
import IsYouLike from "./IsYouLike";
import PostMainPart from "./PostMainPart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CommentType, PostType } from "@/lib/zodValidation";
import CommentBox from "./CommentBox";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema as formSchema } from "@/lib/zodValidation";
import { createComment } from "@/app/actions/createComment";
import { cn } from "@/lib/utils";
import UseOnline from "@/hooks/use-online";
import { dummyComment, scrolling } from "@/lib/helper";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "@/socket";
import toast from "react-hot-toast";
import useObserver from "@/hooks/use-observer";

interface CommentProps {
  currentUser: User;
  queryKey: string[];
  apiUrl: string;
  paramKey: string;
  post: PostType;
  open?: boolean;
  children: React.ReactNode;
  pendingChildren: React.ReactNode;
  isLike: boolean;
  addOptimisticCount: (action: "like") => void;
  setState: Dispatch<
    SetStateAction<{
      likeCount: number;
      isLike: boolean;
      shareCount: number;
    }>
  >;
  setCommentState: Dispatch<
    SetStateAction<{
      commentCount: number;
      comments: CommentType[];
    }>
  >;
  likeCount: number;
  shareCount: number;
  addOptimisticComment: (
    action: (pendingState: {
      commentCount: number;
      comments: CommentType[];
    }) => { commentCount: number; comments: CommentType[] }
  ) => void;
  optimisticComment: { commentCount: number; comments: CommentType[] };
}

const Comment = ({
  currentUser,
  apiUrl,
  paramKey,
  queryKey,
  post,
  open,
  children,
  pendingChildren,
  addOptimisticCount,
  isLike,
  setState,
  likeCount,
  shareCount,
  addOptimisticComment,
  optimisticComment,
  setCommentState,
}: CommentProps) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const firstCommentRef = useRef<HTMLDivElement | null>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    status,
    isFetchingNextPage,
    refetch,
  } = usePostQuery({
    apiUrl,
    queryKey: ["comments", post.id],
    paramKey,
    paramValue: post.id,
  });

  const { isOnline } = UseOnline(refetch);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { newComment } = dummyComment({
      comment: values.comment,
      currentUser,
    });

    startTransition(() => {
      addOptimisticComment((prev) => ({
        ...prev,
        commentCount: prev.commentCount + 1,
        comments: [newComment, ...prev.comments],
      }));
      scrolling(firstCommentRef);
    });

    const data = await createComment(values, post.id, post.userId);

    if (data.success) {
      setCommentState((prev) => ({
        ...prev,
        commentCount: prev.commentCount + 1,
        comments: [data.comment, ...prev.comments],
      }));
      if (data.notification) {
        socket.emit("sendNotification", data.notification);
      }
      queryClient.invalidateQueries({ queryKey: ["comments", post.id] });
    }

    if (data.error) {
      setCommentState((prev) => ({
        ...prev,
        commentCount: prev.commentCount - 1,
        comments: prev.comments,
      }));
      toast.error(data.error);
    }

    form.reset();
  };

  useEffect(() => {
    setCommentState((prev) => ({
      ...prev,
      comments: data?.pages?.flatMap((page) => page.comments) || [],
    }));
  }, [data, setCommentState]);

  useEffect(() => {
    if (
      open &&
      optimisticComment.comments.length > 0 &&
      firstCommentRef.current
    ) {
      setTimeout(() => {
        firstCommentRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 200);
    }
  }, [open, optimisticComment.comments.length]);

  useObserver({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    observerRef,
  });

  const attachObserver = (element: HTMLElement | null) => {
    if (observerRef.current && element) {
      observerRef.current.observe(element);
    }
  };

  if (status === "pending") {
    return pendingChildren;
  }

  return (
    <Fragment>
      {children}
      {!isOnline && (
        <div className="flex items-center justify-center bg-red-500 text-white py-3 text-sm font-medium absolute w-full rounded-t-lg">
          <WifiOff className="mr-2" />
          No Internet Connection
        </div>
      )}
      <ScrollArea className="sm:max-h-[65.6vh] max-h-[75.8vh] border-t dark:border-zinc-800 border-zinc-200 overflow-y-auto scrollbar-track-transparent scrollbar-thin dark:scrollbar-thumb-zinc-800 scrollbar-thumb-zinc-300">
        <div className="flex flex-col gap-1">
          <PostMainPart
            commentCount={optimisticComment.commentCount}
            currentUser={currentUser}
            post={post}
            isYouLike={isLike}
            likeCount={likeCount}
            shareCount={shareCount}
          />
          <div>
            <div className="flex items-center justify-evenly mb-1 gap-2">
              <IsYouLike
                postUserId={post.userId}
                queryKey={queryKey}
                postId={post.id}
                addOptimisticCount={addOptimisticCount}
                isLike={isLike}
                setState={setState}
              />
              <button className="flex items-center gap-2 text-sm dark:text-zinc-400 text-zinc-600 dark:hover:bg-zinc-800 hover:bg-zinc-200 px-4 py-1 rounded-sm transition">
                <MessageCircle />
                <span>Comment</span>
              </button>
              <SharePostDialog
                postUserId={post.userId}
                setState={setState}
                currentUser={currentUser}
                postId={post.sharePost?.id || post.id}
                mainPostId={post.id}
              />
            </div>
            <div className="px-4 mb-1">
              <Separator />
            </div>
          </div>

          {!hasNextPage && optimisticComment.comments.length === 0 ? (
            <div className="flex items-center justify-center py-5 flex-col">
              <h1 className="text-xl font-bold text-zinc-500">
                No comments yet 😐😐
              </h1>
            </div>
          ) : (
            <div className="flex flex-col gap-3 px-4">
              <span className="text-zinc-700 font-medium dark:text-zinc-400 cursor-pointer flex items-center gap-0.5">
                Most relevant
                <FaCaretDown />
              </span>
              <div className="flex flex-col gap-1 mb-1">
                {optimisticComment.comments.map(
                  (comment: CommentType, index: number) => {
                    const isLastItem =
                      index === optimisticComment.comments.length - 1;
                    return (
                      <div
                        ref={(el) => {
                          if (el) {
                            if (isLastItem) attachObserver(el);
                            if (index === 0) firstCommentRef.current = el;
                          }
                        }}
                        className={cn(
                          "flex flex-col",
                          comment.id.startsWith("temp-") &&
                            "bg-zinc-300/50 dark:bg-zinc-700/30 animate-pulse"
                        )}
                        key={comment.id}
                      >
                        <CommentItem
                          previousQueryKey={queryKey}
                          addOptimisticComment={addOptimisticComment}
                          setCommentState={setCommentState}
                          queryKey={["comments", post.id]}
                          postId={post.id}
                          comment={comment}
                          currentUser={currentUser}
                          postUserId={post.userId}
                        />
                      </div>
                    );
                  }
                )}
                {(isFetchingNextPage || (!isOnline && hasNextPage)) && (
                  <div className="w-full flex items-center justify-center pb-2">
                    <Loader2 className="text-blue-600 animate-spin" size={30} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="w-full dark:bg-zinc-950 bg-white px-4 py-2 sm:rounded-b-lg border-t dark:border-zinc-800 border-zinc-200">
        <CommentBox
          currentUser={currentUser}
          form={form}
          placeholder="Write a comment..."
          onSubmit={onSubmit}
        />
      </div>
    </Fragment>
  );
};

export default Comment;
