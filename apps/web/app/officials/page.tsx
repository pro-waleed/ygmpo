import { officialSnapshots } from "@ygmpo/shared/demo-data";
import { RankingTable } from "../../components/ui/ranking-table";

export default function OfficialsPage() {
  return <RankingTable title="ملفات الوزراء" rows={officialSnapshots.map((item) => ({ id: item.id, name: item.name, score: item.score, subtitle: item.ministryName, metaA: `${item.alignmentRate}% اتساق`, metaB: `${item.presenceRate}% داخل اليمن`, href: `/officials/${item.id}` }))} />;
}
