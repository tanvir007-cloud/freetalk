import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href={"/"} className="relative size-11 outline-none">
      <Image
        src={"/logo-dark.png"}
        alt="logo-dark"
        fill
        sizes="1"
        className="hidden dark:block"
      />

      <Image
        src={"/logo-light.png"}
        alt="logo-dark"
        fill
        sizes="1"
        className="block dark:hidden"
      />
    </Link>
  );
};

export default Logo;
