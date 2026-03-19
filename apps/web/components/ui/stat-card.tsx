export function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="card p-5">
      <p className="text-sm text-ink/60">{label}</p>
      <p className="mt-3 text-3xl font-bold">{value}</p>
      <p className="mt-2 text-sm text-ink/70">{hint}</p>
    </article>
  );
}
