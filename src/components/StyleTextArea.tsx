"use client";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

const StyleTextArea = ({
  value: input,
  disabled,
  onChange,
  className,
  placeholder,
  open,
}: {
  value: string;
  disabled?: boolean;
  onChange: Dispatch<SetStateAction<string>>;
  className?: string;
  placeholder?: string;
  open?: boolean;
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textArea =
      textAreaRef.current ?? document.getElementById("title-input");

    if (textArea) {
      textArea.style.height = "0px";
      const scrollHeight = textArea.scrollHeight;
      textArea.style.height = scrollHeight + "px";
    }
  }, [textAreaRef, input, open]);

  useEffect(() => {
    if (open) {
      textAreaRef.current?.focus();
    }
  }, [open]);

  return (
    <textarea
      disabled={disabled || false}
      id="title-input"
      ref={textAreaRef}
      placeholder={placeholder}
      className={`w-full rounded-lg resize-none bg-transparent outline-hidden appearance-none overflow-hidden ${className}`}
      value={input}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default StyleTextArea;
