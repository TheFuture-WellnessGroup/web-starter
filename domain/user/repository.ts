import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import type { User, NewUser, UpdateUserInput } from "./models";

export const userRepository = {
  findAll: async (): Promise<User[]> => {
    return db.select().from(users);
  },

  findById: async (id: string): Promise<User | null> => {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user ?? null;
  },

  create: async (data: Pick<NewUser, "email" | "name">): Promise<User> => {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  },

  update: async (id: string, data: UpdateUserInput): Promise<User | null> => {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user ?? null;
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await db.delete(users).where(eq(users.id, id));
    return true;
  },
};
