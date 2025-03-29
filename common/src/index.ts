import z from "zod";

export const signUpSchema = z
  .object({
    name: z.string(),
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(6).max(16),
  })
  .strict();

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const loginSchema = z
  .object({
    username: z.string(),
    password: z.string().min(6).max(16),
  })
  .strict();

export type LoginSchema = z.infer<typeof loginSchema>;

export const createRoomSchema = z
  .object({
    name: z.string(),
    capacity: z.number(),
  })
  .strict();

export type CreateRoomSchema = z.infer<typeof createRoomSchema>;
