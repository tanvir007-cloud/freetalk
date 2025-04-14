"use client";
import React, { Fragment } from "react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const DesktopModeToggle = () => {
  const { setTheme, theme } = useTheme();

  return (
    <Fragment>
      <DropdownMenuItem
        className={cn(theme === "light" && "bg-zinc-100 dark:bg-zinc-800")}
        onSelect={() => setTheme("light")}
      >
        <Sun />
        Light
      </DropdownMenuItem>
      <DropdownMenuItem
        className={cn(theme === "dark" && "bg-zinc-100 dark:bg-zinc-800")}
        onSelect={() => setTheme("dark")}
      >
        <Moon />
        Dark
      </DropdownMenuItem>
    </Fragment>
  );
};

export default DesktopModeToggle;
