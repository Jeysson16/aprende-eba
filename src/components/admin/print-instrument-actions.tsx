"use client";

import Link from "next/link";

type PrintInstrumentActionsProps = {
  backHref: string;
  xlsxHref: string;
};

export function PrintInstrumentActions({ backHref, xlsxHref }: PrintInstrumentActionsProps) {
  return (
    <div className="print:hidden flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-slate-300 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-600">
        Usa esta vista para imprimir, guardar en PDF o descargar el Excel con el formato académico del instrumento.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href={backHref}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
        >
          Volver
        </Link>
        <Link
          href={xlsxHref}
          className="rounded-full border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-700"
        >
          Descargar XLSX
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white"
        >
          Imprimir / Guardar PDF
        </button>
      </div>
    </div>
  );
}
