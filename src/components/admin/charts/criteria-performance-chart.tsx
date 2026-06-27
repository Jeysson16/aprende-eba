type CriteriaPerformanceChartProps = {
  items: Array<{ title: string; percentage: number }>;
};

export function CriteriaPerformanceChart({ items }: CriteriaPerformanceChartProps) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <p className="text-sm text-cyan-200">Desempeño por criterio</p>
      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <div key={item.title}>
            <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
              <span>{item.title}</span>
              <span>{item.percentage}%</span>
            </div>
            <div className="h-3 rounded-full bg-white/10">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
