"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const SearchErrorHandler = () => {
  const searchParams = useSearchParams();

  const error =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return null;
};

export default SearchErrorHandler;
