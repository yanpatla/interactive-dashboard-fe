import { DatePickerField } from "@/components/DatePickerField";
import {
  DialogFooter,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDashboardSearch } from "@/hooks/traffic/useDashboardSearch";
import { useTrafficByDate } from "@/hooks/traffic/useTrafficByDate";
import { useTrafficMutations } from "@/hooks/traffic/useTrafficMutations";
import { upsertTrafficSchema, type UpsertTrafficInput } from "@/types/traffic";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

type UpsertTrafficDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  date?: string; 
  onClose: () => void;
};

export function UpsertTrafficDialog({
  open,
  mode,
  date,
  onClose,
}: UpsertTrafficDialogProps) {
  const { searchValues } = useDashboardSearch();
  const { createTrafficMutation, updateTrafficMutation } = useTrafficMutations(
    {
      from: searchValues.from,
      to: searchValues.to,
      sortBy: searchValues.sortBy,
      order: searchValues.order,
    }
  );
  const detailQ = useTrafficByDate(date, open && mode === "edit");

  const form = useForm<UpsertTrafficInput>({
    resolver: zodResolver(upsertTrafficSchema),
    defaultValues: { date: date ?? "", visits: 0 },
  });

  useEffect(() => {
    if (mode === "edit" && detailQ.data) {
      form.reset({ date: detailQ.data.date, visits: detailQ.data.visits });
    }
    if (mode === "create") {
      form.reset({ date: date ?? "", visits: 0 });
    }
  }, [mode, date, detailQ.data]);

  const submitting =
    createTrafficMutation.isPending || updateTrafficMutation.isPending;

  const onSubmit = form.handleSubmit(async (values) => {
    if (mode === "create") {
      await createTrafficMutation.mutateAsync(values);
    } else {
      await updateTrafficMutation.mutateAsync(values);
    }
    onClose();
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add entry" : `Edit ${date ?? ""}`}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    {mode === "edit" ? (
                      <Input value={field.value} readOnly disabled />
                    ) : (
                      <DatePickerField
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Pick date"
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visits</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.currentTarget.valueAsNumber)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(createTrafficMutation.error || updateTrafficMutation.error) && (
              <p className="text-sm text-destructive">Save failed</p>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
