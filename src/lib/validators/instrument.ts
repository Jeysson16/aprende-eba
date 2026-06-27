import { z } from "zod";

export const instrumentSchema = z.object({
  title: z.string().min(3),
  sessionTitle: z.string().min(3),
  purpose: z.string().min(10),
});
