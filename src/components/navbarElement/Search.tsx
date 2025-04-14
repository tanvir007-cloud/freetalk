"use client";
import { useZustandStore } from "@/hooks/use-zustand-store";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import React from "react";

const Search = ({ className }: { className?: string }) => {
  const { setOpen } = useZustandStore();
  return (
    <div
      className={cn(
        "flex items-center justify-center cursor-pointer dark:bg-zinc-800 dark:hover:bg-zinc-700 bg-zinc-200 p-2.5 rounded-full transition",
        className
      )}
      onClick={() => setOpen(true)}
    >
      <SearchIcon className="dark:text-zinc-400 text-zinc-600" />
    </div>
  );
};

export default Search;
