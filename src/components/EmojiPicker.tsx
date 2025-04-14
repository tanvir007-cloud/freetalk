"use client";

import React, { useState } from "react";
import { Smile } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { EmojiClickData } from "emoji-picker-react";
import dynamic from "next/dynamic";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <div className="w-[300px] h-[400px] flex items-center justify-center bg-white dark:bg-neutral-900 rounded-md shadow">
      <div className="animate-pulse text-gray-400 dark:text-gray-600 text-sm">
        Loading Emoji Picker...
      </div>
    </div>
  ),
});

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

const EmojiPickerButton = ({ onChange }: EmojiPickerProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const { resolvedTheme } = useTheme();

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onChange(emojiData.emoji);
    setShowPicker(false);
  };

  const theme: any = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <DropdownMenu open={showPicker} onOpenChange={setShowPicker}>
      <DropdownMenuTrigger className="outline-hidden">
        <Smile className="text-yellow-500 dark:text-yellow-400 hover:text-yellow-600 dark:hover:text-yellow-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="left"
        align="center"
        sideOffset={40}
        className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
      >
        <div className="z-50">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme={theme}
            width={300}
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EmojiPickerButton;
