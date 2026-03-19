import type {
  AdminUserRecord,
  ContentItemRecord,
  DashboardStat,
  EvaluationCriterionRecord,
  MinistrySnapshot,
  OfficialSnapshot,
  ReportSummary,
  RoleRecord,
  SourceRecord
} from "./types";

export const dashboardStats: DashboardStat[] = [
  { label: "الجهات المعروضة", value: "7", hint: "تشكيلة تجريبية محدثة من حكومة الزنداني", trend: "up" },
  { label: "الوزراء المعروضون", value: "7", hint: "أسماء محدثة وفق الحكومة الحالية", trend: "up" },
  { label: "معايير التقييم", value: "9", hint: "قابلة للتعديل من لوحة الإدارة", trend: "up" },
  { label: "حالة المنصة", value: "جاهزة للعرض", hint: "واجهة عامة + إدارة محتوى وتجهيز تقييم", trend: "stable" }
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
    summary: "يعرض نموذجًا لتقرير قطاعي قابلًا للطباعة يربط الأداء التنفيذي والانتشار الميداني والمراجعة المبنية على الأدلة."
  }
];

export const sourceRecords: SourceRecord[] = [
  { id: "s1", title: "قرار جمهوري بتشكيل الحكومة", type: "رسمي", url: "https://www.sabanew.net", credibility: "عال" },
  { id: "s2", title: "إحاطة صحفية لرئاسة الوزراء", type: "رسمي", url: "https://www.sabanew.net", credibility: "عال" },
  { id: "s3", title: "تغطية إعلامية لملف الكهرباء", type: "إعلامي", url: "https://example.org/power", credibility: "متوسط" },
  { id: "s4", title: "مذكرة متابعة ميدانية", type: "ميداني", url: "https://example.org/field", credibility: "قيد المراجعة" }
];

export const roleRecords: RoleRecord[] = [
  { id: "r-admin", name: "مدير النظام", permissions: ["إدارة المستخدمين", "إدارة الأدوار", "نشر التقارير", "إدارة المنهجية"], membersCount: 1 },
  { id: "r-analyst", name: "محلل", permissions: ["تحليل المؤشرات", "مراجعة المحتوى", "إنشاء تقارير"], membersCount: 2 },
  { id: "r-entry", name: "مدخل بيانات", permissions: ["إضافة المسؤولين", "إضافة المصادر", "تعبئة المؤشرات"], membersCount: 3 },
  { id: "r-reviewer", name: "مراجع", permissions: ["اعتماد الأدلة", "مراجعة المؤشرات الحساسة"], membersCount: 2 }
];

export const adminUsers: AdminUserRecord[] = [
  { id: "u1", name: "مدير النظام", role: "مدير النظام", status: "نشط" },
  { id: "u2", name: "محلل الأداء", role: "محلل", status: "نشط", ministry: "وزارة المالية" },
  { id: "u3", name: "مدخل بيانات الوزراء", role: "مدخل بيانات", status: "نشط", ministry: "وزارة الصحة العامة والسكان" },
  { id: "u4", name: "مراجع المنهجية", role: "مراجع", status: "بانتظار التفعيل" }
];

export const contentItems: ContentItemRecord[] = [
  { id: "c1", title: "تقرير الأداء الحكومي الشهري", type: "تقرير", status: "قيد المراجعة", owner: "محلل الأداء" },
  { id: "c2", title: "تصريح رسمي حول الكهرباء", type: "تصريح", status: "منشور", owner: "مدخل بيانات الوزراء" },
  { id: "c3", title: "مبادرة الاستجابة للخدمات", type: "مبادرة", status: "مسودة", owner: "محلل الأداء" },
  { id: "c4", title: "اتساق الموقف الرسمي لملف إقليمي", type: "مؤشر حساس", status: "قيد المراجعة", owner: "مراجع المنهجية" }
];

export const evaluationCriteria: EvaluationCriterionRecord[] = [
  { id: "ec1", title: "حضور اجتماعات مجلس الوزراء", category: "حضور", weight: 14, enabled: true, evidenceRequired: true, reviewerRequired: false, note: "يحتسب من سجلات الحضور الرسمية ومحاضر الاجتماع." },
  { id: "ec2", title: "التصريحات واتساقها مع الموقف الرسمي", category: "مواقف", weight: 18, enabled: true, evidenceRequired: true, reviewerRequired: true, note: "يتطلب ربط التصريح بمصدر رسمي أو إعلامي موثق ومراجعة بشرية." },
  { id: "ec3", title: "التواجد في اليمن", category: "تواجد", weight: 10, enabled: true, evidenceRequired: true, reviewerRequired: false, note: "يحتسب وفق سجل زمني موثق للفترة التقييمية." },
  { id: "ec4", title: "التواجد خارج اليمن بمهمات رسمية", category: "تواجد", weight: 8, enabled: true, evidenceRequired: true, reviewerRequired: false, note: "يحسب عند وجود تفويض أو مهمة أو اجتماع رسمي مثبت." },
  { id: "ec5", title: "التواجد خارج اليمن بدون مهمة", category: "تواجد", weight: 8, enabled: true, evidenceRequired: true, reviewerRequired: true, note: "يعامل كعنصر خافض في التقييم ويتطلب توثيق حالة عدم وجود مهمة." },
  { id: "ec6", title: "الأنشطة التخصصية في الوزارة", category: "وزارة", weight: 12, enabled: true, evidenceRequired: true, reviewerRequired: false, note: "يقاس بمدى النشاط التنفيذي والزيارات والاجتماعات القطاعية." },
  { id: "ec7", title: "القرارات المتخذة", category: "وزارة", weight: 10, enabled: true, evidenceRequired: true, reviewerRequired: false, note: "يربط بعدد القرارات وجودتها ومدى اتصالها بأولويات الوزارة." },
  { id: "ec8", title: "التعيينات والترقيات ومدى اتساقها مع القانون", category: "قانون", weight: 12, enabled: true, evidenceRequired: true, reviewerRequired: true, note: "يتطلب التحقق من الأساس القانوني والإجراءات المنظمة." },
  { id: "ec9", title: "حسابات الوزير على وسائل التواصل ومدى ارتباطها بالمهام الرسمية", category: "إعلام رقمي", weight: 8, enabled: true, evidenceRequired: true, reviewerRequired: true, note: "يفحص الاتساق مع الموقف الرسمي للدولة وطبيعة الاستخدام المهني." }
];