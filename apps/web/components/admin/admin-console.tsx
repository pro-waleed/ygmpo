"use client";

import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
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

type EvaluationStatus = EvaluationRecord["status"];

type MinistryForm = {
  name: string;
  ministerName: string;
  score: string;
  attendanceRate: string;
  insideYemenRate: string;
};

type OfficialForm = {
  name: string;
  ministryName: string;
  score: string;
  alignmentRate: string;
  presenceRate: string;
};

type SourceForm = {
  title: string;
  type: SourceRecord["type"];
  url: string;
  credibility: SourceRecord["credibility"];
};

type RoleForm = {
  name: string;
  permissions: string;
  membersCount: string;
};

type ContentForm = {
  title: string;
  type: ContentItemRecord["type"];
  status: ContentItemRecord["status"];
  owner: string;
};

type CriterionForm = {
  title: string;
  category: EvaluationCriterionRecord["category"];
  weight: string;
  enabled: boolean;
  evidenceRequired: boolean;
  reviewerRequired: boolean;
  note: string;
  objectiveMeasure: string;
  calculationMethod: string;
  scoringExample: string;
};

type EvaluationForm = {
  officialId: string;
  criterionId: string;
  periodLabel: string;
  score: string;
  status: EvaluationStatus;
  evidenceSummary: string;
  sourceTitle: string;
  impactSummary: string;
  reviewerNote: string;
};

const storageKey = "ygmpo-admin-state-v5";

const tabs: { key: TabKey; label: string; helper: string }[] = [
  { key: "overview", label: "مركز التحكم", helper: "ملخص الإدارة والمؤشرات" },
  { key: "criteria", label: "معايير الوزراء", helper: "إدارة وتحرير عناصر التقييم الموضوعي" },
  { key: "evaluations", label: "سجلات التقييم", helper: "إضافة وتعديل درجات التقييم وربطها بالأدلة" },
  { key: "ministries", label: "الجهات", helper: "إدارة الوزارات والجهات مع التعديل السريع" },
  { key: "officials", label: "المسؤولون", helper: "إدارة الوزراء والقيادات وربطهم بالجهات" },
  { key: "sources", label: "المصادر", helper: "إدارة الأدلة والمرجعيات ومستوى الموثوقية" },
  { key: "roles", label: "الأدوار", helper: "إدارة الصلاحيات والفرق" },
  { key: "content", label: "المحتوى", helper: "إدارة التقارير والتصريحات والعناصر المنشورة" }
];

const emptyMinistryForm: MinistryForm = { name: "", ministerName: "", score: "70", attendanceRate: "75", insideYemenRate: "68" };
const emptyOfficialForm: OfficialForm = { name: "", ministryName: "", score: "71", alignmentRate: "74", presenceRate: "69" };
const emptySourceForm: SourceForm = { title: "", type: "رسمي", url: "", credibility: "قيد المراجعة" };
const emptyRoleForm: RoleForm = { name: "", permissions: "مراجعة، إدخال، اعتماد", membersCount: "0" };
const emptyContentForm: ContentForm = { title: "", type: "تقرير", status: "مسودة", owner: "" };
const emptyCriterionForm: CriterionForm = {
  title: "",
  category: "حوكمة",
  weight: "10",
  enabled: true,
  evidenceRequired: true,
  reviewerRequired: true,
  note: "",
  objectiveMeasure: "",
  calculationMethod: "",
  scoringExample: ""
};
const emptyEvaluationForm = (officialId = "", criterionId = "", sourceTitle = ""): EvaluationForm => ({
  officialId,
  criterionId,
  periodLabel: "مارس 2026",
  score: "85",
  status: "قيد المراجعة",
  evidenceSummary: "",
  sourceTitle,
  impactSummary: "",
  reviewerNote: ""
});

