import { PerformanceChart } from "../../components/charts/performance-chart";
import { RankingTable } from "../../components/ui/ranking-table";
import { StatCard } from "../../components/ui/stat-card";
import { getDashboardData } from "../../lib/demo";

export default function DashboardPage() {
  const { dashboardStats, ministrySnapshots, officialSnapshots } = getDashboardData();

  return (
    <div className="space-y-8">
      <div>
        <span className="metric-pill">لوحة المؤشرات الحالية</span>
        <h1 className="mt-3 text-3xl font-extrabold">لوحة حكومة الزنداني - مارس 2026</h1>
        <p className="mt-3 max-w-4xl leading-8 text-ink/75">هذه لوحة استعراض حيّة موجهة للشركاء وصناع القرار، وتعرض بيانات تجريبية محدثة بأسماء الحكومة الحالية. أما لوحة التحكم الإدارية الكاملة فتتطلب نشر الواجهة الخلفية ونظام الدخول والصلاحيات، وهي غير مفعلة بعد على النسخة العامة الحالية.</p>
      </div>
      <section className="grid gap-4 md:grid-cols-4">
        {dashboardStats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <PerformanceChart labels={ministrySnapshots.slice(0, 5).map((item) => item.name.replace("وزارة ", ""))} values={ministrySnapshots.slice(0, 5).map((item) => item.score)} title="الجهات الأكثر جاهزية في العرض التجريبي" />
        <PerformanceChart labels={officialSnapshots.slice(0, 5).map((item) => item.name)} values={officialSnapshots.slice(0, 5).map((item) => item.score)} title="الوزراء في لوحة المتابعة" />
      </section>
      <RankingTable title="قائمة الوزراء المعروضين" rows={officialSnapshots.map((item) => ({ id: item.id, name: item.name, score: item.score, subtitle: item.ministryName, metaA: `${item.alignmentRate}% اتساق مع الموقف الرسمي`, metaB: `${item.presenceRate}% تواجد داخل اليمن`, href: `/officials/${item.id}` }))} />
    </div>
  );
}