import { User } from "@prisma/client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { PiShareFat } from "react-icons/pi";
import { TiWorld } from "react-icons/ti";
import Avatar from "./Avatar";
import { Button } from "./ui/button";
import StyleTextArea from "./StyleTextArea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { shareSchema as formSchema } from "@/lib/zodValidation";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import EmojiPicker from "./EmojiPicker";
import createSharePost from "@/app/actions/createSharePost";
import { Separator } from "./ui/separator";
import ShareButtons from "./ShareButtons";
import { socket } from "@/socket";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useZustandStore } from "@/hooks/use-zustand-store";

const SharePostDialog = ({
  currentUser,
  postId,
  mainPostId,
  setState,
  postUserId,
}: {
  currentUser: User | null;
  postId: string;
  mainPostId: string;
  setState: Dispatch<
    SetStateAction<{
      likeCount: number;
      isLike: boolean;
      shareCount: number;
    }>
  >;
  postUserId: string;
}) => {
  const queryClient = useQueryClient();
  const [openShare, setOpenShare] = useState(false);
  const { setLoginOpen } = useZustandStore();
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      desc: "",
    },
  });

  const loading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentUser) return;
    const data = await createSharePost(values, postId, mainPostId, postUserId);

    if (data.success) {
      socket.emit("newPost", data.newSharePost);
      toast.success(data.success);
      if (data.notification) {
        socket.emit("sendNotification", data.notification);
      }
      setState((prev) => ({
        ...prev,
        shareCount: prev.shareCount + 1,
      }));
      queryClient.invalidateQueries({ queryKey: ["posts", currentUser.id] });
      setOpenShare(false);
    }

    if (data.error) {
      toast.error(data.error);
    }
  };

  return (
    <Dialog open={openShare} onOpenChange={setOpenShare}>
      <div
        className="flex items-center gap-2 text-sm dark:text-zinc-400 text-zinc-600 dark:hover:bg-zinc-800 hover:bg-zinc-200 px-4 py-1 rounded-sm transition cursor-pointer"
        onClick={() => (currentUser ? setOpenShare(true) : setLoginOpen(true))}
      >
        <PiShareFat className="text-2xl" />
        <span>Share</span>
      </div>
      {currentUser && (
        <DialogContent className="p-0 pt-6">
          <DialogTitle className="text-center border-b dark:border-zinc-800 border-zinc-200 pb-4">
            Share
          </DialogTitle>
          <div className="flex flex-col gap-4 px-6 pb-2">
            <div className="flex items-center gap-2">
              <Avatar src={currentUser.image || ""} className="size-10" />
              <div className="flex flex-col gap-1">
                <h1 className="capitalize">{currentUser.name}</h1>
                <div className="flex items-center gap-2">
                  <button className="text-sm dark:bg-zinc-700 bg-zinc-300 px-1 rounded-md cursor-pointer">
                    Feed
                  </button>
                  <button className="text-sm dark:bg-zinc-700 bg-zinc-300 px-1 rounded-md flex items-center gap-x-0.5 cursor-pointer">
                    <TiWorld className="text-lg" />
                    Public
                  </button>
                </div>
              </div>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-y-4"
              >
                <div
                  className={`max-h-40 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800 overflow-x-hidden`}
                >
                  <FormField
                    control={form.control}
                    name="desc"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-end mb-1 gap-1">
                            <StyleTextArea
                              value={field.value}
                              onChange={field.onChange}
                              open={openShare}
                              disabled={loading}
                              placeholder="Say something about this (optional)"
                              className="min-h-16"
                            />
                            <EmojiPicker
                              onChange={(emoji: string) =>
                                field.onChange(`${field.value} ${emoji}`)
                              }
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full flex items-center justify-end">
                  <Button
                    size={"sm"}
                    className="px-8"
                    disabled={loading}
                    type="submit"
                  >
                    Share now
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          <Separator />
          <div className="flex flex-col gap-4 px-6">
            <h1 className="text-xl font-semibold">Share to</h1>
            <ShareButtons
              postUrl={`${origin}/post/${postId}`}
              setOpen={setOpenShare}
            />
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default SharePostDialog;
