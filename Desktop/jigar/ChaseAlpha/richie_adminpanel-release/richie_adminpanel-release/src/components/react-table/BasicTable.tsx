// material-ui
import { Stack, Table, Typography, TableBody, TableCell, TableHead, TableRow, Pagination } from '@mui/material';

// import { RightOutlined, DownOutlined } from '@ant-design/icons';
// third-party
import { useTable, useSortBy, useFilters, useExpanded, usePagination } from 'react-table';
import { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/system';
import EditColumDailogBox from './FilterComponents/EditColumDailogBox';
import { useDispatch } from 'react-redux';
import { adviceValue } from 'store/reducers/adviceCounter';

// project import

// ==============================|| REACT TABLE ||============================== //

// const expandColumn = [
//   {
//     id: 'expander',
//     Cell: ({ row }: any) => {
//       return (
//         <span
//           {...row.getToggleRowExpandedProps({
//             style: {
//               paddingLeft: `${row.depth * 2}rem`
//             }
//           })}
//           onClick={() => row.toggleRowExpanded()}
//         >
//           {!row.isExpanded ? <RightOutlined /> : <DownOutlined />}
//         </span>
//       );
//     }
//   }
// ];

const defaultHeaderProps = (column: any) => column.getSortByToggleProps();

function ReactTable({
  childColumns,
  columns,
  data = [],
  striped,
  getHeaderProps = defaultHeaderProps,
  disableFilters,
  onPageChange,
  currentPage = 0,
  totalPage,
  onRowClick,
  limit,
  advicetable
}: any) {
  const [clickedRow, setClickedRow] = useState<any>();
  const dispatch = useDispatch();
  const modifiedColumns = useMemo(() => [...columns], [columns, childColumns]);
  let getTablePropslimit;
  if (limit > 100) {
    getTablePropslimit = {
      columns: modifiedColumns,
      data,
      initialState: { pageIndex: 0, pageSize: limit }
    };
  } else {
    getTablePropslimit = {
      columns: modifiedColumns,
      data,
      initialState: { pageIndex: 0, pageSize: 25 }
    };
  }
  const { getTableProps, gotoPage, pageCount, getTableBodyProps, headerGroups, page, prepareRow, allColumns } = useTable(
    getTablePropslimit,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  );
  const totalPageCount = totalPage || pageCount;

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    gotoPage(value);
    onPageChange?.(value);
  };

  const handleRowClick = (row: any, i: number) => {
    if (onRowClick) {
      dispatch(adviceValue(i));
      setClickedRow(i);
      onRowClick(row.original);
    }
  };

  useEffect(() => {
    setClickedRow(null);
  }, [data]);

  return (
    <>
      <EditColumDailogBox headerGroups={allColumns} />
      <Table
        {...getTableProps()}
        sx={
          advicetable
            ? { borderCollapse: 'separate', borderSpacing: '0px 8px', width: 'max-content' }
            : { borderCollapse: 'separate', borderSpacing: '0px 8px' }
        }
      >
        <TableHead
          sx={{
            bgcolor: '#E5E9FF',
            '& th:first-of-type': {
              borderRadius: '1em 0 0 0'
            },
            '& th:last-of-type': {
              borderRadius: '0 1em 0 0'
            }
          }}
        >
          {headerGroups.map((headerGroup: any, i: number) => (
            <TableRow key={i}>
              {headerGroup.headers.map((column: any, index: number) => (
                <TableCell
                  key={column.Header}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  sx={advicetable ? { fontSize: '8px', width: 'max-content', maxWidth: '30px', padding: '0px' } : { fontSize: '12px' }}
                >
                  <Box>{column.render('Header')}</Box>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody
          {...getTableBodyProps()}
          {...(striped && { className: 'striped' })}
          sx={{
            '& tr:nth-of-type(2n+1)': {
              backgroundColor: '#eeeeee'
            }
          }}
        >
          {page.map((row: any, i: number) => {
            prepareRow(row);
            const isSelected = i === clickedRow;
            return (
              <>
                <TableRow
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'auto'
                  }}
                  onClick={() => handleRowClick(row, i)}
                  selected={isSelected}
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell: any, index: number) => {
                    return (
                      <TableCell
                        key={cell.Cell}
                        {...cell.getCellProps([{ className: cell.column?.className }])}
                        sx={
                          advicetable
                            ? {
                                fontSize: '10px',
                                fontWeight: '600',
                                padding: '10px',
                                backgroundColor: cell.row.index === clickedRow ? '#3856EE' : '',
                                color: cell.row.index === clickedRow ? '#FFFFFF' : 'black',
                                maxWidth:'100px',
                              }
                            : { fontSize: '13px', maxWidth: '700px' }
                        }
                      >
                        {cell.render('Cell') || 'NA'}
                      </TableCell>
                    );
                  })}
                </TableRow>
                {/* {row.isExpanded && (
                  <tr>
                    <td colSpan={visibleColumns.length}>
                      <ReactTable
                        columns={childColumns}
                        disableFilters
                        data={row.original[childDataKey]}
                        getHeaderProps={(column: any) => column.getSortByToggleProps()}
                      />
                    </td>
                  </tr>
                )} */}
              </>
            );
          })}
        </TableBody>
      </Table>
      {page.length === 0 && (
        <Stack p={3}>
          <Typography variant="h5">No rows found</Typography>
        </Stack>
      )}
      <Stack alignItems="flex-end" p={2} spacing={2}>
        <Pagination count={totalPageCount} onChange={handleChange} defaultPage={currentPage} />
      </Stack>
    </>
  );
}

export default ReactTable;
