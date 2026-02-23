import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { Granularity, SortBy, SortOrder } from "../../types/traffic";
import {
  aggregateTrafficStats,
  listTrafficStats,
} from "@/api/traffic/traffic.api";

export function useTrafficList(params: {
  from?: string;
  to?: string;
  sortBy: SortBy;
  order: SortOrder;
}) {
  return useQuery({
    queryKey: ["traffic", "list", params],
    queryFn: () => listTrafficStats(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

export function useTrafficAggregate(params: {
  from?: string;
  to?: string;
  granularity: Granularity;
}) {
  return useQuery({
    queryKey: ["traffic", "aggregate", params],
    queryFn: () => aggregateTrafficStats(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
