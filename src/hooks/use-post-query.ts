import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

interface usePostQueryProps {
  queryKey: string[];
  apiUrl: string;
  paramKey?: string;
  paramValue?: string;
}

export const usePostQuery = ({
  apiUrl,
  queryKey,
  paramKey,
  paramValue,
}: usePostQueryProps) => {
  const fetchPost = async ({ pageParam = undefined }) => {
    const queryObject: Record<string, any> = { cursor: pageParam };

    if (paramKey && paramValue) {
      queryObject[paramKey] = paramValue;
    }

    const url = qs.stringifyUrl({
      url: apiUrl,
      query: queryObject,
    });
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error fetching posts");
    return response.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status,refetch } =
    useInfiniteQuery({
      queryKey: queryKey,
      queryFn: fetchPost,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      initialPageParam: undefined,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch
  };
};
