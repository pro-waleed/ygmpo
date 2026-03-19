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
          <span className="metric-pill">نسخة محدثة من حكومة الزنداني</span>
          <h2 className="mt-5 text-4xl font-extrabold leading-tight text-ink">مرصد مهني لقياس الأداء الحكومي والقيادي في اليمن عبر أدلة، مراجعة، ومنهجية قابلة للتفسير.</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-ink/75">تعرض النسخة الحية الحالية واجهات الاستعراض العامة ولوحة المؤشرات الحكومية بأسماء محدثة من حكومة الزنداني الحالية، مع الإبقاء على منطق المرصد القائم على الأدلة والمؤشرات القابلة للضبط.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className="rounded-full bg-ink px-6 py-3 text-white">فتح لوحة المؤشرات</Link>
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
      <RankingTable title="الوزارات المعروضة" rows={ministrySnapshots.map((item) => ({ id: item.id, name: item.name, score: item.score, subtitle: item.ministerName, metaA: `${item.attendanceRate}% حضور`, metaB: `${item.insideYemenRate}% داخل اليمن`, href: `/ministries/${item.id}` }))} />
      <RankingTable title="الوزراء المعروضون" rows={officialSnapshots.map((item) => ({ id: item.id, name: item.name, score: item.score, subtitle: item.ministryName, metaA: `${item.alignmentRate}% اتساق`, metaB: `${item.presenceRate}% تواجد`, href: `/officials/${item.id}` }))} />
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
          <h2 className="section-title">ملاحظات على النسخة المنشورة</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-ink/80">
            <li>النسخة العامة الحالية تعرض واجهات الاستعراض ولوحة مؤشرات قابلة للمشاركة.</li>
            <li>أسماء الحكومة محدثة وفق صفحة حكومة الزنداني على ويكيبيديا.</li>
            <li>لوحة التحكم الإدارية الكاملة تحتاج نشر الـ API ونظام تسجيل الدخول والصلاحيات.</li>
            <li>يمكن في الخطوة التالية تفعيل لوحة إدارة حقيقية محمية للمحلل ومدير النظام.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}