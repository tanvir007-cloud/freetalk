import { deleteComment } from "@/app/actions/createComment";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ellipsis, Loader2, Pencil, Trash } from "lucide-react";
import React, { Dispatch, Fragment, SetStateAction, useState } from "react";
import toast from "react-hot-toast";

const EditAndDeleteMenu = ({
  setIsEdit,
  commentId,
  isCommentAuthor,
  setCommentState,
  previousQueryKey,
  queryKey,
}: {
  setIsEdit: Dispatch<SetStateAction<boolean>>;
  commentId: string;
  isCommentAuthor: boolean;
  setCommentState: Dispatch<
    SetStateAction<{
      commentCount: number;
      comments: any[];
    }>
  >;
  previousQueryKey: string[];
  queryKey: string[];
}) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { mutate: MutatedeleteComment, isPending } = useMutation({
    mutationFn: async ({
      commentId,
      isCommentAuthor,
    }: {
      commentId: string;
      isCommentAuthor: boolean;
    }) => {
      return await deleteComment(commentId, isCommentAuthor);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success)
        setCommentState((prev) => ({
          ...prev,
          commentCount: prev.commentCount - 1,
          comments: prev.comments.filter(
            (comment) => comment.id !== data.commentId
          ),
        }));
        setOpen(false);
      }
      if (data.error) {
        toast.error(data.error)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: previousQueryKey });
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return (
    <Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={commentId.startsWith("temp-")}
          className="dark:hover:bg-zinc-800 hover:bg-zinc-200 transition rounded-full p-1 dark:disabled:hover:bg-transparent disabled:hover:bg-transparent"
        >
          <Ellipsis size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <div onClick={() => setIsEdit(true)}>
            <DropdownMenuItem>
              <Pencil className="text-green-600 dark:text-green-500" />
              Edit
            </DropdownMenuItem>
          </div>
          <div onClick={() => setOpen(true)}>
            <DropdownMenuItem>
              <Trash className="text-red-600 dark:text-red-500" />
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
              This action cannot be undone. This will permanently delete your
              comment and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              type="button"
              onClick={() =>
                MutatedeleteComment({ commentId, isCommentAuthor })
              }
            >
              {isPending && <Loader2 className="animate-spin" />}
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Fragment>
  );
};

export default EditAndDeleteMenu;
