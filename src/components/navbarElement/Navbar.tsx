import React from "react";
import DesktopNavbar from "./DesktopNavbar";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MenuIcon, Plus } from "lucide-react";
import Search from "./Search";
import NavbarItem from "./NavbarItem";
import Notification from "./Notification";
import Menu from "./Menu";
import { Karla } from "next/font/google";
import { User } from "@prisma/client";
import { SheetTrigger } from "../ui/sheet";

const karla = Karla({ subsets: ["latin"], weight: ["700"] });

const Navbar = async ({ currentUser }: { currentUser: User }) => {
  return (
    <div className="flex md:flex-row flex-col md:justify-between h-full md:gap-x-6">
      <div className="flex items-center justify-between px-4 md:hidden pt-1">
        <h1
          className={`${karla.className} text-3xl text-blue-600 dark:text-white`}
        >
          freetalk
        </h1>
        <div className="flex items-center gap-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="dark:bg-white bg-black rounded-full p-0.5">
              <Plus className="dark:text-zinc-900 text-white" size={20} />
            </DropdownMenuTrigger>
          </DropdownMenu>
          <Search className="p-1" />
        </div>
      </div>
      <div className="flex md:hidden justify-between gap-x-2 w-full">
        <NavbarItem type="MOBILE" />
        <Notification userId={currentUser.id} type="MOBILE" />
        <div className="flex items-center w-full cursor-pointer">
          <Menu currentUser={currentUser}>
            <SheetTrigger
              className="cursor-pointer py-2 rounded-lg transition w-full flex items-center justify-center text-blue-600 dark:text-zinc-300
              hover:text-blue-700 dark:hover:text-white"
            >
              <MenuIcon size={28} />
            </SheetTrigger>
          </Menu>
        </div>
      </div>
      <DesktopNavbar currentUser={currentUser} />
    </div>
  );
};

export default Navbar;
