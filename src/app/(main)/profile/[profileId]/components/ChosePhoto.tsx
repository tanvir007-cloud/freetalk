"use client";
import LikeSkeleton from "@/components/AllSkeletons/LikeSkeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FormField } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useObserver from "@/hooks/use-observer";
import { usePostQuery } from "@/hooks/use-post-query";
import { PostPhoto, ProfilePhoto, User } from "@prisma/client";
import Image from "next/image";
import React, { Dispatch, Fragment, SetStateAction, useRef } from "react";
import { Control, Path } from "react-hook-form";

const ChosePhoto = <T extends Record<string, any>>({
  currentUser,
  control,
  isDialogOpen,
  setIsDialogOpen,
}: {
  currentUser: User;
  control: Control<T>;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  isDialogOpen: boolean;
}) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="p-0 pt-6 pb-2 max-w-xl max-h-[90vh] gap-1">
        <ChosePhotoElement
          currentUser={currentUser}
          control={control}
          setIsDialogOpen={setIsDialogOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

const ChosePhotoElement = <T extends Record<string, any>>({
  currentUser,
  control,
  setIsDialogOpen,
}: {
  currentUser: User;
  control: Control<T>;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const postObserverRef = useRef<IntersectionObserver | null>(null);

  const { data, fetchNextPage, hasNextPage, status, isFetchingNextPage } =
    usePostQuery({
      apiUrl: "/api/allPostPhoto",
      queryKey: ["allPostPhoto", currentUser.id],
      paramKey: "profileUserId",
      paramValue: currentUser.id,
    });

  useObserver({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    observerRef: postObserverRef,
  });

  const postAttachObserver = (element: HTMLElement | null) => {
    if (postObserverRef.current && element) {
      postObserverRef.current.observe(element);
    }
  };

  const recentPhotos = data?.pages?.flatMap((page) => page.recentPhotos) || [];

  if (status === "pending") {
    return (
      <Fragment>
        <DialogTitle className="py-3.5 border-b border-zinc-200 dark:border-zinc-800" />
        <div className="px-4 pb-4">
          <LikeSkeleton type="Pending" />
        </div>
      </Fragment>
    );
  }
  return (
    <Fragment>
      <DialogTitle className="text-center border-b border-zinc-200 dark:border-zinc-800 pb-4">
        Select photo
      </DialogTitle>
      <Tabs defaultValue="recentPhoto">
        <TabsList className="grid w-full grid-cols-2 dark:bg-zinc-950 bg-white px-3">
          <TabsTrigger
            value="recentPhoto"
            className="data-[state=active]:bg-zinc-200 dark:data-[state=active]:bg-zinc-900 rounded-sm"
          >
            Recent photos
          </TabsTrigger>
          <TabsTrigger
            value="profilePhoto"
            className="data-[state=active]:bg-zinc-200 dark:data-[state=active]:bg-zinc-900 rounded-sm"
          >
            Profile & Cover photos
          </TabsTrigger>
        </TabsList>
        <ScrollArea className="px-3 h-[70vh]">
          <TabsContent value="recentPhoto" className="mt-0">
            {!hasNextPage && recentPhotos.length === 0 ? (
              <div className="flex items-center justify-center flex-col h-[65vh]">
                <h1 className="text-xl font-bold text-zinc-500">
                  No photos yet 😐😐
                </h1>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {recentPhotos.map((photo: PostPhoto, index: number) => {
                  const isLastItem = index === recentPhotos.length - 1;
                  return (
                    <FormField
                      key={photo.id}
                      control={control}
                      name={"cover" as Path<T>}
                      render={({ field }) => (
                        <div
                          onClick={() => {
                            field.onChange(photo.postImage);
                            setIsDialogOpen(false);
                          }}
                          ref={isLastItem ? postAttachObserver : null}
                          className="relative aspect-square size-full cursor-pointer"
                        >
                          <Image src={photo.postImage} alt="" fill sizes="1" />
                        </div>
                      )}
                    />
                  );
                })}
                {isFetchingNextPage && (
                  <Fragment>
                    {Array.from({ length: 3 }, (_, i) => (
                      <Skeleton key={i} className="aspect-square size-full" />
                    ))}
                  </Fragment>
                )}
              </div>
            )}
          </TabsContent>
          <TabsContent value="profilePhoto" className="mt-0">
            <ProfilePhotoElement
              control={control}
              currentUser={currentUser}
              setIsDialogOpen={setIsDialogOpen}
            />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </Fragment>
  );
};

const ProfilePhotoElement = <T extends Record<string, any>>({
  currentUser,
  control,
  setIsDialogOpen,
}: {
  currentUser: User;
  control: Control<T>;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const profileObserverRef = useRef<IntersectionObserver | null>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    usePostQuery({
      apiUrl: "/api/allProfilePhoto",
      queryKey: ["allProfilePhoto", currentUser.id],
      paramKey: "profileUserId",
      paramValue: currentUser.id,
    });

  useObserver({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    observerRef: profileObserverRef,
  });

  const profileAttachObserver = (element: HTMLElement | null) => {
    if (profileObserverRef.current && element) {
      profileObserverRef.current.observe(element);
    }
  };

  const profilePhotos =
    data?.pages?.flatMap((page) => page.profilePhotos) || [];

  if (status === "pending") {
    return (
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="aspect-square size-full" />
        ))}
      </div>
    );
  }
  return (
    <Fragment>
      {!hasNextPage && profilePhotos.length === 0 ? (
        <div className="flex items-center justify-center flex-col h-[65vh]">
          <h1 className="text-xl font-bold text-zinc-500">
            No photos yet 😐😐
          </h1>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {profilePhotos.map((photo: ProfilePhoto, index: number) => {
            const isLastItem = index === profilePhotos.length - 1;
            return (
              <FormField
                key={photo.id}
                control={control}
                name={"cover" as Path<T>}
                render={({ field }) => (
                  <div
                    onClick={() => {
                      field.onChange(photo.profileImage);
                      setIsDialogOpen(false);
                    }}
                    ref={isLastItem ? profileAttachObserver : null}
                    className="relative aspect-square size-full cursor-pointer"
                  >
                    <Image src={photo.profileImage} alt="" fill sizes="1" />
                  </div>
                )}
              />
            );
          })}
          {isFetchingNextPage && (
            <Fragment>
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="aspect-square size-full" />
              ))}
            </Fragment>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default ChosePhoto;
