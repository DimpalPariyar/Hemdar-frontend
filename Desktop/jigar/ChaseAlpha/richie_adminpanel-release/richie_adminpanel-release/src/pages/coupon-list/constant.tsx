// material-ui
import { IconButton } from '@mui/material';
import { Link, Tooltip } from '@mui/material';
import { format } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';


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
    Header: 'Coupon description',
    accessor: ({ description }: any) => description || '-'
  },
  {
    Header: 'Coupon Code',
    accessor: ({ couponCode }: any) => couponCode || '-'
  },
  {
    Header: 'Coupon ExpirycouponExpiry',
    disableFilters: true,
    accessor: ({ couponExpiry }: any) => (couponExpiry ? format(new Date(couponExpiry), 'dd MMM yyyy') : 'NA')
  },
  {
    Header: 'Discount Type',
    disableFilters: true,
    accessor: ({ discountType }: any) => discountType || '-'
  },
  {
    Header: 'Coupon Status',
    disableFilters: true,
    accessor: ({ enableCoupon }: any) => (enableCoupon ? 'ACTIVE' : 'INACTIVE')
  },
  {
    Header: 'Discount Percentage ',
    disableFilters: true,
    accessor: ({ percentage }: any) => percentage || '-'
  },
  {
    Header: 'Discount Amount',
    disableFilters: true,
    accessor: ({ amount }: any) => amount || '-'
  },
  {
    Header: 'Max Spend',
    disableFilters: true,
    accessor: ({ maxSpend }: any) => maxSpend || '-'
  },
  {
    Header: 'min Spend',
    disableFilters: true,
    accessor: ({ minSpend }: any) => minSpend || '-'
  },
  {
    Header: 'No of Redeem',
    disableFilters: true,
    accessor: ({ redeem }: any) => redeem || '-'
  },
  {
    Header: 'Edit',
    className: 'cell-right',
    accessor: ({ _id }: any) => {
      return (
        <Link href={`coupons-edit/${_id}`} underline="none">
          <Tooltip title="edit">
            <IconButton color="secondary">
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Link>
      );
    },

  }
];
