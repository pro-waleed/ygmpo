import { PerformanceChart } from "../../components/charts/performance-chart";
import { RankingTable } from "../../components/ui/ranking-table";
import { StatCard } from "../../components/ui/stat-card";
import { getDashboardData } from "../../lib/demo";

export default function DashboardPage() {
  const { dashboardStats, ministrySnapshots, officialSnapshots } = getDashboardData();

  return (
    <div className="space-y-8">
      <div>
        <span className="metric-pill">لوحة الإدارة والتحليل</span>
        <h1 className="mt-3 text-3xl font-extrabold">مؤشرات فبراير 2026</h1>
      </div>
      <section className="grid gap-4 md:grid-cols-4">
        {dashboardStats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <PerformanceChart labels={ministrySnapshots.slice(0, 5).map((item) => item.name.replace("وزارة ", ""))} values={ministrySnapshots.slice(0, 5).map((item) => item.score)} title="أفضل الوزارات أداءً" />
        <PerformanceChart labels={officialSnapshots.map((item) => item.name)} values={officialSnapshots.map((item) => item.score)} title="أداء الوزراء" />
      </section>
      <RankingTable title="حالات المراجعة والأولوية" rows={officialSnapshots.map((item) => ({ id: item.id, name: item.name, score: item.score, subtitle: item.ministryName, metaA: `${item.alignmentRate}% اتساق مع الموقف الرسمي`, metaB: `${item.presenceRate}% تواجد داخل اليمن`, href: `/officials/${item.id}` }))} />
    </div>
  );
}
