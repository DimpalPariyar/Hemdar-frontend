import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

function ReacttanStackTable({ columns, data }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className="" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  className=" bg-slate-300 p-1 border border-black"
                  key={header.id}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr className="border border-black" key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  className="p-1 border-black border text-center"
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
}

export default ReacttanStackTable;
