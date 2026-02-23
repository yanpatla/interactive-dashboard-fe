import type { TrafficModal } from "@/types/traffic";
import type { NavigateFunction } from "react-router-dom";



export function openTrafficModal(
  modal: TrafficModal,
  sp: URLSearchParams,
  navigate: NavigateFunction,
  date?: string,
) {
  const next = new URLSearchParams(sp);
  next.set("modal", modal);
  if (date) next.set("date", date);
  navigate({ search: next.toString() });
}

export function closeTrafficModal(
  navigate: NavigateFunction,
  sp: URLSearchParams,
) {
  const next = new URLSearchParams(sp);
  next.delete("modal");
  next.delete("date");
  navigate({ search: next.toString() }, { replace: true });
}
