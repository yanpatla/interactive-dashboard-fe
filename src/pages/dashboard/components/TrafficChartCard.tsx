import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AggregatePoint, Granularity } from "@/types/traffic";

type Props = {
  granularity: Granularity;
  data?: AggregatePoint[];
  loading?: boolean;
  error?: boolean;
};

export function TrafficChartCard({ granularity, data, loading, error }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic ({granularity})</CardTitle>
      </CardHeader>

      <CardContent>
        {loading && (
          <div className="text-sm text-muted-foreground">Loading chart…</div>
        )}
        {error && <div className="text-sm text-destructive">Chart failed</div>}

        {!loading && !error && (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {granularity === "daily" ? (
                <LineChart data={data ?? []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visits" dot={false} />
                </LineChart>
              ) : (
                <BarChart data={data ?? []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visits" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
