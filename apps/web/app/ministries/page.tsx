"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RankingTable } from "../../components/ui/ranking-table";
import { useRuntimeData } from "../../lib/runtime-data";

function MinistriesContent() {
  const { ministrySnapshots } = useRuntimeData();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("view");
  const selectedMinistry = ministrySnapshots.find((item) => item.id === selectedId);

  return (
    <div className="space-y-6">
      <RankingTable title="ملفات الوزارات" rows={ministrySnapshots.map((item) => ({ id: item.id, name: item.name, score: item.score, subtitle: item.ministerName, metaA: `${item.attendanceRate}% حضور مجلس الوزراء`, metaB: `${item.insideYemenRate}% تواجد الوزير داخل اليمن`, href: `/ministries?view=${item.id}` }))} />
      {selectedMinistry && (
        <section className="card p-8">
          <span className="metric-pill">معاينة سريعة</span>
          <h1 className="mt-4 text-3xl font-extrabold">{selectedMinistry.name}</h1>
          <p className="mt-2 text-lg text-ink/70">الوزير: {selectedMinistry.ministerName}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-mist/60 p-4"><p className="text-sm text-ink/60">الترتيب</p><p className="mt-2 text-2xl font-bold">#{selectedMinistry.rank}</p></div>
            <div className="rounded-2xl bg-mist/60 p-4"><p className="text-sm text-ink/60">الدرجة الكلية</p><p className="mt-2 text-2xl font-bold text-teal">{selectedMinistry.score}%</p></div>
            <div className="rounded-2xl bg-mist/60 p-4"><p className="text-sm text-ink/60">مؤشر الحضور</p><p className="mt-2 text-2xl font-bold">{selectedMinistry.attendanceRate}%</p></div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function MinistriesPage() {
  return (
    <Suspense fallback={<section className="card p-8"><p className="text-ink/70">جاري تحميل بيانات الوزارات...</p></section>}>
      <MinistriesContent />
    </Suspense>
  );
}