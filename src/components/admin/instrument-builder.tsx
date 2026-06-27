import type { AttemptRecord, Instrument } from "@/lib/types";

type InstrumentBuilderProps = {
  instrument: Instrument;
  attempts?: AttemptRecord[];
  showTemplateRows?: boolean;
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

function renderMark(mark: string | undefined, target: "si" | "no") {
  if (mark === target) {
    return <span className="text-base font-black text-cyan-300">✓</span>;
  }

  if (mark === "parcial") {
    return <span className="text-xs font-bold text-amber-300">~</span>;
  }

  return <span className="text-slate-600"> </span>;
}

export function InstrumentBuilder({
  instrument,
  attempts = [],
  showTemplateRows = true,
}: InstrumentBuilderProps) {
  const rows =
    attempts.length > 0
      ? attempts.map((attempt) => ({
          key: attempt.id,
          studentName: attempt.student.fullName,
          attempt,
        }))
      : showTemplateRows
        ? Array.from({ length: 5 }, (_, index) => ({
            key: `template-${index}`,
            studentName: "",
            attempt: undefined,
          }))
        : [];

  return (
    <section className="overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-slate-950/80 text-slate-100 shadow-[0_20px_60px_rgba(8,47,73,0.35)]">
      <div className="border-b border-cyan-400/20 bg-slate-900/95 px-6 py-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/75">
          Vista del instrumento para administradores
        </p>
        <h2 className="mt-2 text-2xl font-semibold uppercase tracking-[0.08em] text-white">
          Instrumento de evaluación
        </h2>
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-300">
          Lista de cotejos
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <tbody>
            <tr className="bg-cyan-400/10 font-semibold uppercase text-cyan-100">
              <th
                colSpan={2}
                className="border border-cyan-400/20 px-4 py-3 text-left text-sm tracking-[0.18em]"
              >
                Datos informativos
              </th>
            </tr>
            <tr>
              <td className="w-1/2 border border-cyan-400/15 px-4 py-3 align-top text-sm">
                <span className="font-semibold text-white">Profesora:</span> {instrument.teacher}
              </td>
              <td className="w-1/2 border border-cyan-400/15 px-4 py-3 align-top text-sm">
                <span className="font-semibold text-white">Fecha:</span> {formatInstrumentDate(instrument.date)}
              </td>
            </tr>
            <tr>
              <td className="border border-cyan-400/15 px-4 py-3 align-top text-sm">
                <span className="font-semibold text-white">Nivel:</span> {instrument.level.toLowerCase()}
              </td>
              <td className="border border-cyan-400/15 px-4 py-3 align-top text-sm">
                <span className="font-semibold text-white">Unidad:</span> {instrument.unit}
              </td>
            </tr>
            <tr>
              <td className="border border-cyan-400/15 px-4 py-3 align-top text-sm leading-6">
                <span className="font-semibold text-white">Sesión:</span> &quot;{instrument.sessionTitle}&quot;
              </td>
              <td className="border border-cyan-400/15 px-4 py-3 align-top text-sm">
                <span className="font-semibold text-white">Modalidad:</span> {instrument.modality.toUpperCase()}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="grid min-w-[1100px] grid-cols-[1.25fr_1.75fr]">
          <table className="border-collapse text-sm">
            <thead>
              <tr className="bg-cyan-400/10">
                <th
                  colSpan={2}
                  className="border border-cyan-400/20 px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] text-cyan-100"
                >
                  Propósitos de aprendizaje
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="w-32 border border-cyan-400/15 px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-200">
                  Propósito
                </th>
                <td className="border border-cyan-400/15 px-4 py-3 align-top text-sm leading-7 text-slate-200">
                  {instrument.purpose}
                </td>
              </tr>
              <tr>
                <th className="border border-cyan-400/15 px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-200">
                  Competencia
                </th>
                <td className="border border-cyan-400/15 px-4 py-3 align-top text-sm leading-7 text-slate-200">
                  {instrument.competence}
                </td>
              </tr>
              <tr>
                <th className="border border-cyan-400/15 px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-200">
                  Capacidad
                </th>
                <td className="border border-cyan-400/15 px-4 py-3 align-top text-sm text-slate-200">
                  <ul className="list-disc pl-5 leading-7">
                    {instrument.capacities.map((capacity) => (
                      <li key={capacity}>{capacity}</li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <th className="border border-cyan-400/15 px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-200">
                  Desempeño precisado
                </th>
                <td className="border border-cyan-400/15 px-4 py-3 align-top text-sm leading-7 text-slate-200">
                  {instrument.performance}
                </td>
              </tr>
            </tbody>
          </table>

          <table className="border-collapse text-sm">
            <thead>
              <tr className="bg-cyan-400/10">
                <th
                  colSpan={instrument.criteria.length}
                  className="border border-cyan-400/20 px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] text-cyan-100"
                >
                  Criterios de evaluación
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {instrument.criteria.map((criterion) => (
                  <td
                    key={criterion.id}
                    className="w-[14rem] border border-cyan-400/15 px-4 py-4 align-top text-sm leading-8 text-slate-200"
                  >
                    {criterion.description}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <table className="min-w-[1100px] border-collapse text-sm">
          <thead>
            <tr className="bg-slate-900">
              <th className="w-16 border border-cyan-400/20 px-3 py-3 text-center text-sm font-semibold text-white">N°</th>
              <th className="w-[28rem] border border-cyan-400/20 px-4 py-3 text-left text-lg font-semibold uppercase tracking-[0.05em] text-white">
                Nombres y apellidos
              </th>
              {instrument.criteria.map((criterion) => (
                <th
                  key={criterion.id}
                  colSpan={2}
                  className="border border-cyan-400/20 px-3 py-3 text-center text-[11px] font-semibold uppercase leading-5 tracking-[0.04em] text-slate-100"
                >
                  {criterion.title}
                </th>
              ))}
            </tr>
            <tr className="bg-cyan-400/10 text-xs font-semibold uppercase text-cyan-100">
              <th className="border border-cyan-400/15 px-3 py-2" />
              <th className="border border-cyan-400/15 px-3 py-2" />
              {instrument.criteria.flatMap((criterion) => [
                <th
                  key={`${criterion.id}-si`}
                  className="w-14 border border-cyan-400/15 px-2 py-2 text-center"
                >
                  Si
                </th>,
                <th
                  key={`${criterion.id}-no`}
                  className="w-14 border border-cyan-400/15 px-2 py-2 text-center"
                >
                  No
                </th>,
              ])}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.key} className="bg-slate-950/70">
                <td className="border border-cyan-400/15 px-3 py-3 text-sm font-semibold text-slate-200">
                  {index + 1}.
                </td>
                <td className="border border-cyan-400/15 px-4 py-3 text-sm font-medium uppercase tracking-[0.02em] text-slate-100">
                  {row.studentName || " "}
                </td>
                {instrument.criteria.flatMap((criterion) => [
                  <td
                    key={`${criterion.id}-row-${index}-si`}
                    className="border border-cyan-400/15 px-3 py-3 text-center"
                  >
                    {renderMark(getCriterionMark(instrument, row.attempt, criterion.id), "si")}
                  </td>,
                  <td
                    key={`${criterion.id}-row-${index}-no`}
                    className="border border-cyan-400/15 px-3 py-3 text-center"
                  >
                    {renderMark(getCriterionMark(instrument, row.attempt, criterion.id), "no")}
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
