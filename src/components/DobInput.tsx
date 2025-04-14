"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const DobInput = ({
  onChange,
  value,
}: {
  onChange: (...event: any[]) => void;
  value: string;
}) => {
  const [dob, setDob] = useState({
    day: "",
    month: "",
    year: "",
  });

  const days = Array.from({ length: 31 }, (_, i) => `${i + 1}`);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from(
    { length: 100 },
    (_, i) => `${new Date().getFullYear() - i}`
  );

  useEffect(() => {
    if (dob.day && dob.month && dob.year) {
      onChange(`${dob.day} ${dob.month} ${dob.year}`);
    }
  }, [dob,onChange]);

  const splitValue = value.split(" ");

  useEffect(() => {
    setDob({
      day: splitValue[0],
      month: splitValue[1],
      year: splitValue[2],
    });
  }, [value,splitValue]);

  return (
    <div className="flex items-center gap-4">
      {/* Month Dropdown */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            {dob.day || "Day"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-80 overflow-y-auto scrollbar-none">
          {days.map((day) => (
            <DropdownMenuItem
              className={cn(
                "flex justify-center w-full",
                dob.day === day && "dark:bg-zinc-800 bg-zinc-100"
              )}
              key={day}
              onSelect={() =>
                setDob({
                  ...dob,
                  day: day,
                })
              }
            >
              {day}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Month Dropdown */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            {dob.month || "Month"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-80 overflow-y-auto scrollbar-none">
          {months.map((month) => (
            <DropdownMenuItem
              className={cn(
                dob.month === month && "dark:bg-zinc-800 bg-zinc-100"
              )}
              key={month}
              onSelect={() =>
                setDob({
                  ...dob,
                  month: month,
                })
              }
            >
              {month}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Year Dropdown */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full">
            {dob.year || "Year"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-80 overflow-y-auto scrollbar-none">
          {years.map((year) => (
            <DropdownMenuItem
              className={cn(
                "flex justify-center w-full",
                dob.year === year && "dark:bg-zinc-800 bg-zinc-100"
              )}
              key={year}
              onSelect={() =>
                setDob({
                  ...dob,
                  year: year,
                })
              }
            >
              {year}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DobInput;
