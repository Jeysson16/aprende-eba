import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import { listSessions } from "@/lib/data-store";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/admin/sessions/[id]">,
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  const { id } = await context.params;
  const session = listSessions().find((item) => item.id === id);

  if (!session) {
    return NextResponse.json({ message: "Sesión no encontrada." }, { status: 404 });
  }

  return NextResponse.json({ session });
}
