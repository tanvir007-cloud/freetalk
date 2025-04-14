"use client";
import React, { Fragment, useEffect, useState } from "react";
import TooltipAction from "../TooltipAction";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import NotificationDropdown from "./NotificationDropdown";
import { Notification as NotificationType, User } from "@prisma/client";
import { socket } from "@/socket";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { newNotificationCount } from "@/app/actions/MarkRead";

export type notificationType = (NotificationType & { sender: User })[];

const Notification = ({
  type,
  userId,
}: {
  type?: "MOBILE";
  userId: string;
}) => {
  const [allNotification, setAllNotification] = useState<notificationType>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleNotificationCount = async () => {
      const data = await newNotificationCount();
      setUnreadCount(data.count || 0);
    };
    handleNotificationCount();
  }, []);

  useEffect(() => {
    socket.emit("join", userId);
    const eventName = `receiveNotification:${userId}`;
    socket.on(eventName, (newNotification) => {
      setAllNotification((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.off(eventName);
    };
  }, [userId]);

  return (
    <Fragment>
      {type === "MOBILE" ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center w-full cursor-pointer outline-hidden">
            <div
              className={cn(
                "rounded-lg transition w-full flex items-center justify-center py-2 group"
              )}
            >
              <div className="relative">
                <Bell className="text-zinc-700 dark:text-zinc-300 group-hover:text-black dark:group-hover:text-white" />
                {unreadCount > 0 && (
                  <span className="absolute bg-rose-500 rounded-full text-xs px-[5px] -top-1.5 -right-1 text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="sm:w-[70vw] w-[90vw] h-[calc(100vh-6rem)]"
          >
            <NotificationDropdown
              userId={userId}
              allNotification={allNotification}
              setAllNotification={setAllNotification}
              unreadCount={unreadCount}
              setUnreadCount={setUnreadCount}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <DropdownMenu>
          <TooltipAction label="Notifications">
            <DropdownMenuTrigger className="flex items-center w-full cursor-pointer">
              <div
                className={cn(
                  "px-4 rounded-lg transition w-full flex items-center justify-center dark:hover:bg-zinc-800 hover:bg-zinc-200 py-3"
                )}
              >
                <div className="relative">
                  <Bell />
                  {unreadCount > 0 && (
                    <span className="absolute bg-rose-500 rounded-full text-xs px-[5px] -top-1.5 -right-1 text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuTrigger>
          </TooltipAction>
          <DropdownMenuContent
            align="end"
            className="md:h-[calc(100vh-4rem)] md:w-96"
          >
            <NotificationDropdown
              userId={userId}
              allNotification={allNotification}
              setAllNotification={setAllNotification}
              unreadCount={unreadCount}
              setUnreadCount={setUnreadCount}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </Fragment>
  );
};

export default Notification;
