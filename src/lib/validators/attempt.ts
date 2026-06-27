import { z } from "zod";

export const studentAttemptSchema = z.object({
  sessionCode: z.string().min(3),
  student: z.object({
    fullName: z.string().min(3),
    section: z.string().optional(),
    consentAccepted: z.boolean().refine(Boolean, "Debes aceptar el uso académico."),
  }),
  answers: z.record(z.string(), z.string()),
});

export const sessionCodeSchema = z.object({
  code: z.string().min(3),
});
