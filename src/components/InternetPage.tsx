"use client";
import UseOnline from "@/hooks/use-online";
import { WifiOff } from "lucide-react";
import React from "react";

const InternetPage = () => {
  const { isOnline } = UseOnline();

  if (isOnline) return null;

  return (
    <div className="fixed inset-0 h-screen w-screen flex items-center justify-center z-999">
      <div className="h-full w-full bg-white/60 dark:bg-black/60 absolute cursor-default" />
      <div className="z-50 flex flex-col gap-2 items-center justify-center">
        <WifiOff className="text-rose-600" size={50} />
        <h1 className="text-3xl font-bold text-zinc-700 dark:text-zinc-300">
          No Internet connection
        </h1>
      </div>
    </div>
  );
};

export default InternetPage;
