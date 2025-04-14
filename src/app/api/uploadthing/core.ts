import getCurrentUser from "@/app/getActions/getCurrentUser";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) throw new UploadThingError("Unauthorized");

  return { userId: currentUser.id };
};
export const ourFileRouter = {
  profileImageUploader: f({ image: { maxFileSize: "8MB" } })
    .middleware(async () => await handleAuth())
    .onUploadComplete(() => {}),
  postImageUploader: f({ image: { maxFileSize: "16MB" } })
    .middleware(async () => await handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
