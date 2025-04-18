"use client";
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { useZustandStore } from "@/hooks/use-zustand-store";
import LoginForm from "@/app/(auth)/login/components/LoginForm";
import Social from "./navbarElement/Social";
import { useRouter } from "next/navigation";

const LoginModal = ({ currentUser }: { currentUser: boolean }) => {
  const { loginOpen, setLoginOpen } = useZustandStore();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) setLoginOpen(false);
  }, [currentUser,setLoginOpen]);

  return (
    <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
      <DialogContent>
        <DialogTitle className="text-center text-3xl font-bold mb-4">
          See more on Freetalk
        </DialogTitle>
        <Social />
        <div className="relative text-center text-sm">
          <div className="absolute inset-0 top-1/2 border-t border-zinc-200 dark:border-zinc-800 z-0" />
          <span className="relative z-10 bg-background px-2 text-zinc-600 dark:text-zinc-400">
            OR CONTINUE WITH
          </span>
        </div>
        <LoginForm />
        <div className="text-center text-sm mt-2">
          Don&apos;t have an account?{" "}
          <div
            className="underline underline-offset-4 text-primary inline-block cursor-pointer"
            onClick={() => {
              router.push("/signin");
              setLoginOpen(false);
            }}
          >
            Sign up
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
