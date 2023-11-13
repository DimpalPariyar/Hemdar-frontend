// material-ui
import { Paper, Stack } from '@mui/material';
import { Chip, Link } from '@mui/material';

import { format } from 'date-fns';
import formatAmount from 'utils/formatAmount';
import { BASE_URL } from 'config';
import axios from '../../utils/axios'

const productStyles = { height: "40px", overflow: 'hidden', background: 'transparent', "&:hover": { minHeight: "40px", height: "max-content", transition: 'height 1s', } }

export const columns = () => {
  return [
    {
      Header: 'OrderId',
      disableFilters: true,
      accessor: ({ orderId }: any) => orderId
    },
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
      Header: 'NAME',
      accessor: 'name'
    },
    {
      Header: 'MOBILE',
      disableFilters: true,
      accessor: 'mobile'
    },
    {
      Header: 'EMAIL ID ',
      disableFilters: true,
      accessor: 'email'
    },
    {
      Header: 'PRODUCT',
      disableFilters: true,
      accessor: 'Product'
    },
    {
      Header: 'AMOUNT',
      disableFilters: true,
      accessor: ({ Amount }: any) => Amount
    },
    {
      Header: 'GST AMOUNT',
      disableFilters: true,
      accessor: ({ GstAmount }: any) => GstAmount
    },
    {
      Header: 'TOTAL AMOUNT',
      disableFilters: true,
      accessor: ({ TotalAmount }: any) => TotalAmount
    },
    {
      Header: 'Paid Amount',
      disableFilters: true,
      accessor: ({ AmountPaid }: any) => AmountPaid
    },
    {
      Header: 'Invoice',
      disableFilters: true,
      accessor: 'invoicenumber'
    },
    {
      Header: 'State',
      disableFilters: true,
      accessor: ({ state }: any) => state || '-'
    },
    {
      Header: 'GST NUMBER',
      disableFilters: true,
      accessor: ({ gstNo }: any) => gstNo || '-'
    },
    {
      Header: 'GST NAME',
      disableFilters: true,
      accessor: ({ company }: any) => company || '-'
    },

  ];

};
