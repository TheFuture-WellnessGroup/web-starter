import { z } from "zod/v4";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { userRepository } from "./repository";
import { createUserSchema, updateUserSchema } from "./models";

export const userRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    return userRepository.findAll();
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      return userRepository.findById(input.id);
    }),

  create: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input }) => {
      return userRepository.create(input);
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: updateUserSchema,
      }),
    )
    .mutation(async ({ input }) => {
      return userRepository.update(input.id, input.data);
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      await userRepository.delete(input.id);
      return { success: true };
    }),
});
