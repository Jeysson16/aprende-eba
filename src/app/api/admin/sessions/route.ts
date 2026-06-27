import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import { listSessions } from "@/lib/data-store";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  return NextResponse.json({ sessions: listSessions() });
}
