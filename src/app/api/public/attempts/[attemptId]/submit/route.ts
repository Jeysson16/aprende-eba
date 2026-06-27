import { NextResponse } from "next/server";

import { getAttemptById } from "@/lib/data-store";

export async function POST(
  _request: Request,
  context: RouteContext<"/api/public/attempts/[attemptId]/submit">,
) {
  const { attemptId } = await context.params;
  const attempt = await getAttemptById(attemptId);

  if (!attempt) {
    return NextResponse.json({ message: "Intento no encontrado." }, { status: 404 });
  }

  return NextResponse.json({ attemptId: attempt.id, status: "submitted" });
}
