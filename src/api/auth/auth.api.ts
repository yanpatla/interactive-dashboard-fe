import { api } from "@/lib/http/axiosClient";
import type { AuthUser } from "@/domain/auth/auth.types";

export async function getAuth(): Promise<AuthUser> {
  const { data } = await api.get("/auth/me");
  return data;
}
