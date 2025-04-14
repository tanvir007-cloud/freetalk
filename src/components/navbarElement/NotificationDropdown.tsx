import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import Avatar from "../Avatar";
import { User, Notification as NotificationType } from "@prisma/client";
import { formateCommentDate } from "@/lib/helper";
import { MarkRead } from "@/app/actions/MarkRead";
import Link from "next/link";
import DeleteNotification from "./DeleteNotification";
import { usePostQuery } from "@/hooks/use-post-query";
import { notificationType } from "./Notification";
import { Skeleton } from "../ui/skeleton";
import useObserver from "@/hooks/use-observer";

const NotificationDropdown = ({
  unreadCount,
  setUnreadCount,
  allNotification,
  setAllNotification,
  userId,
}: {
  allNotification: (NotificationType & { sender: User })[];
  unreadCount: number;
  setUnreadCount: Dispatch<SetStateAction<number>>;
  setAllNotification: Dispatch<SetStateAction<notificationType>>;
  userId: string;
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    usePostQuery({
      apiUrl: "/api/allNotification",
      queryKey: ["allNotification", userId],
    });

  useEffect(() => {
    setAllNotification(data?.pages?.flatMap((page) => page.notification) || []);
  }, [data, setAllNotification]);

  const handleOpenNotification = useCallback(async () => {
    setUnreadCount(0);
    await MarkRead();
  }, [setUnreadCount]);

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

  useEffect(() => {
    if (unreadCount > 0) {
      handleOpenNotification();
    }
  }, [unreadCount, handleOpenNotification]);
  return (
    <div className="flex flex-col gap-y-2 pt-2">
      <h1 className="text-2xl font-bold px-2">Notifications</h1>
      <ScrollArea className="h-[calc(100vh-9.7rem)] md:h-[calc(100vh-7.7rem)] overflow-y-auto scrollbar-track-transparent scrollbar dark:scrollbar-thumb-zinc-800 scrollbar-thumb-zinc-200">
        <div className="flex flex-col mb-1">
          {status === "pending" ? (
            <div className="flex flex-col">
              {Array.from({ length: 3 }, (_, i) => (
                <div className="flex items-center gap-x-2 px-2 py-1" key={i}>
                  <Skeleton className="min-h-14 min-w-14 rounded-full" />
                  <Skeleton className="h-5 w-full rounded-full" />
                </div>
              ))}
            </div>
          ) : !hasNextPage && allNotification.length === 0 ? (
            <div className="flex items-center justify-center h-[calc(100vh-13.7rem)] md:h-[calc(100vh-11.7rem)]">
              <h1 className="text-2xl font-bold text-rose-600 dark:text-rose-500">
                No notification here 😐😐
              </h1>
            </div>
          ) : (
            allNotification.map((notification, index) => {
              const isLastItem = index === allNotification.length - 1;
              return (
                <div
                  ref={isLastItem ? attachObserver : null}
                  className="relative flex items-center group transition-all"
                  key={notification.id}
                >
                  <Link href={notification.link} className="w-full">
                    <DropdownMenuItem>
                      <Avatar
                        src={notification.sender.image || ""}
                        className="size-14"
                      />
                      <div className="flex flex-col gap-y-1">
                        <h1>{`${notification.sender.name} ${notification.message}`}</h1>
                        <h1 className="font-medium text-blue-600 dark:text-blue-500">
                          {formateCommentDate(notification.createdAt)}
                        </h1>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                  <DeleteNotification
                    notificationId={notification.id}
                    userId={userId}
                  />
                </div>
              );
            })
          )}
          {isFetchingNextPage &&
            hasNextPage &&
            Array.from({ length: 3 }, (_, i) => (
              <div className="flex items-center gap-x-2 px-2 py-1" key={i}>
                <Skeleton className="min-h-14 min-w-14 rounded-full" />
                <div className="flex flex-col w-full gap-y-2">
                  <Skeleton className="h-3 rounded-full w-3/4" />
                  <Skeleton className="w-1/2 h-3" />
                </div>
              </div>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotificationDropdown;
