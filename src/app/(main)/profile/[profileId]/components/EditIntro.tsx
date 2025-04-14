"use client";
import { updateBio, updateUserInfo } from "@/app/actions/updateProfile";
import { Button } from "@/components/ui/button";
import { infoSchema } from "@/lib/zodValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import {
  BriefcaseBusiness,
  Cake,
  GraduationCap,
  LinkIcon,
  Loader2,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import EditInfo from "../../components/EditInfo";
import { TiWorld } from "react-icons/ti";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

const EditIntro = ({
  profileUser,
  isCurrentUserProfile,
}: {
  profileUser: User;
  isCurrentUserProfile: boolean;
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
    <Fragment>
      <div className="flex flex-col gap-3">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-xl font-semibold">Bio</h1>
          {isCurrentUserProfile && (
            <Button variant={"ghost"} size={"sm"} onClick={() => setOpen(true)}>
              Edit
            </Button>
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
              <h1 className="text-zinc-500 text-center">
                {profileUser.bio ? profileUser.bio : "Describe yourself..."}
              </h1>
            )}
          </Fragment>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Customize your intro</h1>
          <Button
            variant={"ghost"}
            size={"sm"}
            onClick={() => setOpenDialog(true)}
          >
            Edit
          </Button>
          <EditInfo
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            form={form}
            onSubmit={onSubmit}
          />
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
              <LinkIcon
                className="text-zinc-600 dark:text-zinc-500"
                size={20}
              />
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
        </div>
      </div>
    </Fragment>
  );
};

export default EditIntro;
