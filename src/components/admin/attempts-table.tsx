import Link from "next/link";

import { formatDate, titleCaseLevel } from "@/lib/utils";
import type { AttemptRecord } from "@/lib/types";

type AttemptsTableProps = {
  attempts: AttemptRecord[];
};

export function AttemptsTable({ attempts }: AttemptsTableProps) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-white/5 text-slate-300">
          <tr>
            <th className="px-4 py-4 font-medium">Estudiante</th>
            <th className="px-4 py-4 font-medium">Sesión</th>
            <th className="px-4 py-4 font-medium">Nivel</th>
            <th className="px-4 py-4 font-medium">Porcentaje</th>
            <th className="px-4 py-4 font-medium">Fecha</th>
            <th className="px-4 py-4 font-medium">Detalle</th>
          </tr>
        </thead>
        <tbody>
          {attempts.map((attempt) => (
            <tr key={attempt.id} className="border-t border-white/5 text-slate-200">
              <td className="px-4 py-4">{attempt.student.fullName}</td>
              <td className="px-4 py-4">{attempt.sessionCode}</td>
              <td className="px-4 py-4">{titleCaseLevel(attempt.level)}</td>
              <td className="px-4 py-4">{attempt.percentage}%</td>
              <td className="px-4 py-4">{formatDate(attempt.createdAt)}</td>
              <td className="px-4 py-4">
                <Link
                  href={`/admin/respuestas/${attempt.id}`}
                  className="text-cyan-200 transition hover:text-cyan-100"
                >
                  Ver detalle
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
