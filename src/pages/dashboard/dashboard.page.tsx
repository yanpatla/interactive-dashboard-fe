import { useAuth } from "@/hooks/auth/useAuth";
import { useAuthState } from "@/hooks/auth/useAuthState";
import { useDashboardSearch } from "@/hooks/traffic/useDashboardSearch";
import {
  useTrafficAggregate,
  useTrafficList,
} from "@/hooks/traffic/useTrafficQueries";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TrafficChartCard } from "./components/TrafficChartCard";
import { TrafficFiltersCard } from "./components/TrafficFiltersCard";
import { TrafficTableCard } from "./components/TrafficTableCard";
import { TrafficModalShell } from "./modals/TrafficModalShell";
function openModal(
  navigate: ReturnType<typeof useNavigate>,
  sp: URLSearchParams,
  modal: "create" | "edit" | "delete",
  date?: string,
) {
  const next = new URLSearchParams(sp);
  next.set("modal", modal);
  if (date) next.set("date", date);
  navigate({ search: next.toString() });
}
export default function DashboardPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const { isAuthed } = useAuthState();
  const { isLoading, data, isError } = useAuth(isAuthed);
  const {
    searchValues,
    setFrom,
    setTo,
    setSortBy,
    setOrder,
    setGranularity,
    setPage,
  } = useDashboardSearch();

  const listQ = useTrafficList({
    from: searchValues.from,
    to: searchValues.to,
    sortBy: searchValues.sortBy,
    order: searchValues.order,
  });
  const aggQ = useTrafficAggregate({
    from: searchValues.from,
    to: searchValues.to,
    granularity: searchValues.granularity,
  });
  const PAGE_SIZE = 10;

  const total = listQ.data?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const safePage = Math.min(searchValues.page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageRows = (listQ.data ?? []).slice(start, start + PAGE_SIZE);
  if (isLoading) return <div>Loading…</div>;
  if (isError)
    return <div className="text-red-600">Failed to load profile</div>;
  const canEdit = data?.role === "editor";
  return (
    <div className="space-y-4">
      <TrafficFiltersCard
        from={searchValues.from}
        to={searchValues.to}
        sortBy={searchValues.sortBy}
        order={searchValues.order}
        granularity={searchValues.granularity}
        setFrom={setFrom}
        setTo={setTo}
        setSortBy={setSortBy}
        setOrder={setOrder}
        setGranularity={setGranularity}
      />

      <TrafficChartCard
        granularity={searchValues.granularity}
        data={aggQ.data}
        loading={aggQ.isPending}
        error={aggQ.isError}
      />

      <TrafficTableCard
        rows={pageRows}
        page={safePage}
        totalPages={totalPages}
        loading={listQ.isPending}
        error={listQ.isError}
        canEdit={!!canEdit}
        onCreate={() => openModal(navigate, sp, "create")}
        onEdit={(date) => openModal(navigate, sp, "edit", date)}
        onDelete={(date) => openModal(navigate, sp, "delete", date)}
        onPrevPage={() => setPage(Math.max(1, safePage - 1))}
        onNextPage={() => setPage(Math.min(totalPages, safePage + 1))}
      />
      <TrafficModalShell canEdit={!!canEdit} />
    </div>
  );
}
