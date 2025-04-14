import { cn } from "@/lib/utils";
import React from "react";

const Loader = ({ className }: { className: string }) => {
  return (
    <div className="flex space-x-2 justify-center items-center">
      <div
        className={cn(
          "bg-black rounded-full animate-bounce [animation-delay:-0.3s]",className
        )}
      />
      <div
        className={cn(
          "bg-black rounded-full animate-bounce [animation-delay:-0.15s]",className
        )}
      />
      <div className={cn("bg-black rounded-full animate-bounce",className)} />
    </div>
  );
};

export default Loader;
