"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import {
  ArrowUpFromLine,
  Camera,
  ImageIcon,
  Loader2,
  LockKeyhole,
  Trash,
} from "lucide-react";
import Image from "next/image";
import React, { Fragment, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TiWorld } from "react-icons/ti";
import { Button } from "@/components/ui/button";
import UploadImage from "@/components/UploadImage";
import { Form, FormField, FormItem } from "@/components/ui/form";
import Loader from "@/components/Loader";
import { updateCoverPhoto } from "@/app/actions/updateProfile";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ChosePhoto from "./ChosePhoto";
import toast from "react-hot-toast";

const formSchema = z.object({
  cover: z
    .string({ required_error: "Cover photo required" })
    .min(1, "Cover photo required"),
});

const EditCoverPhoto = ({
  profileUser,
  isCurrentUserProfile,
  isLockProfile,
}: {
  profileUser: User;
  isCurrentUserProfile: boolean;
  isLockProfile: boolean;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [transition, setTransition] = useTransition();
  const [tamporaryImage, setTamporaryImage] = useState<File | null>(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cover: "",
    },
  });

  const loading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = await updateCoverPhoto({
      isCurrentUserProfile,
      userId: profileUser.id,
      values,
      type: "UPLOAD",
    });

    if (data.error) {
      toast.error(data.error);
    }

    if (data.success) {
      toast.success(data.success);
      router.refresh();
      form.reset();
    }
  };

  const handleRemove = () => {
    setTransition(async () => {
      const data = await updateCoverPhoto({
        isCurrentUserProfile,
        userId: profileUser.id,
        values: { cover: form.getValues("cover") },
        type: "REMOVE",
      });

      if (data.error) {
        toast.error(data.error);
      }

      if (data.success) {
        toast.success(data.success);
        router.refresh();
        form.reset();
      }

      setOpen(false);
    });
  };

  return (
    <div
      className={cn(
        "w-full flex justify-center relative dark:bg-zinc-900 bg-white"
      )}
    >
      {(profileUser.cover || form.getValues("cover") || tamporaryImage) && (
        <div className="absolute w-full inset-0 h-full">
          {tamporaryImage ? (
            <Image
              fill
              sizes="1"
              src={URL.createObjectURL(tamporaryImage)}
              alt=""
              className="object-cover"
            />
          ) : (
            (form.getValues("cover") || profileUser.cover) && (
              <Image
                fill
                sizes="1"
                src={form.getValues("cover")! || profileUser.cover!}
                alt=""
                className="object-cover"
              />
            )
          )}
          <div className="absolute inset-0 backdrop-blur-xl" />
          <div className="absolute inset-0 bg-linear-to-t from-white from-25% to-white/10 dark:from-[#131315] dark:from-15% dark:via-zinc-900/80 dark:to-zinc-900/35" />
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full md:h-80 sm:h-64 h-44 relative flex flex-col md:justify-center max-w-5xl"
        >
          {tamporaryImage ? (
            <Fragment>
              <Image
                src={URL.createObjectURL(tamporaryImage)}
                fill
                alt="profile cover"
                sizes="1"
                className="object-cover rounded-b-lg z-40"
              />
              <div className="w-full absolute h-full dark:bg-zinc-950/60 bg-zinc-50/40 z-40 flex items-center justify-center cursor-not-allowed">
                <Loader className="size-3 dark:bg-zinc-50/70 bg-zinc-950/80" />
              </div>
            </Fragment>
          ) : (
            <Fragment>
              {form.getValues("cover") || profileUser.cover ? (
                <Fragment>
                  <Image
                    priority
                    src={form.getValues("cover")! || profileUser.cover!}
                    fill
                    alt="profile cover"
                    sizes="1"
                    className={cn(
                      "object-cover rounded-b-lg",
                      form.getValues("cover") && "z-40"
                    )}
                  />
                  {profileUser.cover && (
                    <Dialog>
                      <DialogTrigger className="w-full h-full z-10">
                        <div className="w-full h-full rounded-b-md  cursor-pointer" />
                      </DialogTrigger>
                      <DialogContent className="p-0 w-full max-w-4xl">
                        <DialogTitle className="sr-only" />
                        <div className="w-full flex items-center justify-center relative lg:h-[80vh] md:h-[70vh] sm:h-[65vh] h-[40vh]">
                          {isLockProfile ? (
                            <div className="flex flex-col gap-2 items-center text-blue-600 dark:text-blue-500">
                              <LockKeyhole size={130} />
                              <h1 className="text-2xl font-bold">
                                Profile has been locked
                              </h1>
                            </div>
                          ) : (
                            <Image
                              fill
                              src={profileUser.cover}
                              alt="profile cover"
                              className="sm:rounded-md"
                            />
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {form.getValues("cover") && (
                    <div className="absolute top-0 bg-zinc-950/40 px-4 py-2 flex items-center sm:justify-between justify-end z-45 w-full">
                      <h1 className="sm:flex items-center gap-2 font-semibold text-white hidden">
                        <TiWorld className="text-3xl" />
                        Your cover photo is public
                      </h1>
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          disabled={loading}
                          size={"sm"}
                          variant={"outline"}
                          onClick={() => form.reset()}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={loading} size={"sm"}>
                          {loading && <Loader2 className="animate-spin" />}
                          Save changes
                        </Button>
                      </div>
                    </div>
                  )}
                </Fragment>
              ) : (
                <div className="h-full w-full dark:bg-zinc-950 rounded-b-lg bg-zinc-200" />
              )}
            </Fragment>
          )}

          {isCurrentUserProfile && (
            <DropdownMenu>
              <DropdownMenuTrigger className="z-30 absolute right-8 bottom-4 flex items-center gap-1 dark:bg-zinc-50 text-sm font-medium dark:hover:bg-zinc-300 transition dark:text-zinc-950 px-2 py-[5px] rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-50 group focus:outline-hidden">
                <Camera
                  className="dark:fill-black dark:stroke-white stroke-zinc-900 group-hover:stroke-zinc-800 dark:group-hover:stroke-zinc-300 fill-zinc-50"
                  size={30}
                />
                <span className="hidden md:flex">Edit cover photo</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuGroup>
                  <div onClick={() => setIsDialogOpen(true)}>
                    <DropdownMenuItem className="py-2">
                      <ImageIcon />
                      Choose cover photo
                    </DropdownMenuItem>
                  </div>

                  <label htmlFor="images">
                    <DropdownMenuItem className="py-2">
                      <ArrowUpFromLine />
                      Upload photo
                    </DropdownMenuItem>
                  </label>
                  <DropdownMenuSeparator />
                  <div onClick={() => setOpen(true)}>
                    <DropdownMenuItem className="py-2">
                      <Trash />
                      Remove
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <ChosePhoto
            currentUser={profileUser}
            control={form.control}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you absolutely sure to remove cover photo?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your cover photo and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel type="button" disabled={transition}>
                  Cancel
                </AlertDialogCancel>
                <Button
                  disabled={transition}
                  type="button"
                  onClick={handleRemove}
                >
                  {transition && <Loader2 className="animate-spin" />}
                  Continue
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <FormField
            control={form.control}
            name="cover"
            render={({ field }) => (
              <FormItem>
                <UploadImage
                  endPoint="profileImageUploader"
                  id="images"
                  onChange={field.onChange}
                  setTamporaryImage={setTamporaryImage}
                  tamporaryImage={tamporaryImage}
                />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default EditCoverPhoto;
