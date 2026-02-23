import { useDashboardSearch } from "@/hooks/traffic/useDashboardSearch";
import { useTrafficMutations } from "@/hooks/traffic/useTrafficMutations";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type DeleteTrafficDialogProps = {
  open: boolean;
  date?: string;
  onClose: () => void;
};
export function DeleteTrafficDialog({
  open,
  date,
  onClose,
}: DeleteTrafficDialogProps) {
  const { searchValues } = useDashboardSearch();
  const { deleteTrafficMutation } = useTrafficMutations(
    {
      from: searchValues.from,
      to: searchValues.to,
      sortBy: searchValues.sortBy,
      order: searchValues.order,
    }
  );
  const onDelete = async () => {
    if (!date) return;
    await deleteTrafficMutation.mutateAsync(date);
    onClose();
  };
  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete entry</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {date ?? "this entry"}.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteTrafficMutation.error && (
          <p className="text-sm text-destructive">Delete failed</p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            disabled={deleteTrafficMutation.isPending}
          >
            {deleteTrafficMutation.isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
