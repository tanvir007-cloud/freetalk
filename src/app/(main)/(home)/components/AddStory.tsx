"use client";
import createStory from "@/app/actions/createStory";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { uploadFiles } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, XIcon } from "lucide-react";
import NextImage from "next/image";
import React, { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";

const AddStory = ({
  currentUser,
  children,
}: {
  currentUser: User;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [tamporaryImage, setTamporaryImage] = useState<File | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number | null;
    height: number | null;
  }>({ width: null, height: null });

  const handleStory = () => {
    startTransition(async () => {
      if (tamporaryImage) {
        const uploadFile = await uploadFiles("postImageUploader", {
          files: [tamporaryImage],
        });

        if (uploadFile.length > 0) {
          const data = await createStory(currentUser.id, uploadFile[0].ufsUrl);

          if (data.success) {
            toast.success(data.success);
            queryClient.invalidateQueries({
              queryKey: ["story", currentUser.id],
            });
            setTamporaryImage(null);
            setOpen(false);
          }

          if (data.error) {
            toast.error(data.error);
          }
        }
      }
    });
  };

  useEffect(() => {
    if (!tamporaryImage) return;

    const img = new Image();
    img.onload = () => {
      setImageDimensions({ height: img.height, width: img.width });
    };
    img.src = URL.createObjectURL(tamporaryImage);
  }, [tamporaryImage]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)} className="w-full">
        {children}
      </div>
      <DialogContent
        className={cn(
          tamporaryImage
            ? "h-full sm:h-auto"
            : "p-0 max-w-xs sm:max-w-xs h-[70%] border-none rounded-lg"
        )}
      >
        <DialogTitle className="sr-only" />
        {tamporaryImage ? (
          <div className="flex flex-col gap-y-3">
            <h1 className="text-xl font-bold">Preview</h1>
            <div className="flex items-center justify-center h-full">
              <div className="relative sm:w-58 sm:h-auto sm:aspect-[9/16] w-full h-full flex justify-center overflow-hidden">
                <div className="h-full w-full flex items-center justify-center relative">
                  <NextImage
                    src={URL.createObjectURL(tamporaryImage)}
                    alt=""
                    fill
                  />
                  <div className="absolute inset-0 backdrop-blur-3xl h-[101%]" />
                  {imageDimensions.width && imageDimensions.height && (
                    <NextImage
                      src={URL.createObjectURL(tamporaryImage)}
                      alt=""
                      height={imageDimensions.height}
                      width={imageDimensions.width}
                      className="z-10"
                    />
                  )}
                </div>
                <XIcon
                  className="cursor-pointer text-zinc-300 transition-colors hover:text-white absolute top-1.5 right-1.5"
                  onClick={() => setTamporaryImage(null)}
                />
              </div>
            </div>
            <div className="flex items-center justify-end mt-2">
              <Button disabled={isPending} onClick={handleStory}>
                {isPending && <Loader2 className="animate-spin" />}
                Share to story
              </Button>
            </div>
          </div>
        ) : (
          <label className="flex items-center justify-center w-full h-full bg-gradient-to-tr from-cyan-400 to-cyan-500 via-indigo-500 via-40% cursor-pointer rounded-lg">
            <div className="absolute h-full w-full hover:bg-white/10 transition-colors rounded-lg" />
            <div className="flex flex-col items-center gap-y-1">
              <div className="border border-border bg-card p-2 rounded-full">
                <ImagePlus />
              </div>
              <h1 className="text-white font-semibold">Create a photo story</h1>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const files = e.target.files;
                if (!files || files.length === 0) return;
                setTamporaryImage(files[0]);
              }}
            />
          </label>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddStory;
