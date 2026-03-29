"use client";

import Link from "next/link";
import { RankingTable } from "../components/ui/ranking-table";
import { StatCard } from "../components/ui/stat-card";
import { useRuntimeData } from "../lib/runtime-data";

const quickFeatures = [
  "ضبط معايير تقييم الوزراء من لوحة الإدارة",
  "انعكاس بيانات الإدارة على العرض داخل نفس البيئة",
  "ربط أوضح بين العرض العام والإدارة التشغيلية",
  "منهجية قابلة للتفسير مع اشتراطات دليل ومراجعة"
];

export default function HomePage() {
  const { dashboardStats, ministrySnapshots, officialSnapshots, reportSummaries } = useRuntimeData();

  return (
    <div className="space-y-10">
      <section className="hero-panel hero-sheen grid-glow reveal-up relative overflow-hidden rounded-[36px] px-8 py-10 text-white shadow-soft">
        <div className="float-orb right-10 top-10 h-28 w-28 bg-gold/60" />
        <div className="float-orb left-10 top-20 h-24 w-24 bg-teal/50" />
        <div className="float-orb bottom-10 right-1/3 h-20 w-20 bg-white/25" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <span className="metric-pill text-white">منصة يمنية أكثر أناقة وحيوية</span>
            <h2 className="mt-5 text-4xl font-extrabold leading-tight">مرصد بصري وتشغيلي يجمع بين العرض المؤسسي الراقي وإدارة المحتوى ومعايير تقييم الوزراء داخل واجهة واحدة.</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/82">تعرض النسخة الحالية الواجهة العامة مع تحسينات حركية وبصرية أوضح، كما تتضمن إدارة تشغيلية للمصادر والجهات والمسؤولين وعناصر التقييم. وأصبح ما يجري تعديله داخل لوحة التحكم قابلًا للظهور في صفحات العرض داخل نفس البيئة.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard" className="primary-button">استعراض المؤشرات</Link>
              <Link href="/admin" className="soft-button border-white/20 bg-white/10 text-white">فتح إدارة المنصة</Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {quickFeatures.map((feature, index) => (
                <div key={feature} className={`glass-card reveal-up stagger-${Math.min(index + 1, 4)} px-4 py-3 text-sm text-white/86`}>
                  {feature}
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card grid gap-4 p-5 text-ink">
            <div className="rounded-[28px] bg-white/80 p-5">
              <p className="text-sm text-ink/55">أحدث قراءة تشغيلية</p>
              <p className="mt-2 text-3xl font-extrabold">نسخة متصلة بالإدارة</p>
              <p className="mt-2 text-sm leading-7 text-ink/65">تعكس هذه الصفحة بيانات الإدارة كلما كانت متاحة محليًا داخل المتصفح، بما يجعل الاستعراض أكثر اتساقًا مع لوحة التحكم.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {dashboardStats.slice(0, 2).map((stat) => <StatCard key={stat.label} {...stat} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {dashboardStats.map((stat, index) => <div key={stat.label} className={`reveal-up stagger-${Math.min(index + 1, 4)}`}><StatCard {...stat} /></div>)}
      </section>

      <section className="grid gap-6 lg:grid-cols-4">
        <div className="feature-card reveal-up lg:col-span-2">
          <span className="kicker-line" />
          <h3 className="mt-4 text-2xl font-bold">هوية أكثر قوة ووضوحًا</h3>
          <p className="mt-4 leading-8 text-ink/72">تم تعزيز الإيقاع البصري بطبقات لونية أعمق، وبطاقات شفافة ناعمة، وحركة خفيفة تضيف حياة من دون أن تفقد الطابع المؤسسي.</p>
        </div>
        <div className="feature-card reveal-up">
          <span className="admin-pill">إدارة</span>
          <h3 className="mt-4 text-xl font-bold">تحكم بالمصادر</h3>
          <p className="mt-3 text-sm leading-7 text-ink/72">إضافة المصادر والأدلة المرجعية مباشرة من لوحة الإدارة.</p>
        </div>
        <div className="feature-card reveal-up">
          <span className="admin-pill">تقييم</span>
          <h3 className="mt-4 text-xl font-bold">معايير قابلة للتعديل</h3>
          <p className="mt-3 text-sm leading-7 text-ink/72">وزن، تفعيل، دليل، ومراجعة لكل عنصر من عناصر تقييم الوزير.</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <RankingTable title="الوزارات المعروضة" rows={ministrySnapshots.map((item) => ({ id: item.id, name: item.name, score: item.score, subtitle: item.ministerName, metaA: `${item.attendanceRate}% حضور`, metaB: `${item.insideYemenRate}% داخل اليمن`, href: `/ministries?view=${item.id}` }))} />
        <div className="card reveal-up p-6">
          <h2 className="section-title">ماذا تطور في التجربة؟</h2>
          <div className="mt-5 space-y-4 text-sm leading-8 text-ink/75">
            <p>الواجهة لم تعد مسطحة أو أقرب إلى نموذج أولي جامد، بل أصبحت أكثر عمقًا وتوازنًا مع حضور بصري مؤسسي أوضح.</p>
            <p>النسخة الحالية تميز بوضوح بين صفحات العرض العام وصفحات الإدارة والتشغيل.</p>
            <p>تم تجهيز مسار يسمح لبيانات الإدارة بالظهور في صفحات العرض داخل المتصفح نفسه، وهو ما يجعل الديمو أكثر إقناعًا عند التعديل ثم الاستعراض.</p>
          </div>
        </div>
      </section>

      <RankingTable title="الوزراء المعروضون" rows={officialSnapshots.map((item) => ({ id: item.id, name: item.name, score: item.score, subtitle: item.ministryName, metaA: `${item.alignmentRate}% اتساق`, metaB: `${item.presenceRate}% تواجد`, href: `/officials?view=${item.id}` }))} />

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
          <h2 className="section-title">ماذا ستجد في الإدارة الآن؟</h2>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-ink/80">
            <li>إدارة الجهات والوزارات.</li>
            <li>إدارة المسؤولين والقيادات.</li>
            <li>إدارة المصادر والأدلة.</li>
            <li>إدارة الأدوار والمستخدمين.</li>
            <li>إدارة عناصر تقييم الوزراء والتحكم بأوزانها وحالتها.</li>
            <li>إدارة سجلات التقييم نفسها إضافة وتعديلًا وحذفًا.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}