"use server";

import { db } from "@/lib/db";

const getSearch = async (searchText: string, userId: string) => {
  if (!searchText) return { users: [] };

  const users = await db.user.findMany({
    where: {
      NOT: { id: userId },
      name: { contains: searchText, mode: "insensitive" },
    },
    orderBy: { name: "desc" },
    take: 40,
  });

  return { users };
};

export default getSearch;
