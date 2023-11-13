import { format } from 'date-fns';

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
  {
    Header: 'Customer Name',
    accessor: ({ name }: any) => name || '-'
  },
  {
    Header: 'Customer Risk Score',
    accessor: ({ riskscore }: any) => riskscore || '-'
  },
  {
    Header: 'Customer Contact Number',
    accessor: ({ mobile }: any) => mobile || '-'
  }
];
