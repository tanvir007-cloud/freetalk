import { auth } from "@/auth/auth";
import { db } from "@/lib/db";

const getCurrentUserId = async () => {
  const session = await auth();

  if (!session?.user?.email) return null;

  const currentUserId = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!currentUserId) return null;

  return currentUserId.id;
};

export default getCurrentUserId;
