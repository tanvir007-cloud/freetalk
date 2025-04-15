"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import SearchBox from "./SearchBox";
import Avatar from "../Avatar";
import { useZustandStore } from "@/hooks/use-zustand-store";
import { User } from "@prisma/client";
import getSearch from "@/app/actions/getSearch";
import { ScrollArea } from "../ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";

const SearchInput = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const { open, setOpen } = useZustandStore();
  const divRef = useRef<HTMLDivElement>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  const debounceSearch = useMemo(
    () =>
      debounce((val: string) => {
        setDebouncedKeyword(val);
      }, 500),
    []
  );

  useEffect(() => {
    debounceSearch(searchKeyword);
    return () => debounceSearch.cancel();
  }, [searchKeyword, debounceSearch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpen]);

  const { data, isLoading } = useQuery({
    queryKey: ["search-user", debouncedKeyword, userId],
    queryFn: async () => {
      const res = await getSearch(debouncedKeyword.trim(), userId);
      return res.users;
    },
    enabled: open && !!debouncedKeyword,
  });

  return (
    <Fragment>
      {open && (
        <div
          ref={divRef}
          className="fixed z-100 dark:bg-zinc-900 bg-white w-full p-3 sm:max-w-sm shadow-md rounded-lg rounded-t-none rounded-b-none sm:rounded-b-lg border border-t-0 dark:border-zinc-800 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between gap-x-4">
            <div
              className="hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full dark:text-zinc-300 text-zinc-700 p-1 transition cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <ArrowLeft />
            </div>
            <div className="relative flex items-center w-full">
              <SearchBox
                className="w-full"
                setSearchKeyword={setSearchKeyword}
              />
            </div>
          </div>

          <ScrollArea className="flex flex-col sm:max-h-[60vh] max-h-[calc(100vh-73.5px)] overflow-y-auto">
            <h1 className="text-2xl font-bold mb-1">Recent</h1>
            {isLoading ? (
              <div className="flex items-center justify-center w-full py-10">
                <Loader2 className="animate-spin" />
              </div>
            ) : data && data.length > 0 ? (
              data.map((user: User) => (
                <div
                  key={user.id}
                  className="flex items-center gap-x-3 px-2 transition hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md py-2 cursor-pointer"
                  onClick={() => {
                    router.push(`/profile/${user.id}`);
                    setOpen(false);
                  }}
                >
                  <Avatar src={user.image || ""} className="size-8" />
                  <h1 className="line-clamp-2">{user.name}</h1>
                </div>
              ))
            ) : (
              debouncedKeyword && (
                <div className="text-center text-zinc-500 py-5">
                  No search result found.
                </div>
              )
            )}
          </ScrollArea>
        </div>
      )}
    </Fragment>
  );
};

export default SearchInput;
