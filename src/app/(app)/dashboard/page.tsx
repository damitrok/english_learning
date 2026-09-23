const STATS = [
  { label: "Текущий стрик", value: "0", unit: "дней" },
  { label: "Слов выучено", value: "0", unit: "слов" },
  { label: "Время на этой неделе", value: "0", unit: "минут" },
] as const;

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 py-4">
      <div>
        <p className="text-eyebrow font-medium uppercase text-ash">Прогресс</p>
        <h1 className="mt-2 text-heading font-normal text-pure-white">Дашборд</h1>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-cards border border-border-hairline bg-ink p-6 shadow-key"
          >
            <p className="text-body text-ash">{stat.label}</p>
            <p className="mt-2 text-heading-sm font-medium text-pure-white">
              {stat.value}{" "}
              <span className="text-body font-normal text-smoke">{stat.unit}</span>
            </p>
          </div>
        ))}
      </div>
      <p className="text-body text-smoke">
        Появится после того, как заработает учёт сессий (Фаза 1-4 плана).
      </p>
    </div>
  );
}
