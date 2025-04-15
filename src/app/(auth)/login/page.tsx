import React from "react";
import Link from "next/link";
import { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "./components/LoginForm";
import Social from "@/components/navbarElement/Social";
import getCurrentUserId from "@/app/getActions/getCurrentUserId";
import { redirect } from "next/navigation";

export const generateMetadata = (): Metadata => {
  return {
    title: "Login | Freetalk",
    description: "Login to your Freetalk account using Google or GitHub.",
    openGraph: {
      title: "Login | Freetalk",
      description: "Login to your Freetalk account using Google or GitHub.",
      url: "https://freetalk-whdr.onrender.com/login",
      images: [
        {
          url: "https://freetalk-whdr.onrender.com/opengraph.png", // Full URL is safer for OG
          width: 1200,
          height: 630,
          alt: "Freetalk",
        },
      ],
      siteName: "Freetalk",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Login | Freetalk",
      description: "Login to your Freetalk account using Google or GitHub.",
      images: ["https://freetalk-whdr.onrender.com/opengraph.png"],
    },
  };
};

const LoginPage = async() => {
  const currentUserId = await getCurrentUserId()
  if(currentUserId) return redirect("/")
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold">Welcome back</CardTitle>
          <CardDescription>
            Login with your GitHub or Google account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Social />
          <div className="relative text-center text-sm">
            <div className="absolute inset-0 top-1/2 border-t border-zinc-200 dark:border-zinc-800 z-0" />
            <span className="relative z-10 bg-card px-2 text-zinc-600 dark:text-zinc-400">
              OR CONTINUE WITH
            </span>
          </div>
          <LoginForm />
          <div className="text-center text-sm mt-2">
            Don&apos;t have an account?{" "}
            <Link
              href="/signin"
              className="underline underline-offset-4 text-primary"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
