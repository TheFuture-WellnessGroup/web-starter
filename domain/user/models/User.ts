import { z } from "zod/v4";
import type { users } from "@/db/schema";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

// Drizzle 스키마에서 타입 추론
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// API 요청/응답용 스키마
export const createUserSchema = z.object({
  email: z.email(),
  name: z.string().min(1).max(255).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  isActive: z.boolean().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
