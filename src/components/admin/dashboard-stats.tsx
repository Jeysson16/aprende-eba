type DashboardStatsProps = {
  stats: {
    totalAttempts: number;
    averagePercentage: number;
    activeSessions: number;
    weakestCriterion: string;
  };
};

export function DashboardStats({ stats }: DashboardStatsProps) {
  const items = [
    {
      label: "Respuestas registradas",
      value: String(stats.totalAttempts),
    },
    {
      label: "Promedio global",
      value: `${stats.averagePercentage}%`,
    },
    {
      label: "Sesiones activas",
      value: String(stats.activeSessions),
    },
    {
      label: "Criterio con más dificultad",
      value: stats.weakestCriterion,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5"
        >
          <p className="text-sm text-slate-400">{item.label}</p>
          <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
        </article>
      ))}
    </div>
  );
}
