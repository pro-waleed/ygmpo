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
    <section className="card reveal-up p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="section-title text-xl">{title}</h2>
          <p className="mt-1 text-sm text-ink/55">عرض مرتب قابل للمشاركة أمام الشركاء وصناع القرار</p>
        </div>
        <span className="metric-pill">عرض تفاعلي</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-right text-sm">
          <thead className="text-ink/55">
            <tr>
              <th className="pb-3">الاسم</th>
              <th className="pb-3">الدرجة</th>
              <th className="pb-3">بيان 1</th>
              <th className="pb-3">بيان 2</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className="border-t border-mist/80 transition hover:bg-slate-50/70">
                <td className="py-4">
                  <div>
                    <p className="font-semibold text-ink">{index + 1}. {row.name}</p>
                    <p className="text-ink/58">{row.subtitle}</p>
                  </div>
                </td>
                <td className="py-4 font-extrabold text-teal">{row.score}%</td>
                <td className="py-4 text-ink/70">{row.metaA}</td>
                <td className="py-4 text-ink/70">{row.metaB}</td>
                <td className="py-4">
                  <Link href={row.href} className="soft-button inline-flex items-center gap-2">
                    <span>عرض الملف</span>
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