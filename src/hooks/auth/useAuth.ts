import { getAuth } from "@/api/auth/auth.api";
import { useQuery, queryOptions } from "@tanstack/react-query";

const meOptions = queryOptions({
  queryKey: ["auth", "me"],
  queryFn: getAuth,
  staleTime: 5 * 60 * 1000,
});

export function useAuth(enabled: boolean) {
  return useQuery({
    ...meOptions,
    enabled,
  });
}

