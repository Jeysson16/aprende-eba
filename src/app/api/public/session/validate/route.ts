import { NextResponse } from "next/server";

import { getSessionDetails } from "@/lib/data-store";
import { sessionCodeSchema } from "@/lib/validators/attempt";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = sessionCodeSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { valid: false, message: "Debes ingresar un código válido." },
      { status: 400 },
    );
  }

  const session = getSessionDetails(parsed.data.code);

  if (!session) {
    return NextResponse.json(
      { valid: false, message: "No existe una sesión activa con ese código." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    valid: true,
    sessionCode: session.session.code,
    instrumentTitle: session.instrument.title,
  });
}
