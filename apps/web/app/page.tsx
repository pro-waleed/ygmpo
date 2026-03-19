import Link from "next/link";
import { getDashboardData } from "../lib/demo";
import { RankingTable } from "../components/ui/ranking-table";
import { StatCard } from "../components/ui/stat-card";

export default function HomePage() {
  const { dashboardStats, ministrySnapshots, officialSnapshots, reportSummaries } = getDashboardData();

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="card overflow-hidden p-8">
          <span className="metric-pill">منصة عربية أولًا</span>
          <h2 className="mt-5 text-4xl font-extrabold leading-tight text-ink">مرصد مهني لقياس الأداء الحكومي والقيادي في اليمن عبر أدلة، مراجعة، ومنهجية قابلة للتفسير.</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-ink/75">تعرض المنصة أداء الوزارات والوزراء، حضور مجلس الوزراء، التواجد داخل اليمن، التفاعل الرسمي، والمواقف الوطنية ضمن نموذج تقييم قابل للضبط الإداري والتوسع المؤسسي.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-full bg-ink px-6 py-3 text-white">استعراض لوحة المؤشرات</Link>
            <Link href="/methodology" className="rounded-full border border-ink/15 px-6 py-3">قراءة المنهجية</Link>
          </div>
        </div>
        <div className="grid gap-4">
          {dashboardStats.slice(0, 2).map((stat) => <StatCard key={stat.label} {...stat} />)}
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-4">
        {dashboardStats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </section>
      <RankingTable title="ترتيب الوزارات" rows={ministrySnapshots.map((item) => ({ id: item.id, name: item.name, score: item.score, subtitle: item.ministerName, metaA: `${item.attendanceRate}% حضور`, metaB: `${item.insideYemenRate}% داخل اليمن`, href: `/ministries/${item.id}` }))} />
      <RankingTable title="ترتيب الوزراء" rows={officialSnapshots.map((item) => ({ id: item.id, name: item.name, score: item.score, subtitle: item.ministryName, metaA: `${item.alignmentRate}% اتساق`, metaB: `${item.presenceRate}% تواجد`, href: `/officials/${item.id}` }))} />
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="section-title">أرشيف التقارير</h2>
          <div className="mt-5 space-y-4">
            {reportSummaries.map((report) => (
              <article key={report.id} className="rounded-2xl border border-mist/80 bg-white/70 p-4">
                <p className="text-sm text-teal">{report.periodLabel}</p>
                <h3 className="mt-1 text-lg font-bold">{report.title}</h3>
                <p className="mt-2 text-sm leading-7 text-ink/70">{report.summary}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="section-title">ضوابط المؤشرات الحساسة</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-ink/80">
            <li>الأدلة إلزامية للمؤشرات المتعلقة بالمواقف الوطنية والالتزام بالموقف الرسمي.</li>
            <li>يعتمد كل تقييم حساس على مراجعة بشرية وتبرير وسجل تدقيق.</li>
            <li>تصنف المصادر إلى رسمية، إعلامية، ميدانية، وداخلية مع مستوى موثوقية.</li>
            <li>تفصل المنصة بين تقييم الوزارة وتقييم الوزير، مع إمكانية الربط التحليلي بينهما.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
