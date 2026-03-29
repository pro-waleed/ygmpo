"use client";

import { RankingTable } from "../../components/ui/ranking-table";
import { useRuntimeData } from "../../lib/runtime-data";

export default function MinistriesPage() {
  const { ministrySnapshots } = useRuntimeData();

  return <RankingTable title="ملفات الوزارات" rows={ministrySnapshots.map((item) => ({ id: item.id, name: item.name, score: item.score, subtitle: item.ministerName, metaA: `${item.attendanceRate}% حضور مجلس الوزراء`, metaB: `${item.insideYemenRate}% تواجد الوزير داخل اليمن`, href: `/ministries/${item.id}` }))} />;
}