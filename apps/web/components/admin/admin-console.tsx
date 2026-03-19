"use client";

import { useEffect, useMemo, useState, startTransition } from "react";
import type {
  AdminUserRecord,
  ContentItemRecord,
  EvaluationCriterionRecord,
  MinistrySnapshot,
  OfficialSnapshot,
  RoleRecord,
  SourceRecord
} from "@ygmpo/shared/types";
import {
  adminUsers as seedUsers,
  contentItems as seedContent,
  evaluationCriteria as seedCriteria,
  ministrySnapshots as seedMinistries,
  officialSnapshots as seedOfficials,
  roleRecords as seedRoles,
  sourceRecords as seedSources
} from "@ygmpo/shared/demo-data";

type TabKey = "overview" | "criteria" | "ministries" | "officials" | "sources" | "roles" | "content";

const storageKey = "ygmpo-admin-state-v3";

const tabs: { key: TabKey; label: string; helper: string }[] = [
  { key: "overview", label: "مركز التحكم", helper: "ملخص الإدارة" },
  { key: "criteria", label: "معايير الوزراء", helper: "إدارة عناصر التقييم الموضوعي" },
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
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    startTransition(() => {
      window.localStorage.setItem(storageKey, JSON.stringify({ ministries, officials, sources, roles, users, contentItems, criteria }));
    });
  }, [ministries, officials, sources, roles, users, contentItems, criteria]);

  const pendingReviewCount = useMemo(
    () => contentItems.filter((item) => item.status === "قيد المراجعة").length + sources.filter((item) => item.credibility === "قيد المراجعة").length + criteria.filter((item) => item.reviewerRequired && item.enabled).length,
    [contentItems, sources, criteria]
  );

  const totalActiveWeight = useMemo(
    () => criteria.filter((item) => item.enabled).reduce((sum, item) => sum + item.weight, 0),
    [criteria]
  );

  function addMinistry() {
    if (!ministryName.trim() || !ministerName.trim()) return;
    setMinistries((current) => [{ id: `m-${Date.now()}`, name: ministryName.trim(), code: `C${current.length + 1}`, rank: current.length + 1, score: 70, ministerName: ministerName.trim(), attendanceRate: 75, insideYemenRate: 68 }, ...current]);
    setMinistryName("");
    setMinisterName("");
  }

  function addOfficial() {
    if (!officialName.trim() || !officialMinistry.trim()) return;
    setOfficials((current) => [{ id: `o-${Date.now()}`, name: officialName.trim(), ministryName: officialMinistry.trim(), score: 71, alignmentRate: 74, presenceRate: 69 }, ...current]);
    setUsers((current) => [{ id: `u-${Date.now()}`, name: officialName.trim(), role: "مدخل بيانات", status: "بانتظار التفعيل", ministry: officialMinistry.trim() }, ...current]);
    setOfficialName("");
    setOfficialMinistry("");
  }

  function addSource() {
    if (!sourceTitle.trim() || !sourceUrl.trim()) return;
    setSources((current) => [{ id: `s-${Date.now()}`, title: sourceTitle.trim(), url: sourceUrl.trim(), type: "رسمي", credibility: "قيد المراجعة" }, ...current]);
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
    setCriteria((current) => [{
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
    }, ...current]);
    setCriterionTitle("");
    setCriterionWeight("10");
  }

  function updateCriterion(id: string, patch: Partial<EvaluationCriterionRecord>) {
    setCriteria((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  return (
    <div className="space-y-8">
      <section className="hero-panel hero-sheen grid-glow reveal-up relative overflow-hidden rounded-[36px] px-8 py-10 text-white shadow-soft">
        <div className="float-orb left-10 top-12 h-24 w-24 bg-gold/60" />
        <div className="float-orb right-14 top-10 h-32 w-32 bg-teal/40" />
        <div className="float-orb bottom-8 left-1/3 h-16 w-16 bg-white/20" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="metric-pill text-white">إدارة المحتوى والبيانات والتقييم الموضوعي</span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight">لوحة تشغيلية لإدارة المنصة ومعايير تقييم الوزراء بصيغة قابلة للقياس</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-white/80">كل عنصر تقييم في هذه الصفحة ليس مجرد عنوان عام، بل أصبح يوضح ما الذي يقاس، وكيف يحتسب، وما المثال العملي على احتساب درجته. هذا يجعل التقييم أكثر موضوعية وقابلية للتفسير والمراجعة.</p>
          </div>
          <div className="glass-card grid gap-4 p-5 text-ink">
            <div className="rounded-3xl bg-white/75 p-4"><p className="text-sm text-ink/55">العناصر بانتظار مراجعة</p><p className="mt-2 text-3xl font-extrabold">{pendingReviewCount}</p></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/75 p-4"><p className="text-sm text-ink/55">المعايير النشطة</p><p className="mt-2 text-2xl font-bold">{criteria.filter((item) => item.enabled).length}</p></div>
              <div className="rounded-3xl bg-white/75 p-4"><p className="text-sm text-ink/55">الوزن الكلي</p><p className="mt-2 text-2xl font-bold">{totalActiveWeight}</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card reveal-up p-4">
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)} className={activeTab === tab.key ? "primary-button" : "soft-button"}>{tab.label}</button>)}
        </div>
        <p className="mt-3 text-sm text-ink/60">{tabs.find((item) => item.key === activeTab)?.helper}</p>
      </section>

      {activeTab === "overview" && (
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="card reveal-up p-6">
            <h2 className="section-title text-xl">ملخص الإدارة</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <InfoBox label="الجهات" value={ministries.length.toString()} />
              <InfoBox label="المسؤولون" value={officials.length.toString()} />
              <InfoBox label="الأدوار" value={roles.length.toString()} />
              <InfoBox label="عناصر التقييم" value={criteria.length.toString()} />
            </div>
          </div>
          <div className="card reveal-up p-6">
            <h2 className="section-title text-xl">آخر العناصر التشغيلية</h2>
            <div className="mt-5 space-y-3">
              {contentItems.slice(0, 4).map((item) => (
                <article key={item.id} className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm text-ink/55">{item.type} • {item.owner}</p>
                    </div>
                    <span className="admin-pill">{item.status}</span>
                  </div>
                </article>
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
              أمثلة العناصر الموضوعية الحالية: موقف الوزير في قضية عامة، انضباطه في حضور مجلس الوزراء، نسبة التواجد داخل اليمن، التواجد بمهمة رسمية أو بدونها، الأنشطة التخصصية، القرارات، التعيينات والترقيات، وحضور الوزير الرقمي على وسائل التواصل.
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

      {activeTab === "ministries" && <ManagementSection title="إدارة الجهات الحكومية" subtitle="إضافة جهة جديدة وتحديث قائمة العرض الحالية"><div className="grid gap-3 md:grid-cols-3"><input className="input-shell" value={ministryName} onChange={(event) => setMinistryName(event.target.value)} placeholder="اسم الوزارة أو الجهة" /><input className="input-shell" value={ministerName} onChange={(event) => setMinisterName(event.target.value)} placeholder="اسم الوزير أو المسؤول" /><button type="button" className="primary-button" onClick={addMinistry}>إضافة جهة</button></div><DataList items={ministries.map((item) => ({ id: item.id, title: item.name, meta: item.ministerName, status: `${item.score}%` }))} /></ManagementSection>}

      {activeTab === "officials" && <ManagementSection title="إدارة المسؤولين" subtitle="إضافة وزير أو مسؤول وربطه بجهة"><div className="grid gap-3 md:grid-cols-3"><input className="input-shell" value={officialName} onChange={(event) => setOfficialName(event.target.value)} placeholder="اسم المسؤول" /><input className="input-shell" value={officialMinistry} onChange={(event) => setOfficialMinistry(event.target.value)} placeholder="الوزارة أو الجهة" /><button type="button" className="primary-button" onClick={addOfficial}>إضافة مسؤول</button></div><DataList items={officials.map((item) => ({ id: item.id, title: item.name, meta: item.ministryName, status: `${item.score}%` }))} /></ManagementSection>}

      {activeTab === "sources" && <ManagementSection title="إدارة المصادر والأدلة" subtitle="إضافة مصدر جديد وإظهاره فورًا في قائمة الرصد"><div className="grid gap-3 md:grid-cols-3"><input className="input-shell" value={sourceTitle} onChange={(event) => setSourceTitle(event.target.value)} placeholder="عنوان المصدر" /><input className="input-shell" value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} placeholder="الرابط" /><button type="button" className="primary-button" onClick={addSource}>إضافة مصدر</button></div><DataList items={sources.map((item) => ({ id: item.id, title: item.title, meta: `${item.type} • ${item.url}`, status: item.credibility }))} /></ManagementSection>}

      {activeTab === "roles" && (
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <ManagementSection title="إدارة الأدوار" subtitle="تعريف الأدوار وصلاحياتها داخل المنصة"><div className="grid gap-3 md:grid-cols-[1fr_auto]"><input className="input-shell" value={roleName} onChange={(event) => setRoleName(event.target.value)} placeholder="اسم الدور" /><button type="button" className="primary-button" onClick={addRole}>إضافة دور</button></div><DataList items={roles.map((item) => ({ id: item.id, title: item.name, meta: item.permissions.join(" • "), status: `${item.membersCount} أعضاء` }))} /></ManagementSection>
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

      {activeTab === "content" && <ManagementSection title="إدارة المحتوى والمنشورات" subtitle="إضافة تقرير أو تصريح أو عنصر محتوى جديد للمنصة"><div className="grid gap-3 md:grid-cols-3"><input className="input-shell" value={contentTitle} onChange={(event) => setContentTitle(event.target.value)} placeholder="عنوان المحتوى" /><input className="input-shell" value={contentOwner} onChange={(event) => setContentOwner(event.target.value)} placeholder="المالك أو المحرر" /><button type="button" className="primary-button" onClick={addContentItem}>إضافة محتوى</button></div><DataList items={contentItems.map((item) => ({ id: item.id, title: item.title, meta: `${item.type} • ${item.owner}`, status: item.status }))} /></ManagementSection>}
    </div>
  );
}

function ManagementSection({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <section className="card reveal-up space-y-5 p-6"><div><h2 className="section-title text-xl">{title}</h2><p className="mt-2 text-sm leading-7 text-ink/60">{subtitle}</p></div>{children}</section>;
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return <div className="rounded-3xl bg-slate-50/80 p-4"><p className="text-sm text-ink/55">{label}</p><p className="mt-2 text-3xl font-extrabold">{value}</p></div>;
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