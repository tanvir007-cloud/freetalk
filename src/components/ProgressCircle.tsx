import React from "react";

const ProgressCircle = ({ progress }: { progress: number }) => {
  const strokeDashoffset = (1 - progress / 100) * 289;

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 100 100"
      className="transform rotate-[-90deg]"
    >
      {/* Background Circle */}
      <circle
        cx="50"
        cy="50"
        r="46"
        strokeWidth="8"
        fill="none"
        className="dark:stroke-zinc-300 stroke-zinc-700"
      />
      {/* Progress Circle */}
      <circle
        cx="50"
        cy="50"
        r="46"
        strokeWidth="8"
        fill="none"
        strokeDasharray="289"
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        className="text-red-500 transition-all duration-500 dark:stroke-blue-700 stroke-blue-400"
      />
    </svg>
  );
};

export default ProgressCircle;