export function AdminConsole() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [ministries, setMinistries] = useState<MinistrySnapshot[]>(seedMinistries);
  const [officials, setOfficials] = useState<OfficialSnapshot[]>(seedOfficials);
  const [sources, setSources] = useState<SourceRecord[]>(seedSources);
  const [roles, setRoles] = useState<RoleRecord[]>(seedRoles);
  const [users] = useState<AdminUserRecord[]>(seedUsers);
  const [contentItems, setContentItems] = useState<ContentItemRecord[]>(seedContent);
  const [criteria, setCriteria] = useState<EvaluationCriterionRecord[]>(seedCriteria);
  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>(seedEvaluations);

  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery.trim());
  const [evaluationStatusFilter, setEvaluationStatusFilter] = useState<"الكل" | EvaluationStatus>("الكل");

  const [selectedMinistryId, setSelectedMinistryId] = useState<string | null>(seedMinistries[0]?.id ?? null);
  const [selectedOfficialId, setSelectedOfficialId] = useState<string | null>(seedOfficials[0]?.id ?? null);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(seedSources[0]?.id ?? null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(seedRoles[0]?.id ?? null);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(seedContent[0]?.id ?? null);
  const [selectedCriterionId, setSelectedCriterionId] = useState<string | null>(seedCriteria[0]?.id ?? null);
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<string | null>(seedEvaluations[0]?.id ?? null);

  const [ministryForm, setMinistryForm] = useState<MinistryForm>(emptyMinistryForm);
  const [officialForm, setOfficialForm] = useState<OfficialForm>(emptyOfficialForm);
  const [sourceForm, setSourceForm] = useState<SourceForm>(emptySourceForm);
  const [roleForm, setRoleForm] = useState<RoleForm>(emptyRoleForm);
  const [contentForm, setContentForm] = useState<ContentForm>(emptyContentForm);
  const [criterionForm, setCriterionForm] = useState<CriterionForm>(emptyCriterionForm);
  const [evaluationForm, setEvaluationForm] = useState<EvaluationForm>(emptyEvaluationForm(seedOfficials[0]?.id ?? "", seedCriteria[0]?.id ?? "", seedSources[0]?.title ?? ""));

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (parsed.ministries) setMinistries(parsed.ministries);
      if (parsed.officials) setOfficials(parsed.officials);
      if (parsed.sources) setSources(parsed.sources);
      if (parsed.roles) setRoles(parsed.roles);
      if (parsed.contentItems) setContentItems(parsed.contentItems);
      if (parsed.criteria) setCriteria(parsed.criteria);
      if (parsed.evaluations) setEvaluations(parsed.evaluations);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    startTransition(() => {
      window.localStorage.setItem(storageKey, JSON.stringify({ ministries, officials, sources, roles, contentItems, criteria, evaluations }));
    });
  }, [ministries, officials, sources, roles, contentItems, criteria, evaluations]);

  useEffect(() => {
    const item = ministries.find((entry) => entry.id === selectedMinistryId);
    if (!item) {
      setMinistryForm(emptyMinistryForm);
      return;
    }
    setMinistryForm({
      name: item.name,
      ministerName: item.ministerName,
      score: String(item.score),
      attendanceRate: String(item.attendanceRate),
      insideYemenRate: String(item.insideYemenRate)
    });
  }, [selectedMinistryId, ministries]);

  useEffect(() => {
    const item = officials.find((entry) => entry.id === selectedOfficialId);
    if (!item) {
      setOfficialForm(emptyOfficialForm);
      return;
    }
    setOfficialForm({
      name: item.name,
      ministryName: item.ministryName,
      score: String(item.score),
      alignmentRate: String(item.alignmentRate),
      presenceRate: String(item.presenceRate)
    });
  }, [selectedOfficialId, officials]);
  useEffect(() => {
    const item = sources.find((entry) => entry.id === selectedSourceId);
    if (!item) {
      setSourceForm(emptySourceForm);
      return;
    }
    setSourceForm({ title: item.title, type: item.type, url: item.url, credibility: item.credibility });
  }, [selectedSourceId, sources]);

  useEffect(() => {
    const item = roles.find((entry) => entry.id === selectedRoleId);
    if (!item) {
      setRoleForm(emptyRoleForm);
      return;
    }
    setRoleForm({ name: item.name, permissions: item.permissions.join("، "), membersCount: String(item.membersCount) });
  }, [selectedRoleId, roles]);

  useEffect(() => {
    const item = contentItems.find((entry) => entry.id === selectedContentId);
    if (!item) {
      setContentForm(emptyContentForm);
      return;
    }
    setContentForm({ title: item.title, type: item.type, status: item.status, owner: item.owner });
  }, [selectedContentId, contentItems]);

  useEffect(() => {
    const item = criteria.find((entry) => entry.id === selectedCriterionId);
    if (!item) {
      setCriterionForm(emptyCriterionForm);
      return;
    }
    setCriterionForm({
      title: item.title,
      category: item.category,
      weight: String(item.weight),
      enabled: item.enabled,
      evidenceRequired: item.evidenceRequired,
      reviewerRequired: item.reviewerRequired,
      note: item.note,
      objectiveMeasure: item.objectiveMeasure,
      calculationMethod: item.calculationMethod,
      scoringExample: item.scoringExample
    });
  }, [selectedCriterionId, criteria]);

  useEffect(() => {
    const item = evaluations.find((entry) => entry.id === selectedEvaluationId);
    if (!item) {
      setEvaluationForm(emptyEvaluationForm(officials[0]?.id ?? "", criteria[0]?.id ?? "", sources[0]?.title ?? ""));
      return;
    }
    setEvaluationForm({
      officialId: item.officialId,
      criterionId: item.criterionId,
      periodLabel: item.periodLabel,
      score: String(item.score),
      status: item.status,
      evidenceSummary: item.evidenceSummary,
      sourceTitle: item.sourceTitle,
      impactSummary: item.impactSummary,
      reviewerNote: item.reviewerNote
    });
  }, [selectedEvaluationId, evaluations, officials, criteria, sources]);

  const query = deferredSearchQuery.toLowerCase();
  const matches = (value: string) => value.toLowerCase().includes(query);

  const filteredMinistries = useMemo(
    () => ministries.filter((item) => !query || matches(item.name) || matches(item.ministerName) || matches(item.code)),
    [ministries, query]
  );
  const filteredOfficials = useMemo(
    () => officials.filter((item) => !query || matches(item.name) || matches(item.ministryName)),
    [officials, query]
  );
  const filteredSources = useMemo(
    () => sources.filter((item) => !query || matches(item.title) || matches(item.url) || matches(item.type)),
    [sources, query]
  );
  const filteredRoles = useMemo(
    () => roles.filter((item) => !query || matches(item.name) || item.permissions.some((permission) => matches(permission))),
    [roles, query]
  );
  const filteredContent = useMemo(
    () => contentItems.filter((item) => !query || matches(item.title) || matches(item.owner) || matches(item.type)),
    [contentItems, query]
  );
  const filteredCriteria = useMemo(
    () => criteria.filter((item) => !query || matches(item.title) || matches(item.category) || matches(item.note)),
    [criteria, query]
  );
  const filteredEvaluations = useMemo(
    () =>
      evaluations.filter((item) => {
        const statusMatch = evaluationStatusFilter === "الكل" || item.status === evaluationStatusFilter;
        const textMatch = !query || matches(item.officialName) || matches(item.criterionTitle) || matches(item.ministryName) || matches(item.sourceTitle);
        return statusMatch && textMatch;
      }),
    [evaluations, evaluationStatusFilter, query]
  );

  const pendingReviewCount = useMemo(
    () =>
      contentItems.filter((item) => item.status === "قيد المراجعة").length +
      sources.filter((item) => item.credibility === "قيد المراجعة").length +
      criteria.filter((item) => item.reviewerRequired && item.enabled).length +
      evaluations.filter((item) => item.status === "قيد المراجعة").length,
    [contentItems, sources, criteria, evaluations]
  );
  const approvedEvaluations = useMemo(() => evaluations.filter((item) => item.status === "معتمد").length, [evaluations]);
  const activeCriteriaCount = useMemo(() => criteria.filter((item) => item.enabled).length, [criteria]);
  const totalActiveWeight = useMemo(() => criteria.filter((item) => item.enabled).reduce((sum, item) => sum + item.weight, 0), [criteria]);
  const averageScore = useMemo(() => (evaluations.length ? Math.round(evaluations.reduce((sum, item) => sum + item.score, 0) / evaluations.length) : 0), [evaluations]);
  const recentEvaluations = useMemo(() => [...evaluations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5), [evaluations]);
  const totalEntities = ministries.length + officials.length + sources.length + roles.length + contentItems.length;

  function resetMinistryEditor() {
    setSelectedMinistryId(null);
    setMinistryForm(emptyMinistryForm);
  }

  function saveMinistry() {
    if (!ministryForm.name.trim() || !ministryForm.ministerName.trim()) return;

    if (selectedMinistryId) {
      setMinistries((current) => current.map((item) => item.id === selectedMinistryId ? {
        ...item,
        name: ministryForm.name.trim(),
        ministerName: ministryForm.ministerName.trim(),
        score: Number(ministryForm.score),
        attendanceRate: Number(ministryForm.attendanceRate),
        insideYemenRate: Number(ministryForm.insideYemenRate)
      } : item));
      return;
    }

    const id = `m-${Date.now()}`;
    setMinistries((current) => [{
      id,
      name: ministryForm.name.trim(),
      code: `C${current.length + 1}`,
      rank: current.length + 1,
      score: Number(ministryForm.score),
      ministerName: ministryForm.ministerName.trim(),
      attendanceRate: Number(ministryForm.attendanceRate),
      insideYemenRate: Number(ministryForm.insideYemenRate)
    }, ...current]);
    setSelectedMinistryId(id);
  }

  function deleteMinistry(id: string) {
    setMinistries((current) => current.filter((item) => item.id !== id));
    if (selectedMinistryId === id) resetMinistryEditor();
  }

  function resetOfficialEditor() {
    setSelectedOfficialId(null);
    setOfficialForm(emptyOfficialForm);
  }

  function saveOfficial() {
    if (!officialForm.name.trim() || !officialForm.ministryName.trim()) return;

    if (selectedOfficialId) {
      setOfficials((current) => current.map((item) => item.id === selectedOfficialId ? {
        ...item,
        name: officialForm.name.trim(),
        ministryName: officialForm.ministryName.trim(),
        score: Number(officialForm.score),
        alignmentRate: Number(officialForm.alignmentRate),
        presenceRate: Number(officialForm.presenceRate)
      } : item));
      return;
    }

    const id = `o-${Date.now()}`;
    setOfficials((current) => [{
      id,
      name: officialForm.name.trim(),
      ministryName: officialForm.ministryName.trim(),
      score: Number(officialForm.score),
      alignmentRate: Number(officialForm.alignmentRate),
      presenceRate: Number(officialForm.presenceRate)
    }, ...current]);
    setSelectedOfficialId(id);
    setEvaluationForm((current) => ({ ...current, officialId: id }));
  }

  function deleteOfficial(id: string) {
    setOfficials((current) => current.filter((item) => item.id !== id));
    setEvaluations((current) => current.filter((item) => item.officialId !== id));
    if (selectedOfficialId === id) resetOfficialEditor();
  }

  function resetSourceEditor() {
    setSelectedSourceId(null);
    setSourceForm(emptySourceForm);
  }

  function saveSource() {
    if (!sourceForm.title.trim() || !sourceForm.url.trim()) return;

    if (selectedSourceId) {
      setSources((current) => current.map((item) => item.id === selectedSourceId ? { ...item, ...sourceForm, title: sourceForm.title.trim(), url: sourceForm.url.trim() } : item));
      return;
    }

    const id = `s-${Date.now()}`;
    setSources((current) => [{ id, ...sourceForm, title: sourceForm.title.trim(), url: sourceForm.url.trim() }, ...current]);
    setSelectedSourceId(id);
    setEvaluationForm((current) => ({ ...current, sourceTitle: sourceForm.title.trim() }));
  }

  function deleteSource(id: string) {
    const source = sources.find((item) => item.id === id);
    setSources((current) => current.filter((item) => item.id !== id));
    if (source) {
      setEvaluations((current) => current.map((item) => item.sourceTitle === source.title ? { ...item, sourceTitle: "مصدر محذوف" } : item));
    }
    if (selectedSourceId === id) resetSourceEditor();
  }
  function resetRoleEditor() {
    setSelectedRoleId(null);
    setRoleForm(emptyRoleForm);
  }

  function saveRole() {
    if (!roleForm.name.trim()) return;
    const permissions = roleForm.permissions.split(/[،,]/).map((item) => item.trim()).filter(Boolean);

    if (selectedRoleId) {
      setRoles((current) => current.map((item) => item.id === selectedRoleId ? {
        ...item,
        name: roleForm.name.trim(),
        permissions,
        membersCount: Number(roleForm.membersCount)
      } : item));
      return;
    }

    const id = `r-${Date.now()}`;
    setRoles((current) => [{ id, name: roleForm.name.trim(), permissions, membersCount: Number(roleForm.membersCount) }, ...current]);
    setSelectedRoleId(id);
  }

  function deleteRole(id: string) {
    setRoles((current) => current.filter((item) => item.id !== id));
    if (selectedRoleId === id) resetRoleEditor();
  }

  function resetContentEditor() {
    setSelectedContentId(null);
    setContentForm(emptyContentForm);
  }

  function saveContent() {
    if (!contentForm.title.trim() || !contentForm.owner.trim()) return;

    if (selectedContentId) {
      setContentItems((current) => current.map((item) => item.id === selectedContentId ? { ...item, ...contentForm, title: contentForm.title.trim(), owner: contentForm.owner.trim() } : item));
      return;
    }

    const id = `c-${Date.now()}`;
    setContentItems((current) => [{ id, ...contentForm, title: contentForm.title.trim(), owner: contentForm.owner.trim() }, ...current]);
    setSelectedContentId(id);
  }

  function deleteContent(id: string) {
    setContentItems((current) => current.filter((item) => item.id !== id));
    if (selectedContentId === id) resetContentEditor();
  }

  function resetCriterionEditor() {
    setSelectedCriterionId(null);
    setCriterionForm(emptyCriterionForm);
  }

  function saveCriterion() {
    if (!criterionForm.title.trim()) return;

    if (selectedCriterionId) {
      setCriteria((current) => current.map((item) => item.id === selectedCriterionId ? {
        ...item,
        title: criterionForm.title.trim(),
        category: criterionForm.category,
        weight: Number(criterionForm.weight),
        enabled: criterionForm.enabled,
        evidenceRequired: criterionForm.evidenceRequired,
        reviewerRequired: criterionForm.reviewerRequired,
        note: criterionForm.note.trim(),
        objectiveMeasure: criterionForm.objectiveMeasure.trim(),
        calculationMethod: criterionForm.calculationMethod.trim(),
        scoringExample: criterionForm.scoringExample.trim()
      } : item));
      setEvaluations((current) => current.map((item) => item.criterionId === selectedCriterionId ? { ...item, criterionTitle: criterionForm.title.trim() } : item));
      return;
    }

    const id = `ec-${Date.now()}`;
    setCriteria((current) => [{
      id,
      title: criterionForm.title.trim(),
      category: criterionForm.category,
      weight: Number(criterionForm.weight),
      enabled: criterionForm.enabled,
      evidenceRequired: criterionForm.evidenceRequired,
      reviewerRequired: criterionForm.reviewerRequired,
      note: criterionForm.note.trim(),
      objectiveMeasure: criterionForm.objectiveMeasure.trim(),
      calculationMethod: criterionForm.calculationMethod.trim(),
      scoringExample: criterionForm.scoringExample.trim()
    }, ...current]);
    setSelectedCriterionId(id);
    setEvaluationForm((current) => ({ ...current, criterionId: id }));
  }

  function deleteCriterion(id: string) {
    setCriteria((current) => current.filter((item) => item.id !== id));
    setEvaluations((current) => current.filter((item) => item.criterionId !== id));
    if (selectedCriterionId === id) resetCriterionEditor();
  }

  function resetEvaluationEditor() {
    setSelectedEvaluationId(null);
    setEvaluationForm(emptyEvaluationForm(officials[0]?.id ?? "", criteria[0]?.id ?? "", sources[0]?.title ?? ""));
  }

  function saveEvaluation() {
    const official = officials.find((item) => item.id === evaluationForm.officialId);
    const criterion = criteria.find((item) => item.id === evaluationForm.criterionId);
    if (!official || !criterion || !evaluationForm.evidenceSummary.trim() || !evaluationForm.impactSummary.trim()) return;

    const payload = {
      officialId: official.id,
      officialName: official.name,
      ministryName: official.ministryName,
      criterionId: criterion.id,
      criterionTitle: criterion.title,
      periodLabel: evaluationForm.periodLabel.trim() || "مارس 2026",
      score: Number(evaluationForm.score),
      status: evaluationForm.status,
      evidenceSummary: evaluationForm.evidenceSummary.trim(),
      sourceTitle: evaluationForm.sourceTitle.trim() || "مصدر داخلي",
      impactSummary: evaluationForm.impactSummary.trim(),
      reviewerNote: evaluationForm.reviewerNote.trim() || "بانتظار ملاحظة المراجع.",
      updatedAt: new Date().toISOString().slice(0, 10)
    };

    if (selectedEvaluationId) {
      setEvaluations((current) => current.map((item) => item.id === selectedEvaluationId ? { ...item, ...payload } : item));
      return;
    }

    const id = `ev-${Date.now()}`;
    setEvaluations((current) => [{ id, ...payload }, ...current]);
    setSelectedEvaluationId(id);
  }

  function deleteEvaluation(id: string) {
    setEvaluations((current) => current.filter((item) => item.id !== id));
    if (selectedEvaluationId === id) resetEvaluationEditor();
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
            <h1 className="mt-5 text-4xl font-extrabold leading-tight">لوحة تحكم أكثر فعالية لإدارة المنصة وتحرير البيانات والتقييمات بسرعة ووضوح</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-white/80">
              حسّنت اللوحة لتعمل كمركز تشغيل حقيقي: بحث، تصفية، تحرير مباشر، حفظ، حذف، ومراجعة بصرية أوضح لسجلات التقييم ومحتوى المنصة.
              ما زالت هذه النسخة تعمل محليًا داخل المتصفح، لكنها أصبحت أقرب كثيرًا لتجربة إدارة إنتاجية قابلة للتوسع.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/85">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">تحرير مباشر للسجلات</span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">بحث وتصفية فورية</span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">عرض أكثر وضوحًا واتساقًا</span>
            </div>
          </div>
          <div className="glass-card grid gap-4 p-5 text-ink">
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoBox label="بانتظار المراجعة" value={pendingReviewCount.toString()} accent="amber" />
              <InfoBox label="سجلات معتمدة" value={approvedEvaluations.toString()} accent="teal" />
              <InfoBox label="متوسط الدرجات" value={`${averageScore}/100`} accent="slate" />
              <InfoBox label="إجمالي الكيانات" value={String(totalEntities)} accent="rose" />
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card reveal-up p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)} className={activeTab === tab.key ? "primary-button" : "soft-button"}>
                {tab.label}
              </button>
            ))}
          </div>
          {activeTab !== "overview" && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input className="input-shell min-w-[220px]" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="بحث سريع داخل هذا القسم" />
              {activeTab === "evaluations" && (
                <select className="input-shell min-w-[180px]" value={evaluationStatusFilter} onChange={(event) => setEvaluationStatusFilter(event.target.value as "الكل" | EvaluationStatus)}>
                  <option value="الكل">كل الحالات</option>
                  <option value="مسودة">مسودة</option>
                  <option value="قيد المراجعة">قيد المراجعة</option>
                  <option value="معتمد">معتمد</option>
                </select>
              )}
            </div>
          )}
        </div>
        <p className="mt-3 text-sm text-ink/60">{tabs.find((item) => item.key === activeTab)?.helper}</p>
      </section>

      {activeTab === "overview" && (
        <section className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="space-y-6">
            <div className="card reveal-up p-6">
              <h2 className="section-title text-xl">جاهزية لوحة الإدارة</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <SignalCard title="المعايير النشطة" value={String(activeCriteriaCount)} hint="عدد المؤشرات المفعلة في نموذج التقييم" tone="teal" />
                <SignalCard title="إجمالي الأوزان" value={String(totalActiveWeight)} hint="يساعد على ضبط المعادلة العامة للتقييم" tone="gold" />
                <SignalCard title="سجلات التقييم" value={String(evaluations.length)} hint="سجلات فعلية قابلة للتعديل والاعتماد" tone="navy" />
                <SignalCard title="الجهات والمسؤولون" value={String(ministries.length + officials.length)} hint="يمكن تحريرهم مباشرة من اللوحة" tone="rose" />
              </div>
            </div>
            <div className="card reveal-up p-6">
              <h2 className="section-title text-xl">ماذا تحسن الآن؟</h2>
              <div className="mt-4 grid gap-3">
                <QuickNote title="تحرير البيانات" body="يمكنك الآن اختيار السجل الحالي وتعديله وحفظه بدل الاكتفاء بالإضافة." />
                <QuickNote title="التعامل مع التقييمات" body="سجلات التقييم أصبحت قابلة للإضافة والتعديل والحذف مع ربطها بالوزير والمؤشر والدليل." />
                <QuickNote title="الأداء البصري" body="أضفت بحثًا فوريًا وتصفية للحالات وتنظيمًا أفضل للمحرر والقوائم داخل كل قسم." />
              </div>
            </div>
          </div>

          <div className="card reveal-up p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="section-title text-xl">آخر سجلات التقييم</h2>
                <p className="mt-2 text-sm leading-7 text-ink/60">عرض مختصر يساعد فريق التشغيل على متابعة آخر ما تم تعديله أو اعتماده.</p>
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
        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <ListPanel title="عناصر التقييم" count={filteredCriteria.length}>
            {filteredCriteria.map((item) => (
              <SelectableCard
                key={item.id}
                title={item.title}
                subtitle={`${item.category} • وزن ${item.weight}`}
                meta={item.enabled ? "نشط" : "معطل"}
                selected={selectedCriterionId === item.id}
                onClick={() => setSelectedCriterionId(item.id)}
                onDelete={() => deleteCriterion(item.id)}
              />
            ))}
          </ListPanel>
          <EditorPanel
            title={selectedCriterionId ? "تعديل معيار" : "إضافة معيار جديد"}
            description="هذا القسم أصبح يدعم تحرير النصوص المنهجية والأوزان وحالة التفعيل والمراجعة من مكان واحد."
            onSave={saveCriterion}
            onReset={resetCriterionEditor}
            saveLabel={selectedCriterionId ? "حفظ التعديل" : "إضافة المعيار"}
          >
            <div className="grid gap-3 md:grid-cols-2">
              <input className="input-shell" value={criterionForm.title} onChange={(event) => setCriterionForm((current) => ({ ...current, title: event.target.value }))} placeholder="عنوان المؤشر" />
              <select className="input-shell" value={criterionForm.category} onChange={(event) => setCriterionForm((current) => ({ ...current, category: event.target.value as EvaluationCriterionRecord["category"] }))}>
                <option value="حوكمة">حوكمة</option>
                <option value="حضور">حضور</option>
                <option value="تواجد">تواجد</option>
                <option value="مواقف">مواقف</option>
                <option value="وزارة">وزارة</option>
                <option value="قانون">قانون</option>
                <option value="إعلام رقمي">إعلام رقمي</option>
              </select>
              <input className="input-shell" type="number" min="1" max="100" value={criterionForm.weight} onChange={(event) => setCriterionForm((current) => ({ ...current, weight: event.target.value }))} placeholder="الوزن" />
              <textarea className="input-shell min-h-[92px] md:col-span-2" value={criterionForm.note} onChange={(event) => setCriterionForm((current) => ({ ...current, note: event.target.value }))} placeholder="وصف مختصر للمؤشر" />
              <textarea className="input-shell min-h-[120px] md:col-span-2" value={criterionForm.objectiveMeasure} onChange={(event) => setCriterionForm((current) => ({ ...current, objectiveMeasure: event.target.value }))} placeholder="ما الذي يُقاس؟" />
              <textarea className="input-shell min-h-[120px] md:col-span-2" value={criterionForm.calculationMethod} onChange={(event) => setCriterionForm((current) => ({ ...current, calculationMethod: event.target.value }))} placeholder="كيف يُحسب؟" />
              <textarea className="input-shell min-h-[120px] md:col-span-2" value={criterionForm.scoringExample} onChange={(event) => setCriterionForm((current) => ({ ...current, scoringExample: event.target.value }))} placeholder="مثال على احتساب الدرجة" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <ToggleRow label="تفعيل المؤشر" checked={criterionForm.enabled} onChange={(checked) => setCriterionForm((current) => ({ ...current, enabled: checked }))} />
              <ToggleRow label="يتطلب دليل" checked={criterionForm.evidenceRequired} onChange={(checked) => setCriterionForm((current) => ({ ...current, evidenceRequired: checked }))} />
              <ToggleRow label="يتطلب مراجعة" checked={criterionForm.reviewerRequired} onChange={(checked) => setCriterionForm((current) => ({ ...current, reviewerRequired: checked }))} />
            </div>
          </EditorPanel>
        </section>
      )}

      {activeTab === "evaluations" && (
        <section className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
          <ListPanel title="سجلات التقييم" count={filteredEvaluations.length}>
            {filteredEvaluations.map((item) => (
              <SelectableEvaluationCard
                key={item.id}
                record={item}
                selected={selectedEvaluationId === item.id}
                onClick={() => setSelectedEvaluationId(item.id)}
                onDelete={() => deleteEvaluation(item.id)}
              />
            ))}
          </ListPanel>
          <EditorPanel
            title={selectedEvaluationId ? "تعديل سجل تقييم" : "إضافة سجل تقييم"}
            description="يمكنك الآن تعديل الدرجة أو المبرر أو الحالة أو المصدر في أي وقت من نفس اللوحة."
            onSave={saveEvaluation}
            onReset={resetEvaluationEditor}
            saveLabel={selectedEvaluationId ? "حفظ السجل" : "إضافة السجل"}
          >
            <div className="grid gap-3 md:grid-cols-2">
              <select className="input-shell" value={evaluationForm.officialId} onChange={(event) => setEvaluationForm((current) => ({ ...current, officialId: event.target.value }))}>
                {officials.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
              <select className="input-shell" value={evaluationForm.criterionId} onChange={(event) => setEvaluationForm((current) => ({ ...current, criterionId: event.target.value }))}>
                {criteria.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
              </select>
              <input className="input-shell" value={evaluationForm.periodLabel} onChange={(event) => setEvaluationForm((current) => ({ ...current, periodLabel: event.target.value }))} placeholder="الفترة" />
              <input className="input-shell" type="number" min="0" max="100" value={evaluationForm.score} onChange={(event) => setEvaluationForm((current) => ({ ...current, score: event.target.value }))} placeholder="الدرجة" />
              <select className="input-shell" value={evaluationForm.status} onChange={(event) => setEvaluationForm((current) => ({ ...current, status: event.target.value as EvaluationStatus }))}>
                <option value="مسودة">مسودة</option>
                <option value="قيد المراجعة">قيد المراجعة</option>
                <option value="معتمد">معتمد</option>
              </select>
              <input className="input-shell" value={evaluationForm.sourceTitle} onChange={(event) => setEvaluationForm((current) => ({ ...current, sourceTitle: event.target.value }))} placeholder="اسم المصدر" />
              <textarea className="input-shell min-h-[112px] md:col-span-2" value={evaluationForm.evidenceSummary} onChange={(event) => setEvaluationForm((current) => ({ ...current, evidenceSummary: event.target.value }))} placeholder="ملخص الدليل" />
              <textarea className="input-shell min-h-[112px] md:col-span-2" value={evaluationForm.impactSummary} onChange={(event) => setEvaluationForm((current) => ({ ...current, impactSummary: event.target.value }))} placeholder="الأثر أو تفسير الدرجة" />
              <textarea className="input-shell min-h-[112px] md:col-span-2" value={evaluationForm.reviewerNote} onChange={(event) => setEvaluationForm((current) => ({ ...current, reviewerNote: event.target.value }))} placeholder="ملاحظة المراجع" />
            </div>
          </EditorPanel>
        </section>
      )}

      {activeTab === "ministries" && (
        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <ListPanel title="الجهات الحكومية" count={filteredMinistries.length}>
            {filteredMinistries.map((item) => (
              <SelectableCard
                key={item.id}
                title={item.name}
                subtitle={item.ministerName}
                meta={`${item.score}%`}
                selected={selectedMinistryId === item.id}
                onClick={() => setSelectedMinistryId(item.id)}
                onDelete={() => deleteMinistry(item.id)}
              />
            ))}
          </ListPanel>
          <EditorPanel title={selectedMinistryId ? "تعديل جهة" : "إضافة جهة"} description="يمكن تعديل اسم الجهة، الوزير، ودرجات المؤشرات الأساسية من نفس اللوحة." onSave={saveMinistry} onReset={resetMinistryEditor} saveLabel={selectedMinistryId ? "حفظ الجهة" : "إضافة الجهة"}>
            <div className="grid gap-3 md:grid-cols-2">
              <input className="input-shell" value={ministryForm.name} onChange={(event) => setMinistryForm((current) => ({ ...current, name: event.target.value }))} placeholder="اسم الجهة" />
              <input className="input-shell" value={ministryForm.ministerName} onChange={(event) => setMinistryForm((current) => ({ ...current, ministerName: event.target.value }))} placeholder="اسم الوزير" />
              <input className="input-shell" type="number" min="0" max="100" value={ministryForm.score} onChange={(event) => setMinistryForm((current) => ({ ...current, score: event.target.value }))} placeholder="الدرجة العامة" />
              <input className="input-shell" type="number" min="0" max="100" value={ministryForm.attendanceRate} onChange={(event) => setMinistryForm((current) => ({ ...current, attendanceRate: event.target.value }))} placeholder="نسبة الحضور" />
              <input className="input-shell md:col-span-2" type="number" min="0" max="100" value={ministryForm.insideYemenRate} onChange={(event) => setMinistryForm((current) => ({ ...current, insideYemenRate: event.target.value }))} placeholder="نسبة التواجد داخل اليمن" />
            </div>
          </EditorPanel>
        </section>
      )}

      {activeTab === "officials" && (
        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <ListPanel title="المسؤولون" count={filteredOfficials.length}>
            {filteredOfficials.map((item) => (
              <SelectableCard
                key={item.id}
                title={item.name}
                subtitle={item.ministryName}
                meta={`${item.score}%`}
                selected={selectedOfficialId === item.id}
                onClick={() => setSelectedOfficialId(item.id)}
                onDelete={() => deleteOfficial(item.id)}
              />
            ))}
          </ListPanel>
          <EditorPanel title={selectedOfficialId ? "تعديل مسؤول" : "إضافة مسؤول"} description="تحرير اسم الوزير وربطه بالوزارة وتعديل المؤشرات العامة بسرعة." onSave={saveOfficial} onReset={resetOfficialEditor} saveLabel={selectedOfficialId ? "حفظ المسؤول" : "إضافة المسؤول"}>
            <div className="grid gap-3 md:grid-cols-2">
              <input className="input-shell" value={officialForm.name} onChange={(event) => setOfficialForm((current) => ({ ...current, name: event.target.value }))} placeholder="اسم المسؤول" />
              <input className="input-shell" value={officialForm.ministryName} onChange={(event) => setOfficialForm((current) => ({ ...current, ministryName: event.target.value }))} placeholder="الجهة" />
              <input className="input-shell" type="number" min="0" max="100" value={officialForm.score} onChange={(event) => setOfficialForm((current) => ({ ...current, score: event.target.value }))} placeholder="الدرجة العامة" />
              <input className="input-shell" type="number" min="0" max="100" value={officialForm.alignmentRate} onChange={(event) => setOfficialForm((current) => ({ ...current, alignmentRate: event.target.value }))} placeholder="اتساق الموقف" />
              <input className="input-shell md:col-span-2" type="number" min="0" max="100" value={officialForm.presenceRate} onChange={(event) => setOfficialForm((current) => ({ ...current, presenceRate: event.target.value }))} placeholder="نسبة التواجد" />
            </div>
          </EditorPanel>
        </section>
      )}
      {activeTab === "sources" && (
        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <ListPanel title="المصادر والأدلة" count={filteredSources.length}>
            {filteredSources.map((item) => (
              <SelectableCard
                key={item.id}
                title={item.title}
                subtitle={`${item.type} • ${item.url}`}
                meta={item.credibility}
                selected={selectedSourceId === item.id}
                onClick={() => setSelectedSourceId(item.id)}
                onDelete={() => deleteSource(item.id)}
              />
            ))}
          </ListPanel>
          <EditorPanel title={selectedSourceId ? "تعديل مصدر" : "إضافة مصدر"} description="إدارة الموثوقية والرابط والتصنيف ليتوافق مع منهجية الأدلة في المنصة." onSave={saveSource} onReset={resetSourceEditor} saveLabel={selectedSourceId ? "حفظ المصدر" : "إضافة المصدر"}>
            <div className="grid gap-3 md:grid-cols-2">
              <input className="input-shell md:col-span-2" value={sourceForm.title} onChange={(event) => setSourceForm((current) => ({ ...current, title: event.target.value }))} placeholder="عنوان المصدر" />
              <select className="input-shell" value={sourceForm.type} onChange={(event) => setSourceForm((current) => ({ ...current, type: event.target.value as SourceRecord["type"] }))}>
                <option value="رسمي">رسمي</option>
                <option value="إعلامي">إعلامي</option>
                <option value="ميداني">ميداني</option>
                <option value="داخلي">داخلي</option>
              </select>
              <select className="input-shell" value={sourceForm.credibility} onChange={(event) => setSourceForm((current) => ({ ...current, credibility: event.target.value as SourceRecord["credibility"] }))}>
                <option value="عال">عال</option>
                <option value="متوسط">متوسط</option>
                <option value="قيد المراجعة">قيد المراجعة</option>
              </select>
              <input className="input-shell md:col-span-2" value={sourceForm.url} onChange={(event) => setSourceForm((current) => ({ ...current, url: event.target.value }))} placeholder="الرابط" />
            </div>
          </EditorPanel>
        </section>
      )}

      {activeTab === "roles" && (
        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <ListPanel title="الأدوار" count={filteredRoles.length}>
            {filteredRoles.map((item) => (
              <SelectableCard
                key={item.id}
                title={item.name}
                subtitle={item.permissions.join(" • ")}
                meta={`${item.membersCount} أعضاء`}
                selected={selectedRoleId === item.id}
                onClick={() => setSelectedRoleId(item.id)}
                onDelete={() => deleteRole(item.id)}
              />
            ))}
          </ListPanel>
          <EditorPanel title={selectedRoleId ? "تعديل دور" : "إضافة دور"} description="يمكنك الآن تحرير اسم الدور والصلاحيات وعدد الأعضاء بدل الاكتفاء بإضافته فقط." onSave={saveRole} onReset={resetRoleEditor} saveLabel={selectedRoleId ? "حفظ الدور" : "إضافة الدور"}>
            <div className="grid gap-3 md:grid-cols-2">
              <input className="input-shell" value={roleForm.name} onChange={(event) => setRoleForm((current) => ({ ...current, name: event.target.value }))} placeholder="اسم الدور" />
              <input className="input-shell" type="number" min="0" value={roleForm.membersCount} onChange={(event) => setRoleForm((current) => ({ ...current, membersCount: event.target.value }))} placeholder="عدد الأعضاء" />
              <textarea className="input-shell min-h-[112px] md:col-span-2" value={roleForm.permissions} onChange={(event) => setRoleForm((current) => ({ ...current, permissions: event.target.value }))} placeholder="الصلاحيات مفصولة بفاصلة" />
            </div>
            <div className="rounded-3xl bg-slate-50/80 p-4 text-sm leading-8 text-ink/70">
              المستخدمون الحاليون في نسخة العرض: {users.map((user) => user.name).join(" • ")}
            </div>
          </EditorPanel>
        </section>
      )}

      {activeTab === "content" && (
        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <ListPanel title="المحتوى والمنشورات" count={filteredContent.length}>
            {filteredContent.map((item) => (
              <SelectableCard
                key={item.id}
                title={item.title}
                subtitle={`${item.type} • ${item.owner}`}
                meta={item.status}
                selected={selectedContentId === item.id}
                onClick={() => setSelectedContentId(item.id)}
                onDelete={() => deleteContent(item.id)}
              />
            ))}
          </ListPanel>
          <EditorPanel title={selectedContentId ? "تعديل محتوى" : "إضافة محتوى"} description="إدارة المحتوى أصبحت أسرع مع محرر واضح للحالة والنوع والمالك." onSave={saveContent} onReset={resetContentEditor} saveLabel={selectedContentId ? "حفظ المحتوى" : "إضافة المحتوى"}>
            <div className="grid gap-3 md:grid-cols-2">
              <input className="input-shell md:col-span-2" value={contentForm.title} onChange={(event) => setContentForm((current) => ({ ...current, title: event.target.value }))} placeholder="عنوان المحتوى" />
              <select className="input-shell" value={contentForm.type} onChange={(event) => setContentForm((current) => ({ ...current, type: event.target.value as ContentItemRecord["type"] }))}>
                <option value="تقرير">تقرير</option>
                <option value="تصريح">تصريح</option>
                <option value="مبادرة">مبادرة</option>
                <option value="مؤشر حساس">مؤشر حساس</option>
              </select>
              <select className="input-shell" value={contentForm.status} onChange={(event) => setContentForm((current) => ({ ...current, status: event.target.value as ContentItemRecord["status"] }))}>
                <option value="مسودة">مسودة</option>
                <option value="قيد المراجعة">قيد المراجعة</option>
                <option value="منشور">منشور</option>
              </select>
              <input className="input-shell md:col-span-2" value={contentForm.owner} onChange={(event) => setContentForm((current) => ({ ...current, owner: event.target.value }))} placeholder="المالك أو المحرر" />
            </div>
          </EditorPanel>
        </section>
      )}
    </div>
  );
}

