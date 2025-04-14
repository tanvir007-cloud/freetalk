"use client";
import { createPost } from "@/app/actions/createPost";
import Avatar from "@/components/Avatar";
import EmojiPicker from "@/components/EmojiPicker";
import Loader from "@/components/Loader";
import StyleTextArea from "@/components/StyleTextArea";
import TooltipAction from "@/components/TooltipAction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import UploadImage from "@/components/UploadImage";
import { cn } from "@/lib/utils";
import { postSchema as formSchema } from "@/lib/zodValidation";
import { socket } from "@/socket";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import {
  CalendarRange,
  ChartColumnDecreasingIcon,
  ImageIcon,
  ImagePlusIcon,
  Loader2,
  Video,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const AddPostElement = ({
  currentUser,
  setOpen: setIsOpen,
  open: isOpen,
  queryKey,
}: {
  currentUser: User;
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  queryKey: string[];
}) => {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [tamporaryImage, setTamporaryImage] = useState<File | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      desc: "",
      image: "",
    },
  });

  const loading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = await createPost(values);

    if (data.success) {
      socket.emit("newPost", data.newPost);
      form.reset();
      toast.success(data.success);
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: queryKey });
    }

    if (data.error) {
      toast.error(data.error);
    }
  };

  const scrollableDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && scrollableDivRef.current) {
      scrollableDivRef.current.scrollTo({
        top: scrollableDivRef.current.scrollHeight,
        behavior: "instant",
      });
    }
  }, [open]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.value = form.getValues("desc");
  }, [isOpen,form]);

  return (
    <div className="flex items-center gap-4">
      <Link href={`/profile/${currentUser.id}`}>
        <Avatar src={currentUser.image || ""} className="size-11" />
      </Link>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogTrigger className="w-full">
          <input
            ref={inputRef}
            type="text"
            className="w-full outline-hidden bg-zinc-100 dark:bg-zinc-800 py-2 rounded-full px-3 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
            placeholder={`What's your mind, ${
              currentUser.name.split(" ")[0]
            } ?`}
            readOnly
          />
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className="text-center">Create Post</DialogTitle>
          <Separator />
          <div className="flex flex-col pl-4 pr-1 mt-4 gap-3">
            <div className="flex items-center gap-2">
              <Avatar src={currentUser?.image || ""} className="size-12" />
              <h1>{currentUser?.name}</h1>
            </div>
            {/* main part start */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div
                  ref={scrollableDivRef}
                  className={`max-h-[250px] md:max-h-[18rem] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800 overflow-x-hidden`}
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
                              open={open}
                              placeholder={`What's on your mind, ${
                                currentUser?.name.split(" ")[0]
                              }`}
                              className={`${
                                !open
                                  ? "placeholder:text-2xl min-h-24"
                                  : "placeholder:text-base min-h-14"
                              } ${
                                !open
                                  ? field.value.length > 115
                                    ? "text-base"
                                    : "text-2xl"
                                  : "text-base"
                              }`}
                            />
                            <EmojiPicker
                              onChange={(emoji: string) =>
                                field.onChange(`${field.value} ${emoji}`)
                              }
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {open && (
                    <div className="pr-3">
                      <div className="border dark:border-zinc-800 border-zinc-200 flex items-center justify-center w-full h-44 md:h-48 rounded-sm p-2 transition-all relative">
                        <FormField
                          control={form.control}
                          name="image"
                          render={({ field }) => (
                            <FormItem className="w-full h-full">
                              <FormControl>
                                {field.value || tamporaryImage ? (
                                  <div className="relative size-full">
                                    {field.value ? (
                                      <Image
                                        src={field.value}
                                        alt="post"
                                        className="object-cover rounded-sm"
                                        sizes="1"
                                        fill
                                      />
                                    ) : (
                                      <>
                                        {tamporaryImage && (
                                          <Image
                                            src={URL.createObjectURL(
                                              tamporaryImage
                                            )}
                                            alt="post"
                                            className="object-cover rounded-sm"
                                            sizes="1"
                                            fill
                                          />
                                        )}
                                      </>
                                    )}
                                    {tamporaryImage && (
                                      <div className="w-full absolute h-full dark:bg-zinc-950/60 bg-zinc-50/40 z-10 flex items-center justify-center cursor-not-allowed">
                                        <Loader className="size-3 dark:bg-zinc-50/70 bg-zinc-950/80" />
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <label
                                    className={cn(
                                      " dark:bg-zinc-900 bg-zinc-100 h-full w-full rounded-sm flex items-center justify-center group transition cursor-pointer dark:hover:bg-zinc-800 hover:bg-zinc-200"
                                    )}
                                  >
                                    <div className="flex flex-col items-center justify-center gap-1">
                                      <div className="dark:bg-zinc-700 bg-zinc-300 p-[6px] rounded-full">
                                        <ImagePlusIcon size={24} />
                                      </div>
                                      <div className="flex flex-col items-center justify-center">
                                        <h1 className="text-lg font-semibold dark:text-zinc-400 text text-zinc-700">
                                          Add Photos
                                        </h1>
                                        <p className="text-xs text-red-600 -mt-1">
                                          Maximum file size 16mb.
                                        </p>
                                      </div>
                                    </div>
                                    <UploadImage
                                      id="image"
                                      onChange={field.onChange}
                                      setTamporaryImage={setTamporaryImage}
                                      tamporaryImage={tamporaryImage}
                                      endPoint="postImageUploader"
                                    />
                                  </label>
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {!tamporaryImage && (
                          <div
                            className="absolute top-4 right-4 cursor-pointer dark:bg-zinc-950 bg-white border-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full p-1 border dark:border-zinc-800 transition"
                            onClick={() => {
                              setOpen(false);
                              form.setValue("image", "");
                            }}
                          >
                            <X className="text-zinc-800 dark:text-zinc-300" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="pr-3">
                  <div className="flex items-center justify-between border dark:border-zinc-800 border-zinc-200 py-4 rounded-lg px-5 mt-2">
                    <h1 className="font-medium">Add to your post</h1>
                    <div className="flex items-center gap-3">
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          setOpen(true);
                        }}
                      >
                        <TooltipAction label="Image">
                          <ImageIcon className="text-3xl text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-600 transition" />
                        </TooltipAction>
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          setOpen(true);
                        }}
                      >
                        <TooltipAction label="Video">
                          <Video className="text-3xl text-rose-600 hover:text-rose-700 dark:text-rose-500 dark:hover:text-rose-600 transition" />
                        </TooltipAction>
                      </div>
                      <div className="cursor-pointer">
                        <TooltipAction label="Poll">
                          <ChartColumnDecreasingIcon className="text-3xl text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-600 transition" />
                        </TooltipAction>
                      </div>
                      <div className="cursor-pointer">
                        <TooltipAction label="Event">
                          <CalendarRange className="text-3xl text-purple-600 hover:text-purple-700 dark:text-purple-500 dark:hover:text-purple-600 transition" />
                        </TooltipAction>
                      </div>
                    </div>
                  </div>
                  <Button
                    disabled={
                      loading ||
                      (tamporaryImage && true) ||
                      (!form.watch("desc") && !form.watch("image"))
                    }
                    className="w-full mt-4 flex items-center"
                    type="submit"
                  >
                    {loading && <Loader2 className="animate-spin" />}
                    Post
                  </Button>
                </div>
              </form>
            </Form>
            {/* main part end */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddPostElement;
