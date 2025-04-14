"use server";

import { signinSchema } from "@/lib/zodValidation";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const signin = async (values: z.infer<typeof signinSchema>) => {
  const validatedFields = signinSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalied credentials" };
  }

  const { email, name, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) return { error: "Email already in use!" };

  await db.user.create({
    data: {
      name,
      password: hashedPassword,
      email,
    },
  });

  return { success: "Account created successfully." };
};

export default signin;
