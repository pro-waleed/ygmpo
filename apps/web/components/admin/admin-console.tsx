"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import type {
  AdminUserRecord,
  ContentItemRecord,
  EvaluationCriterionRecord,
  EvaluationRecord,
  MinistrySnapshot,
  OfficialSnapshot,
  RoleRecord,
  SourceRecord
} from "@ygmpo/shared/types";
import {
  adminUsers as seedUsers,
  contentItems as seedContent,
  evaluationCriteria as seedCriteria,
  evaluationRecords as seedEvaluations,
  ministrySnapshots as seedMinistries,
  officialSnapshots as seedOfficials,
  roleRecords as seedRoles,
  sourceRecords as seedSources
} from "@ygmpo/shared/demo-data";

type TabKey = "overview" | "criteria" | "evaluations" | "ministries" | "officials" | "sources" | "roles" | "content";

const storageKey = "ygmpo-admin-state-v4";

const tabs: { key: TabKey; label: string; helper: string }[] = [
  { key: "overview", label: "مركز التحكم", helper: "ملخص الإدارة والمؤشرات" },
  { key: "criteria", label: "معايير الوزراء", helper: "إدارة عناصر التقييم الموضوعي" },
  { key: "evaluations", label: "سجلات التقييم", helper: "إدخال درجات فعلية وربطها بالأدلة" },
  { key: "ministries", label: "الجهات", helper: "الوزارات والجهات" },
  { key: "officials", label: "المسؤولون", helper: "الوزراء والقيادات" },
  { key: "sources", label: "المصادر", helper: "الأدلة والمرجعيات" },
  { key: "roles", label: "الأدوار", helper: "الصلاحيات والمستخدمون" },
  { key: "content", label: "المحتوى", helper: "التقارير والتصريحات" }
];

