import { useCallback, useMemo, useState, Fragment, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Dialog,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  Button
} from '@mui/material';

// third-party
import { useFilters, useExpanded, useGlobalFilter, useSortBy, useTable, usePagination, Column } from 'react-table';

// project import
import QuestionView from 'pages/risk-profile/QuestionView';
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

import RiskProfileQuestion from './questions/createQuestion';
import UpdateRiskProfileQuestion from './questions/updateQuestion';
import { BASE_URL } from 'config';
import axios from 'utils/axios';

interface Props {
  columns: Column[];
  data: [];
  getHeaderProps: (column: any) => void;
  renderRowSubComponent: any;
}

const RenderQuestions = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [add, setAdd] = useState<boolean>(false);
  const [questions, setQuestions] = useState<[]>([]);
  const [open, setOpen] = useState(false);

  const init = async () => {
    try {
      await axios.get(`${BASE_URL}/riskprofile/all`).then((response: any) => {
        setQuestions(response?.data?.data[0].questions || []);
        // console.log(response?.data?.data[0]);
      });
    } catch (error) {
      setQuestions([]);
      console.log({ error: error });
    }
  };

  useEffect(() => {
    init();
  }, [open]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenUpdate = () => {
    setAdd(true);
  };

  const handleClickCloseUpdate = () => {
    setAdd(false);
    init();
  };

  const deleteHandler = async (questionId: any) => {
    await axios.delete(`${BASE_URL}/riskprofile/question/${questionId}/delete`).then(() => {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Question is deleted successfully.',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
      init();
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

  const columns = useMemo(
    () => [
      {
        Header: 'Question',
        accessor: 'questionDescription',
        Cell: ({ row }: any) => {
          const { values } = row;
          return (
            <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="flex-start">
              <Stack spacing={0}>
                <Typography
                  variant="subtitle1"
                  sx={{ maxWidth: '800px', whiteSpace: 'nowrap', wordWrap: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {values.questionDescription}
                </Typography>
              </Stack>
            </Stack>
          );
        }
      },
      {
        Header: 'Actions',
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
                    setCurrentQuestion(row);
                    handleClickOpenUpdate();
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
                    deleteHandler(row.original.questionId);
                  }}
                >
                  <DeleteTwoTone twoToneColor={theme.palette.error.main} />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    [theme]
  );

  const renderRowSubComponent = useCallback(({ row, i }) => <QuestionView data={questions[i]} />, [questions]);

  return (
    <MainCard
      content={false}
      title={
        <Stack
          direction={matchDownSM ? 'column' : 'row'}
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 3, pb: 0 }}
        >
          <Grid container direction="row" justifyContent="space-between">
            <Typography variant="h4">Risk Profile Questions</Typography>
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleClickOpen}>
              Add Question
            </Button>
            <Dialog
              maxWidth="sm"
              fullWidth
              onClose={(_, reason) => {
                if (reason !== 'backdropClick') {
                  handleClose();
                }
              }}
              open={open}
              sx={{ '& .MuiDialog-paper': { p: 0 } }}
            >
              {open && <RiskProfileQuestion handleClose={handleClose} />}
            </Dialog>
          </Grid>
        </Stack>
      }
    >
      <ScrollX>
        <ReactTable
          columns={columns}
          data={questions}
          getHeaderProps={(column: any) => column.getSortByToggleProps()}
          renderRowSubComponent={renderRowSubComponent}
        />
      </ScrollX>
      <Dialog
        maxWidth="sm"
        fullWidth
        onClose={(_, reason) => {
          if (reason !== 'backdropClick') {
            handleClickCloseUpdate();
          }
        }}
        open={add}
        sx={{ '& .MuiDialog-paper': { p: 0 } }}
      >
        {add && <UpdateRiskProfileQuestion currentQuestion={currentQuestion} handleClose={handleClickCloseUpdate} />}
      </Dialog>
    </MainCard>
  );
};
export default RenderQuestions;
