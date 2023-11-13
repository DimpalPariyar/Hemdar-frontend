// material-ui
import { Typography, Button, Dialog, DialogContent, DialogTitle, Chip } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import ToggleButton from '@mui/material/ToggleButton';
import axios from 'utils/axios';
import { BASE_URL } from 'config';
import ClearIcon from '@mui/icons-material/Clear';
import { Stack } from '@mui/system';
import moment from 'moment';

export const columns = [
  {
    Header: 'SR NO.',
    disableFilters: true,
    accessor: ({ srNo }: any) => srNo
  },
  {
    Header: 'DATE',
    disableFilters: true,
    accessor: ({ registeredAt }: any) => (registeredAt ? registeredAt.slice(0, 10) : 'NA')
  },
  {
    Header: 'TIME',
    disableFilters: true,
    accessor: ({ registeredAt }: any) => (registeredAt ? registeredAt.slice(10, 19) : 'NA')
  },
  {
    Header: 'Name',
    accessor: ({ firstName }: any) => firstName,
    disableFilters: true,
    style: {
      width: 140
    }
  },
  {
    Header: 'lastName',
    accessor: ({ lastName }: any) => lastName,
    disableFilters: true,
    style: {
      width: 140
    }
  },
  {
    Header: 'email',
    accessor: ({ email }: any) => email,
    disableFilters: true,
    style: {
      width: 140
    }
  },
  {
    Header: 'Mobile',
    accessor: ({ mobile }: any) => {
      return (
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '90px' }}>
          <Typography noWrap>{mobile}</Typography>
        </div>
      );
    },
    filter: (rows: any, id: any, filterValue: any) => {
      return rows.filter((row: any) => {
        if (!filterValue) return true;
        return `${row.original.mobile}`.includes(filterValue);
      });
    }
  },
  {
    Header: 'Broker Account',
    accessor: ({ brokerAccounts }: any) => {
      return (<div>
        {brokerAccounts.map((x: any) =>
          <Stack direction="column">
            <Chip sx={{ m: 1 }} label={x} color="success" size="small"></Chip>
          </Stack>
        )}
      </div>)
    },
    disableFilters: true,
    style: {
      width: 140
    }
  },
  {
    Header: 'interests',
    accessor: ({ interests }: any) => {
      return (<div>
        {interests.map((x: any) =>
          <Stack direction="column">
            <Chip sx={{ m: 1 }} label={x} color="info" size="small"></Chip>
          </Stack>
        )}
      </div>)
    },
    disableFilters: true,
    style: {
      width: 140
    }
  },
  {
    Header: 'Device',
    accessor: ({ device }: any) => device,
    disableFilters: true,
    style: {
      width: 140
    }
  },
  {
    Header: 'enable User?',
    className: 'cell-right',
    disableSortBy: true,
    accessor: ({ enable, _id }: any) => { return { _id, enable } },
    Cell: ({ value }: any) => {
      const [selected, setSelected] = useState(value.enable)
      const [open, setOpen] = useState(false);
      const handleClickOpen = () => {
        setOpen(true);
      };

      const handleClose = () => {
        setOpen(false);
      };
      const bgColor = {
        background: 'linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)',
        color: " #FFFFFF", borderRadius: "10px"
      }
      return (
        <>
          <Button sx={bgColor} variant="outlined" onClick={handleClickOpen}>
            {selected ? "Disable User" : "Enable User"}
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle >
              {"please click on below button to give access to user"}
            </DialogTitle>
            <DialogContent>             
              <ToggleButton
                sx={{ marginLeft: "40%" }}
                value="cross"
                selected={selected}
                color="success"
                onChange={async () => {
                  setSelected(!selected);
                  await axios.patch(`${BASE_URL}/beta/${value._id}`, { "enable": !value.enable });
                  handleClose()
                }}
              >
                {selected ? <CheckIcon /> : <ClearIcon />}
              </ToggleButton>
            </DialogContent>

          </Dialog>
        </>
      );
    }
  },
  // {
  //   Header: 'Delete Actions',
  //   className: 'cell-right',
  //   accessor: ({ _id }: any) => {
  //     return <Link href={``} underline="none">
  //       <Tooltip title="delete">
  //         <IconButton color="secondary">
  //           <DeleteIcon />
  //         </IconButton>
  //       </Tooltip>
  //     </Link>;
  //   }
  // }

];
