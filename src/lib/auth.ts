import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

import { env, hasSupabaseAuth } from "@/lib/env";

const COOKIE_NAME = "admin_session";

function secret() {
  return env.ADMIN_SECRET ?? "demo-secret-for-local-use";
}

function createToken(email: string) {
  const payload = `${email}|${new Date().toISOString().slice(0, 10)}`;
  const signature = createHmac("sha256", secret()).update(payload).digest("hex");
  return Buffer.from(`${payload}|${signature}`).toString("base64url");
}

function validateToken(token: string) {
  const decoded = Buffer.from(token, "base64url").toString("utf8");
  const [email, day, signature] = decoded.split("|");
  if (!email || !day || !signature) return false;

  const expected = createHmac("sha256", secret()).update(`${email}|${day}`).digest("hex");
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function signInAdmin(email: string, password: string) {
  if (hasSupabaseAuth()) {
    const supabase = createClient(
      env.NEXT_PUBLIC_SUPABASE_URL as string,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      const cookieStore = await cookies();
      cookieStore.set(COOKIE_NAME, createToken(email), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
      });

      return { success: true, message: "Ingreso correcto con Supabase Auth." };
    }
  }

  const validEmail = env.ADMIN_EMAIL ?? "docente@ceba.edu.pe";
  const validPassword = env.ADMIN_PASSWORD ?? "Docente123";

  if (email !== validEmail || password !== validPassword) {
    return { success: false, message: "Credenciales incorrectas." };
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return { success: true, message: "Ingreso correcto." };
}

export async function signOutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return token ? validateToken(token) : false;
}

export async function requireAdmin() {
  const isAuthenticated = await isAdminAuthenticated();
  if (!isAuthenticated) {
    redirect("/admin/login");
  }
}
