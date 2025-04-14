"use client";
import { useZustandStore } from "@/hooks/use-zustand-store";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
} from "react";

const SearchBox = ({
  className,
  setSearchKeyword,
}: {
  className?: string;
  setSearchKeyword?: Dispatch<SetStateAction<string>>;
  searchKeyword?: boolean;
}) => {
  const { setOpen, open } = useZustandStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  return (
    <Fragment>
      <input
        autoComplete="off"
        ref={inputRef}
        type="text"
        className={cn(
          "outline-hidden rounded-full pr-3 pl-8 py-2 dark:bg-zinc-800 bg-zinc-100",
          className
        )}
        placeholder="Search Facebook"
        onFocus={() => setOpen(true)}
        onChange={(e) =>
          setSearchKeyword !== undefined && setSearchKeyword(e.target.value)
        }
      />
      <Search className="absolute left-2 pointer-events-none" size={20} />
    </Fragment>
  );
};

export default SearchBox;
