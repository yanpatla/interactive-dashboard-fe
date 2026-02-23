import { DatePickerField } from "@/components/DatePickerField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Granularity, SortBy, SortOrder } from "@/types/traffic";

type TrafficFiltersCardProps = {
  from?: string;
  to?: string;
  sortBy: SortBy;
  order: SortOrder;
  granularity: Granularity;

  setFrom: (v?: string) => void;
  setTo: (v?: string) => void;
  setSortBy: (v: SortBy) => void;
  setOrder: (v: SortOrder) => void;
  setGranularity: (v: Granularity) => void;
};

export function TrafficFiltersCard(p: TrafficFiltersCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-wrap gap-4">
        <div className="grid gap-1">
          <Label>From</Label>
          <DatePickerField
            value={p.from}
            onChange={p.setFrom}
            placeholder="From"
          />
        </div>

        <div className="grid gap-1">
          <Label>To</Label>
          <DatePickerField value={p.to} onChange={p.setTo} placeholder="To" />
        </div>

        <div className="grid gap-1 min-w-[160px]">
          <Label>Sort by</Label>
          <Select
            value={p.sortBy}
            onValueChange={(v) => p.setSortBy(v as SortBy)}
          >
            <SelectTrigger>
              <SelectValue placeholder="sortBy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">date</SelectItem>
              <SelectItem value="visits">visits</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1 min-w-[160px]">
          <Label>Order</Label>
          <Select
            value={p.order}
            onValueChange={(v) => p.setOrder(v as SortOrder)}
          >
            <SelectTrigger>
              <SelectValue placeholder="order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">asc</SelectItem>
              <SelectItem value="desc">desc</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1 min-w-[180px]">
          <Label>Chart granularity</Label>
          <Select
            value={p.granularity}
            onValueChange={(v) => p.setGranularity(v as Granularity)}
          >
            <SelectTrigger>
              <SelectValue placeholder="granularity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">daily</SelectItem>
              <SelectItem value="weekly">weekly</SelectItem>
              <SelectItem value="monthly">monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
