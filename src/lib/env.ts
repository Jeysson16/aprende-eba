import { z } from "zod";

const optionalString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().optional(),
);

const optionalUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().url().optional(),
);

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalString,
  SUPABASE_SERVICE_ROLE_KEY: optionalString,
  GEMINI_API_KEY: optionalString,
  APP_URL: optionalUrl,
  ADMIN_EMAIL: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().email().optional(),
  ),
  ADMIN_PASSWORD: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().min(6).optional(),
  ),
  ADMIN_SECRET: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().min(12).optional(),
  ),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  APP_URL: process.env.APP_URL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  ADMIN_SECRET: process.env.ADMIN_SECRET,
});

export function hasSupabase() {
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL &&
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function hasSupabaseAuth() {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
