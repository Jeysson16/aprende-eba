import { NextResponse } from "next/server";

import { getAttemptById } from "@/lib/data-store";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/public/feedback/[attemptId]">,
) {
  const { attemptId } = await context.params;
  const attempt = await getAttemptById(attemptId);

  if (!attempt) {
    return NextResponse.json({ message: "Retroalimentación no encontrada." }, { status: 404 });
  }

  return NextResponse.json(attempt);
}
