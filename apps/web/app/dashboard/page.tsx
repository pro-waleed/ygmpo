import { PerformanceChart } from "../../components/charts/performance-chart";
import { RankingTable } from "../../components/ui/ranking-table";
import { StatCard } from "../../components/ui/stat-card";
import { getDashboardData } from "../../lib/demo";

export default function DashboardPage() {
  const { dashboardStats, ministrySnapshots, officialSnapshots } = getDashboardData();

  return (
    <div className="space-y-8">
      <section className="card reveal-up overflow-hidden p-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="metric-pill">لوحة مؤشرات تنفيذية</span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight">لوحة حكومة الزنداني مع قراءة أسرع وأوضح للمؤشرات الحيوية</h1>
            <p className="mt-4 max-w-4xl leading-8 text-ink/75">هذه الصفحة مخصصة للعرض العام والتحليل السريع، بينما تم تخصيص صفحة منفصلة لإدارة المحتوى وتشغيل المنصة. بذلك أصبحت البنية أوضح: `لوحة مؤشرات` للعرض، و`إدارة المنصة` للتشغيل والإدخال.</p>
          </div>
          <div className="rounded-[30px] bg-gradient-to-br from-ink via-teal to-gold p-5 text-white shadow-soft">
            <p className="text-sm text-white/70">جاهزية العرض</p>
            <p className="mt-2 text-3xl font-extrabold">مرتفعة</p>
            <p className="mt-3 text-sm leading-7 text-white/80">تصميم أكثر أناقة، حركة أخف، وتسلسل بصري يميز بين التحليل التشغيلي والإدارة الفعلية للمحتوى.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {dashboardStats.map((stat, index) => <div key={stat.label} className={`reveal-up stagger-${Math.min(index + 1, 4)}`}><StatCard {...stat} /></div>)}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <PerformanceChart labels={ministrySnapshots.slice(0, 5).map((item) => item.name.replace("وزارة ", ""))} values={ministrySnapshots.slice(0, 5).map((item) => item.score)} title="الجهات الأعلى جاهزية" />
        <PerformanceChart labels={officialSnapshots.slice(0, 5).map((item) => item.name)} values={officialSnapshots.slice(0, 5).map((item) => item.score)} title="القيادات الأبرز في المتابعة" />
      </section>

      <RankingTable title="قائمة الوزراء المعروضين" rows={officialSnapshots.map((item) => ({ id: item.id, name: item.name, score: item.score, subtitle: item.ministryName, metaA: `${item.alignmentRate}% اتساق مع الموقف الرسمي`, metaB: `${item.presenceRate}% تواجد داخل اليمن`, href: `/officials/${item.id}` }))} />
    </div>
  );
}