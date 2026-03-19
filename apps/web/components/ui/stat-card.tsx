export function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="card reveal-up relative overflow-hidden p-5">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-gold via-teal to-ink" />
      <p className="text-sm text-ink/55">{label}</p>
      <p className="mt-3 text-3xl font-extrabold tracking-tight text-ink">{value}</p>
      <p className="mt-3 text-sm leading-7 text-ink/72">{hint}</p>
    </article>
  );
}