export function AdminConsole() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [ministries, setMinistries] = useState<MinistrySnapshot[]>(seedMinistries);
  const [officials, setOfficials] = useState<OfficialSnapshot[]>(seedOfficials);
  const [sources, setSources] = useState<SourceRecord[]>(seedSources);
  const [roles, setRoles] = useState<RoleRecord[]>(seedRoles);
  const [users, setUsers] = useState<AdminUserRecord[]>(seedUsers);
  const [contentItems, setContentItems] = useState<ContentItemRecord[]>(seedContent);
  const [criteria, setCriteria] = useState<EvaluationCriterionRecord[]>(seedCriteria);
  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>(seedEvaluations);

  const [ministryName, setMinistryName] = useState("");
  const [ministerName, setMinisterName] = useState("");
  const [officialName, setOfficialName] = useState("");
  const [officialMinistry, setOfficialMinistry] = useState("");
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [roleName, setRoleName] = useState("");
  const [contentTitle, setContentTitle] = useState("");
  const [contentOwner, setContentOwner] = useState("");
  const [criterionTitle, setCriterionTitle] = useState("");
  const [criterionWeight, setCriterionWeight] = useState("10");

  const [selectedOfficialId, setSelectedOfficialId] = useState(seedOfficials[0]?.id ?? "");
  const [selectedCriterionId, setSelectedCriterionId] = useState(seedCriteria[0]?.id ?? "");
  const [evaluationScore, setEvaluationScore] = useState("85");
  const [evaluationPeriod, setEvaluationPeriod] = useState("مارس 2026");
  const [evaluationEvidence, setEvaluationEvidence] = useState("");
  const [evaluationSourceTitle, setEvaluationSourceTitle] = useState(seedSources[0]?.title ?? "");
  const [evaluationImpact, setEvaluationImpact] = useState("");
  const [evaluationReviewerNote, setEvaluationReviewerNote] = useState("");
  const [evaluationStatus, setEvaluationStatus] = useState<EvaluationRecord["status"]>("قيد المراجعة");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (parsed.ministries) setMinistries(parsed.ministries);
      if (parsed.officials) setOfficials(parsed.officials);
      if (parsed.sources) setSources(parsed.sources);
      if (parsed.roles) setRoles(parsed.roles);
      if (parsed.users) setUsers(parsed.users);
      if (parsed.contentItems) setContentItems(parsed.contentItems);
      if (parsed.criteria) setCriteria(parsed.criteria);
      if (parsed.evaluations) setEvaluations(parsed.evaluations);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    startTransition(() => {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ ministries, officials, sources, roles, users, contentItems, criteria, evaluations })
      );
    });
  }, [ministries, officials, sources, roles, users, contentItems, criteria, evaluations]);

  const activeCriteriaCount = useMemo(() => criteria.filter((item) => item.enabled).length, [criteria]);
  const totalActiveWeight = useMemo(() => criteria.filter((item) => item.enabled).reduce((sum, item) => sum + item.weight, 0), [criteria]);
  const pendingReviewCount = useMemo(
    () =>
      contentItems.filter((item) => item.status === "قيد المراجعة").length +
      sources.filter((item) => item.credibility === "قيد المراجعة").length +
      criteria.filter((item) => item.reviewerRequired && item.enabled).length +
      evaluations.filter((item) => item.status === "قيد المراجعة").length,
    [contentItems, sources, criteria, evaluations]
  );
  const approvedEvaluations = useMemo(() => evaluations.filter((item) => item.status === "معتمد").length, [evaluations]);
  const averageScore = useMemo(() => {
    if (!evaluations.length) return 0;
    return Math.round(evaluations.reduce((sum, item) => sum + item.score, 0) / evaluations.length);
  }, [evaluations]);
  const evaluationsNeedingEvidence = useMemo(
    () => evaluations.filter((item) => item.evidenceSummary.trim().length < 20).length,
    [evaluations]
  );
  const recentEvaluations = useMemo(() => [...evaluations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5), [evaluations]);

  function addMinistry() {
    if (!ministryName.trim() || !ministerName.trim()) return;
    setMinistries((current) => [
      {
        id: `m-${Date.now()}`,
        name: ministryName.trim(),
        code: `C${current.length + 1}`,
        rank: current.length + 1,
        score: 70,
        ministerName: ministerName.trim(),
        attendanceRate: 75,
        insideYemenRate: 68
      },
      ...current
    ]);
    setMinistryName("");
    setMinisterName("");
  }

  function addOfficial() {
    if (!officialName.trim() || !officialMinistry.trim()) return;
    setOfficials((current) => [
      { id: `o-${Date.now()}`, name: officialName.trim(), ministryName: officialMinistry.trim(), score: 71, alignmentRate: 74, presenceRate: 69 },
      ...current
    ]);
    setUsers((current) => [
      { id: `u-${Date.now()}`, name: officialName.trim(), role: "مدخل بيانات", status: "بانتظار التفعيل", ministry: officialMinistry.trim() },
      ...current
    ]);
    setOfficialName("");
    setOfficialMinistry("");
  }

  function addSource() {
    if (!sourceTitle.trim() || !sourceUrl.trim()) return;
    setSources((current) => [
      { id: `s-${Date.now()}`, title: sourceTitle.trim(), url: sourceUrl.trim(), type: "رسمي", credibility: "قيد المراجعة" },
      ...current
    ]);
    setSourceTitle("");
    setSourceUrl("");
  }

  function addRole() {
    if (!roleName.trim()) return;
    setRoles((current) => [{ id: `r-${Date.now()}`, name: roleName.trim(), permissions: ["مراجعة", "إدخال", "اعتماد"], membersCount: 0 }, ...current]);
    setRoleName("");
  }

  function addContentItem() {
    if (!contentTitle.trim() || !contentOwner.trim()) return;
    setContentItems((current) => [{ id: `c-${Date.now()}`, title: contentTitle.trim(), type: "تقرير", status: "مسودة", owner: contentOwner.trim() }, ...current]);
    setContentTitle("");
    setContentOwner("");
  }

  function addCriterion() {
    if (!criterionTitle.trim()) return;
    setCriteria((current) => [
      {
        id: `ec-${Date.now()}`,
        title: criterionTitle.trim(),
        category: "حوكمة",
        weight: Number(criterionWeight),
        enabled: true,
        evidenceRequired: true,
        reviewerRequired: true,
        note: "عنصر مضاف من لوحة الإدارة.",
        objectiveMeasure: "حدد ما الذي سيقاس بصورة صريحة.",
        calculationMethod: "حدد قاعدة حساب أو مقارنة واضحة.",
        scoringExample: "أضف مثالًا على عتبات أو نطاقات الدرجة."
      },
      ...current
    ]);
    setCriterionTitle("");
    setCriterionWeight("10");
  }

  function updateCriterion(id: string, patch: Partial<EvaluationCriterionRecord>) {
    setCriteria((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function addEvaluation() {
    const official = officials.find((item) => item.id === selectedOfficialId);
    const criterion = criteria.find((item) => item.id === selectedCriterionId);
    if (!official || !criterion || !evaluationEvidence.trim() || !evaluationImpact.trim()) return;

    setEvaluations((current) => [
      {
        id: `ev-${Date.now()}`,
        officialId: official.id,
        officialName: official.name,
        ministryName: official.ministryName,
        criterionId: criterion.id,
        criterionTitle: criterion.title,
        periodLabel: evaluationPeriod.trim() || "مارس 2026",
        score: Number(evaluationScore),
        status: evaluationStatus,
        evidenceSummary: evaluationEvidence.trim(),
        sourceTitle: evaluationSourceTitle.trim() || "مصدر داخلي",
        impactSummary: evaluationImpact.trim(),
        reviewerNote: evaluationReviewerNote.trim() || "بانتظار ملاحظة المراجع.",
        updatedAt: new Date().toISOString().slice(0, 10)
      },
      ...current
    ]);

    setEvaluationScore("85");
    setEvaluationEvidence("");
    setEvaluationImpact("");
    setEvaluationReviewerNote("");
    setEvaluationStatus("قيد المراجعة");
  }

  return (
    <div className="space-y-8">
      <section className="hero-panel hero-sheen grid-glow reveal-up relative overflow-hidden rounded-[36px] px-8 py-10 text-white shadow-soft">
        <div className="float-orb left-10 top-12 h-24 w-24 bg-gold/60" />
        <div className="float-orb right-14 top-10 h-32 w-32 bg-teal/40" />
        <div className="float-orb bottom-8 left-1/3 h-16 w-16 bg-white/20" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="metric-pill text-white">إدارة المحتوى والبيانات والتقييم الموضوعي</span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight">لوحة تشغيلية لإدارة المنصة وسجلات تقييم الوزراء بصورة قابلة للقياس والمراجعة</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-white/80">
              المنصة لم تعد تكتفي بتعريف عناصر التقييم، بل أصبحت تعرض دورة عمل كاملة: معيار موضوعي، سجل تقييم فعلي، دليل، درجة، أثر، وملاحظة مراجعة.
              هذا يجعل المنصة أكثر قربًا من إدارة محتوى رقابية حقيقية، حتى في نسخة العرض الحالية.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/85">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">تقييمات قابلة للتدقيق</span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">دلائل ومصادر مرتبطة</span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">حالة مراجعة واعتماد</span>
            </div>
          </div>
          <div className="glass-card grid gap-4 p-5 text-ink">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoBox label="بانتظار المراجعة" value={pendingReviewCount.toString()} accent="amber" />
              <InfoBox label="سجلات معتمدة" value={approvedEvaluations.toString()} accent="teal" />
              <InfoBox label="متوسط الدرجات" value={`${averageScore}`} accent="slate" />
              <InfoBox label="سجلات تحتاج دليل أوفى" value={evaluationsNeedingEvidence.toString()} accent="rose" />
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card reveal-up p-4">
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)} className={activeTab === tab.key ? "primary-button" : "soft-button"}>
              {tab.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-ink/60">{tabs.find((item) => item.key === activeTab)?.helper}</p>
      </section>

      {activeTab === "overview" && (
        <section className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="space-y-6">
            <div className="card reveal-up p-6">
              <h2 className="section-title text-xl">ملخص الإدارة</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <InfoBox label="الجهات" value={ministries.length.toString()} accent="slate" />
                <InfoBox label="المسؤولون" value={officials.length.toString()} accent="slate" />
                <InfoBox label="الأدوار" value={roles.length.toString()} accent="slate" />
                <InfoBox label="عناصر التقييم" value={criteria.length.toString()} accent="slate" />
              </div>
            </div>
            <div className="card reveal-up p-6">
              <h2 className="section-title text-xl">جاهزية التقييم الموضوعي</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <SignalCard title="المعايير النشطة" value={activeCriteriaCount.toString()} hint="المؤشرات المفعلة فعليًا في نموذج التقييم" tone="teal" />
                <SignalCard title="إجمالي الأوزان" value={totalActiveWeight.toString()} hint="مجموع الأوزان الحالية للمؤشرات النشطة" tone="gold" />
                <SignalCard title="سجلات التقييم" value={evaluations.length.toString()} hint="إدخالات تقييم فعلية مرتبطة بمسؤولين ومعايير" tone="navy" />
                <SignalCard title="متوسط الدرجة" value={`${averageScore}/100`} hint="صورة سريعة لمستوى الأداء في السجلات الحالية" tone="rose" />
              </div>
            </div>
          </div>

          <div className="card reveal-up p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="section-title text-xl">آخر سجلات التقييم</h2>
                <p className="mt-2 text-sm leading-7 text-ink/60">رؤية تشغيلية سريعة لما تم إدخاله أو مراجعته مؤخرًا داخل المرصد.</p>
              </div>
              <span className="admin-pill">{recentEvaluations.length} عناصر</span>
            </div>
            <div className="mt-5 space-y-4">
              {recentEvaluations.map((item) => (
                <EvaluationTimelineCard key={item.id} record={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === "criteria" && (
        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <ManagementSection title="معايير تقييم الوزراء" subtitle="إدارة عناصر التقييم بصيغة موضوعية قابلة للقياس والحساب">
            <div className="grid gap-3 md:grid-cols-[1fr_160px_auto]">
              <input className="input-shell" value={criterionTitle} onChange={(event) => setCriterionTitle(event.target.value)} placeholder="عنوان عنصر تقييم جديد" />
              <input className="input-shell" value={criterionWeight} onChange={(event) => setCriterionWeight(event.target.value)} placeholder="الوزن" type="number" min="1" max="100" />
              <button type="button" className="primary-button" onClick={addCriterion}>إضافة عنصر</button>
            </div>
            <div className="rounded-3xl bg-slate-50/80 p-4 text-sm leading-8 text-ink/72">
              كل معيار يجب أن يجيب صراحة عن ثلاثة أسئلة: ما الذي نقيسه؟ كيف نحسبه؟ وما المثال العملي على الدرجة؟ بهذه الطريقة يصبح تقييم موقف الوزير أو حضوره أو تواجده قابلًا للتفسير لا مجرد حكم عام.
            </div>
          </ManagementSection>

          <div className="space-y-4">
            {criteria.map((item) => (
              <article key={item.id} className="card reveal-up p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold">{item.title}</h3>
                      <span className="admin-pill">{item.category}</span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-ink/65">{item.note}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm font-semibold text-ink">وزن {item.weight}</div>
                </div>
                <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
                  <label className="rounded-2xl bg-slate-50/80 p-4 text-sm text-ink/75">
                    <span className="mb-3 block font-medium">الوزن</span>
                    <input type="range" min="1" max="30" value={item.weight} onChange={(event) => updateCriterion(item.id, { weight: Number(event.target.value) })} className="w-full accent-teal" />
                  </label>
                  <label className="flex items-center justify-between rounded-2xl bg-slate-50/80 p-4 text-sm text-ink/75">
                    <span>تفعيل العنصر</span>
                    <input type="checkbox" checked={item.enabled} onChange={(event) => updateCriterion(item.id, { enabled: event.target.checked })} className="h-5 w-5 accent-teal" />
                  </label>
                  <label className="flex items-center justify-between rounded-2xl bg-slate-50/80 p-4 text-sm text-ink/75">
                    <span>اشتراط دليل</span>
                    <input type="checkbox" checked={item.evidenceRequired} onChange={(event) => updateCriterion(item.id, { evidenceRequired: event.target.checked })} className="h-5 w-5 accent-teal" />
                  </label>
                </div>
                <div className="mt-5 grid gap-3 lg:grid-cols-3">
                  <MetricExplain title="ما الذي يُقاس؟" value={item.objectiveMeasure} />
                  <MetricExplain title="كيف يُحسب؟" value={item.calculationMethod} />
                  <MetricExplain title="مثال على الدرجة" value={item.scoringExample} />
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-ink/65">
                  <span className="rounded-full bg-slate-100 px-3 py-1">{item.reviewerRequired ? "يتطلب مراجعة" : "لا يتطلب مراجعة"}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">{item.enabled ? "نشط" : "معطل"}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === "evaluations" && (
        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <ManagementSection title="سجلات تقييم الوزراء" subtitle="إدخال درجة موضوعية فعلية وربطها بمسؤول ومعيار ودليل ومصدر">
            <div className="grid gap-3 md:grid-cols-2">
              <select className="input-shell" value={selectedOfficialId} onChange={(event) => setSelectedOfficialId(event.target.value)}>
                {officials.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
              <select className="input-shell" value={selectedCriterionId} onChange={(event) => setSelectedCriterionId(event.target.value)}>
                {criteria.filter((item) => item.enabled).map((item) => (
                  <option key={item.id} value={item.id}>{item.title}</option>
                ))}
              </select>
              <input className="input-shell" value={evaluationPeriod} onChange={(event) => setEvaluationPeriod(event.target.value)} placeholder="الفترة" />
              <input className="input-shell" value={evaluationScore} onChange={(event) => setEvaluationScore(event.target.value)} type="number" min="0" max="100" placeholder="الدرجة" />
              <input className="input-shell" value={evaluationSourceTitle} onChange={(event) => setEvaluationSourceTitle(event.target.value)} placeholder="اسم المصدر" />
              <select className="input-shell" value={evaluationStatus} onChange={(event) => setEvaluationStatus(event.target.value as EvaluationRecord["status"])}>
                <option value="مسودة">مسودة</option>
                <option value="قيد المراجعة">قيد المراجعة</option>
                <option value="معتمد">معتمد</option>
              </select>
            </div>
            <textarea className="input-shell min-h-28" value={evaluationEvidence} onChange={(event) => setEvaluationEvidence(event.target.value)} placeholder="ملخص الدليل أو السجل المرجعي" />
            <textarea className="input-shell min-h-24" value={evaluationImpact} onChange={(event) => setEvaluationImpact(event.target.value)} placeholder="الأثر أو التفسير التنفيذي للدرجة" />
            <textarea className="input-shell min-h-24" value={evaluationReviewerNote} onChange={(event) => setEvaluationReviewerNote(event.target.value)} placeholder="ملاحظة المراجع أو سبب الاعتماد/التأجيل" />
            <div className="rounded-3xl bg-slate-50/80 p-4 text-sm leading-8 text-ink/70">
              مثال: إذا كان المؤشر هو <strong>انضباط حضور مجلس الوزراء</strong>، فالدرجة يجب أن تبنى على نسبة حضور فعلية. وإذا كان المؤشر هو <strong>موقف الوزير في قضية ما</strong>، فالمدخل يجب أن يذكر القضية والموقف الرسمي وما صدر عن الوزير وما إذا تبعه إجراء.
            </div>
            <button type="button" className="primary-button w-full justify-center" onClick={addEvaluation}>إضافة سجل تقييم</button>
          </ManagementSection>

          <div className="space-y-4">
            {evaluations.map((item) => (
              <article key={item.id} className="card reveal-up overflow-hidden p-0">
                <div className="border-b border-slate-100 bg-gradient-to-r from-[#f8fafc] via-white to-[#f0fdfa] px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold">{item.officialName}</h3>
                        <span className="admin-pill">{item.status}</span>
                      </div>
                      <p className="mt-2 text-sm text-ink/60">{item.ministryName} • {item.criterionTitle}</p>
                    </div>
                    <ScoreRing score={item.score} />
                  </div>
                </div>
                <div className="grid gap-4 px-5 py-5 lg:grid-cols-[1fr_1fr]">
                  <MetricExplain title="الدليل" value={item.evidenceSummary} />
                  <MetricExplain title="الأثر أو التفسير" value={item.impactSummary} />
                  <MetricExplain title="المصدر والفترة" value={`${item.sourceTitle} • ${item.periodLabel}`} />
                  <MetricExplain title="ملاحظة المراجع" value={item.reviewerNote} />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === "ministries" && (
        <ManagementSection title="إدارة الجهات الحكومية" subtitle="إضافة جهة جديدة وتحديث قائمة العرض الحالية">
          <div className="grid gap-3 md:grid-cols-3">
            <input className="input-shell" value={ministryName} onChange={(event) => setMinistryName(event.target.value)} placeholder="اسم الوزارة أو الجهة" />
            <input className="input-shell" value={ministerName} onChange={(event) => setMinisterName(event.target.value)} placeholder="اسم الوزير أو المسؤول" />
            <button type="button" className="primary-button" onClick={addMinistry}>إضافة جهة</button>
          </div>
          <DataList items={ministries.map((item) => ({ id: item.id, title: item.name, meta: item.ministerName, status: `${item.score}%` }))} />
        </ManagementSection>
      )}

      {activeTab === "officials" && (
        <ManagementSection title="إدارة المسؤولين" subtitle="إضافة وزير أو مسؤول وربطه بجهة">
          <div className="grid gap-3 md:grid-cols-3">
            <input className="input-shell" value={officialName} onChange={(event) => setOfficialName(event.target.value)} placeholder="اسم المسؤول" />
            <input className="input-shell" value={officialMinistry} onChange={(event) => setOfficialMinistry(event.target.value)} placeholder="الوزارة أو الجهة" />
            <button type="button" className="primary-button" onClick={addOfficial}>إضافة مسؤول</button>
          </div>
          <DataList items={officials.map((item) => ({ id: item.id, title: item.name, meta: item.ministryName, status: `${item.score}%` }))} />
        </ManagementSection>
      )}

      {activeTab === "sources" && (
        <ManagementSection title="إدارة المصادر والأدلة" subtitle="إضافة مصدر جديد وإظهاره فورًا في قائمة الرصد">
          <div className="grid gap-3 md:grid-cols-3">
            <input className="input-shell" value={sourceTitle} onChange={(event) => setSourceTitle(event.target.value)} placeholder="عنوان المصدر" />
            <input className="input-shell" value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} placeholder="الرابط" />
            <button type="button" className="primary-button" onClick={addSource}>إضافة مصدر</button>
          </div>
          <DataList items={sources.map((item) => ({ id: item.id, title: item.title, meta: `${item.type} • ${item.url}`, status: item.credibility }))} />
        </ManagementSection>
      )}

      {activeTab === "roles" && (
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <ManagementSection title="إدارة الأدوار" subtitle="تعريف الأدوار وصلاحياتها داخل المنصة">
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <input className="input-shell" value={roleName} onChange={(event) => setRoleName(event.target.value)} placeholder="اسم الدور" />
              <button type="button" className="primary-button" onClick={addRole}>إضافة دور</button>
            </div>
            <DataList items={roles.map((item) => ({ id: item.id, title: item.name, meta: item.permissions.join(" • "), status: `${item.membersCount} أعضاء` }))} />
          </ManagementSection>
          <div className="card reveal-up p-6">
            <h2 className="section-title text-xl">المستخدمون والإتاحة</h2>
            <div className="mt-5 space-y-3">
              {users.map((user) => (
                <article key={user.id} className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="mt-1 text-sm text-ink/55">{user.role}{user.ministry ? ` • ${user.ministry}` : ""}</p>
                    </div>
                    <span className="admin-pill">{user.status}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === "content" && (
        <ManagementSection title="إدارة المحتوى والمنشورات" subtitle="إضافة تقرير أو تصريح أو عنصر محتوى جديد للمنصة">
          <div className="grid gap-3 md:grid-cols-3">
            <input className="input-shell" value={contentTitle} onChange={(event) => setContentTitle(event.target.value)} placeholder="عنوان المحتوى" />
            <input className="input-shell" value={contentOwner} onChange={(event) => setContentOwner(event.target.value)} placeholder="المالك أو المحرر" />
            <button type="button" className="primary-button" onClick={addContentItem}>إضافة محتوى</button>
          </div>
          <DataList items={contentItems.map((item) => ({ id: item.id, title: item.title, meta: `${item.type} • ${item.owner}`, status: item.status }))} />
        </ManagementSection>
      )}
    </div>
  );
}

function ManagementSection({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="card reveal-up space-y-5 p-6">
      <div>
        <h2 className="section-title text-xl">{title}</h2>
        <p className="mt-2 text-sm leading-7 text-ink/60">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function InfoBox({ label, value, accent }: { label: string; value: string; accent: "amber" | "teal" | "slate" | "rose" }) {
  const accentClasses = {
    amber: "from-[#fef3c7] to-white",
    teal: "from-[#ccfbf1] to-white",
    slate: "from-[#e2e8f0] to-white",
    rose: "from-[#ffe4e6] to-white"
  };

  return (
    <div className={`rounded-3xl bg-gradient-to-br ${accentClasses[accent]} p-4`}>
      <p className="text-sm text-ink/55">{label}</p>
      <p className="mt-2 text-3xl font-extrabold">{value}</p>
    </div>
  );
}

function SignalCard({ title, value, hint, tone }: { title: string; value: string; hint: string; tone: "teal" | "gold" | "navy" | "rose" }) {
  const toneClasses = {
    teal: "border-teal/20 bg-teal/5",
    gold: "border-gold/30 bg-gold/10",
    navy: "border-slate-200 bg-slate-50",
    rose: "border-rose-200 bg-rose-50"
  };

  return (
    <article className={`rounded-3xl border p-4 ${toneClasses[tone]}`}>
      <p className="text-sm text-ink/55">{title}</p>
      <p className="mt-2 text-3xl font-extrabold text-ink">{value}</p>
      <p className="mt-2 text-sm leading-7 text-ink/60">{hint}</p>
    </article>
  );
}

function DataList({ items }: { items: { id: string; title: string; meta: string; status: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article key={item.id} className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4 transition hover:-translate-y-0.5 hover:shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-ink/55">{item.meta}</p>
            </div>
            <span className="admin-pill">{item.status}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

function MetricExplain({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50/80 p-4">
      <p className="text-xs font-semibold text-teal">{title}</p>
      <p className="mt-2 text-sm leading-7 text-ink/72">{value}</p>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const tone = score >= 85 ? "bg-teal text-white" : score >= 70 ? "bg-gold/80 text-ink" : "bg-rose-100 text-rose-700";
  return <div className={`flex h-16 w-16 items-center justify-center rounded-full text-lg font-extrabold shadow-soft ${tone}`}>{score}</div>;
}

function EvaluationTimelineCard({ record }: { record: EvaluationRecord }) {
  return (
    <article className="rounded-3xl border border-slate-100 bg-slate-50/85 p-4 transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{record.officialName}</p>
            <span className="admin-pill">{record.status}</span>
          </div>
          <p className="mt-1 text-sm text-ink/55">{record.criterionTitle} • {record.periodLabel}</p>
          <p className="mt-3 text-sm leading-7 text-ink/65">{record.impactSummary}</p>
        </div>
        <ScoreRing score={record.score} />
      </div>
    </article>
  );
}
