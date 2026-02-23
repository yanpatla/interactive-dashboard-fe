import { z } from "zod";
export type SortBy = "date" | "visits";
export type SortOrder = "asc" | "desc";
export type Granularity = "daily" | "weekly" | "monthly";
export type TrafficModal = "create" | "edit" | "delete";

export type AggregatePoint = { period: string; visits: number };

export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export function isDateYYYYMMDD(v: string | null): v is string {
  return typeof v === "string" && DATE_RE.test(v);
}

export const upsertTrafficSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD"),
  visits: z.number().int().min(0, "Min 0"),
});

export type TrafficStat = z.infer<typeof upsertTrafficSchema>;
export type UpsertTrafficInput = z.infer<typeof upsertTrafficSchema>;
