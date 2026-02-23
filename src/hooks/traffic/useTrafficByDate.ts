import { getTrafficByDate } from "@/api/traffic/traffic.api";
import { useQuery } from "@tanstack/react-query";
 
export function useTrafficByDate(date?: string, enabled?: boolean) {
  return useQuery({
    queryKey: ["traffic", "byDate", date],
    queryFn: () => getTrafficByDate(date!),
    enabled: !!date && !!enabled,
    staleTime: 30_000,
  });
}
