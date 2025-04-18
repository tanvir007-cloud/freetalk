import React from "react";
import AllFriendRequest from "./components/AllFriendRequest";
import getCurrentUser from "@/app/getActions/getCurrentUser";
import { redirect } from "next/navigation";

const FriendPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return redirect("/login");

  return (
    <div className="flex w-full justify-center px-4 py-4">
      <div className="w-full max-w-[44.9rem] flex flex-col gap-5 md:gap-7">
        <AllFriendRequest currentUser={currentUser} />
      </div>
    </div>
  );
};

export default FriendPage;
