// material-ui
import { IconButton, Link, TextField, Typography } from '@mui/material';
import { format } from 'date-fns';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import BasicTable from '../../components/react-table/BasicTable';
import { Box } from '@mui/system';

export const columns = [
  {
    Header: 'DATE',
    disableFilters: true,
    accessor: ({ createdAt }: any) => (createdAt ? format(new Date(createdAt), 'dd MMM yyyy') : 'NA')
  },
  {
    Header: 'TIME',
    disableFilters: true,
    accessor: ({ createdAt }: any) => (createdAt ? format(new Date(createdAt), 'HH:mm') : 'NA')
  },
  // {
  //   Header: 'Notification Body',
  //   accessor: ({ notificationBody }: any) => {
  //     return (
  //       <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
  //         <Typography noWrap>{notificationBody}</Typography>
  //       </div>
  //     );
  //   }
  // },
  {
    Header: 'Notification Body',
    accessor: ({ body }: any) => {
      return (
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <Typography noWrap>{body}</Typography>
        </div>
      );
    }
  },
  {
    Header: 'Notification Title',
    accessor: ({ title }: any) => {
      return (
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis'}}>
          <Typography noWrap>{title}</Typography>
        </div>
      );
    }
  },
  // {
  //   Header: 'Notification Title',
  //   accessor: ({ notificationTitle }: any) => {
  //     return (
  //       <div style={{ overflow: 'hidden', textOverflow: 'ellipsis'}}>
  //         <Typography noWrap>{notificationTitle}</Typography>
  //       </div>
  //     );
  //   }
  // },
  {
    Header: 'Target Audience',
    accessor: ({ targetAudience }: any) => {
      return (
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <Typography noWrap>{targetAudience}</Typography>
        </div>
      );
    }
  },
  {
    Header: 'Type of Notification',
    accessor: ({ notificationType }: any) => {

      return (
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <Typography noWrap>{notificationType}</Typography>
        </div>
      );
    }
  },
  // {
  //   Header: 'Type of Notification',
  //   accessor: ({ typeOfNotification }: any) => {

  //     return (
  //       <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
  //         <Typography noWrap>{typeOfNotification?.typeofNotification}</Typography>
  //       </div>
  //     );
  //   }
  // },
  {
    Header: 'Users Count',
    accessor: 'userDetails',
    Cell: ({ value }: any) => {
      const [open, setOpen] = useState(false);
      const [page, setPage] = useState<number>(1);
      console.log(value)
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
          accessor: ({ name, _id }: any) => {
            return (
              <div>
                <Link href={`/admin/user-list/detail/${_id}`} underline="none">
                  {name}
                </Link>
              </div>
            );
          }
        },
        {
          Header: 'Email',
          accessor: ({ email, _id }: any) => {
            return (
              <div>
                <Link href={`/admin/user-list/detail/${_id}`} underline="none">
                  {email}
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
