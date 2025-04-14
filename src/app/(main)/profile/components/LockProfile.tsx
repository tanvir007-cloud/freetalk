"use client";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LockProfileType, User } from "@prisma/client";
import { Ellipsis, LockKeyhole, LockKeyholeOpen, Users } from "lucide-react";
import { FaUsersRectangle } from "react-icons/fa6";
import React from "react";
import lockProfile from "@/app/actions/lockProfile";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const LockProfile = ({
  profileUser,
  isCurrentUserProfile,
}: {
  profileUser: User;
  isCurrentUserProfile: boolean;
}) => {
  const router = useRouter();
  const handleLock = async (type: LockProfileType) => {
    const data = await lockProfile(type, isCurrentUserProfile, profileUser.id);
    if (data.success) {
      toast.success(data.success)
      router.refresh();
    }
    if (data.error) {
      toast.error(data.error)
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={buttonVariants({
          variant: "outline",
          size: "sm",
          className: "px-4 focus-visible:ring-0 focus-visible:ring-offset-0",
        })}
      >
        <Ellipsis className="text-zinc-700 dark:text-zinc-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <LockKeyhole />
            Lock Profile
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                disabled={profileUser.lockProfile === "ALL"}
                onSelect={() => handleLock("ALL")}
              >
                <FaUsersRectangle />
                All
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={profileUser.lockProfile === "FRIENDS"}
                onSelect={() => handleLock("FRIENDS")}
              >
                <Users />
                Friends
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={profileUser.lockProfile === "NONE"}
                onSelect={() => handleLock("NONE")}
              >
                <LockKeyholeOpen />
                None
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LockProfile;
