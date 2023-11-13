import { useCallback, useMemo, Fragment, useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  Button,
  Dialog
} from '@mui/material';

// third-party
import { useFilters, useExpanded, useGlobalFilter, useSortBy, useTable, usePagination, Column } from 'react-table';

// project import
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { renderFilterTypes } from 'utils/react-table';
import { HeaderSort, TablePagination } from 'components/third-party/ReactTable';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';
// assets
import { PlusOutlined } from '@ant-design/icons';
import { CloseOutlined, EyeTwoTone, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { getProgramPlans, getUpdateOperations } from 'store/reducers/programPlans';

import { BASE_URL } from 'config';
import axios from 'utils/axios';
import ViewPlans from './ViewPlans';
import { useSelector } from 'store';
import _ from 'lodash';
import CreatePlan from './CreatePlan';
import UpdatePlan from './UpdatePlan';

interface Props {
  columns: Column[];
  data: [];
  getHeaderProps: (column: any) => void;
  renderRowSubComponent: any;
}

const PlanList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { programPlans, updateOperations } = useSelector((state) => state.programPlans);
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updateRow, setOpenUpdateRow] = useState<any>();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenUpdateDialog = (row: any) => {
    setOpenUpdateDialog(true);
    setOpenUpdateRow(row);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const init = async () => {
    try {
      await dispatch(getUpdateOperations());
      await dispatch(getProgramPlans());
      console.log(updateOperations.delete);
    } catch (error) {
      console.log({ error: error });
    }
  };

  useEffect(() => {
    init();
  }, [openUpdateDialog, open]);

  const deleteHandler = async (priceId: any) => {
    axios.delete(`${BASE_URL}/learning/plan/${priceId}`).then(() => {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Plan is deleted successfully.',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
      dispatch(getProgramPlans());
    });
  };

  function ReactTable({ columns, data, getHeaderProps, renderRowSubComponent }: Props) {
    const filterTypes = useMemo(() => renderFilterTypes, []);

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      visibleColumns,
      rows,
      // @ts-ignore
      page,
      // @ts-ignore
      gotoPage,
      // @ts-ignore
      setPageSize,
      // @ts-ignore
      state: { pageIndex, pageSize }
    } = useTable(
      {
        columns,
        data,
        // @ts-ignore
        filterTypes,
        // @ts-ignore
        initialState: { pageIndex: 0, pageSize: 10 }
      },
      useGlobalFilter,
      useFilters,
      useSortBy,
      useExpanded,
      usePagination
    );
    return (
      <>
        <Stack spacing={3}>
          <Table {...getTableProps()}>
            <TableHead>
              {headerGroups.map((headerGroup) => (
                <TableRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column: any) => (
                    <TableCell {...column.getHeaderProps([{ className: column.className }, getHeaderProps(column)])}>
                      <HeaderSort column={column} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {page.map((row: any, i: number) => {
                prepareRow(row);
                const rowProps = row.getRowProps();

                return (
                  <Fragment key={i}>
                    <TableRow {...row.getRowProps()} sx={{ cursor: 'pointer', bgcolor: 'inherit' }}>
                      {row.cells.map((cell: any) => (
                        <TableCell {...cell.getCellProps([{ className: cell.column.className }])}>{cell.render('Cell')}</TableCell>
                      ))}
                    </TableRow>
                    {row.isExpanded && renderRowSubComponent({ row, rowProps, visibleColumns, i })}
                  </Fragment>
                );
              })}
              <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
                <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                  <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Stack>
      </>
    );
  }

  const columns = [
    {
      Header: 'Plan Name',
      accessor: 'priceName',
      Cell: ({ row }: any) => {
        const { values } = row;
        return (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Stack spacing={0}>
              <Typography
                variant="subtitle1"
                sx={{
                  justifyItems: 'flex-start',
                  whiteSpace: 'nowrap',
                  wordWrap: 'break-word',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {values.priceName}
              </Typography>
            </Stack>
          </Stack>
        );
      }
    },
    {
      Header: 'd',
      disableSortBy: true,
      Cell: ({ row }: any) => {
        const collapseIcon = row.isExpanded ? (
          <CloseOutlined style={{ color: theme.palette.error.main }} />
        ) : (
          <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
        );
        return (
          <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0}>
            <Tooltip title="View">
              <IconButton
                color="secondary"
                onClick={(e: any) => {
                  e.stopPropagation();
                  row.toggleRowExpanded();
                }}
              >
                {collapseIcon}
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                onClick={(e: any) => {
                  e.stopPropagation();
                  handleClickOpenUpdateDialog(row.original);
                }}
              >
                <EditTwoTone twoToneColor={theme.palette.primary.main} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={(e: any) => {
                  e.stopPropagation();
                  deleteHandler(row.original._id);
                }}
              >
                <DeleteTwoTone twoToneColor={theme.palette.error.main} />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      }
    }
  ];

  const renderRowSubComponent = useCallback(({ row, i }) => <ViewPlans data={programPlans[i]} />, [programPlans]);

  return (
    <MainCard
      content={false}
      title={
        <Stack direction={matchDownSM ? 'column' : 'row'} spacing={1} justifyContent="space-between" alignItems="center">
          <Grid container direction="row" justifyContent="space-between">
            <Typography variant="h4">Session Plan Details</Typography>
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleClickOpen}>
              Add Plan
            </Button>
          </Grid>
        </Stack>
      }
    >
      {!_.isEmpty(programPlans) ? (
        <ScrollX>
          <ReactTable
            columns={columns}
            data={programPlans}
            getHeaderProps={(column: any) => column.getSortByToggleProps()}
            renderRowSubComponent={renderRowSubComponent}
          />
        </ScrollX>
      ) : (
        <Typography variant="h6" sx={{ pl: 3 }}>
          No plans found
        </Typography>
      )}
      <Dialog
        onClose={(_: any, reason: string) => {
          if (reason !== 'backdropClick') {
            handleClose();
          }
        }}
        open={open}
      >
        {open && <CreatePlan handleClose={handleClose} />}
      </Dialog>
      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={(_: any, reason: string) => {
          if (reason !== 'backdropClick') {
            handleClose();
          }
        }}
        open={openUpdateDialog}
      >
        {openUpdateDialog && <UpdatePlan plan={updateRow} handleClose={handleCloseUpdateDialog} />}
      </Dialog>
    </MainCard>
  );
};
export default PlanList;
