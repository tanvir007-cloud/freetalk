"use client";
import React, { useTransition } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/auth/routes";
import { Button } from "../ui/button";

const Social = () => {
  const [transition, startTransition] = useTransition();
  const onClick = (provider: "github" | "google") => {
    startTransition(async () => {
      await signIn(provider, {
        redirectTo: DEFAULT_LOGIN_REDIRECT,
      });
    });
  };
  
  return (
    <div className="flex items-center gap-4">
      <Button
        disabled={transition}
        variant={"outline"}
        className="w-full"
        onClick={() => onClick("github")}
      >
        <FaGithub />
        GitHub
      </Button>
      <Button
        disabled={transition}
        variant={"outline"}
        className="w-full"
        onClick={() => onClick("google")}
      >
        <FaGoogle />
        Google
      </Button>
    </div>
  );
};

export default Social;
