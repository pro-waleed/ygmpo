"use client";

import { useEffect, useMemo, useState, startTransition } from "react";
import type { AdminUserRecord, ContentItemRecord, MinistrySnapshot, OfficialSnapshot, RoleRecord, SourceRecord } from "@ygmpo/shared/types";
import { adminUsers as seedUsers, contentItems as seedContent, ministrySnapshots as seedMinistries, officialSnapshots as seedOfficials, roleRecords as seedRoles, sourceRecords as seedSources } from "@ygmpo/shared/demo-data";

type TabKey = "overview" | "ministries" | "officials" | "sources" | "roles" | "content";

const storageKey = "ygmpo-admin-state-v1";

const tabs: { key: TabKey; label: string; helper: string }[] = [
  { key: "overview", label: "مركز التحكم", helper: "ملخص الإدارة" },
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

  const [ministryName, setMinistryName] = useState("");
  const [ministerName, setMinisterName] = useState("");
  const [officialName, setOfficialName] = useState("");
  const [officialMinistry, setOfficialMinistry] = useState("");
  const [sourceTitle, setSourceTitle] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [roleName, setRoleName] = useState("");
  const [contentTitle, setContentTitle] = useState("");
  const [contentOwner, setContentOwner] = useState("");

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
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    startTransition(() => {
      window.localStorage.setItem(storageKey, JSON.stringify({ ministries, officials, sources, roles, users, contentItems }));
    });
  }, [ministries, officials, sources, roles, users, contentItems]);

  const pendingReviewCount = useMemo(
    () => contentItems.filter((item) => item.status === "قيد المراجعة").length + sources.filter((item) => item.credibility === "قيد المراجعة").length,
    [contentItems, sources]
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

  return (
    <div className="space-y-8">
      <section className="hero-panel grid-glow reveal-up relative overflow-hidden rounded-[36px] px-8 py-10 text-white shadow-soft">
        <div className="float-orb left-10 top-12 h-24 w-24 bg-gold/60" />
        <div className="float-orb right-14 top-10 h-32 w-32 bg-teal/40" />
        <div className="float-orb bottom-8 left-1/3 h-16 w-16 bg-white/20" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="metric-pill text-white">إدارة المحتوى والبيانات</span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight">لوحة التحكم التشغيلية للمنصة</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-white/80">هذه الواجهة مخصصة لإدارة المنصة نفسها: إضافة الجهات، المسؤولين، المصادر، الأدوار، والعناصر التحريرية. الحفظ هنا تجريبي داخل المتصفح ليُظهر سير العمل والإدارة بصورة حية أمام الشركاء.</p>
          </div>
          <div className="glass-card grid gap-4 p-5 text-ink">
            <div className="rounded-3xl bg-white/75 p-4"><p className="text-sm text-ink/55">العناصر بانتظار مراجعة</p><p className="mt-2 text-3xl font-extrabold">{pendingReviewCount}</p></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/75 p-4"><p className="text-sm text-ink/55">المصادر</p><p className="mt-2 text-2xl font-bold">{sources.length}</p></div>
              <div className="rounded-3xl bg-white/75 p-4"><p className="text-sm text-ink/55">المستخدمون</p><p className="mt-2 text-2xl font-bold">{users.length}</p></div>
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
              <InfoBox label="المحتوى" value={contentItems.length.toString()} />
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