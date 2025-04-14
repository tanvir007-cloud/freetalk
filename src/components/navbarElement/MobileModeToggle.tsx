"use client";
import { Moon } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";
import { Switch } from "../ui/switch";

const MobileModeToggle = () => {
  const { setTheme, theme } = useTheme();
  return (
    <div
      className="flex items-center gap-2 justify-between bg-white dark:bg-zinc-900 px-3 h-16 transition dark:hover:bg-zinc-800/70 rounded-md shadow-sm cursor-pointer"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <div className="flex items-center gap-2">
        <Moon />
        <h1>Dark mode</h1>
      </div>
      <Switch
        checked={theme === "dark"}
        onCheckedChange={() => setTheme(theme === "light" ? "dark" : "light")}
      />
    </div>
  );
};

export default MobileModeToggle;
