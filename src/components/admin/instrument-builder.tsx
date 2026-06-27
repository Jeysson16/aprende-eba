import type { AttemptRecord, Instrument } from "@/lib/types";

type InstrumentVariant = "web" | "export";

type InstrumentBuilderProps = {
  instrument: Instrument;
  attempts?: AttemptRecord[];
  showTemplateRows?: boolean;
  minimumRows?: number;
  variant?: InstrumentVariant;
};

function formatInstrumentDate(value: string) {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) {
    return value;
  }

  return `${day}-${month}-${year.slice(-2)}`;
}

function getCriterionMark(
  instrument: Instrument,
  attempt: AttemptRecord | undefined,
  criterionId: string,
) {
  if (!attempt) {
    return undefined;
  }

  const sourceQuestion = instrument.questions.find(
    (question) => question.criterionId === criterionId && question.type === "single",
  );

  if (!sourceQuestion) {
    return undefined;
  }

  const value = attempt.answers[sourceQuestion.id];
  if (value === "si" || value === "no" || value === "parcial") {
    return value;
  }

  return undefined;
}

function renderMark(
  mark: string | undefined,
  target: "si" | "no",
  variant: InstrumentVariant,
) {
  if (mark === target) {
    return (
      <span
        className={
          variant === "export"
            ? "text-sm font-black text-black"
            : "inline-flex h-6 w-6 items-center justify-center text-base font-black text-cyan-300"
        }
      >
        X
      </span>
    );
  }

  if (mark === "parcial" && target === "si") {
    return (
      <span
        className={
          variant === "export"
            ? "text-xs font-bold text-black"
            : "inline-flex h-6 w-6 items-center justify-center text-xs font-bold text-amber-300"
        }
      >
        /
      </span>
    );
  }

  return <span className={variant === "export" ? "text-black/40" : "text-slate-600"}> </span>;
}

