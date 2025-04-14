"use client";
import React, { useState } from "react";

const formatText = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) =>
    urlRegex.test(part) ? (
      <a
        key={index}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-500 hover:underline transition"
      >
        {part}
      </a>
    ) : (
      <span key={index}> {part} </span>
    )
  );
};

const Trim = ({
  text,
  length = 100,
  className,
  moreClassName,
}: {
  text: string;
  length?: number;
  className?: string;
  moreClassName?: string;
}) => {
  const [more, setMore] = useState(false);

  const shouldShowMore = text.length > length;
  const trimmedText = shouldShowMore
    ? text.substring(0, length).trimEnd()
    : text;

  return (
    <span className={`text-wrap text-sm`}>
      <span className={`${className}`}>
        {more ? formatText(text) : formatText(trimmedText)}
        {shouldShowMore && (
          <span
            className={`text-zinc-500 text-sm cursor-pointer ${moreClassName}`}
            onClick={() => setMore(!more)}
          >
            {more ? " ...less" : " ...more"}
          </span>
        )}
      </span>
    </span>
  );
};

export default Trim;
