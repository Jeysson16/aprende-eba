import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/layout/site-header";
import { AttemptForm } from "@/components/student/attempt-form";
import { getSessionDetails } from "@/lib/data-store";

export default async function SessionPage(props: PageProps<"/sesion/[code]">) {
  const { code } = await props.params;
  const details = getSessionDetails(code);

  if (!details) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
            {details.session.code}
          </p>
          <h1 className="mt-4 text-5xl text-white">{details.instrument.sessionTitle}</h1>
          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300">
            {details.instrument.purpose}
          </p>
        </section>

        <AttemptForm instrument={details.instrument} sessionCode={details.session.code} />
      </main>
    </div>
  );
}
