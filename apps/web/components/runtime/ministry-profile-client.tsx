"use client";

import { useRuntimeData } from "../../lib/runtime-data";

export function MinistryProfileClient({ id }: { id: string }) {
  const { ministrySnapshots } = useRuntimeData();
  const ministry = ministrySnapshots.find((item) => item.id === id);

  if (!ministry) {
    return (
      <section className="card p-8">
        <h1 className="text-2xl font-extrabold">الوزارة غير موجودة</h1>
        <p className="mt-3 leading-8 text-ink/70">قد تكون حذفت من لوحة الإدارة أو لم تعد متاحة ضمن البيانات الحالية.</p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="card p-8">
        <span className="metric-pill">ملف وزارة</span>
        <h1 className="mt-4 text-3xl font-extrabold">{ministry.name}</h1>
        <p className="mt-2 text-lg text-ink/70">الوزير: {ministry.ministerName}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-mist/60 p-4"><p className="text-sm text-ink/60">الترتيب</p><p className="mt-2 text-2xl font-bold">#{ministry.rank}</p></div>
          <div className="rounded-2xl bg-mist/60 p-4"><p className="text-sm text-ink/60">الدرجة الكلية</p><p className="mt-2 text-2xl font-bold text-teal">{ministry.score}%</p></div>
          <div className="rounded-2xl bg-mist/60 p-4"><p className="text-sm text-ink/60">مؤشر الحضور</p><p className="mt-2 text-2xl font-bold">{ministry.attendanceRate}%</p></div>
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <article className="card p-6">
          <h2 className="text-xl font-bold">ملخص الأداء الشهري</h2>
          <p className="mt-4 leading-8 text-ink/75">يعكس هذا الملف المؤشرات المؤسسية الخاصة بالوزارة مثل الإنجاز التنفيذي والشفافية والمتابعة، مع فصل تحليلي عن تقييم الوزير المسؤول عنها.</p>
        </article>
        <article className="card p-6">
          <h2 className="text-xl font-bold">أبرز المحاور</h2>
          <ul className="mt-4 space-y-3 leading-8 text-ink/75">
            <li>الإنجاز التنفيذي ومتابعة المبادرات.</li>
            <li>الشفافية والتقارير.</li>
            <li>التنسيق مع مجلس الوزراء.</li>
            <li>متابعة القضايا الوطنية ذات الصلة بالقطاع.</li>
          </ul>
        </article>
      </section>
    </div>
  );
}