import React, { Fragment, useState, useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Ellipsis, Loader2, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import deleteNotification from "@/app/actions/deleteNotification";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const DeleteNotification = ({
  notificationId,
  userId,
}: {
  notificationId: string;
  userId: string;
}) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const data = await deleteNotification(notificationId);

      if (data.success) {
        setOpen(false);
        queryClient.invalidateQueries({
          queryKey: ["allNotification", userId],
        });
      }

      if (data.error) {
        toast.error(data.error)
      }
    });
  };
  return (
    <Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger className="absolute right-6 bg-white border border-zinc-200 dark:border-zinc-950 dark:bg-zinc-800 rounded-full p-1 opacity-0 group-hover:opacity-100 transition cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 outline-hidden">
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div onClick={() => setOpen(true)}>
            <DropdownMenuItem>
              <Trash />
              Delete
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              notification and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={handleDelete} disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Fragment>
  );
};

export default DeleteNotification;
