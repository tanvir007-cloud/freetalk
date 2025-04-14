import Navbar from "@/components/navbarElement/Navbar";
import SearchInput from "@/components/navbarElement/SearchInput";
import React from "react";
import getCurrentUser from "../getActions/getCurrentUser";
import { redirect } from "next/navigation";
import InternetPage from "@/components/InternetPage";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return redirect("/login");
  return (
    <div className="relative">
      <InternetPage />
      <SearchInput userId={currentUser.id} />
      <div className="w-full md:px-8 sticky top-0 z-50 dark:border-b dark:border-zinc-800 dark:bg-zinc-900 bg-white shadow-sm md:h-14 h-[5.3rem]">
        <Navbar currentUser={currentUser} />
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};

export default MainLayout;
