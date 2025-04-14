import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import ProfileCard from "../../profile/components/ProfileCard";
import Link from "next/link";
import { GiPostStamp } from "react-icons/gi";
import {
  Activity,
  CalendarRange,
  ClipboardList,
  HandPlatter,
  Images,
  Newspaper,
  Settings,
  Store,
  Video,
} from "lucide-react";

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

const LeftMenu = () => {
  return (
    <div className="fixed top-14 h-full w-[25.5%] px-2">
      <ScrollArea className="flex flex-col mt-6 w-full h-[88%] rounded-md">
        <div className="flex flex-col gap-6">
          <ProfileCard />
          <div className="py-3 px-2 bg-white dark:bg-zinc-900 rounded-md shadow-md flex flex-col">
            {routes.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 dark:hover:bg-zinc-800 hover:bg-zinc-200 transition py-3 px-2 rounded-md"
                >
                  <Icon className="text-3xl" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default LeftMenu;
