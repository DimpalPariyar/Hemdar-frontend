// material-ui
import { Chip, IconButton, Typography, MenuItem, Select, SelectChangeEvent, Tooltip, Link } from '@mui/material';
import { format, startOfDay, addDays } from 'date-fns';
import DatePicker from 'components/DatePicker';
import LogoutIcon from '@mui/icons-material/Logout';
import { EyeTwoTone } from '@ant-design/icons';
import axios from '../../utils/axios';
import { BASE_URL } from 'config';


export const columns = [
  {
    Header: 'Name',
    accessor: 'name'
  },
  {
    Header: 'Email',
    accessor: 'email'
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
    Header: 'PAN Card',
    accessor: 'panNumber'
  },
  {
    Header: 'Risk Profile',
    accessor: ({ score }: any) => score?.value,
    disableSortBy: true,
    style: {
      width: 340
    }
  },
  {
    Header: 'Courses',
    accessor: ({ purchasedCourses }: any) => purchasedCourses.length,
    disableFilters: true,
    style: {
      width: 140
    }
  },
  // {
  //   Header: 'Advisories',
  //   accessor: ({ subscribedAdvisories }: any) => subscribedAdvisories.length
  // },
  {
    Header: 'Sessions',
    accessor: ({ purchasedSessions }: any) => purchasedSessions.length,
    disableFilters: true,
    style: {
      width: 140
    }
  },
  {
    Header: 'KYC Status',
    style: {
      width: 240
    },
    accessor: ({ kycStatus }: any) => {
      const status = kycStatus?.value;
      if (!status) return null;
      switch (status) {
        case 0:
          return <Chip color="error" label="Not Verified" size="small" variant="light" />;
        case 1:
          return <Chip color="success" label="Verified" size="small" variant="light" />;
      }
    },
    Filter: ({ column: { filterValue = 0, setFilter } }: any) => {
      const handleChange = (event: SelectChangeEvent) => {
        setFilter(event.target.value as string);
      };

      return (
        <Select value={filterValue} sx={{ display: 'flex', gap: 2 }} onChange={handleChange}>
          <MenuItem value={0}>All</MenuItem>
          <MenuItem value={1}>Verified</MenuItem>
          <MenuItem value={2}>Not Verified</MenuItem>
        </Select>
      );
    },
    filter: (rows: any, id: any, filterValue: any) => {
      return rows.filter((row: any) => {
        if (!filterValue) return true;
        return row.original.status.value === filterValue;
      });
    }
  },
  {
    Header: 'Last Login',
    style: {
      width: 380
    },
    accessor: ({ lastLogin }: any) => (lastLogin ? format(new Date(lastLogin), 'dd MMM yyyy') : 'NA'),
    Filter: ({ column: { filterValue, setFilter } }: any) => {
      return <DatePicker value={filterValue || null} onChange={(date: any) => setFilter(date)} />;
    },
    filter: (rows: any, id: any, filterValue: any) => {
      return rows.filter((row: any) => {
        if (!filterValue || isNaN(Number(filterValue))) return true;
        const rowDate = row.original.lastLogin;
        if (!rowDate) return false;
        const formattedDate = new Date(rowDate).toISOString().substring(0, 10);
        const formattedFilter = addDays(startOfDay(filterValue), 1).toISOString().substring(0, 10);
        return formattedDate === formattedFilter;
      });
    }
  },
  {
    Header: 'Status',
    accessor: ({ status = {} }: any) => {
      const value = status?.value;
      if (!value) return null;

      switch (value) {
        case 1:
          return <Chip color="info" label={status.label} size="small" variant="light" />;
        case 2:
        default:
          return <Chip color="error" label={status.label || 'Not Active'} size="small" variant="light" />;
      }
    },
    Filter: ({ column: { filterValue = 0, setFilter } }: any) => {
      const handleChange = (event: SelectChangeEvent) => {
        setFilter(event.target.value as string);
      };
      return (
        <Select value={filterValue} sx={{ display: 'flex', gap: 2 }} onChange={handleChange}>
          <MenuItem value={0}>All</MenuItem>
          <MenuItem value={1}>Active</MenuItem>
          <MenuItem value={2}>Inactive</MenuItem>
        </Select>
      );
    },
    filter: (rows: any, id: any, filterValue: any) => {
      return rows.filter((row: any) => {
        if (!filterValue) return true;
        return row.original.status.value === filterValue;
      });
    }
  },
  {
    Header: 'Actions',
    className: 'cell-right',
    accessor: '_id',
    disableSortBy: true,
    Cell: ({ value }: any) => {
      return (
        <Link href={`user-list/detail/${value}`} underline="none">
          <Tooltip title="View">
            <IconButton color="secondary">
              <EyeTwoTone />
            </IconButton>
          </Tooltip>
        </Link>
      );
    }
  },
  {
    Header: 'Logout User',
    className: 'cell-right',
    accessor: ({ _id }: any) => {
      const handleLogout = async () => {
        let data = {
          userId: _id,
          isUser: true
        }
        await axios.delete(`${BASE_URL}/admin/logout`, { data: data })
      }
      return (
        <Tooltip title="logout">
          <IconButton onClick={handleLogout} color="secondary">
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      );
    }
  }

];
