import { api } from "@/lib/http/axiosClient";
import type {
  AggregatePoint,
  Granularity,
  SortBy,
  SortOrder,
  TrafficStat,
} from "@/types/traffic";

export async function listTrafficStats(params: {
  from?: string;
  to?: string;
  sortBy?: SortBy;
  order?: SortOrder;
}): Promise<TrafficStat[]> {
  const { data } = await api.get<TrafficStat[]>("/traffic-stats", { params });
  return data;
}

export async function aggregateTrafficStats(params: {
  from?: string;
  to?: string;
  granularity: Granularity;
}): Promise<AggregatePoint[]> {
  const { data } = await api.get<AggregatePoint[]>("/traffic-stats/aggregate", {
    params,
  });
  return data;
}

export async function getTrafficByDate(date: string): Promise<TrafficStat> {
  const { data } = await api.get<TrafficStat>(`/traffic-stats/${date}`);
  return data;
}

export async function createTraffic(input: {
  date: string;
  visits: number;
}): Promise<string> {
  const { data } = await api.post<string>("/traffic-stats", input);
  return data;
}

export async function updateTraffic(
  date: string,
  input: { visits: number },
): Promise<string> {
  const { data } = await api.put<string>(`/traffic-stats/${date}`, input);
  return data;
}

export async function deleteTraffic(date: string): Promise<string> {
  const { data } = await api.delete<string>(`/traffic-stats/${date}`);
  return data;
}
