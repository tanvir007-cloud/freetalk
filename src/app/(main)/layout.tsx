import Navbar from "@/components/navbarElement/Navbar";
import React from "react";
import getCurrentUser from "../getActions/getCurrentUser";
import InternetPage from "@/components/InternetPage";
import SearchMountain from "@/components/navbarElement/SearchMountain";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  return (
    <div className="relative">
      <InternetPage />
      <SearchMountain currentUser={currentUser} />
      <div className="w-full md:px-8 sticky top-0 z-50 dark:border-b dark:border-zinc-800 dark:bg-zinc-900 bg-white shadow-sm md:h-14 h-[5.3rem]">
        <Navbar currentUser={currentUser} />
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};

export default MainLayout;
