import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import { getInstrumentDetails } from "@/lib/data-store";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/admin/instruments/[id]">,
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const instrument = getInstrumentDetails(id);

  if (!instrument) {
    return NextResponse.json({ message: "Instrumento no encontrado." }, { status: 404 });
  }

  return NextResponse.json({ instrument });
}
