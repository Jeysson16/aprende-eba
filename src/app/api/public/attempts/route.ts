import { NextResponse } from "next/server";

import { createStudentAttempt, listAttempts } from "@/lib/data-store";
import { studentAttemptSchema } from "@/lib/validators/attempt";

export async function GET() {
  const attempts = await listAttempts();
  return NextResponse.json({ attempts });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = studentAttemptSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Completa los datos del estudiante y todas las respuestas necesarias." },
      { status: 400 },
    );
  }

  try {
    const attempt = await createStudentAttempt(parsed.data);
    return NextResponse.json({
      attemptId: attempt.id,
      percentage: attempt.percentage,
      attempt,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "No se pudo registrar el intento.",
      },
      { status: 400 },
    );
  }
}
