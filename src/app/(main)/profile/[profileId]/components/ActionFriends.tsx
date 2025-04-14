"use client";
import {
  addFriend,
  cancelRequest,
  confirmFriendRequest,
  unFriend,
} from "@/app/actions/friendAction";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, UserCheck, UserMinus, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { Fragment, useState, useTransition } from "react";
import toast from "react-hot-toast";

const ActionFriends = ({
  status,
  currentUserId,
  profileUserId,
  profileUserName,
  type,
}: {
  status: "Friends" | "Cancel request" | "Confirm" | "Add friend" | undefined;
  profileUserId: string;
  currentUserId: string;
  profileUserName: string;
  type?: "FRIENDS";
}) => {
  const [openAlert, setOpenAlert] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleSubmit = (
    status: "Friends" | "Cancel request" | "Confirm" | "Add friend" | undefined
  ) => {
    startTransition(async () => {
      if (status === "Add friend") {
        const data = await addFriend(currentUserId, profileUserId);

        if (data.error) toast.error(data.error)

        if (data.success) {
          toast.success(data.success)
          router.refresh();
        }
      }

      if (status === "Cancel request") {
        const data = await cancelRequest(currentUserId, profileUserId);

        if (data.error) toast.error(data.error)

        if (data.success) {
          toast.success(data.success)
          router.refresh();
        }
      }

      if (status === "Confirm") {
        const data = await confirmFriendRequest(currentUserId, profileUserId);

        if (data.error) toast.error(data.error)

        if (data.success) {
          toast.success(data.success)
          router.refresh();
        }
      }

      if (status === "Friends") {
        const data = await unFriend(currentUserId, profileUserId);

        if (data.error) toast.error(data.error)

        if (data.success) {
          toast.success(data.success)
          router.refresh();
          setOpenAlert(false);
        }
      }
    });
  };
  return (
    <Fragment>
      <Button
        disabled={isPending}
        className={`${type === "FRIENDS" ? "" : "w-full sm:w-auto"}`}
        variant={"outline"}
        onClick={() =>
          status === "Friends" ? setOpenAlert(true) : handleSubmit(status)
        }
      >
        {status === "Add friend" ? (
          <UserPlus />
        ) : status === "Cancel request" ? (
          <UserMinus />
        ) : (
          <UserCheck />
        )}
        {status}
      </Button>

      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure to unfriend {profileUserName}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently unfriend your
              friend and remove your friend data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <Button disabled={isPending} onClick={() => handleSubmit(status)}>
              {isPending && <Loader2 className="animate-spin" />}
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Fragment>
  );
};

export default ActionFriends;
