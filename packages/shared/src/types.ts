export type UserRole = "SYSTEM_ADMIN" | "ANALYST" | "DATA_ENTRY" | "REVIEWER" | "PUBLIC";

export type SubjectScope = "MINISTRY" | "OFFICIAL" | "BOTH";

export type SourceType = "OFFICIAL" | "MEDIA" | "FIELD" | "INTERNAL" | "SOCIAL";

export type PresenceType = "INSIDE_YEMEN" | "OUTSIDE_YEMEN";

export type AlignmentStatus = "ALIGNED" | "PARTIALLY_ALIGNED" | "UNCLEAR" | "NOT_ALIGNED";

export interface DashboardStat {
  label: string;
  value: string;
  hint: string;
  trend: "up" | "down" | "stable";
}

export interface MinistrySnapshot {
  id: string;
  name: string;
  code: string;
  rank: number;
  score: number;
  ministerName: string;
  attendanceRate: number;
  insideYemenRate: number;
}

export interface OfficialSnapshot {
  id: string;
  name: string;
  ministryName: string;
  score: number;
  alignmentRate: number;
  presenceRate: number;
}

export interface ReportSummary {
  id: string;
  title: string;
  periodLabel: string;
  publishedAt: string;
  summary: string;
}

export interface SourceRecord {
  id: string;
  title: string;
  type: "رسمي" | "إعلامي" | "ميداني" | "داخلي";
  url: string;
  credibility: "عال" | "متوسط" | "قيد المراجعة";
}

export interface RoleRecord {
  id: string;
  name: string;
  permissions: string[];
  membersCount: number;
}

export interface AdminUserRecord {
  id: string;
  name: string;
  role: string;
  status: "نشط" | "بانتظار التفعيل";
  ministry?: string;
}

export interface ContentItemRecord {
  id: string;
  title: string;
  type: "تقرير" | "تصريح" | "مبادرة" | "مؤشر حساس";
  status: "مسودة" | "قيد المراجعة" | "منشور";
  owner: string;
}