export function InstrumentBuilder({
  instrument,
  attempts = [],
  showTemplateRows = true,
  minimumRows = 0,
  variant = "web",
}: InstrumentBuilderProps) {
  const defaultRows = variant === "export" ? 8 : 5;
  const rowCount =
    attempts.length > 0
      ? Math.max(minimumRows, attempts.length)
      : showTemplateRows
        ? Math.max(minimumRows, defaultRows)
        : 0;

  const rows = Array.from({ length: rowCount }, (_, index) => {
    const attempt = attempts[index];

    return {
      key: attempt?.id ?? `template-${index}`,
      studentName: attempt?.student.fullName ?? "",
      attempt,
    };
  });

  const isExport = variant === "export";

  const palette = isExport
    ? {
        section:
          "overflow-hidden rounded-none border border-[#000000] bg-[#f3e3d5] text-[#111111] shadow-none",
        header: "border-b border-[#000000] bg-[#e5bea1] px-6 py-4 text-center",
        adminLabel: "hidden",
        title: "text-xl font-black uppercase tracking-wide text-black",
        subtitle: "text-base font-black uppercase text-black",
        infoRow: "bg-[#efe0d2] font-bold uppercase text-black",
        infoBorder: "border border-[#000000]",
        softBorder: "border border-[#000000]",
        sectionTitle: "border border-[#000000] px-4 py-1 text-center text-sm font-black uppercase text-black",
        sectionTitleBg: "bg-[#e5bea1]",
        leftLabel:
          "w-32 border border-[#000000] px-2 py-2 text-left text-[10px] font-black tracking-normal text-black",
        leftCell: "border border-[#000000] px-3 py-2 align-top text-sm leading-6 text-black",
        criteriaCell: "w-[14rem] border border-[#000000] px-3 py-3 align-top text-sm leading-8 text-black",
        bottomHeader: "bg-[#ead7c7]",
        bottomHeaderCell:
          "border border-[#000000] px-3 py-2 text-center text-[11px] font-black uppercase leading-4 text-black",
        studentHeader:
          "w-[28rem] border border-[#000000] px-4 py-2 text-left text-[0.95rem] font-black uppercase text-black",
        numberHeader:
          "w-16 border border-[#000000] px-3 py-2 text-center text-[0.95rem] font-black text-black",
        yesNoRow: "bg-[#efe3bf] text-[11px] font-black uppercase text-black",
        yesNoCell: "w-14 border border-[#000000] px-2 py-2 text-center",
        bodyRow: "bg-[#f7f3ef]",
        numberCell: "border border-[#000000] px-2 py-2 text-sm font-black text-black",
        studentCell: "border border-[#000000] px-3 py-2 text-xs uppercase text-black",
        markCell: "border border-[#000000] px-2 py-2 text-center",
      }
    : {
        section:
          "overflow-hidden rounded-[2rem] border border-cyan-400/25 bg-[#010b1d] text-slate-100 shadow-[0_20px_60px_rgba(8,47,73,0.35)]",
        header: "border-b border-cyan-400/20 bg-[#02142a] px-6 py-5 text-center",
        adminLabel: "text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/75",
        title: "mt-2 text-2xl font-semibold uppercase tracking-[0.08em] text-white",
        subtitle: "text-sm font-medium uppercase tracking-[0.28em] text-slate-300",
        infoRow: "bg-[#03233f] font-semibold uppercase text-cyan-50",
        infoBorder: "border border-cyan-500/30",
        softBorder: "border border-cyan-500/25",
        sectionTitle:
          "border border-cyan-500/30 px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] text-cyan-50",
        sectionTitleBg: "bg-[#03233f]",
        leftLabel:
          "w-28 border border-cyan-500/25 px-3 py-3 text-left text-[0.78rem] font-semibold uppercase tracking-[0.06em] text-slate-100",
        leftCell: "border border-cyan-500/25 px-4 py-3 align-top text-sm leading-8 text-slate-100",
        criteriaCell: "w-[10rem] border border-cyan-500/25 px-3 py-4 align-top text-sm leading-8 text-slate-100",
        bottomHeader: "bg-[#071a36]",
        bottomHeaderCell:
          "border border-cyan-500/30 px-2 py-3 text-center text-[10px] font-semibold uppercase leading-5 tracking-[0.04em] text-slate-100",
        studentHeader:
          "w-[22rem] border border-cyan-500/30 px-4 py-3 text-left text-[1rem] font-semibold uppercase tracking-[0.05em] text-white",
        numberHeader:
          "w-16 border border-cyan-500/30 px-3 py-3 text-center text-sm font-semibold text-white",
        yesNoRow: "bg-[#082241] text-[11px] font-semibold uppercase text-cyan-50",
        yesNoCell: "w-12 border border-cyan-500/25 px-2 py-2 text-center",
        bodyRow: "bg-[#010b1d]",
        numberCell: "border border-cyan-500/25 px-3 py-2 text-sm font-semibold text-slate-100",
        studentCell:
          "border border-cyan-500/25 px-4 py-2 text-sm font-medium uppercase tracking-[0.02em] text-slate-100",
        markCell: "border border-cyan-500/25 px-2 py-2 text-center align-middle",
      };

  return (
    <section className={palette.section}>
      {isExport ? (
        <div className={palette.header}>
          <h2 className={palette.title}>Instrumento de evaluación</h2>
          <p className={palette.subtitle}>Lista de cotejos</p>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <tbody>
            <tr className={palette.infoRow}>
              <th colSpan={2} className={`${palette.infoBorder} px-4 py-3 text-left text-sm tracking-[0.18em]`}>
                Datos informativos
              </th>
            </tr>
            <tr>
              <td className={`${palette.softBorder} w-1/2 px-4 py-3 align-top text-sm`}>
                <span className={isExport ? "font-black" : "font-semibold text-white"}>Profesora:</span>{" "}
                {instrument.teacher}
              </td>
              <td className={`${palette.softBorder} w-1/2 px-4 py-3 align-top text-sm`}>
                <span className={isExport ? "font-black" : "font-semibold text-white"}>Fecha:</span>{" "}
                {formatInstrumentDate(instrument.date)}
              </td>
            </tr>
            <tr>
              <td className={`${palette.softBorder} px-4 py-3 align-top text-sm`}>
                <span className={isExport ? "font-black" : "font-semibold text-white"}>Nivel:</span>{" "}
                {instrument.level.toLowerCase()}
              </td>
              <td className={`${palette.softBorder} px-4 py-3 align-top text-sm`}>
                <span className={isExport ? "font-black" : "font-semibold text-white"}>Unidad:</span>{" "}
                {instrument.unit}
              </td>
            </tr>
            <tr>
              <td className={`${palette.softBorder} px-4 py-3 align-top text-sm leading-6`}>
                <span className={isExport ? "font-black" : "font-semibold text-white"}>Sesión:</span>{" "}
                &quot;{instrument.sessionTitle}&quot;
              </td>
              <td className={`${palette.softBorder} px-4 py-3 align-top text-sm`}>
                <span className={isExport ? "font-black" : "font-semibold text-white"}>Modalidad:</span>{" "}
                {instrument.modality.toUpperCase()}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="min-w-[980px]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className={palette.sectionTitleBg}>
                <th colSpan={2} className={palette.sectionTitle}>
                  Propósitos de aprendizaje
                </th>
                <th colSpan={instrument.criteria.length * 2} className={palette.sectionTitle}>
                  Criterios de evaluación
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className={palette.leftLabel}>Propósito</th>
                <td className={palette.leftCell}>{instrument.purpose}</td>
                {instrument.criteria.map((criterion) => (
                  <td key={criterion.id} colSpan={2} rowSpan={4} className={palette.criteriaCell}>
                    {criterion.description}
                  </td>
                ))}
              </tr>
              <tr>
                <th className={palette.leftLabel}>Competencia</th>
                <td className={palette.leftCell}>{instrument.competence}</td>
              </tr>
              <tr>
                <th className={palette.leftLabel}>Capacidad</th>
                <td className={`${palette.leftCell} ${isExport ? "text-[13px]" : ""}`}>
                  <ul className={isExport ? "list-disc pl-5 leading-6" : "list-disc pl-5 leading-7"}>
                    {instrument.capacities.map((capacity) => (
                      <li key={capacity}>{capacity}</li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <th className={palette.leftLabel}>Desempeño precisado</th>
                <td className={palette.leftCell}>{instrument.performance}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <table className="min-w-[980px] border-collapse text-sm">
          <thead>
            <tr className={palette.yesNoRow}>
              <th className={palette.numberHeader}>N°</th>
              <th className={palette.studentHeader}>Nombres y apellidos</th>
              {instrument.criteria.flatMap((criterion) => [
                <th key={`${criterion.id}-si`} className={palette.yesNoCell}>
                  Si
                </th>,
                <th key={`${criterion.id}-no`} className={palette.yesNoCell}>
                  No
                </th>,
              ])}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.key} className={palette.bodyRow}>
                <td className={palette.numberCell}>{index + 1}.</td>
                <td className={palette.studentCell}>{row.studentName || " "}</td>
                {instrument.criteria.flatMap((criterion) => [
                  <td key={`${criterion.id}-row-${index}-si`} className={palette.markCell}>
                    {renderMark(getCriterionMark(instrument, row.attempt, criterion.id), "si", variant)}
                  </td>,
                  <td key={`${criterion.id}-row-${index}-no`} className={palette.markCell}>
                    {renderMark(getCriterionMark(instrument, row.attempt, criterion.id), "no", variant)}
                  </td>,
                ])}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
