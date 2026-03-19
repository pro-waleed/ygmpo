import Link from "next/link";
import { getDashboardData } from "../lib/demo";
import { RankingTable } from "../components/ui/ranking-table";
import { StatCard } from "../components/ui/stat-card";

export default function HomePage() {
  const { dashboardStats, ministrySnapshots, officialSnapshots, reportSummaries } = getDashboardData();

  return (
    <div className="space-y-10">
      <section className="hero-panel grid-glow reveal-up relative overflow-hidden rounded-[36px] px-8 py-10 text-white shadow-soft">
        <div className="float-orb right-10 top-10 h-28 w-28 bg-gold/60" />
        <div className="float-orb left-10 top-20 h-24 w-24 bg-teal/50" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <span className="metric-pill text-white">مرصد عربي أولًا • حي • قابل للمشاركة</span>
            <h2 className="mt-5 text-4xl font-extrabold leading-tight">واجهة حكومية أكثر أناقة وحيوية لعرض الأداء والقيادة وإدارة المحتوى في منصة يمنية قابلة للتوسع.</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/82">تعرض النسخة الحالية الواجهة العامة بلوحات مؤشرات حديثة، كما تتضمن صفحة إدارة محتوى تشغيلية داخل المتصفح لإدارة الجهات، المسؤولين، المصادر، الأدوار، والتقارير بصورة تفاعلية توضح شكل النظام النهائي.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard" className="primary-button">استعراض المؤشرات</Link>
              <Link href="/admin" className="soft-button border-white/20 bg-white/10 text-white">فتح إدارة المنصة</Link>
            </div>
          </div>
          <div className="glass-card grid gap-4 p-5 text-ink">
            <div className="rounded-[28px] bg-white/80 p-5">
              <p className="text-sm text-ink/55">آخر تحديث مرجعي</p>
              <p className="mt-2 text-3xl font-extrabold">19 مارس 2026</p>
              <p className="mt-2 text-sm leading-7 text-ink/65">بيانات العرض الحالية مبنية على حكومة الزنداني مع إبراز المسارات المؤسسية للمنصة.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {dashboardStats.slice(0, 2).map((stat, index) => <StatCard key={stat.label} {...stat} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {dashboardStats.map((stat, index) => <div key={stat.label} className={`reveal-up stagger-${Math.min(index + 1, 4)}`}><StatCard {...stat} /></div>)}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <RankingTable title="الوزارات المعروضة" rows={ministrySnapshots.map((item) => ({ id: item.id, name: item.name, score: item.score, subtitle: item.ministerName, metaA: `${item.attendanceRate}% حضور`, metaB: `${item.insideYemenRate}% داخل اليمن`, href: `/ministries/${item.id}` }))} />
        <div className="card reveal-up p-6">
          <h2 className="section-title">لماذا هذه النسخة أقوى؟</h2>
          <div className="mt-5 space-y-4 text-sm leading-8 text-ink/75">
            <p>تم تحسين الهوية البصرية بطابع مؤسسي أكثر فخامة مع طبقات شفافة وحركة خفيفة وخلفية أكثر عمقًا.</p>
            <p>أصبحت إدارة المنصة جزءًا من التجربة نفسها من خلال صفحة `إدارة المنصة`، بدل الاكتفاء بلوحة عرض ثابتة.</p>
            <p>المحتوى الحساس ما زال مؤطرًا بمنهجية قائمة على الأدلة، لكن الواجهة الآن أوضح في التفريق بين العرض العام والإدارة التشغيلية.</p>
          </div>
        </div>
      </section>

      <RankingTable title="الوزراء المعروضون" rows={officialSnapshots.map((item) => ({ id: item.id, name: item.name, score: item.score, subtitle: item.ministryName, metaA: `${item.alignmentRate}% اتساق`, metaB: `${item.presenceRate}% تواجد`, href: `/officials/${item.id}` }))} />

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card reveal-up p-6">
          <h2 className="section-title">أرشيف التقارير</h2>
          <div className="mt-5 space-y-4">
            {reportSummaries.map((report) => (
              <article key={report.id} className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4 transition hover:-translate-y-0.5 hover:shadow-soft">
                <p className="text-sm text-teal">{report.periodLabel}</p>
                <h3 className="mt-1 text-lg font-bold">{report.title}</h3>
                <p className="mt-2 text-sm leading-7 text-ink/70">{report.summary}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="card reveal-up p-6">
          <h2 className="section-title">ما الجديد في لوحة التحكم؟</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-ink/80">
            <li>إدارة الجهات والوزارات من واجهة تشغيلية واضحة.</li>
            <li>إضافة المسؤولين وربطهم بالجهات مباشرة.</li>
            <li>إدارة المصادر والأدلة المرجعية.</li>
            <li>تعريف الأدوار والمستخدمين وحالة التفعيل.</li>
            <li>إدارة عناصر المحتوى كالتقارير والتصريحات والمبادرات.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}