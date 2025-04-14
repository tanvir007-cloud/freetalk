"use client";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@prisma/client";
import { Pencil } from "lucide-react";
import React from "react";
import EditProfilePhotoElement from "./EditProfilePhotoElement";
import EditIntro from "./EditIntro";

const EditProfile = ({
  profileUser,
  isCurrentUserProfile,
}: {
  profileUser: User;
  isCurrentUserProfile: boolean;
}) => {
  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({
          variant: "outline",
          className: "w-full sm:w-auto",
        })}
      >
        <Pencil />
        Edit profile
      </DialogTrigger>
      <DialogContent className="p-0 pt-6 max-w-xl max-h-[90vh] gap-1">
        <DialogTitle className="text-center pb-4 border-b border-zinc-200 dark:border-zinc-800">
          Edit profile
        </DialogTitle>
        <ScrollArea className="h-[70vh] px-4">
          <div className="flex flex-col gap-4 pt-3 pb-6">
            <EditProfilePhotoElement
              profileUser={profileUser}
              isCurrentUserProfile={isCurrentUserProfile}
            />

            <EditIntro profileUser={profileUser} isCurrentUserProfile={isCurrentUserProfile}/>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
