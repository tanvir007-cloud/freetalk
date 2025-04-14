import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import Link from "next/link";
import React from "react";

const Birthdays = () => {
  return (
    <div className="p-4 bg-white dark:bg-zinc-900 rounded-md shadow-md flex flex-col gap-4">
      <div className="flex items-center justify-between font-medium">
        <span className="text-zinc-500 dark:text-zinc-400">Birthdays</span>
        <Button variant={"outline"} size={"sm"}>
          Celebrate
        </Button>
      </div>
      <div className="p-4 rounded-lg flex items-center gap-4 bg-zinc-200 dark:bg-zinc-800">
        <Gift size={40}/>
        <Link href={"/"} className="flex flex-col gap-1 text-sm">
        <span className="text-zinc-700 dark:text-zinc-300 font-semibold">Upcoming Birthdays</span>
        <span className="text-sm text-zinc-500">See other 16 have upcoming birthdays</span>
        </Link>
      </div>
    </div>
  );
};

export default Birthdays;
