import getCurrentUser from "@/app/getActions/getCurrentUser";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbarElement/Navbar";
import { Fragment } from "react";
import Logo from "@/components/Logo";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import InternetPage from "@/components/InternetPage";
import SearchInput from "@/components/navbarElement/SearchInput";
import HomePageElement from "./components/HomePageElement";

const HomePage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return redirect("/");

  return (
    <div>
      <InternetPage />
      {currentUser && <SearchInput userId={currentUser.id} />}
      <div
        className={cn(
          "w-full md:px-8 sticky top-0 z-50 dark:border-b dark:border-zinc-800 dark:bg-zinc-900 bg-white shadow-sm",
          currentUser
            ? "md:h-14 h-[5.3rem]"
            : "flex items-center justify-between h-14 px-4"
        )}
      >
        {currentUser ? (
          <Navbar currentUser={currentUser} />
        ) : (
          <Fragment>
            <Logo />
            <Link href={"/login"} className={buttonVariants()}>
              Login
            </Link>
          </Fragment>
        )}
      </div>
      <HomePageElement currentUser={currentUser} />
    </div>
  );
};

export default HomePage;
