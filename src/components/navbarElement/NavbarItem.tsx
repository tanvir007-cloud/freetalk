"use client";
import { cn } from "@/lib/utils";
import { Home, Store, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Fragment } from "react";
import TooltipAction from "../TooltipAction";
import { FaUsersRectangle } from "react-icons/fa6";

const routes = [
  {
    href: "/",
    title: "Home",
    icon: Home,
  },
  {
    href: "/friends",
    title: "Friends",
    icon: Users,
  },
  {
    href: "#",
    title: "MarketPlace",
    icon: Store,
  },
  {
    href: "#",
    title: "Group",
    icon: FaUsersRectangle,
  },
];

const NavbarItem = ({ type }: { type?: "MOBILE" }) => {
  const pathname = usePathname();
  return (
    <Fragment>
      {routes.map((item, index) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Fragment key={index}>
            {type === "MOBILE" ? (
              <Link
                href={item.href}
                className={`flex items-center transition-all relative w-full`}
              >
                <div
                  className={cn(
                    "rounded-lg transition w-full flex items-center justify-center py-2 text-zinc-700 dark:text-zinc-300",
                    !isActive && "hover:text-black dark:hover:text-white"
                  )}
                >
                  <Icon
                    className={cn(
                      isActive && " stroke-blue-600",
                      Icon === FaUsersRectangle && "size-6"
                    )}
                  />
                </div>
                <div
                  className={cn(
                    "border absolute w-full bottom-0 border-blue-500 transition-all opacity-0",
                    isActive && "opacity-100"
                  )}
                />
              </Link>
            ) : (
              <TooltipAction label={item.title}>
                <Link
                  href={item.href}
                  className={`flex items-center transition-all relative w-full`}
                >
                  <div
                    className={cn(
                      "px-4 py-3 rounded-lg transition w-full flex items-center justify-center",
                      !isActive && "dark:hover:bg-zinc-800 hover:bg-zinc-200"
                    )}
                  >
                    <Icon
                      className={cn(
                        isActive && " stroke-blue-600",
                        Icon === FaUsersRectangle && "size-6"
                      )}
                    />
                  </div>
                  <div
                    className={cn(
                      "border absolute w-full bottom-0 border-blue-500 transition-all opacity-0",
                      isActive && "opacity-100"
                    )}
                  />
                </Link>
              </TooltipAction>
            )}
          </Fragment>
        );
      })}
    </Fragment>
  );
};

export default NavbarItem;
