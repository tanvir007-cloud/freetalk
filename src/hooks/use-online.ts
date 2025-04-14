import {
  InfiniteData,
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";

const UseOnline = (
  refetch?: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<InfiniteData<any, unknown>, Error>>
) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    const checkOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    checkOnlineStatus();

    const handleOnline = () => {
      setIsOnline(true);
      if (refetch !== undefined) refetch();
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [refetch]);

  return { isOnline };
};

export default UseOnline;
