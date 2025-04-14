"use client";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { usePostQuery } from "@/hooks/use-post-query";
import { cn } from "@/lib/utils";
import { PostPhoto, ProfilePhoto, User } from "@prisma/client";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Fragment } from "react";

const AllPhotos = ({ userProfile }: { userProfile: User }) => {
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
    <div className="flex flex-col md:gap-6 gap-5">
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
            <div
              className={cn(
                "p-4 bg-white dark:bg-zinc-900 md:rounded-md shadow-md flex flex-col gap-4"
              )}
            >
              <h1 className="text-zinc-500 dark:text-zinc-400 text-2xl font-semibold">
                Recent Photos
              </h1>
              <div
                className={cn(
                  "grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4"
                )}
              >
                {recentPhotos.map((photo: PostPhoto) => (
                  <Dialog key={photo.id}>
                    <DialogTrigger>
                      <div className={cn("relative aspect-square size-full")}>
                        <Image
                          src={photo.postImage}
                          alt=""
                          fill
                          sizes="1"
                          className="rounded-sm object-cover"
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="p-0">
                      <DialogTitle className="sr-only" />
                      <div className="relative aspect-square">
                        <Image
                          fill
                          src={photo.postImage}
                          alt="profile cover"
                          className="sm:rounded-md"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
                {isFetchingNextPage && (
                  <Fragment>
                    {Array.from({ length: 4 }, (_, i) => (
                      <Skeleton key={i} className="aspect-square size-full" />
                    ))}
                  </Fragment>
                )}
              </div>
              {!!hasNextPage && (
                <Button
                  type="button"
                  variant={"outline"}
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
            <div
              className={cn(
                "p-4 bg-white dark:bg-zinc-900 md:rounded-md shadow-md flex flex-col gap-4"
              )}
            >
              <h1 className="text-zinc-500 dark:text-zinc-400 text-2xl font-semibold">
                Profile & Cover Photos
              </h1>
              <div
                className={cn(
                  "grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4"
                )}
              >
                {profilePhotos.map((photo: ProfilePhoto) => (
                  <Dialog key={photo.id}>
                    <DialogTrigger>
                      <div className={cn("relative aspect-square size-full")}>
                        <Image
                          src={photo.profileImage}
                          alt=""
                          fill
                          sizes="1"
                          className="rounded-sm object-cover"
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="p-0">
                      <DialogTitle className="sr-only" />
                      <div className="relative aspect-square">
                        <Image
                          fill
                          src={photo.profileImage}
                          alt="profile cover"
                          className="sm:rounded-md"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
                {isProfileFetchingNextPage && (
                  <Fragment>
                    {Array.from({ length: 4 }, (_, i) => (
                      <Skeleton key={i} className="aspect-square size-full" />
                    ))}
                  </Fragment>
                )}
              </div>
              {!!profileHasNextPage && (
                <Button
                  type="button"
                  variant={"outline"}
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

export default AllPhotos;
