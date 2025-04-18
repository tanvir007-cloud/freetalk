import React, { Fragment } from "react";
import Search from "./Search";
import SearchBox from "./SearchBox";
import NavbarItem from "./NavbarItem";
import UserAccountNav from "./UserAccountNav";
import { User } from "@prisma/client";
import Logo from "../Logo";
import { cn } from "@/lib/utils";

const DesktopNavbar = ({ currentUser }: { currentUser: User }) => {
  return (
    <Fragment>
      <div className={cn("md:flex hidden items-center gap-x-4")}>
        <Logo/>
        <div className="lg:hidden block">
          <Search />
        </div>
        <div className="lg:flex items-center relative hidden">
          <SearchBox />
        </div>
      </div>
      <div className="w-full md:block hidden">
        <div className="flex w-full h-full justify-center max-w-xl">
          <div className="flex justify-between w-full max-w-md gap-x-2 ">
            <NavbarItem />
          </div>
        </div>
      </div>
      <UserAccountNav currentUser={currentUser} />
    </Fragment>
  );
};

export default DesktopNavbar;
