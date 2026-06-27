import type { Instrument } from "@/lib/types";

type InstrumentBuilderProps = {
  instrument: Instrument;
  studentNames?: string[];
};

function formatInstrumentDate(value: string) {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) {
    return value;
  }

  return `${day}-${month}-${year.slice(-2)}`;
}

export function InstrumentBuilder({ instrument, studentNames = [] }: InstrumentBuilderProps) {
  const rows = Array.from(
    { length: Math.max(10, studentNames.length) },
    (_, index) => studentNames[index] ?? "",
  );

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#8d725d] bg-[#ead7c7] text-[#1d140e] shadow-[0_20px_60px_rgba(15,23,42,0.22)]">
      <div className="border-b border-[#8d725d] bg-[#dfbea6] px-6 py-5 text-center">
        <p className="text-sm font-semibold tracking-[0.25em] text-[#5c4332]">
          Vista del instrumento para administradores
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase tracking-wide">
          Instrumento de evaluación
        </h2>
        <p className="text-lg font-bold uppercase">Lista de cotejos</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <tbody>
            <tr className="bg-[#efe3bf] font-bold uppercase">
              <th
                colSpan={2}
                className="border border-[#8d725d] px-4 py-2 text-left text-[0.95rem]"
              >
                Datos informativos
              </th>
            </tr>
            <tr>
              <td className="w-1/2 border border-[#8d725d] px-4 py-2 align-top">
                <span className="font-bold">Profesora:</span> {instrument.teacher}
              </td>
              <td className="w-1/2 border border-[#8d725d] px-4 py-2 align-top">
                <span className="font-bold">Fecha:</span> {formatInstrumentDate(instrument.date)}
              </td>
            </tr>
            <tr>
              <td className="border border-[#8d725d] px-4 py-2 align-top">
                <span className="font-bold">Nivel:</span> {instrument.level.toLowerCase()}
              </td>
              <td className="border border-[#8d725d] px-4 py-2 align-top">
                <span className="font-bold">Unidad:</span> {instrument.unit}
              </td>
            </tr>
            <tr>
              <td className="border border-[#8d725d] px-4 py-2 align-top">
                <span className="font-bold">Sesión:</span> &quot;{instrument.sessionTitle}&quot;
              </td>
              <td className="border border-[#8d725d] px-4 py-2 align-top">
                <span className="font-bold">Modalidad:</span> {instrument.modality.toUpperCase()}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="grid min-w-[1100px] grid-cols-[1.25fr_1.75fr]">
          <table className="border-collapse text-sm">
            <thead>
              <tr className="bg-[#dfbea6]">
                <th
                  colSpan={2}
                  className="border border-[#8d725d] px-4 py-2 text-center font-bold uppercase"
                >
                  Propósitos de aprendizaje
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="w-28 border border-[#8d725d] px-3 py-3 text-left text-xs font-bold">
                  Propósito
                </th>
                <td className="border border-[#8d725d] px-3 py-3 align-top leading-6">
                  {instrument.purpose}
                </td>
              </tr>
              <tr>
                <th className="border border-[#8d725d] px-3 py-3 text-left text-xs font-bold">
                  Competencia
                </th>
                <td className="border border-[#8d725d] px-3 py-3 align-top leading-6">
                  {instrument.competence}
                </td>
              </tr>
              <tr>
                <th className="border border-[#8d725d] px-3 py-3 text-left text-xs font-bold">
                  Capacidad
                </th>
                <td className="border border-[#8d725d] px-3 py-3 align-top">
                  <ul className="list-disc pl-5 leading-6">
                    {instrument.capacities.map((capacity) => (
                      <li key={capacity}>{capacity}</li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <th className="border border-[#8d725d] px-3 py-3 text-left text-xs font-bold">
                  Desempeño precisado
                </th>
                <td className="border border-[#8d725d] px-3 py-3 align-top leading-6">
                  {instrument.performance}
                </td>
              </tr>
            </tbody>
          </table>

          <table className="border-collapse text-sm">
            <thead>
              <tr className="bg-[#dfbea6]">
                <th
                  colSpan={instrument.criteria.length}
                  className="border border-[#8d725d] px-4 py-2 text-center font-bold uppercase"
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
                    className="w-[14rem] border border-[#8d725d] px-4 py-4 align-top text-[0.95rem] leading-7"
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
            <tr className="bg-[#f0d9c7]">
              <th className="w-16 border border-[#8d725d] px-3 py-3 text-center font-bold">N°</th>
              <th className="w-[28rem] border border-[#8d725d] px-4 py-3 text-left text-xl font-black uppercase">
                Nombres y apellidos
              </th>
              {instrument.criteria.map((criterion) => (
                <th
                  key={criterion.id}
                  colSpan={2}
                  className="border border-[#8d725d] px-3 py-3 text-center text-xs font-bold uppercase"
                >
                  {criterion.title}
                </th>
              ))}
            </tr>
            <tr className="bg-[#efe3bf] text-xs font-bold uppercase">
              <th className="border border-[#8d725d] px-3 py-2" />
              <th className="border border-[#8d725d] px-3 py-2" />
              {instrument.criteria.flatMap((criterion) => [
                <th
                  key={`${criterion.id}-si`}
                  className="w-14 border border-[#8d725d] px-2 py-2 text-center"
                >
                  Si
                </th>,
                <th
                  key={`${criterion.id}-no`}
                  className="w-14 border border-[#8d725d] px-2 py-2 text-center"
                >
                  No
                </th>,
              ])}
            </tr>
          </thead>
          <tbody>
            {rows.map((studentName, index) => (
              <tr key={`${studentName}-${index}`} className="bg-[#f7efe7]">
                <td className="border border-[#8d725d] px-3 py-3 font-bold">{index + 1}.</td>
                <td className="border border-[#8d725d] px-4 py-3 uppercase">
                  {studentName || " "}
                </td>
                {instrument.criteria.flatMap((criterion) => [
                  <td
                    key={`${criterion.id}-row-${index}-si`}
                    className="border border-[#8d725d] px-3 py-3 text-center"
                  >
                    &nbsp;
                  </td>,
                  <td
                    key={`${criterion.id}-row-${index}-no`}
                    className="border border-[#8d725d] px-3 py-3 text-center"
                  >
                    &nbsp;
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
