import { DataTableActionHolder, DataTableAction } from './data-table.partials';
import { DataTableProps } from './data-table.util';

export default function DataTable({
  columnHeadings,
  children,
}: DataTableProps) {
  return (
    <div className="">
      <table className="w-full">
        <thead>
          <tr>
            {columnHeadings.map((heading) => (
              <th key={heading} className="text-left">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

DataTable.ActionHolder = DataTableActionHolder;
DataTable.Action = DataTableAction;
