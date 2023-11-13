import { useState } from 'react';
import { IconButton, Link, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import BasicTable from '../../components/react-table/BasicTable';
import { Box } from '@mui/system';
export const columns = [
  {
    Header: 'Products',
    accessor: 'product'
  },
  {
    Header: 'Total Subscription',
    accessor: 'totalcount'
  },
  {
    Header: '30 days',
    accessor: 'monthcount'
  },
  {
    Header: '60 days',
    accessor: 'sixtydayscount'
  },
  {
    Header: '90 days',
    accessor: 'quatercount'
  },
  {
    Header: 'List of Users',
    accessor: 'users',
    Cell: ({ value }: any) => {
      const [open, setOpen] = useState(false);
      const [page, setPage] = useState<number>(1);
      const [data, setData] = useState(value);
      let limit = 10;
      const handleClickOpen = () => {
        setOpen(true);
      };

      const handleClose = () => {
        setOpen(false);
      };
      const handlePageChange = (page: number) => {
        setPage(page);
        setData(value?.slice(page * limit - limit, page * limit));
      };
      const setSearchText = (e: any) => {
        var filtered = function (list: any, key: any, value: String) {
          var filtered = [],
            i = list.length;
          var reg = new RegExp('(.*)(' + value.toLowerCase() + ')(.*)');
          while (i--) {
            if (reg.test(list[i][key]?.toLowerCase())) {
              filtered.push(list[i]);
            }
          }
          return filtered;
        };
        setData(filtered(data, 'email', e.target.value.split(' ').join('')));
        if (!e.target.value) {
          setData(value);
        }
      };

      const columns = [
        {
          Header: 'UserName',
          accessor: ({ name, id }: any) => {
            return (
              <div>
                <Link href={`/admin/user-list/detail/${id}`} underline="none">
                  {name}
                </Link>
              </div>
            );
          }
        },
        {
          Header: 'Email',
          accessor: ({ email, id }: any) => {
            return (
              <div>
                <Link href={`/admin/user-list/detail/${id}`} underline="none">
                  {email}
                </Link>
              </div>
            );
          }
        },
        {
          Header: 'Mobile',
          accessor: ({ mobile, id }: any) => {
            return (
              <div>
                <Link href={`/admin/user-list/detail/${id}`} underline="none">
                  {mobile}
                </Link>
              </div>
            );
          }
        }
      ];
      return (
        <>
          {value && (
            <IconButton
              onClick={handleClickOpen}
              sx={{
                bgcolor: '#ECEFFF',
                borderRadius: '15px'
              }}
            >
              {value?.length}
            </IconButton>
          )}

          <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">Notification sent to this Users</DialogTitle>
            <DialogContent sx={{ position: 'relative' }}>
              <Box m={1} sx={{ textAlign: 'center' }}>
                {/* <SearchInput onChange={setSearchText} /> */}
                <TextField onChange={setSearchText} placeholder="Search"></TextField>
              </Box>
              <BasicTable
                columns={columns}
                getHeaderProps={(column: any) => column.getSortByToggleProps()}
                data={data}
                totalPage={Math.ceil(value?.length / limit)}
                onPageChange={handlePageChange}
                currentPage={page}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </>
      );
    }
  }
];
