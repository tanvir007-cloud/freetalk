import { auth } from "@/auth/auth";
import { db } from "@/lib/db";

const getCurrentUser = async () => {
  const session = await auth();

  if (!session?.user?.email) return null;

  const currentUser = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!currentUser) return null;

  return currentUser;
};

export default getCurrentUser;
