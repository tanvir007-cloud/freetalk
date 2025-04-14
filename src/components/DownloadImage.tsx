"use client";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useTransition,
} from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import ProgressCircle from "./ProgressCircle";

const DownloadImage = ({
  imageUrl,
  setOpenDropdown,
  openDropdown,
}: {
  imageUrl: string;
  setOpenDropdown: Dispatch<SetStateAction<boolean>>;
  openDropdown: boolean;
}) => {
  const [progress, setProgress] = useState(0); // Progress state
  const [isPending, startTransition] = useTransition();
  const handleDownload = async () => {
    startTransition(async () => {
      setProgress(1); // Start from 1%

      try {
        const response = await fetch(imageUrl);
        const reader = response.body?.getReader();
        const contentLength = +response.headers.get("Content-Length")!; // Total file size

        let receivedLength = 0;
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;

          chunks.push(value);
          receivedLength += value.length;

          // Calculate progress (1 to 100%)
          const percent = Math.min(
            100,
            Math.floor((receivedLength / contentLength) * 100)
          );
          setProgress(percent);
        }

        // Convert chunks to a Blob
        const blob = new Blob(chunks);
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `facebook_post_${Date.now()}.jpg`; // Unique filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading image:", error);
      } finally {
        setTimeout(() => {
          setProgress(0); // Reset progress after 1 sec
        }, 1000);
        setOpenDropdown(false);
      }
    });
  };
  return (
    <AlertDialog open={openDropdown} onOpenChange={setOpenDropdown}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently download this
            post photo in your device.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button disabled={isPending} onClick={handleDownload}>
            {!isPending && <Download />}
            Download
            {isPending && <ProgressCircle progress={progress} />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DownloadImage;
