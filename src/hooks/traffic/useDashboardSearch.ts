import {
  isDateYYYYMMDD,
  type Granularity,
  type SortBy,
  type SortOrder,
} from "@/types/traffic";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const DEFAULTS = {
  sortBy: "date" as SortBy,
  order: "asc" as SortOrder,
  granularity: "daily" as Granularity,
  page: 1,
};

function getEnum<T extends string>(
  v: string | null,
  allowed: readonly T[],
  fallback: T,
): T {
  return v && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
}

export function useDashboardSearch() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    if (!urlParams.get("page")) urlParams.set("page", String(DEFAULTS.page));
    if (!urlParams.get("sortBy")) urlParams.set("sortBy", DEFAULTS.sortBy);
    if (!urlParams.get("order")) urlParams.set("order", DEFAULTS.order);
    if (!urlParams.get("granularity"))
      urlParams.set("granularity", DEFAULTS.granularity);

    if (urlParams.toString() !== searchParams.toString()) {
      setSearchParams(urlParams, { replace: true });
    }
  }, []);

  const searchValues = useMemo(() => {
    const pageRaw = Number(searchParams.get("page"));
    const page =
      Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : DEFAULTS.page;

    const from = isDateYYYYMMDD(searchParams.get("from"))
      ? searchParams.get("from")!
      : undefined;
    const to = isDateYYYYMMDD(searchParams.get("to"))
      ? searchParams.get("to")!
      : undefined;

    const sortBy = getEnum(
      searchParams.get("sortBy"),
      ["date", "visits"] as const,
      DEFAULTS.sortBy,
    );
    const order = getEnum(
      searchParams.get("order"),
      ["asc", "desc"] as const,
      DEFAULTS.order,
    );
    const granularity = getEnum(
      searchParams.get("granularity"),
      ["daily", "weekly", "monthly"] as const,
      DEFAULTS.granularity,
    );

    return { from, to, sortBy, order, granularity, page };
  }, [searchParams]);

  const setParam = (key: string, value?: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (!value) newParams.delete(key);
      else newParams.set(key, value);
      return newParams;
    });
  };

  return {
    searchParams,
    searchValues,
    setFrom: (v?: string) => setParam("from", v),
    setTo: (v?: string) => setParam("to", v),
    setSortBy: (v: SortBy) => setParam("sortBy", v),
    setOrder: (v: SortOrder) => setParam("order", v),
    setGranularity: (v: Granularity) => setParam("granularity", v),
    setPage: (n: number) => setParam("page", String(n)),
  };
}
