interface StepCardProps {
  step: number;
  strand: string;
  minutes: number;
  description: string;
}

export function StepCard({ step, strand, minutes, description }: StepCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-cards border border-border-hairline bg-ink p-6 shadow-key">
      <div className="flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-icon-container bg-obsidian text-body font-medium text-mist">
          {step}
        </span>
        <span className="rounded-badges bg-graphite px-2 py-1 font-mono text-[12px] text-ash">
          {minutes} мин
        </span>
      </div>
      <div>
        <h3 className="text-subheading font-medium text-pure-white">{strand}</h3>
        <p className="mt-1 text-body text-ash">{description}</p>
      </div>
      <button
        disabled
        title="Появится в следующих фазах разработки"
        className="mt-auto self-start rounded-buttons bg-mist px-3 py-2 text-body font-medium text-iron opacity-40"
      >
        Начать
      </button>
    </div>
  );
}
