"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import { User } from "@prisma/client";
import Notification from "@/components/navbarElement/Notification";
import Menu from "@/components/navbarElement/Menu";
import TooltipAction from "@/components/TooltipAction";
import { SheetTrigger } from "@/components/ui/sheet";
import {
  BookDashed,
  Contrast,
  LogOutIcon,
  MenuIcon,
  SquareUserRound,
} from "lucide-react";
import DesktopModeToggle from "@/components/navbarElement/DesktopModeToggle";
import Logout from "@/components/Logout";

const UserAccountNav = ({ currentUser }: { currentUser: User }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="items-center gap-x-2 hidden md:flex">
      <Notification userId={currentUser.id} />
      <div className="lg:flex items-center hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full">
            <Avatar src={currentUser.image || ""} className="size-10" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{currentUser.name}</p>
                <p className="w-[200px] truncate text-sm text-gray-700 dark:text-slate-300">
                  {currentUser.email}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/profile/${currentUser.id}`}>
                <SquareUserRound />
                Your profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={"/"}>
                <BookDashed />
                Feed
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <Contrast />
                Display
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DesktopModeToggle />
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <div onClick={() => setOpen(true)}>
              <DropdownMenuItem className="p-0 w-full flex items-center gap-x-2 px-2 py-1.5">
                <LogOutIcon />
                Log out
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Logout open={open} setOpen={setOpen} />
      <TooltipAction label="Menu">
        <div className="lg:hidden flex items-center">
          <Menu currentUser={currentUser}>
            <SheetTrigger className="cursor-pointer px-4 py-2.5 rounded-lg transition w-full flex items-center justify-center dark:hover:bg-zinc-800 hover:bg-zinc-200">
              <MenuIcon className="text-blue-600 dark:text-white" size={28} />
            </SheetTrigger>
          </Menu>
        </div>
      </TooltipAction>
    </div>
  );
};

export default UserAccountNav;
