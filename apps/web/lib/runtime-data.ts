"use client";

import { useEffect, useState } from "react";
import {
  contentItems,
  dashboardStats,
  evaluationCriteria,
  evaluationRecords,
  ministrySnapshots,
  officialSnapshots,
  reportSummaries,
  roleRecords,
  sourceRecords
} from "@ygmpo/shared/demo-data";
import type {
  ContentItemRecord,
  DashboardStat,
  EvaluationCriterionRecord,
  EvaluationRecord,
  MinistrySnapshot,
  OfficialSnapshot,
  ReportSummary,
  RoleRecord,
  SourceRecord
} from "@ygmpo/shared/types";

export const ADMIN_STORAGE_KEY = "ygmpo-admin-state-v5";

type AdminRuntimeState = {
  ministries?: MinistrySnapshot[];
  officials?: OfficialSnapshot[];
  sources?: SourceRecord[];
  roles?: RoleRecord[];
  contentItems?: ContentItemRecord[];
  criteria?: EvaluationCriterionRecord[];
  evaluations?: EvaluationRecord[];
};

export type RuntimeData = {
  dashboardStats: DashboardStat[];
  ministrySnapshots: MinistrySnapshot[];
  officialSnapshots: OfficialSnapshot[];
  reportSummaries: ReportSummary[];
  sourceRecords: SourceRecord[];
  roleRecords: RoleRecord[];
  contentItems: ContentItemRecord[];
  evaluationCriteria: EvaluationCriterionRecord[];
  evaluationRecords: EvaluationRecord[];
};

const fallbackData: RuntimeData = {
  dashboardStats,
  ministrySnapshots,
  officialSnapshots,
  reportSummaries,
  sourceRecords,
  roleRecords,
  contentItems,
  evaluationCriteria,
  evaluationRecords
};

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function mergeRuntimeData(): RuntimeData {
  if (typeof window === "undefined") return fallbackData;

  const parsed = safeParse<AdminRuntimeState>(window.localStorage.getItem(ADMIN_STORAGE_KEY));
  if (!parsed) return fallbackData;

  return {
    dashboardStats,
    reportSummaries,
    ministrySnapshots: parsed.ministries ?? fallbackData.ministrySnapshots,
    officialSnapshots: parsed.officials ?? fallbackData.officialSnapshots,
    sourceRecords: parsed.sources ?? fallbackData.sourceRecords,
    roleRecords: parsed.roles ?? fallbackData.roleRecords,
    contentItems: parsed.contentItems ?? fallbackData.contentItems,
    evaluationCriteria: parsed.criteria ?? fallbackData.evaluationCriteria,
    evaluationRecords: parsed.evaluations ?? fallbackData.evaluationRecords
  };
}

export function useRuntimeData() {
  const [data, setData] = useState<RuntimeData>(fallbackData);

  useEffect(() => {
    const sync = () => setData(mergeRuntimeData());
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return data;
}