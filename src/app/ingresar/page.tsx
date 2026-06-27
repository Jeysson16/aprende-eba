import { SessionCodeForm } from "@/components/student/session-code-form";
import { SiteHeader } from "@/components/layout/site-header";

export default function IngresarPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10">
        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
            Acceso estudiante
          </p>
          <h1 className="mt-4 text-5xl text-white">
            Ingresa con el código de tu sesión de aprendizaje
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
            Completa el formulario y recibirás retroalimentación inmediata sobre lo que
            respondiste bien, lo que debes mejorar, una explicación breve y una
            recomendación de estudio.
          </p>
        </section>

        <SessionCodeForm />
      </main>
    </div>
  );
}
