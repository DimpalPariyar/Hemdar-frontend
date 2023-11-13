import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useTable, useSortBy, useFilters, useExpanded, usePagination } from 'react-table';
import {
  Box,
  Table,
  Typography,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
  Tooltip,
  Button,
  Avatar,
  IconButton,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11
    }
  })
);

interface Props {
  data: any;
  columns: any;
  SelectAdvice:any,
  
}

const OptionTable: React.FC<Props> = ({ data, columns,SelectAdvice }) => {
  let getTablePropslimit;
  const modifiedColumns = useMemo(() => [...columns], [columns]);
  getTablePropslimit = {
    columns: modifiedColumns,
    data,
    initialState: { pageIndex: 0, pageSize: 25 }
  };
  const { getTableProps, gotoPage, pageCount, getTableBodyProps, headerGroups, page, prepareRow, allColumns } = useTable(
    getTablePropslimit,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  );

  return (
    // <table {...getTableProps()} className="table">
    //   <thead>
    //     {headerGroups.map((headerGroup) => (
    //       <tr {...headerGroup.getHeaderGroupProps()}>
    //         {headerGroup.headers.map((column) => (
    //           <th {...column.getHeaderProps()}>{column.render('Header')}</th>
    //         ))}
    //       </tr>
    //     ))}
    //   </thead>
    //   <tbody {...getTableBodyProps()}>
    //     {rows.map((row) => {
    //       prepareRow(row);
    //       return (
    //         <tr {...row.getRowProps()}>
    //           {row.cells.map((cell) => {
    //             return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
    //           })}
    //         </tr>
    //       );
    //     })}
    //   </tbody>
    // </table>
    <Table {...getTableProps()} sx={{ borderCollapse: 'separate', borderSpacing: '0px 8px' }}>
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
              <TableCell key={column.Header} sx={{ fontSize: '11px', textAlign: 'center' }}>
                <Box>{column.render('Header')}</Box>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody
        {...getTableBodyProps()}
        sx={{
          '& tr:nth-of-type(2n+1)': {
            backgroundColor: '#eeeeee'
          }
        }}
      >
        {page.map((row: any, i: number) => {
          prepareRow(row);
          return (
            <Fragment key={i}>
              <TableRow
                sx={{
                  cursor: 'auto'
                }}
                {...row.getRowProps()}
              >
                {row.cells.map((cell: any, index: number) => {
                //   console.log(cell);
                  return (
                    <Fragment key={index}>
                      {cell?.column?.Header === 'Strike Price' ? (
                        <>
                          <LightTooltip
                            title={
                              <>
                                <Stack direction="row" gap={1}>
                                  <IconButton onClick={() => SelectAdvice('buy', 'CE', cell?.row)} sx={{ height: '30px', width: '30px' }}>
                                    <Avatar
                                      sx={{
                                        bgcolor: 'green',
                                        borderRadius: '8px',
                                        height: '30px',
                                        width: '30px',
                                        '.&Hover': { backgroundColor: 'red' }
                                      }}
                                      variant="square"
                                    >
                                      B
                                    </Avatar>
                                  </IconButton>
                                  <IconButton onClick={() => SelectAdvice('sell', 'CE', cell?.row)} sx={{ height: '30px', width: '30px' }}>
                                    <Avatar
                                      sx={{
                                        bgcolor: 'red',
                                        borderRadius: '8px',
                                        height: '30px',
                                        width: '30px',
                                        '.&Hover': { backgroundColor: 'red' }
                                      }}
                                      variant="square"
                                    >
                                      S
                                    </Avatar>
                                  </IconButton>
                                </Stack>
                              </>
                            }
                            placement="left-start"
                          >
                            <Tooltip
                              title={
                                <>
                                  <Stack direction="row" gap={1}>
                                    <IconButton onClick={() => SelectAdvice('buy', 'PE', cell?.row)} sx={{ height: '30px', width: '30px' }}>
                                      <Avatar
                                        sx={{
                                          bgcolor: 'green',
                                          borderRadius: '8px',
                                          height: '30px',
                                          width: '30px',
                                          '.&Hover': { backgroundColor: 'red' }
                                        }}
                                        variant="square"
                                      >
                                        B
                                      </Avatar>
                                    </IconButton>
                                    <IconButton onClick={() => SelectAdvice('sell', 'PE', cell?.row)} sx={{ height: '30px', width: '30px' }}>
                                      <Avatar
                                        sx={{
                                          bgcolor: 'red',
                                          borderRadius: '8px',
                                          height: '30px',
                                          width: '30px',
                                          '.&Hover': { backgroundColor: 'red' }
                                        }}
                                        variant="square"
                                      >
                                        S
                                      </Avatar>
                                    </IconButton>
                                  </Stack>
                                </>
                              }
                              placement="right-start"
                            >
                              <TableCell
                                key={cell.Cell}
                                {...cell.getCellProps([{ className: cell.column?.className }])}
                                sx={{
                                  fontSize: '11px',
                                  textAlign: 'center',
                                  background: 'lightgrey'
                                }}
                              >
                                {}
                                {cell.render('Cell') || 'NA'}
                              </TableCell>
                            </Tooltip>
                          </LightTooltip>
                        </>
                      ) : (
                        <>
                          <TableCell
                            key={cell.Cell}
                            {...cell.getCellProps([{ className: cell.column?.className }])}
                            sx={{
                              fontSize: '11px',
                              textAlign: 'center'
                            }}
                          >
                            {}
                            {cell.render('Cell') || 'NA'}
                          </TableCell>
                        </>
                      )}
                    </Fragment>
                  );
                })}
              </TableRow>

            </Fragment>
          );
        })}
      </TableBody>
    </Table>
    //   {page.length === 0 && (
    //     <Stack p={3}>
    //       <Typography variant="h5">No rows found</Typography>
    //     </Stack>
    //   )}
    //   <Stack alignItems="flex-end" p={2} spacing={2}>
    //     <Pagination count={totalPageCount} onChange={handleChange} defaultPage={currentPage} />
    //   </Stack>
    // </>
  );
};

export default OptionTable;
