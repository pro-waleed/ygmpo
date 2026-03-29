"use client";

import { RankingTable } from "../../components/ui/ranking-table";
import { useRuntimeData } from "../../lib/runtime-data";

export default function OfficialsPage() {
  const { officialSnapshots } = useRuntimeData();

  return <RankingTable title="ملفات الوزراء" rows={officialSnapshots.map((item) => ({ id: item.id, name: item.name, score: item.score, subtitle: item.ministryName, metaA: `${item.alignmentRate}% اتساق`, metaB: `${item.presenceRate}% داخل اليمن`, href: `/officials/${item.id}` }))} />;
}