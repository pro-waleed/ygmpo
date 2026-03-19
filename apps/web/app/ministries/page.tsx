import { ministrySnapshots } from "@ygmpo/shared/demo-data";
import { RankingTable } from "../../components/ui/ranking-table";

export default function MinistriesPage() {
  return <RankingTable title="ملفات الوزارات" rows={ministrySnapshots.map((item) => ({ id: item.id, name: item.name, score: item.score, subtitle: item.ministerName, metaA: `${item.attendanceRate}% حضور مجلس الوزراء`, metaB: `${item.insideYemenRate}% تواجد الوزير داخل اليمن`, href: `/ministries/${item.id}` }))} />;
}
