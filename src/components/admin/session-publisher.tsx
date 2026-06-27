import type { ReturnTypeOfListSessions } from "@/lib/view-models";

type SessionPublisherProps = {
  sessions: ReturnTypeOfListSessions;
};

export function SessionPublisher({ sessions }: SessionPublisherProps) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <p className="text-sm text-cyan-200">Sesiones publicadas</p>
      <div className="mt-4 space-y-4">
        {sessions.map((session) => (
          <article
            key={session.id}
            className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-white">{session.label}</p>
                <p className="text-sm text-slate-400">{session.instrument?.title}</p>
              </div>
              <span className="rounded-full bg-cyan-300 px-3 py-1 text-sm font-medium text-slate-950">
                {session.code}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
