"use client";
import Avatar from "@/components/Avatar";
import { User } from "@prisma/client";
import { Camera } from "lucide-react";
import React, { Fragment, useState } from "react";
import ChooseProfilePhoto from "./ChooseProfilePhoto";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { updateProfilePhoto } from "@/app/actions/updateProfile";
import toast from "react-hot-toast";

const formSchema = z.object({
  image: z.string(),
  bio: z.string().max(101, "Bio must be at most 101 characters"),
});

const EditProfilePhoto = ({
  userProfile,
  isCurrentUserProfile,
}: {
  userProfile: User;
  isCurrentUserProfile: boolean;
}) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: "",
      bio: userProfile.bio || "",
    },
  });

  const loading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = await updateProfilePhoto({
      isCurrentUserProfile,
      userId: userProfile.id,
      values,
      coverImage: userProfile.cover,
    });

    if (data.error) {
      toast.error(data.error);
    }

    if (data.success) {
      toast.success(data.success);
      router.refresh();
      form.reset();
      setIsDialogOpen(false);
    }
  };

  return (
    <Form {...form}>
      <form
        id="update-profile"
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:relative md:-top-6 -top-[4.5rem] absolute z-40"
      >
        <Avatar
          src={userProfile.image || ""}
          className="size-36 ring-3 dark:ring-zinc-900 ring-white"
        />
        {isCurrentUserProfile && (
          <Fragment>
            <div
              className="z-50 rounded-full absolute right-0 bottom-4 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition bg-zinc-200 hover:bg-zinc-300 group focus:outline-hidden px-[3px] py-[3px] cursor-pointer"
              onClick={() => setIsDialogOpen(true)}
            >
              <Camera className="dark:fill-white dark:stroke-zinc-800 stroke-zinc-200 group-hover:stroke-zinc-300 dark:group-hover:stroke-zinc-700 fill-zinc-950" />
            </div>
            <ChooseProfilePhoto
              id="update-profile"
              loading={loading}
              control={form.control}
              value={form.watch("image")}
              isDialogOpen={isDialogOpen}
              userProfile={userProfile}
              setIsDialogOpen={setIsDialogOpen}
              reset={form.reset}
            />
          </Fragment>
        )}
      </form>
    </Form>
  );
};

export default EditProfilePhoto;
