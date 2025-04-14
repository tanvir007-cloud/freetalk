import Avatar from "@/components/Avatar";
import Loader from "@/components/Loader";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadImage from "@/components/UploadImage";
import { usePostQuery } from "@/hooks/use-post-query";
import { PostPhoto, ProfilePhoto, User } from "@prisma/client";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
import React, { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Control, Path, UseFormReset } from "react-hook-form";
import { TiWorld } from "react-icons/ti";

type ChooseProfilePhotoProps<T extends Record<string, any>> = {
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  userProfile: User;
  control: Control<T>;
  value: string;
  reset: UseFormReset<T>;
  loading: boolean;
  id: string;
};

const ChooseProfilePhoto = <T extends Record<string, any>>({
  isDialogOpen,
  setIsDialogOpen,
  userProfile,
  control,
  value,
  reset,
  loading,
  id,
}: ChooseProfilePhotoProps<T>) => {
  const [tamporaryImage, setTamporaryImage] = useState<File | null>(null);
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="p-0 pt-6 max-w-xl max-h-[90vh] gap-1">
        <DialogTitle className="text-center pb-4 border-b border-zinc-200 dark:border-zinc-800">
          Choose profile picture
        </DialogTitle>
        {value ? (
          <div className="h-[76vh]">
            <div className="flex flex-col w-full h-full justify-between py-6">
              <FormField
                control={control}
                name={"bio" as Path<T>}
                render={({ field }) => (
                  <div className="flex flex-col gap-y-2">
                    <div className="px-4 flex items-center gap-3">
                      <Label className="text-lg">Bio:</Label>
                      <Input
                        placeholder="Say something about your profile picture"
                        {...field}
                      />
                    </div>
                    <div className="pl-14">
                      <FormMessage />
                    </div>
                  </div>
                )}
              />
              <div className="flex items-center justify-center w-full">
                <Avatar src={value} className="size-64" />
              </div>
              <div>
                <div className="w-full border-b border-zinc-200 dark:border-zinc-800 px-3 text-lg">
                  <div className="flex items-center gap-2">
                    <TiWorld className="text-2xl" />
                    Your profile picture is public.
                  </div>
                </div>
                <div className="flex items-center w-full justify-end px-3 mt-5 gap-x-4">
                  <Button
                    type="button"
                    disabled={loading}
                    variant={"destructive"}
                    onClick={() => reset({ image: "" } as unknown as T)}
                  >
                    Cancel
                  </Button>
                  <Button
                    form={id}
                    disabled={loading}
                    className="px-12"
                    type="submit"
                  >
                    {loading && <Loader2 className="animate-spin" />}
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="uploadPhoto">
            <TabsList className="grid w-full grid-cols-2 dark:bg-zinc-950 bg-white px-3">
              <TabsTrigger
                value="uploadPhoto"
                className="data-[state=active]:bg-zinc-200 dark:data-[state=active]:bg-zinc-900 rounded-sm"
              >
                Upload Photo
              </TabsTrigger>
              <TabsTrigger
                value="choosePhoto"
                className="data-[state=active]:bg-zinc-200 dark:data-[state=active]:bg-zinc-900 rounded-sm"
              >
                Choose photo
              </TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[70vh]">
              <TabsContent value="uploadPhoto">
                <div className="flex flex-col w-full h-[68vh] py-6 gap-y-2">
                  <div className="w-full flex justify-center h-full items-center">
                    <div className="relative size-64 aspect-square rounded-full">
                      <Image
                        src={
                          tamporaryImage
                            ? URL.createObjectURL(tamporaryImage)
                            : userProfile.image || "/avater.jpg"
                        }
                        alt=""
                        fill
                        sizes="1"
                        className="rounded-full"
                      />
                      {tamporaryImage && (
                        <div className="rounded-full flex items-center justify-center size-full absolute dark:bg-zinc-950/60 bg-zinc-200/40">
                          <Loader className="size-3 dark:bg-zinc-200 bg-zinc-900" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="w-full border-b border-zinc-200 dark:border-zinc-800 px-3 text-xl pb-2">
                      <h1>If you want to upload photo:</h1>
                    </div>
                    <div className="flex items-center w-full justify-end px-3">
                      <label
                        className={buttonVariants({
                          variant: "default",
                          className: `${
                            tamporaryImage
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }`,
                        })}
                      >
                        <Plus />
                        Upload photo
                        <FormField
                          control={control}
                          name={"image" as Path<T>}
                          render={({ field }) => (
                            <FormItem>
                              <UploadImage
                                endPoint="profileImageUploader"
                                onChange={field.onChange}
                                setTamporaryImage={setTamporaryImage}
                                tamporaryImage={tamporaryImage}
                              />
                            </FormItem>
                          )}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="choosePhoto">
                <ChoosePhotoElement
                  userProfile={userProfile}
                  control={control}
                />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

const ChoosePhotoElement = <T extends Record<string, any>>({
  userProfile,
  control,
}: {
  userProfile: User;
  control: Control<T>;
}) => {
  const { data, fetchNextPage, hasNextPage, status, isFetchingNextPage } =
    usePostQuery({
      apiUrl: "/api/allPostPhoto",
      queryKey: ["allPostPhoto", userProfile.id],
      paramKey: "profileUserId",
      paramValue: userProfile.id,
    });

  const {
    data: profileData,
    fetchNextPage: profileFetchNextPage,
    hasNextPage: profileHasNextPage,
    isFetchingNextPage: isProfileFetchingNextPage,
    status: profileStatus,
  } = usePostQuery({
    apiUrl: "/api/allProfilePhoto",
    queryKey: ["allProfilePhoto", userProfile.id],
    paramKey: "profileUserId",
    paramValue: userProfile.id,
  });

  const recentPhotos = data?.pages?.flatMap((page) => page.recentPhotos) || [];

  const profilePhotos =
    profileData?.pages?.flatMap((page) => page.profilePhotos) || [];

  if (status === "pending" || profileStatus === "pending") {
    return (
      <div className="flex items-center justify-center w-full h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-5 mt-3 px-3 mb-2">
      {!hasNextPage &&
      recentPhotos.length === 0 &&
      !profileHasNextPage &&
      profilePhotos.length === 0 ? (
        <div className="flex items-center justify-center h-[55vh] text-2xl font-bold text-red-600">
          <h1>No photo yet 😐</h1>
        </div>
      ) : (
        <Fragment>
          {(hasNextPage || recentPhotos.length !== 0) && (
            <div className="flex flex-col gap-2">
              <h1 className="text-lg font-semibold tracking-wider">
                Recent Photos
              </h1>
              <div className="grid grid-cols-6 gap-1">
                {recentPhotos.map((photo: PostPhoto) => (
                  <FormField
                    key={photo.id}
                    control={control}
                    name={"image" as Path<T>}
                    render={({ field }) => (
                      <div
                        onClick={() => {
                          field.onChange(photo.postImage);
                        }}
                        className="relative aspect-square size-full cursor-pointer"
                      >
                        <Image src={photo.postImage} alt="" fill sizes="1" />
                      </div>
                    )}
                  />
                ))}
                {isFetchingNextPage && (
                  <Fragment>
                    {Array.from({ length: 6 }, (_, i) => (
                      <Skeleton key={i} className="aspect-square size-full" />
                    ))}
                  </Fragment>
                )}
              </div>
              {!!hasNextPage && (
                <Button
                  type="button"
                  variant={"outline"}
                  className="mt-1"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage && (
                    <Loader className="size-2 dark:bg-zinc-200 bg-zinc-800" />
                  )}
                  See more
                </Button>
              )}
            </div>
          )}

          {(profileHasNextPage || profilePhotos.length !== 0) && (
            <div className="flex flex-col gap-2">
              <h1 className="text-lg font-semibold tracking-wider">
                Profile & Cover photos
              </h1>
              <div className="grid grid-cols-6 gap-1">
                {profilePhotos.map((photo: ProfilePhoto) => (
                  <FormField
                    key={photo.id}
                    control={control}
                    name={"image" as Path<T>}
                    render={({ field }) => (
                      <div
                        onClick={() => field.onChange(photo.profileImage)}
                        className="relative aspect-square size-full cursor-pointer"
                      >
                        <Image src={photo.profileImage} alt="" fill sizes="1" />
                      </div>
                    )}
                  />
                ))}
                {isProfileFetchingNextPage && (
                  <Fragment>
                    {Array.from({ length: 6 }, (_, i) => (
                      <Skeleton key={i} className="aspect-square size-full" />
                    ))}
                  </Fragment>
                )}
              </div>
              {!!profileHasNextPage && (
                <Button
                  type="button"
                  variant={"outline"}
                  className="mt-1"
                  onClick={() => profileFetchNextPage()}
                  disabled={isProfileFetchingNextPage}
                >
                  {isProfileFetchingNextPage && (
                    <Loader className="size-2 dark:bg-zinc-200 bg-zinc-800" />
                  )}
                  See more
                </Button>
              )}
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default ChooseProfilePhoto;
