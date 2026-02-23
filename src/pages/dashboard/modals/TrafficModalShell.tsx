import type { TrafficModal } from "@/types/traffic";
import { closeTrafficModal } from "./modalUrl";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UpsertTrafficDialog } from "./UpsertTrafficDialog";
import { DeleteTrafficDialog } from "./DeleteTrafficDialog";
type TrafficModalShellProps = {
  canEdit?: boolean;
};
export function TrafficModalShell({ canEdit }: TrafficModalShellProps) {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const modal = sp.get("modal") as TrafficModal | null;
  const date = sp.get("date") || undefined;

  const onClose = () => closeTrafficModal(navigate, sp);
  if (!modal) return null;
  if (modal && !canEdit) {
    onClose();
    return null;
  }
  if (modal === "delete") {
    return <DeleteTrafficDialog open date={date} onClose={onClose} />;
  }

  return (
    <UpsertTrafficDialog open mode={modal} date={date} onClose={onClose} />
  );
}
