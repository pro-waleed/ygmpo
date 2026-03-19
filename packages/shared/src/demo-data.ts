import type { DashboardStat, MinistrySnapshot, OfficialSnapshot, ReportSummary } from "./types";

export const dashboardStats: DashboardStat[] = [
  { label: "الجهات المعروضة", value: "7", hint: "تشكيلة تجريبية محدثة من حكومة الزنداني", trend: "up" },
  { label: "الوزراء المعروضون", value: "7", hint: "أسماء محدثة وفق الحكومة الحالية", trend: "up" },
  { label: "تاريخ التحديث المرجعي", value: "19 مارس 2026", hint: "اعتمادًا على مرجع حكومة الزنداني", trend: "stable" },
  { label: "حالة النسخة", value: "عرض حي", hint: "واجهة استعراض عامة قابلة للمشاركة", trend: "stable" }
];

export const ministrySnapshots: MinistrySnapshot[] = [
  { id: "mofa", name: "وزارة الخارجية وشؤون المغتربين", code: "MOFA", rank: 1, score: 84.8, ministerName: "شايع محسن الزنداني", attendanceRate: 91, insideYemenRate: 66 },
  { id: "finance", name: "وزارة المالية", code: "MOF", rank: 2, score: 82.6, ministerName: "مروان فرج سعيد بن غانم", attendanceRate: 88, insideYemenRate: 73 },
  { id: "health", name: "وزارة الصحة العامة والسكان", code: "MOH", rank: 3, score: 79.4, ministerName: "د. قاسم محمد بحيبح", attendanceRate: 86, insideYemenRate: 78 },
  { id: "education", name: "وزارة التربية والتعليم", code: "MOE", rank: 4, score: 75.1, ministerName: "د. عادل عبد المجيد علوي العبادي", attendanceRate: 81, insideYemenRate: 71 },
  { id: "interior", name: "وزارة الداخلية", code: "MOI", rank: 5, score: 72.8, ministerName: "اللواء إبراهيم حيدان", attendanceRate: 79, insideYemenRate: 76 },
  { id: "electricity", name: "وزارة الكهرباء", code: "MOELECT", rank: 6, score: 68.9, ministerName: "المهندس عدنان محمد عمر الكاف", attendanceRate: 74, insideYemenRate: 63 },
  { id: "water", name: "وزارة المياه والبيئة", code: "MWE", rank: 7, score: 64.7, ministerName: "توفيق عبد الواحد الشرجبي", attendanceRate: 70, insideYemenRate: 60 }
];

export const officialSnapshots: OfficialSnapshot[] = [
  { id: "o1", name: "شايع محسن الزنداني", ministryName: "وزارة الخارجية وشؤون المغتربين", score: 84.1, alignmentRate: 91, presenceRate: 66 },
  { id: "o2", name: "مروان فرج سعيد بن غانم", ministryName: "وزارة المالية", score: 82.7, alignmentRate: 88, presenceRate: 73 },
  { id: "o3", name: "د. قاسم محمد بحيبح", ministryName: "وزارة الصحة العامة والسكان", score: 79.8, alignmentRate: 84, presenceRate: 78 },
  { id: "o4", name: "د. عادل عبد المجيد علوي العبادي", ministryName: "وزارة التربية والتعليم", score: 75.5, alignmentRate: 78, presenceRate: 71 },
  { id: "o5", name: "اللواء إبراهيم حيدان", ministryName: "وزارة الداخلية", score: 73.1, alignmentRate: 77, presenceRate: 76 },
  { id: "o6", name: "المهندس عدنان محمد عمر الكاف", ministryName: "وزارة الكهرباء", score: 69.2, alignmentRate: 72, presenceRate: 63 },
  { id: "o7", name: "توفيق عبد الواحد الشرجبي", ministryName: "وزارة المياه والبيئة", score: 65.4, alignmentRate: 70, presenceRate: 60 }
];

export const reportSummaries: ReportSummary[] = [
  {
    id: "r1",
    title: "ملخص استعراضي لحكومة الزنداني - مارس 2026",
    periodLabel: "مارس 2026",
    publishedAt: "2026-03-19",
    summary: "نسخة عرض توضح التشكيلة الحكومية الحالية، وأمثلة على مؤشرات الأداء والحضور والتواجد والتفاعل الرسمي ضمن منصة المرصد."
  },
  {
    id: "r2",
    title: "تقرير وزارة الصحة العامة والسكان - مارس 2026",
    periodLabel: "مارس 2026",
    publishedAt: "2026-03-19",
    summary: "يعرض نموذجًا لتقرير قطاعي قابل للطباعة يربط الأداء التنفيذي والانتشار الميداني والمراجعة المبنية على الأدلة."
  }
];