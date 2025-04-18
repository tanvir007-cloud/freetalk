"use client";
import removeMyPost from "@/app/actions/removeMyPost";
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
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { Dispatch, SetStateAction, useTransition } from "react";
import toast from "react-hot-toast";

const RemovePost = ({
  postId,
  openRemove,
  setOpenRemove,
  isPostAuther,
  currentUserId,
}: {
  postId: string;
  openRemove: boolean;
  setOpenRemove: Dispatch<SetStateAction<boolean>>;
  isPostAuther: boolean;
  currentUserId: string | undefined;
}) => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    if (!currentUserId) return;
    startTransition(async () => {
      const data = await removeMyPost(isPostAuther, postId);

      if (data.error) toast.error(data.error);

      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["posts", currentUserId] });
        toast.success(data.success);
        setOpenRemove(false);
      }
    });
  };
  return (
    <AlertDialog open={openRemove} onOpenChange={setOpenRemove}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your post
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button disabled={isPending} onClick={handleRemove}>
            {isPending && <Loader2 className="animate-spin" />}
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RemovePost;
