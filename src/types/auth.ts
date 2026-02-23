import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Min 6 characteres"),
});

export type LoginInput = z.infer<typeof loginSchema>;
