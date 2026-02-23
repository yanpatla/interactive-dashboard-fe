import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { TrafficStat } from "@/types/traffic";

type TrafficTableCardProps = {
  rows?: TrafficStat[];
  loading?: boolean;
  error?: boolean;

  canEdit: boolean;
  page: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onCreate: () => void;
  onEdit: (date: string) => void;
  onDelete: (date: string) => void;
};

export function TrafficTableCard({
  rows,
  loading,
  error,
  canEdit,
  page,
  totalPages,
  onCreate,
  onEdit,
  onDelete,
  onPrevPage,
  onNextPage,
}: TrafficTableCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Entries</CardTitle>
        {canEdit && <Button onClick={onCreate}>Add entry</Button>}
      </CardHeader>

      <CardContent>
        {loading && (
          <div className="text-sm text-muted-foreground">Loading rows…</div>
        )}
        {error && <div className="text-sm text-destructive">Table failed</div>}

        {!loading && !error && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Visits</TableHead>
                {canEdit && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {(rows ?? []).map((r) => (
                <TableRow key={r.date}>
                  <TableCell className="font-medium">{r.date}</TableCell>
                  <TableCell className="text-right">{r.visits}</TableCell>

                  {canEdit && (
                    <TableCell className="text-right">
                      <div className="inline-flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(r.date)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(r.date)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}

              {(rows?.length ?? 0) === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={canEdit ? 3 : 2}
                    className="text-muted-foreground"
                  >
                    No data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {page} / {totalPages}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onPrevPage} disabled={page <= 1}>
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={onNextPage}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
