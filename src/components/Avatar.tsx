import Image from "next/image";
import React from "react";

const Avatar = ({ className, src }: { className?: string; src: string }) => {
  return (
    <div>
      <div
        className={`aspect-square overflow-hidden rounded-full ${className} relative`}
      >
        <Image
          src={src || "/avater.jpg"}
          alt="avatar"
          fill
          sizes="1"
          priority
        />
      </div>
    </div>
  );
};

export default Avatar;
