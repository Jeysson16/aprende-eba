import type { Instrument } from "@/lib/types";

type InstrumentBuilderProps = {
  instrument: Instrument;
};

export function InstrumentBuilder({ instrument }: InstrumentBuilderProps) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <p className="text-sm text-cyan-200">Vista del instrumento para administradores</p>
      <h2 className="mt-3 text-2xl font-semibold text-white">INSTRUMENTO DE EVALUACIÓN</h2>
      <p className="text-lg text-slate-300">LISTA DE COTEJOS</p>

      <div className="mt-6 grid gap-4 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5 md:grid-cols-2">
        <div className="space-y-2 text-sm text-slate-300">
          <p>
            <strong className="text-white">Profesora:</strong> {instrument.teacher}
          </p>
          <p>
            <strong className="text-white">Fecha:</strong> {instrument.date}
          </p>
          <p>
            <strong className="text-white">Nivel:</strong> {instrument.level}
          </p>
          <p>
            <strong className="text-white">Unidad:</strong> {instrument.unit}
          </p>
        </div>
        <div className="space-y-2 text-sm text-slate-300">
          <p>
            <strong className="text-white">Sesión:</strong> {instrument.sessionTitle}
          </p>
          <p>
            <strong className="text-white">Modalidad:</strong> {instrument.modality}
          </p>
          <p>
            <strong className="text-white">Propósito:</strong> {instrument.purpose}
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              <th className="px-4 py-4">N°</th>
              <th className="px-4 py-4">Criterio</th>
              <th className="px-4 py-4">SI</th>
              <th className="px-4 py-4">NO</th>
            </tr>
          </thead>
          <tbody>
            {instrument.criteria.map((criterion, index) => (
              <tr key={criterion.id} className="border-t border-white/5 text-slate-200">
                <td className="px-4 py-4">{index + 1}</td>
                <td className="px-4 py-4">{criterion.description}</td>
                <td className="px-4 py-4">□</td>
                <td className="px-4 py-4">□</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
