import { SiteHeader } from "@/components/layout/site-header";
import { ResultPageClient } from "@/components/student/result-page-client";

export default async function ResultPage(
  props: PageProps<"/sesion/[code]/resultado/[attemptId]">,
) {
  const { attemptId, code } = await props.params;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <ResultPageClient attemptId={attemptId} sessionCode={code} />
      </main>
    </div>
  );
}
