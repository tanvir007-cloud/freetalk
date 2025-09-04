import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  differenceInWeeks,
  differenceInYears,
  format,
  isThisYear,
  isToday,
  isYesterday,
} from "date-fns";
import { ReplyCommentType } from "./zodValidation";
import { User } from "@prisma/client";
import { RefObject } from "react";

export const formatNumber = (num: number) => {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }

  return num;
};

export const formatDate = (time: Date) => {
  const date = new Date(time);

  if (isThisYear(date)) {
    return format(date, "MMMM d");
  } else {
    return format(date, "MMMM d, yyyy");
  }
};

export const formatMainPageDate = (time: Date) => {
  const date = new Date(time);
  if (isToday(date)) {
    return `Today at ${format(date, "h:mm a")}`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, "h:mm a")}`;
  } else {
    return format(date, "MMM d, yyyy 'at' h:mm a");
  }
};

export const formatCommentDate = (date: Date) => {
  const now = new Date();

  const years = differenceInYears(now, date);
  if (years > 0) return `${years}y`;

  const weeks = differenceInWeeks(now, date);
  if (weeks > 0) return `${weeks}w`;

  const days = differenceInDays(now, date);
  if (days > 0) return `${days}d`;

  const hours = differenceInHours(now, date);
  if (hours > 0) return `${hours}h`;

  const minutes = differenceInMinutes(now, date);
  if (minutes > 0) return `${minutes}m`;

  const seconds = differenceInSeconds(now, date);
  if (seconds > 5) return `${seconds}s`;

  return `Just now`;
};

export const isValidObjectId = (id: string): boolean =>
  /^[a-f0-9]{24}$/.test(id.trim().toLowerCase());

export const dummyComment = ({
  comment,
  currentUser,
  commentUserName,
}: {
  currentUser: User;
  comment: string;
  commentUserName?: string;
}) => {
  const tempId = `temp-${Date.now()}`;
  const newComment: ReplyCommentType = {
    id: tempId,
    desc: comment,
    postId: null,
    replyToId: null,
    isEdited: false,
    parentReplyCommentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    _count: { likes: 0, replies: 0, parentReplies: 0 },
    likes: [],
    userId: currentUser.id,
    user: currentUser,
    replyTo: { user: { name: commentUserName ?? "" } },
    deleteComment: false,
  };

  return { newComment };
};

export const scrolling = (
  firstCommentRef: RefObject<HTMLDivElement | null>,
  block?: "end" | "center" | "nearest" | "start"
) => {
  return setTimeout(() => {
    if (firstCommentRef.current) {
      const rect = firstCommentRef.current.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

      if (!isVisible) {
        firstCommentRef.current.scrollIntoView({
          behavior: "smooth",
          block: block !== undefined ? block : "end",
        });
      }
    }
  }, 0);
};
