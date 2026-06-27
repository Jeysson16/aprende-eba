import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import { getDashboardStats, listAttempts } from "@/lib/data-store";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }

  const [stats, attempts] = await Promise.all([getDashboardStats(), listAttempts()]);
  return NextResponse.json({ stats, attempts });
}