function ListPanel({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section className="card reveal-up p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="section-title text-xl">{title}</h2>
        <span className="admin-pill">{count}</span>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function EditorPanel({ title, description, onSave, onReset, saveLabel, children }: { title: string; description: string; onSave: () => void; onReset: () => void; saveLabel: string; children: React.ReactNode }) {
  return (
    <section className="card reveal-up space-y-5 p-6">
      <div>
        <h2 className="section-title text-xl">{title}</h2>
        <p className="mt-2 text-sm leading-7 text-ink/60">{description}</p>
      </div>
      {children}
      <div className="flex flex-wrap gap-3">
        <button type="button" className="primary-button" onClick={onSave}>{saveLabel}</button>
        <button type="button" className="soft-button" onClick={onReset}>سجل جديد</button>
      </div>
    </section>
  );
}

function SelectableCard({ title, subtitle, meta, selected, onClick, onDelete }: { title: string; subtitle: string; meta: string; selected: boolean; onClick: () => void; onDelete: () => void }) {
  return (
    <article className={`rounded-3xl border p-4 transition hover:-translate-y-0.5 hover:shadow-soft ${selected ? "border-teal/40 bg-teal/5" : "border-slate-100 bg-slate-50/85"}`}>
      <div className="flex items-start justify-between gap-3">
        <button type="button" className="min-w-0 flex-1 text-right" onClick={onClick}>
          <p className="font-semibold text-ink">{title}</p>
          <p className="mt-1 text-sm text-ink/55">{subtitle}</p>
          <p className="mt-3 text-xs font-semibold text-teal">{meta}</p>
        </button>
        <button type="button" className="soft-button px-3 py-1.5 text-xs" onClick={onDelete}>حذف</button>
      </div>
    </article>
  );
}

function SelectableEvaluationCard({ record, selected, onClick, onDelete }: { record: EvaluationRecord; selected: boolean; onClick: () => void; onDelete: () => void }) {
  return (
    <article className={`rounded-3xl border p-4 transition hover:-translate-y-0.5 hover:shadow-soft ${selected ? "border-teal/40 bg-teal/5" : "border-slate-100 bg-slate-50/85"}`}>
      <div className="flex items-start justify-between gap-4">
        <button type="button" className="min-w-0 flex-1 text-right" onClick={onClick}>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-ink">{record.officialName}</p>
            <span className="admin-pill">{record.status}</span>
          </div>
          <p className="mt-1 text-sm text-ink/55">{record.criterionTitle}</p>
          <p className="mt-2 line-clamp-2 text-sm leading-7 text-ink/65">{record.impactSummary}</p>
        </button>
        <div className="flex flex-col items-end gap-2">
          <ScoreRing score={record.score} />
          <button type="button" className="soft-button px-3 py-1.5 text-xs" onClick={onDelete}>حذف</button>
        </div>
      </div>
    </article>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center justify-between rounded-2xl bg-slate-50/85 p-4 text-sm text-ink/75">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 accent-teal" />
    </label>
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

function ScoreRing({ score }: { score: number }) {
  const tone = score >= 85 ? "bg-teal text-white" : score >= 70 ? "bg-gold/80 text-ink" : "bg-rose-100 text-rose-700";
  return <div className={`flex h-14 w-14 items-center justify-center rounded-full text-base font-extrabold shadow-soft ${tone}`}>{score}</div>;
}

function QuickNote({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-3xl border border-slate-100 bg-slate-50/85 p-4">
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-2 text-sm leading-7 text-ink/65">{body}</p>
    </article>
  );
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