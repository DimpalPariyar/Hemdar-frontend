// material-ui
import { Chip, IconButton, MenuItem, Select, SelectChangeEvent, Tooltip } from '@mui/material';
import { format, startOfDay, addDays } from 'date-fns';
import { EyeTwoTone } from '@ant-design/icons';
import DatePicker from 'components/DatePicker';

export const columns = [
  {
    Header: 'Customer Name',
    accessor: ({ name = '', email = '' }: any) => `${name} ${email}`,
    filter: (rows: any, id: any, filterValue: any) => {
      return rows.filter((row: any) => {
        if (!filterValue) return true;
        const values = [row.original.name, row.original.email];
        return values.some((value = '') => value.toLowerCase().includes(filterValue?.toLowerCase()));
      });
    }
  },
  {
    Header: 'Order Id',
    accessor: 'orderId'
  },
  {
    Header: 'Product Name',
    accessor: 'productName'
  },
  {
    Header: 'RP Order ID',
    accessor: 'RPOrderId'
  },
  {
    Header: 'RP Payment ID',
    accessor: 'RPPaymentId'
  },
  {
    Header: 'IP Address',
    accessor: 'IpAddress'
  },
  {
    Header: 'Amount',
    accessor: 'amount'
  },
  {
    Header: 'Date & Time',
    style: {
      width: 180
    },
    accessor: ({ transactionDate }: any) => (transactionDate ? format(new Date(transactionDate), 'dd MMM yyyy') : 'NA'),
    Filter: ({ column: { filterValue, setFilter } }: any) => {
      return <DatePicker value={filterValue || null} onChange={(date: any) => setFilter(date)} />;
    },
    filter: (rows: any, id: any, filterValue: any) => {
      return rows.filter((row: any) => {
        if (!filterValue || isNaN(Number(filterValue))) return true;
        const rowDate = row.original.transactionDate;
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
          return <Chip color="success" label={status.label} size="small" variant="light" />;
        case 2:
          return <Chip color="error" label={status.label} size="small" variant="light" />;
        case 3:
          return <Chip color="secondary" label={status.label} size="small" variant="light" />;
        case 4:
          return <Chip color="error" label={status.label} size="small" variant="light" />;
        case 5:
        default:
          return <Chip color="warning" label={status.label || 'Not Active'} size="small" variant="light" />;
      }
    },
    Filter: ({ column: { filterValue = 0, setFilter } }: any) => {
      const handleChange = (event: SelectChangeEvent) => {
        setFilter(event.target.value as string);
      };
      return (
        <Select value={filterValue} sx={{ display: 'flex', gap: 2 }} onChange={handleChange}>
          <MenuItem value={1}>Completed</MenuItem>
          <MenuItem value={2}>Failed</MenuItem>
          <MenuItem value={3}>Pending</MenuItem>
          <MenuItem value={4}>Cancelled</MenuItem>
          <MenuItem value={5}>Refunded</MenuItem>
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
    disableSortBy: true,
    Cell: () => (
      <Tooltip title="View">
        <IconButton color="secondary">
          <EyeTwoTone />
        </IconButton>
      </Tooltip>
    )
  }
];
