import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  SortBy,
  SortOrder,
  TrafficStat,
} from "../../types/traffic";
import {
  createTraffic,
  deleteTraffic,
  updateTraffic,
} from "@/api/traffic/traffic.api";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/errors";

type ListParams = {
  from?: string;
  to?: string;
  sortBy: SortBy;
  order: SortOrder;
};

function inRange(date: string, from?: string, to?: string) {
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

function sortRows(rows: TrafficStat[], sortBy: SortBy, order: SortOrder) {
  const dir = order === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const av = sortBy === "date" ? a.date : a.visits;
    const bv = sortBy === "date" ? b.date : b.visits;
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });
}

export function useTrafficMutations(
  listParams: ListParams,
) {
  const queryClient = useQueryClient();
  const listKey = ["traffic", "list", listParams] as const;

  const invalidateChart = () =>
    queryClient.invalidateQueries({ queryKey: ["traffic", "aggregate"] });

  const invalidateListSoft = () =>
    queryClient.invalidateQueries({ queryKey: ["traffic", "list"] });

  const createTrafficMutation = useMutation({
    mutationFn: (input: TrafficStat) => createTraffic(input),

    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: listKey });

      const prev = queryClient.getQueryData<TrafficStat[]>(listKey);
      if (!prev) return { prev };

      if (!inRange(input.date, listParams.from, listParams.to)) return { prev };

      const next = sortRows(
        [
          ...prev.filter((r) => r.date !== input.date),
          { date: input.date, visits: input.visits },
        ],
        listParams.sortBy,
        listParams.order,
      );

      queryClient.setQueryData(listKey, next);
      return { prev };
    },

    onError: (err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(listKey, ctx.prev);
      toast.error(getErrorMessage(err));
    },

    onSuccess: (data) => {
      invalidateChart();

      invalidateListSoft();
      toast.success(data);
    },
  });

  const updateTrafficMutation = useMutation({
    mutationFn: (input: TrafficStat) =>
      updateTraffic(input.date, { visits: input.visits }),

    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: listKey });

      const prev = queryClient.getQueryData<TrafficStat[]>(listKey);
      if (!prev) return { prev };

      if (!inRange(input.date, listParams.from, listParams.to)) return { prev };

      const next = sortRows(
        prev.map((r) =>
          r.date === input.date ? { ...r, visits: input.visits } : r,
        ),
        listParams.sortBy,
        listParams.order,
      );

      queryClient.setQueryData(listKey, next);
      return { prev };
    },

    onError: (err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(listKey, ctx.prev);
      toast.error(getErrorMessage(err));
    },

    onSuccess: (data) => {
      invalidateChart();
      invalidateListSoft();
      toast.success(data);
    },
  });

  const deleteTrafficMutation = useMutation({
    mutationFn: (date: string) => deleteTraffic(date),

    onMutate: async (date) => {
      await queryClient.cancelQueries({ queryKey: listKey });

      const prev = queryClient.getQueryData<TrafficStat[]>(listKey);
      if (!prev) return { prev };

      const next = prev.filter((r) => r.date !== date);
      queryClient.setQueryData(listKey, next);
      return { prev };
    },

    onError: (err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(listKey, ctx.prev);
      toast.error(getErrorMessage(err));
    },

    onSuccess: () => {
      invalidateChart();
      invalidateListSoft();
      toast.success(`Deleted`);
    },
  });

  return {
    createTrafficMutation,
    updateTrafficMutation,
    deleteTrafficMutation,
  };
}
