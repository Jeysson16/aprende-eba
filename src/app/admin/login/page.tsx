import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { SiteHeader } from "@/components/layout/site-header";
import { isAdminAuthenticated, signInAdmin } from "@/lib/auth";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const isAuthenticated = await isAdminAuthenticated();
  if (isAuthenticated) {
    redirect("/admin");
  }

  const params = await searchParams;

  async function loginAction(formData: FormData) {
    "use server";

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const result = await signInAdmin(email, password);

    if (!result.success) {
      redirect(`/admin/login?error=${encodeURIComponent(result.message)}`);
    }

    redirect("/admin");
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-10">
        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
            Acceso docente
          </p>
          <h1 className="mt-4 text-5xl text-white">Panel de administradores</h1>
          <p className="mt-4 text-base leading-8 text-slate-300">
            Gestiona instrumentos, revisa respuestas de estudiantes y observa la
            retroalimentación generada por Gemini o por reglas locales de respaldo.
          </p>
        </section>

        <form action={loginAction}>
          <LoginForm error={params.error} />
        </form>
      </main>
    </div>
  );
}
