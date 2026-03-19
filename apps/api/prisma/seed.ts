import {
  AlignmentStatus,
  AttendanceStatus,
  CredibilityLevel,
  EvidenceSourceType,
  IndicatorInputType,
  PeriodStatus,
  PresenceType,
  PrismaClient,
  ReportType,
  ScoringType,
  StatementType,
  SubjectScope,
  SubjectType,
  UserRole
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { computePercentage, computeWeightedScore } from "@ygmpo/shared/scoring";

const prisma = new PrismaClient();

async function resetDb() {
  await prisma.auditLog.deleteMany();
  await prisma.report.deleteMany();
  await prisma.positionAlignmentRecord.deleteMany();
  await prisma.nationalPositionTopic.deleteMany();
  await prisma.statement.deleteMany();
  await prisma.travelPresenceRecord.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.evidenceLink.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.scoreDetail.deleteMany();
  await prisma.score.deleteMany();
  await prisma.indicatorEntry.deleteMany();
  await prisma.evaluationIndicator.deleteMany();
  await prisma.evaluationAxis.deleteMany();
  await prisma.evaluationSubject.deleteMany();
  await prisma.official.deleteMany();
  await prisma.ministry.deleteMany();
  await prisma.evaluationPeriod.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  await resetDb();

  const admin = await prisma.user.create({ data: { email: "admin@ygmpo.ye", passwordHash: await bcrypt.hash("Admin@123", 10), name: "مدير النظام", role: UserRole.SYSTEM_ADMIN } });
  const analyst = await prisma.user.create({ data: { email: "analyst@ygmpo.ye", passwordHash: await bcrypt.hash("Analyst@123", 10), name: "محلل الأداء", role: UserRole.ANALYST } });
  const reviewer = await prisma.user.create({ data: { email: "reviewer@ygmpo.ye", passwordHash: await bcrypt.hash("Reviewer@123", 10), name: "مراجع المنهجية", role: UserRole.REVIEWER } });

  const ministryRows = [
    ["وزارة الخارجية وشؤون المغتربين", "MOFA"],
    ["وزارة المالية", "MOF"],
    ["وزارة الصحة العامة والسكان", "MOH"],
    ["وزارة التربية والتعليم", "MOE"],
    ["وزارة الداخلية", "MOI"],
    ["وزارة الكهرباء والطاقة", "MOEP"],
    ["وزارة المياه والبيئة", "MWE"]
  ] as const;

  const ministries = [];
  for (const [nameAr, code] of ministryRows) {
    ministries.push(await prisma.ministry.create({ data: { nameAr, code } }));
  }

  const officialRows = [
    ["د. شائع الزنداني", "وزير الخارجية وشؤون المغتربين"],
    ["سالم بن بريك", "وزير المالية"],
    ["د. قاسم بحيبح", "وزير الصحة العامة والسكان"],
    ["طارق العكبري", "وزير التربية والتعليم"],
    ["اللواء إبراهيم حيدان", "وزير الداخلية"],
    ["مانع بن يمين", "وزير الكهرباء والطاقة"],
    ["توفيق الشرجبي", "وزير المياه والبيئة"]
  ] as const;

  const officials = [];
  for (const [index, row] of officialRows.entries()) {
    officials.push(await prisma.official.create({ data: { fullNameAr: row[0], titleAr: row[1], appointmentDate: new Date("2024-02-01"), ministryId: ministries[index].id } }));
  }

  for (const ministry of ministries) {
    await prisma.evaluationSubject.create({ data: { subjectType: SubjectType.MINISTRY, ministryId: ministry.id } });
  }
  for (const official of officials) {
    await prisma.evaluationSubject.create({ data: { subjectType: SubjectType.OFFICIAL, officialId: official.id } });
  }

  const axes = await Promise.all([
    prisma.evaluationAxis.create({ data: { nameAr: "الإنجاز التنفيذي", scope: SubjectScope.BOTH, weight: 0.24, displayOrder: 1 } }),
    prisma.evaluationAxis.create({ data: { nameAr: "حضور اجتماعات مجلس الوزراء", scope: SubjectScope.OFFICIAL, weight: 0.14, displayOrder: 2 } }),
    prisma.evaluationAxis.create({ data: { nameAr: "التواجد داخل اليمن", scope: SubjectScope.OFFICIAL, weight: 0.12, displayOrder: 3 } }),
    prisma.evaluationAxis.create({ data: { nameAr: "التفاعل الرسمي والتصريحات", scope: SubjectScope.OFFICIAL, weight: 0.16, displayOrder: 4 } }),
    prisma.evaluationAxis.create({ data: { nameAr: "المواقف الوطنية والالتزام بالموقف الرسمي للدولة", scope: SubjectScope.OFFICIAL, weight: 0.18, displayOrder: 5 } }),
    prisma.evaluationAxis.create({ data: { nameAr: "الشفافية والتقارير", scope: SubjectScope.MINISTRY, weight: 0.16, displayOrder: 6 } })
  ]);

  const indicators = await Promise.all([
    prisma.evaluationIndicator.create({ data: { axisId: axes[0].id, nameAr: "تنفيذ المبادرات الشهرية", inputType: IndicatorInputType.PERCENTAGE, scoringType: ScoringType.DIRECT, maxScore: 100, weight: 0.5 } }),
    prisma.evaluationIndicator.create({ data: { axisId: axes[0].id, nameAr: "إنجاز القرارات التنفيذية", inputType: IndicatorInputType.PERCENTAGE, scoringType: ScoringType.DIRECT, maxScore: 100, weight: 0.5 } }),
    prisma.evaluationIndicator.create({ data: { axisId: axes[1].id, nameAr: "نسبة حضور اجتماعات مجلس الوزراء", inputType: IndicatorInputType.PERCENTAGE, scoringType: ScoringType.THRESHOLD, maxScore: 100, weight: 1, thresholdConfigJson: { excellent: 90, good: 75, fair: 60 } } }),
    prisma.evaluationIndicator.create({ data: { axisId: axes[2].id, nameAr: "نسبة الأيام داخل اليمن", inputType: IndicatorInputType.PERCENTAGE, scoringType: ScoringType.THRESHOLD, maxScore: 100, weight: 1, thresholdConfigJson: { excellent: 80, good: 65, fair: 50 } } }),
    prisma.evaluationIndicator.create({ data: { axisId: axes[3].id, nameAr: "الاستجابة الرسمية للقضايا العامة", inputType: IndicatorInputType.MANUAL_RATING, scoringType: ScoringType.WEIGHTED, maxScore: 100, weight: 0.55, requiresEvidence: true, requiresReview: true } }),
    prisma.evaluationIndicator.create({ data: { axisId: axes[3].id, nameAr: "توثيق التصريحات الرسمية", inputType: IndicatorInputType.PERCENTAGE, scoringType: ScoringType.DIRECT, maxScore: 100, weight: 0.45, requiresEvidence: true } }),
    prisma.evaluationIndicator.create({ data: { axisId: axes[4].id, nameAr: "اتساق الموقف مع السياسة العامة للدولة", inputType: IndicatorInputType.CATEGORICAL, scoringType: ScoringType.REVIEW_ONLY, maxScore: 100, weight: 0.6, requiresEvidence: true, requiresReview: true, isSensitive: true } }),
    prisma.evaluationIndicator.create({ data: { axisId: axes[4].id, nameAr: "تحويل الموقف المعلن إلى إجراء عملي", inputType: IndicatorInputType.MANUAL_RATING, scoringType: ScoringType.WEIGHTED, maxScore: 100, weight: 0.4, requiresEvidence: true, requiresReview: true, isSensitive: true } }),
    prisma.evaluationIndicator.create({ data: { axisId: axes[5].id, nameAr: "نشر التقارير والبيانات التوضيحية", inputType: IndicatorInputType.PERCENTAGE, scoringType: ScoringType.DIRECT, maxScore: 100, weight: 1 } })
  ]);

  const period = await prisma.evaluationPeriod.create({ data: { labelAr: "فبراير 2026", month: 2, year: 2026, startDate: new Date("2026-02-01"), endDate: new Date("2026-02-28"), status: PeriodStatus.OPEN } });
  const subjects = await prisma.evaluationSubject.findMany();

  for (const subject of subjects) {
    const relevantIndicators = indicators.filter((indicator) => {
      const axis = axes.find((item) => item.id === indicator.axisId);
      return axis?.scope === SubjectScope.BOTH || (axis?.scope === SubjectScope.MINISTRY && subject.subjectType === SubjectType.MINISTRY) || (axis?.scope === SubjectScope.OFFICIAL && subject.subjectType === SubjectType.OFFICIAL);
    });

    for (const indicator of relevantIndicators) {
      const numericValue = 64 + Math.floor(Math.random() * 28);
      await prisma.indicatorEntry.create({ data: { periodId: period.id, subjectId: subject.id, indicatorId: indicator.id, numericValue, valueText: indicator.inputType === IndicatorInputType.CATEGORICAL ? "aligned" : null, notes: "بيان تجريبي مبني على رصد دوري ومصادر موثقة.", confidenceLevel: CredibilityLevel.HIGH, reviewedById: reviewer.id, approvedAt: new Date("2026-03-05") } });
    }
  }

  for (const [index, official] of officials.entries()) {
    for (let meetingIndex = 0; meetingIndex < 6; meetingIndex += 1) {
      const meeting = await prisma.meeting.create({ data: { periodId: period.id, titleAr: `اجتماع مجلس الوزراء رقم ${meetingIndex + 1}`, meetingDate: new Date(`2026-02-${String(3 + meetingIndex * 4).padStart(2, "0")}T10:00:00Z`), locationAr: "عدن", notes: "متابعة الأولويات الخدمية والتنفيذية." } });
      await prisma.attendanceRecord.create({ data: { meetingId: meeting.id, officialId: official.id, status: index === 5 && meetingIndex === 4 ? AttendanceStatus.EXCUSED : AttendanceStatus.ATTENDED, participationNotes: "مداخلة مرتبطة باختصاص الوزارة." } });
    }

    await prisma.travelPresenceRecord.createMany({ data: [
      { officialId: official.id, presenceType: PresenceType.INSIDE_YEMEN, fromDate: new Date("2026-02-01"), toDate: new Date("2026-02-19"), purposeAr: "إدارة العمل والزيارات الميدانية", contextAr: "رسمي" },
      { officialId: official.id, presenceType: PresenceType.OUTSIDE_YEMEN, fromDate: new Date("2026-02-20"), toDate: new Date("2026-02-24"), purposeAr: "مهمة خارجية", contextAr: "رسمي" },
      { officialId: official.id, presenceType: PresenceType.INSIDE_YEMEN, fromDate: new Date("2026-02-25"), toDate: new Date("2026-02-28"), purposeAr: "متابعة تنفيذية", contextAr: "رسمي" }
    ]});

    const statement = await prisma.statement.create({ data: { officialId: official.id, titleAr: `تصريح رسمي حول أولويات ${official.titleAr}`, statementType: StatementType.OFFICIAL_STATEMENT, sourceType: EvidenceSourceType.OFFICIAL, issueTopicAr: "الأولويات الوطنية والخدمات العامة", summaryAr: "تأكيد التزام الجهة بخطة تنفيذية منسجمة مع السياسات العامة للدولة.", statementDate: new Date("2026-02-18"), sourceUrl: "https://example.org/statement" } });
    const topic = await prisma.nationalPositionTopic.create({ data: { topicAr: `موقف وطني - ${official.fullNameAr}`, officialStatePosition: "تعزيز وحدة مؤسسات الدولة، دعم الاستقرار، وربط التصريحات بالإجراء التنفيذي." } });

    await prisma.positionAlignmentRecord.create({ data: { topicId: topic.id, officialId: official.id, statementId: statement.id, alignmentStatus: index === 5 ? AlignmentStatus.PARTIALLY_ALIGNED : AlignmentStatus.ALIGNED, scoreContribution: index === 5 ? 72 : 88, actionSummaryAr: "تم رصد تصريح رسمي وإجراء لاحق مرتبط به.", reviewerNotes: "مدعوم بمصدر رسمي ومراجعة بشرية.", reviewedAt: new Date("2026-03-04") } });
    await prisma.evidence.create({ data: { titleAr: `دليل رسمي لـ ${official.fullNameAr}`, externalUrl: "https://example.org/evidence", sourceType: EvidenceSourceType.OFFICIAL, credibilityLevel: CredibilityLevel.HIGH, notes: "مرجع صالح للمؤشرات الحساسة." } });
  }

  const entries = await prisma.indicatorEntry.findMany({ include: { indicator: true } });
  for (const subject of subjects) {
    const subjectEntries = entries.filter((entry) => entry.subjectId === subject.id);
    const axisScores: { score: number; weight: number }[] = [];

    for (const axis of axes) {
      const axisEntries = subjectEntries.filter((entry) => entry.indicator.axisId === axis.id);
      if (!axisEntries.length) continue;
      const axisScore = computeWeightedScore(axisEntries.map((entry) => ({ score: entry.numericValue ?? (entry.valueText === "aligned" ? 85 : 70), weight: entry.indicator.weight })));
      const score = await prisma.score.create({ data: { periodId: period.id, subjectId: subject.id, axisId: axis.id, totalScore: axisScore } });
      axisScores.push({ score: axisScore, weight: axis.weight });

      for (const entry of axisEntries) {
        await prisma.scoreDetail.create({ data: { scoreId: score.id, indicatorId: entry.indicatorId, rawValue: entry.numericValue ?? null, computedScore: entry.numericValue ?? (entry.valueText === "aligned" ? 85 : 70), justification: "درجة محسوبة من الإدخال الموثق والأوزان المعتمدة." } });
      }
    }

    await prisma.score.create({ data: { periodId: period.id, subjectId: subject.id, totalScore: computeWeightedScore(axisScores) } });
  }

  const attendanceRate = computePercentage(41, 42);
  await prisma.report.create({ data: { titleAr: "التقرير الحكومي العام - فبراير 2026", slug: "government-report-2026-02", reportType: ReportType.GOVERNMENT_MONTHLY, periodId: period.id, summaryAr: "ملخص عام لأداء الوزارات والوزراء مع تحليل الحضور والتواجد والتفاعل الرسمي.", htmlContent: `<section dir="rtl"><h1>التقرير الحكومي العام</h1><p>معدل حضور مجلس الوزراء: ${attendanceRate}%</p><p>جميع المؤشرات الحساسة تمر عبر أدلة ومراجعة بشرية.</p></section>`, publishedAt: new Date("2026-03-10") } });

  await prisma.auditLog.createMany({ data: [
    { userId: admin.id, action: "SEED_BOOTSTRAP", entityType: "SYSTEM", entityId: period.id, payloadJson: { note: "تهيئة البيانات التجريبية" } },
    { userId: analyst.id, action: "SCORE_CALCULATED", entityType: "PERIOD", entityId: period.id, payloadJson: { label: period.labelAr } }
  ]});
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
