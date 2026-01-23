import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { users, insertUserSchema } from "@/db/schema";

export const userRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(users);
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [user] = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, input.id));
      return user ?? null;
    }),

  create: publicProcedure
    .input(insertUserSchema.pick({ email: true, name: true }))
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db.insert(users).values(input).returning();
      return user;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: insertUserSchema.pick({ name: true, isActive: true }).partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db
        .update(users)
        .set({ ...input.data, updatedAt: new Date() })
        .where(eq(users.id, input.id))
        .returning();
      return user;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(users).where(eq(users.id, input.id));
      return { success: true };
    }),
});
