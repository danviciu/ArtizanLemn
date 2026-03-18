import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  render: (item: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (item: T) => string;
  emptyState?: React.ReactNode;
};

export function DataTable<T>({
  columns,
  data,
  rowKey,
  emptyState,
}: DataTableProps<T>) {
  if (!data.length) {
    return <>{emptyState ?? null}</>;
  }

  return (
    <div className="luxury-card overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b border-sand-300/70 text-left">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  "px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-wood-700",
                  column.className,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={rowKey(item)} className="border-b border-sand-300/55 last:border-b-0">
              {columns.map((column) => (
                <td key={column.key} className={cn("px-4 py-3 align-top text-sm", column.className)}>
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
