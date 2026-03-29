"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RankingTable } from "../../components/ui/ranking-table";
import { useRuntimeData } from "../../lib/runtime-data";

function OfficialsContent() {
  const { officialSnapshots } = useRuntimeData();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("view");
  const selectedOfficial = officialSnapshots.find((item) => item.id === selectedId);

  return (
    <div className="space-y-6">
      <RankingTable title="ملفات الوزراء" rows={officialSnapshots.map((item) => ({ id: item.id, name: item.name, score: item.score, subtitle: item.ministryName, metaA: `${item.alignmentRate}% اتساق`, metaB: `${item.presenceRate}% داخل اليمن`, href: `/officials?view=${item.id}` }))} />
      {selectedOfficial && (
        <section className="card p-8">
          <span className="metric-pill">معاينة سريعة</span>
          <h1 className="mt-4 text-3xl font-extrabold">{selectedOfficial.name}</h1>
          <p className="mt-2 text-lg text-ink/70">{selectedOfficial.ministryName}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-mist/60 p-4"><p className="text-sm text-ink/60">الدرجة الكلية</p><p className="mt-2 text-2xl font-bold text-teal">{selectedOfficial.score}%</p></div>
            <div className="rounded-2xl bg-mist/60 p-4"><p className="text-sm text-ink/60">اتساق الموقف</p><p className="mt-2 text-2xl font-bold">{selectedOfficial.alignmentRate}%</p></div>
            <div className="rounded-2xl bg-mist/60 p-4"><p className="text-sm text-ink/60">التواجد داخل اليمن</p><p className="mt-2 text-2xl font-bold">{selectedOfficial.presenceRate}%</p></div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function OfficialsPage() {
  return (
    <Suspense fallback={<section className="card p-8"><p className="text-ink/70">جاري تحميل بيانات الوزراء...</p></section>}>
      <OfficialsContent />
    </Suspense>
  );
}