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
