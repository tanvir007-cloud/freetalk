import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";
import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";

interface usePostQueryProps {
  queryKey: string[];
  apiUrl: string;
  paramKey: string;
  paramValue: string;
  searchKey: string;
  searchValue: string;
  debounceTime?: number;
}

export const useSearchQuery = ({
  apiUrl,
  queryKey,
  paramKey,
  paramValue,
  searchKey,
  searchValue,
  debounceTime = 500,
}: usePostQueryProps) => {
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);

  const debouncedUpdate = useMemo(() => {
    const handler = debounce((value: string) => {
      setDebouncedSearch(value);
    }, debounceTime);

    return handler;
  }, [debounceTime]);

  useEffect(() => {
    debouncedUpdate(searchValue);
    return () => debouncedUpdate.cancel();
  }, [searchValue, debouncedUpdate]);

  const fetchData = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl({
      url: apiUrl,
      query: {
        cursor: pageParam,
        [paramKey]: paramValue,
        ...(searchKey && debouncedSearch
          ? { [searchKey]: debouncedSearch }
          : {}),
      },
    });

    const response = await fetch(url);
    if (!response.ok) throw new Error("Error fetching data");
    return response.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [...queryKey, debouncedSearch || ""],
      queryFn: fetchData,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      initialPageParam: undefined,
      enabled: !!debouncedSearch,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
