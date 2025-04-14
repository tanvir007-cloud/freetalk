import { updateProfilePhoto } from "@/app/actions/updateProfile";
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ChooseProfilePhoto from "./ChooseProfilePhoto";
import toast from "react-hot-toast";

const formSchema = z.object({
  image: z.string(),
  bio: z.string().max(101, "Bio must be at most 101 characters"),
});

const EditProfilePhotoElement = ({
  profileUser,
  isCurrentUserProfile,
}: {
  profileUser: User;
  isCurrentUserProfile: boolean;
}) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: "",
      bio: profileUser.bio || "",
    },
  });

  const loading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = await updateProfilePhoto({
      isCurrentUserProfile,
      userId: profileUser.id,
      values,
      coverImage: profileUser.cover,
    });

    if (data.error) {
      toast.error(data.error)
    }

    if (data.success) {
      toast.success(data.success)
      router.refresh();
      form.reset();
      setIsDialogOpen(false);
    }
  };
  return (
    <Form {...form}>
      <form
        id="edit-profile"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Profile picture</h1>
          <Button
            variant={"ghost"}
            size={"sm"}
            type="button"
            onClick={() => setIsDialogOpen(true)}
          >
            Edit
          </Button>
        </div>
        <div className="flex items-center justify-center">
          <Avatar src={profileUser.image || ""} className="size-40" />
        </div>
        <ChooseProfilePhoto
          id="edit-profile"
          loading={loading}
          control={form.control}
          value={form.watch("image")}
          isDialogOpen={isDialogOpen}
          userProfile={profileUser}
          setIsDialogOpen={setIsDialogOpen}
          reset={form.reset}
        />
      </form>
    </Form>
  );
};

export default EditProfilePhotoElement;
