"use client";
import React, { useState } from "react";
import {
  Activity,
  CalendarRange,
  ClipboardList,
  HandPlatter,
  Images,
  LogOutIcon,
  Newspaper,
  Plus,
  Settings,
  Store,
  Video,
} from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import Avatar from "../Avatar";
import { GiPostStamp } from "react-icons/gi";
import { ScrollArea } from "../ui/scroll-area";
import MobileModeToggle from "./MobileModeToggle";
import Logout from "../Logout";
import { User } from "@prisma/client";

const routes = [
  {
    title: "My Posts",
    icon: GiPostStamp,
    href: "/",
  },
  {
    title: "Activity",
    icon: Activity,
    href: "/",
  },
  {
    title: "MarketPlace",
    icon: Store,
    href: "/",
  },
  {
    title: "Events",
    icon: CalendarRange,
    href: "/",
  },
  {
    title: "Albums",
    icon: Images,
    href: "/",
  },
  {
    title: "Videos",
    icon: Video,
    href: "/",
  },
  {
    title: "News",
    icon: Newspaper,
    href: "/",
  },
  {
    title: "Courses",
    icon: HandPlatter,
    href: "/",
  },
  {
    title: "Lists",
    icon: ClipboardList,
    href: "/",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/",
  },
];

const Menu = ({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: User;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet>
      {children}
      <SheetContent className="w-full py-3 px-0">
        <SheetTitle className="sr-only" />
        <h1 className="text-2xl font-bold pb-4 px-4">Menu</h1>
        <ScrollArea className="h-[calc(100vh-80px)] px-4">
          <div className="flex flex-col gap-2">
            <div className="rounded-md flex flex-col shadow-sm">
              <Link
                href={`/profile/${currentUser.id}`}
                className="flex items-center gap-2 outline-hidden bg-white dark:bg-zinc-900 px-3 h-16 transition dark:hover:bg-zinc-800/70 rounded-t-md border-b border-zinc-200 dark:border-zinc-800"
              >
                <Avatar src={currentUser.image || ""} className="size-10" />
                <h1 className="text-lg font-medium truncate">
                  {currentUser.name}
                </h1>
              </Link>
              <Link
                href={`#`}
                className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-3 h-16 transition dark:hover:bg-zinc-800/70 rounded-b-md outline-hidden"
              >
                <div className="bg-zinc-500 rounded-full p-px text-white dark:text-zinc-900">
                  <Plus />
                </div>
                <div className="flex flex-col">
                  <h1>Create another profile</h1>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Switch between profiles with one login
                  </p>
                </div>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {routes.map((route, index) => {
                const Icon = route.icon;
                return (
                  <Link
                    key={index}
                    href={route.href}
                    className="flex items-center gap-3 bg-white dark:bg-zinc-900 px-3 h-16 transition dark:hover:bg-zinc-800/70 rounded-md shadow-sm"
                  >
                    <Icon className="text-3xl" />
                    <h1>{route.title}</h1>
                  </Link>
                );
              })}
            </div>
            <div
              className="w-full flex items-center gap-3 bg-white dark:bg-zinc-900 px-3 h-16 transition dark:hover:bg-zinc-800/70 rounded-md shadow-sm cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <LogOutIcon />
              Log out
            </div>
            <Logout open={open} setOpen={setOpen} />
            <MobileModeToggle />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default Menu;
