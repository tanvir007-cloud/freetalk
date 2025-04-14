"use client";
import { updateBio, updateUserInfo } from "@/app/actions/updateProfile";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import {
  BriefcaseBusiness,
  GraduationCap,
  Link as Website,
  MapPin,
  CalendarDays,
  Edit,
  Loader2,
  Cake,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState, useTransition } from "react";
import { TiWorld } from "react-icons/ti";
import EditInfo from "./EditInfo";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { infoSchema } from "@/lib/zodValidation";
import toast from "react-hot-toast";

const UserInfoCard = ({
  profileUser,
  isCurrentUserProfile,
  type,
}: {
  profileUser: User;
  isCurrentUserProfile: boolean;
  type?: "ABOUT";
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [bio, setBio] = useState<string>(profileUser.bio || "");
  const [transition, setTransition] = useTransition();
  const form = useForm<z.infer<typeof infoSchema>>({
    resolver: zodResolver(infoSchema),
    defaultValues: {
      city: "",
      school: "",
      work: "",
      website: "",
      dob: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof infoSchema>) => {
    console.log(values);

    const data = await updateUserInfo(
      values,
      isCurrentUserProfile,
      profileUser.id
    );

    if (data.success) {
      toast.success(data.success);
      form.reset();
      router.refresh();
      setOpenDialog(false);
    }

    if (data.error) {
      toast.error(data.error);
    }
  };

  useEffect(() => {
    form.setValue("city", profileUser.city || "");
    form.setValue("dob", profileUser.dob || "");
    form.setValue("school", profileUser.school || "");
    form.setValue("website", profileUser.website || "");
    form.setValue("work", profileUser.work || "");
  }, [
    openDialog,
    profileUser.city,
    profileUser.dob,
    profileUser.work,
    profileUser.school,
    profileUser.website,
    form
  ]);

  const handleBio = () => {
    setTransition(async () => {
      const data = await updateBio({
        bio,
        isCurrentUserProfile,
        userId: profileUser.id,
      });

      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        router.refresh();
        setBio("");
        setOpen(false);
      }
    });
  };

  useEffect(() => {
    if (profileUser.bio) {
      setBio(profileUser.bio);
    }
  }, [open, profileUser.bio]);

  return (
    <div
      className={cn(
        "p-4 bg-white dark:bg-zinc-900 md:rounded-md shadow-md flex flex-col"
      )}
    >
      <div className="flex items-center justify-between font-medium">
        <span className="text-zinc-500 dark:text-zinc-400">
          User Information
        </span>
        {type !== "ABOUT" && (
          <TabsList className="dark:bg-transparent p-0 bg-transparent">
            <TabsTrigger
              value="about"
              className="text-blue-600 text-sm hover:underline transition"
            >
              See all
            </TabsTrigger>
          </TabsList>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <div className="w-full flex items-center justify-between">
            {!isCurrentUserProfile && !profileUser.bio ? null : (
              <h1 className="text-xl font-semibold">Intro</h1>
            )}
            {isCurrentUserProfile && (
              <Edit
                className="cursor-pointer dark:text-zinc-300 transition dark:hover:text-white text-zinc-700 hover:text-black"
                onClick={() => setOpen(true)}
              />
            )}
          </div>
          {open ? (
            <div className="mt-2">
              <Textarea
                className="text-center"
                placeholder="Discribe who you are"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={101}
              />
              <div className="w-full flex items-end flex-col gap-1">
                <h1 className="text-sm text-zinc-500">
                  {101 - bio.length} caracters remaining
                </h1>
                <div className="flex items-center w-full justify-between">
                  <div className="flex items-center gap-1">
                    <TiWorld className="text-2xl" />
                    <span>Public</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size={"sm"}
                      variant={"destructive"}
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size={"sm"}
                      disabled={bio.length === 0 || transition}
                      onClick={handleBio}
                    >
                      {transition && <Loader2 className="animate-spin" />}
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Fragment>
              {profileUser.bio && (
                <h1 className="text-zinc-500">{profileUser.bio}</h1>
              )}
            </Fragment>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {profileUser.city && (
            <div className="flex items-center gap-2">
              <MapPin className="text-zinc-600 dark:text-zinc-500" size={20} />
              <h1 className="text-zinc-600 dark:text-zinc-500 line-clamp-1">
                Living in{" "}
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                  {profileUser.city}
                </span>
              </h1>
            </div>
          )}
          {profileUser.school && (
            <div className="flex items-center gap-2">
              <GraduationCap
                className="text-zinc-600 dark:text-zinc-500"
                size={20}
              />
              <h1 className="text-zinc-600 dark:text-zinc-500 line-clamp-1">
                Went to{" "}
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                  {profileUser.school}
                </span>
              </h1>
            </div>
          )}
          {profileUser.work && (
            <div className="flex items-center gap-2">
              <BriefcaseBusiness
                className="text-zinc-600 dark:text-zinc-500"
                size={20}
              />
              <h1 className="text-zinc-600 dark:text-zinc-500 line-clamp-1">
                Works al{" "}
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                  {profileUser.work}
                </span>
              </h1>
            </div>
          )}
          {profileUser.website && (
            <div className="flex items-center gap-2">
              <Website className="text-zinc-600 dark:text-zinc-500" size={20} />
              <Link
                target="_blank"
                href={profileUser.website}
                className="line-clamp-1 text-blue-600 transition hover:underline font-medium"
              >
                {profileUser.website.split(".")[0].split("//")[1]}
              </Link>
            </div>
          )}
          {profileUser.dob && (
            <div className="flex items-center gap-2">
              <Cake className="text-zinc-600 dark:text-zinc-500" size={20} />
              <h1 className="text-zinc-600 dark:text-zinc-500 line-clamp-1">
                Date of birth{" "}
                <span className="text-zinc-800 dark:text-zinc-200 font-medium">
                  {profileUser.dob}
                </span>
              </h1>
            </div>
          )}
          <div className="flex items-center gap-2 justify-end">
            <CalendarDays
              size={20}
              className="text-zinc-600 dark:text-zinc-500"
            />
            <span className="bg-blue-500/30 px-[1px] text-zinc-700 dark:bg-blue-500/10 dark:text-zinc-400">
              Joined
            </span>
            <span className="text-sm line-clamp-1 text-zinc-600 dark:text-zinc-500">
              {formatDate(profileUser.createdAt)}
            </span>
          </div>
          {isCurrentUserProfile && (
            <Button
              variant={"outline"}
              className="mt-2"
              onClick={() => setOpenDialog(true)}
            >
              Edit Details
            </Button>
          )}
          <EditInfo
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            form={form}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
