import Link from "next/link";
import { reportSummaries } from "@ygmpo/shared/demo-data";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="card p-8">
        <span className="metric-pill">أرشيف التقارير</span>
        <h1 className="mt-3 text-3xl font-extrabold">تقارير شهرية قابلة للطباعة</h1>
      </div>
      <div className="grid gap-5">
        {reportSummaries.map((report) => (
          <article key={report.id} className="card p-6">
            <p className="text-sm text-teal">{report.periodLabel}</p>
            <h2 className="mt-2 text-xl font-bold">{report.title}</h2>
            <p className="mt-3 leading-8 text-ink/75">{report.summary}</p>
            <Link href={`/reports/${report.id}`} className="mt-4 inline-flex rounded-full border border-ink/10 px-4 py-2">عرض التقرير</Link>
          </article>
        ))}
      </div>
    </div>
  );
}
