import { ourFileRouter } from "@/app/api/uploadthing/core";
import { uploadFiles } from "@/lib/uploadthing";
import React, { Dispatch, SetStateAction } from "react";

const UploadImage = ({
  onChange,
  setTamporaryImage,
  tamporaryImage,
  endPoint,
  id
}: {
  tamporaryImage: File | null;
  setTamporaryImage: Dispatch<SetStateAction<File | null>>;
  onChange: (...event: any[]) => void;
  endPoint: keyof typeof ourFileRouter;
  id?:string
}) => {
  return (
    <input
      disabled={tamporaryImage ? true : undefined}
      type="file"
      id={id}
      className="hidden"
      onChange={async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setTamporaryImage(files[0]);
        try {
          const uploadFile = await uploadFiles(endPoint, {
            files: Array.from(files),
          });

          if (uploadFile.length > 0) {
            onChange(uploadFile[0].ufsUrl);
            setTamporaryImage(null);
          }
        } catch (error: any) {
          console.log("Upload failed: ", error);
        }
      }}
    />
  );
};

export default UploadImage;
