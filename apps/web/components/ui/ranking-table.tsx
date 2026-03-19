import Link from "next/link";

type Row = {
  id: string;
  name: string;
  score: number;
  subtitle: string;
  metaA: string;
  metaB: string;
  href: string;
};

export function RankingTable({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <section className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="section-title text-xl">{title}</h2>
        <span className="metric-pill">عرض تفاعلي</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-right text-sm">
          <thead className="text-ink/60">
            <tr>
              <th className="pb-3">الاسم</th>
              <th className="pb-3">الدرجة</th>
              <th className="pb-3">بيان 1</th>
              <th className="pb-3">بيان 2</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-mist/80">
                <td className="py-4">
                  <div>
                    <p className="font-semibold">{row.name}</p>
                    <p className="text-ink/60">{row.subtitle}</p>
                  </div>
                </td>
                <td className="py-4 font-bold text-teal">{row.score}%</td>
                <td className="py-4">{row.metaA}</td>
                <td className="py-4">{row.metaB}</td>
                <td className="py-4">
                  <Link href={row.href} className="rounded-full border border-teal/20 px-4 py-2 text-teal hover:bg-teal/5">
                    عرض الملف
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
