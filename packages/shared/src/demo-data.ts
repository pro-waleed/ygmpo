import type { DashboardStat, MinistrySnapshot, OfficialSnapshot, ReportSummary } from "./types";

export const dashboardStats: DashboardStat[] = [
  { label: "متوسط أداء الوزارات", value: "74.8%", hint: "تحسن 4.2% عن الشهر السابق", trend: "up" },
  { label: "متوسط أداء الوزراء", value: "71.1%", hint: "3 مؤشرات بانتظار مراجعة", trend: "stable" },
  { label: "حضور مجلس الوزراء", value: "82.5%", hint: "من 6 اجتماعات خلال الفترة", trend: "up" },
  { label: "التواجد داخل اليمن", value: "68.3%", hint: "محسوب من سجلات التواجد الرسمية", trend: "down" }
];

export const ministrySnapshots: MinistrySnapshot[] = [
  { id: "mofa", name: "وزارة الخارجية وشؤون المغتربين", code: "MOFA", rank: 1, score: 86.2, ministerName: "د. شائع الزنداني", attendanceRate: 92, insideYemenRate: 64 },
  { id: "finance", name: "وزارة المالية", code: "MOF", rank: 2, score: 81.4, ministerName: "سالم بن بريك", attendanceRate: 88, insideYemenRate: 72 },
  { id: "health", name: "وزارة الصحة العامة والسكان", code: "MOH", rank: 3, score: 78.6, ministerName: "د. قاسم بحيبح", attendanceRate: 85, insideYemenRate: 77 },
  { id: "education", name: "وزارة التربية والتعليم", code: "MOE", rank: 4, score: 74.2, ministerName: "طارق العكبري", attendanceRate: 80, insideYemenRate: 69 },
  { id: "interior", name: "وزارة الداخلية", code: "MOI", rank: 5, score: 70.3, ministerName: "اللواء إبراهيم حيدان", attendanceRate: 78, insideYemenRate: 75 },
  { id: "electricity", name: "وزارة الكهرباء والطاقة", code: "MOEP", rank: 6, score: 65.9, ministerName: "مانع بن يمين", attendanceRate: 71, insideYemenRate: 61 },
  { id: "water", name: "وزارة المياه والبيئة", code: "MWE", rank: 7, score: 62.1, ministerName: "توفيق الشرجبي", attendanceRate: 69, insideYemenRate: 58 }
];

export const officialSnapshots: OfficialSnapshot[] = [
  { id: "o1", name: "د. شائع الزنداني", ministryName: "وزارة الخارجية وشؤون المغتربين", score: 84.1, alignmentRate: 90, presenceRate: 64 },
  { id: "o2", name: "سالم بن بريك", ministryName: "وزارة المالية", score: 82.4, alignmentRate: 88, presenceRate: 72 },
  { id: "o3", name: "د. قاسم بحيبح", ministryName: "وزارة الصحة العامة والسكان", score: 79.9, alignmentRate: 81, presenceRate: 77 },
  { id: "o4", name: "طارق العكبري", ministryName: "وزارة التربية والتعليم", score: 72.5, alignmentRate: 76, presenceRate: 69 }
];

export const reportSummaries: ReportSummary[] = [
  {
    id: "r1",
    title: "التقرير الحكومي العام - فبراير 2026",
    periodLabel: "فبراير 2026",
    publishedAt: "2026-03-10",
    summary: "يستعرض أداء الوزارات والوزراء، والحضور، والتواجد داخل اليمن، ومؤشرات التفاعل الرسمي والقضايا الوطنية."
  },
  {
    id: "r2",
    title: "تقرير وزارة الصحة العامة والسكان - فبراير 2026",
    periodLabel: "فبراير 2026",
    publishedAt: "2026-03-09",
    summary: "يركز على الاستجابة للأزمات الصحية، الانضباط التنفيذي، والانتشار الميداني وربط ذلك بالأدلة الموثقة."
  }
];
