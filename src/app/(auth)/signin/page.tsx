import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SigninForm from "./components/SigninForm";
import Social from "@/components/navbarElement/Social";

export const generateMetadata = (): Metadata => {
  return {
    title: "Sign Up | Facebook Clone",
    description: "Create a new account to join Facebook Clone and connect with friends.",
    openGraph: {
      title: "Sign Up | Facebook Clone",
      description: "Create a new account to join Facebook Clone and connect with friends.",
      url: "https://yourfacebookclone.com/signin",
      siteName: "Facebook Clone",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Sign Up | Facebook Clone",
      description: "Create a new account to join Facebook Clone and connect with friends.",
    },
  };
};

const SigninPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="md:max-w-md sm:max-w-md w-[90%]">
        <CardHeader className="text-center">
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Social />
          <div className="relative text-center text-sm mt-3">
            <div className="absolute inset-0 top-1/2 border-t border-zinc-200 dark:border-zinc-800 z-0" />
            <span className="relative z-10 bg-card px-2 text-zinc-600 dark:text-zinc-400">
              OR CONTINUE WITH
            </span>
          </div>
          <SigninForm />
          <div className="text-center text-sm mt-2">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4 text-primary">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SigninPage;



