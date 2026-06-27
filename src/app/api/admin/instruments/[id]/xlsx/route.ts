import { isAdminAuthenticated } from "@/lib/auth";
import { getInstrumentDetails, listAttempts } from "@/lib/data-store";
import { buildInstrumentWorkbook } from "@/lib/admin/instrument-xlsx";

export const runtime = "nodejs";

function safeFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(
  _request: Request,
  context: RouteContext<"/api/admin/instruments/[id]/xlsx">,
) {
  if (!(await isAdminAuthenticated())) {
    return new Response(JSON.stringify({ message: "No autorizado." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id } = await context.params;
  const instrument = getInstrumentDetails(id);

  if (!instrument) {
    return new Response(JSON.stringify({ message: "Instrumento no encontrado." }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const attempts = (await listAttempts()).filter((attempt) => attempt.instrumentId === instrument.id);
  const workbook = await buildInstrumentWorkbook(instrument, attempts.slice(0, 10));
  const buffer = await workbook.xlsx.writeBuffer();
  const fileName = `${safeFileName(instrument.title || instrument.id)}.xlsx`;

  return new Response(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
