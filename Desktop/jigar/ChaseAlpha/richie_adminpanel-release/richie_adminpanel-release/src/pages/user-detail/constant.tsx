// material-ui
import { Chip, Link } from '@mui/material';
import { format } from 'date-fns';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import moment from 'moment';

export const riskColumns = [
  {
    Header: 'Date',
    accessor: ({ createdAt }: any) => (createdAt ? format(new Date(createdAt), 'dd MMM yyyy') : 'NA')
  },
  {
    Header: 'Time',
    accessor: ({ createdAt }: any) =>
      createdAt ? format(new Date(createdAt), 'dd MMM yyyy HH:mm:ss').split('').slice(11, 22).join('') : 'NA'
  },
  {
    Header: 'Score',
    accessor: 'totalScores'
  },
  {
    Header: 'Actions',
    accessor: 'response',
    disableSortBy: true,
    Cell: ({ value }: any) => {
      const bgColor = {
        background: '#ECEFFF',
        color: '#2D00D2',
        borderRadius: '10px'
      };
      const [open, setOpen] = useState(false);
      const handleClickOpen = () => {
        setOpen(true);
      };

      const handleClose = () => {
        setOpen(false);
      };
      return (
        <>
          <Button sx={bgColor} onClick={handleClickOpen}>
            User Response
          </Button>
          <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">Risk Profile User Response</DialogTitle>
            <DialogContent sx={{ position: 'relative' }}>
              {value.map((x: any, index: any) => (
                <div key={index}>{`${index + 1} : ${Object.keys(x)} : ${Object.values(x)} `}</div>
              ))}
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

export const subscriptionColumns = [
  {
    Header: 'Product',
    accessor: ({ advisoryId }: any) => {
      return advisoryId?.productTitle ? advisoryId.productTitle : '-';
    }
  },
  {
    Header: 'Start Date',
    accessor: ({ startTime }: any) => (startTime ? format(new Date(startTime), 'dd MMM yyyy') : 'NA')
  },
  {
    Header: 'Periodicity',
    accessor: ({ startTime, endTime }: any) => {
      const day1 = moment(startTime);
      const day2 = moment(endTime); // Corrected to September 30th

      const daysDifference = day2.diff(day1, 'days');
      return `${daysDifference} days`;
    }
  },
  {
    Header: 'End Date',
    accessor: ({ endTime }: any) => (endTime ? format(new Date(endTime), 'dd MMM yyyy') : 'NA')
  },
  {
    Header: 'Status',
    accessor: ({ active }: any) => {
      const value = active;
      if (!value) return null;

      switch (value) {
        case true:
          return <Chip color="success" label="Active" size="small" variant="light" />;
        default:
          return <Chip color="warning" label="Not Active" size="small" variant="light" />;
      }
    }
  }
];

export const subscribedNotifications = [
  {
    Header: 'Title',
    accessor: ({ title }: any) => {
      return title || '-';
    }
  },
  {
    Header: 'Description',
    accessor: ({ body }: any) => {
      return body || '-';
    }
  },
  {
    Header: 'Sent At',
    accessor: ({ createdAt }: any) => (createdAt ? format(new Date(createdAt), 'dd MMM yyyy HH:mm:ss') : 'NA')
  }
];

export const mangeApiDetails = {
  session: {
    search: 'learning/session',
    existing: 'admin/user/sessions',
    update: 'admin/user/sessions',
    updateKey: 'newPurchasedSessions',
    searchDataKey: 'sessionName'
  },
  advisory: {
    search: 'advisory/product',
    existing: 'admin/user/advisory',
    update: 'admin/user/advisory',
    updateKey: 'newSubscribedAdvisories',
    searchDataKey: 'productTitle'
  }
};


export const WhatsappMessage = [
  {
    Header: 'Message Body',
    accessor: ({ messagebody }: any) => {
      return messagebody || '-';
    }
  },
  {
    Header: 'Template Name',
    accessor: ({ templateName }: any) => {
      return templateName || '-';
    }
  },
  {
    Header: 'Sent At',
    accessor: ({ createdAt }: any) => (createdAt ? format(new Date(createdAt), 'dd MMM yyyy HH:mm:ss') : 'NA')
  },
  {
    Header: 'Status',
    accessor: ({ responses }: any) => (responses[0]?.message ? responses[0]?.message : 'NA')
  },
  {
    Header: 'Message Id',
    accessor: ({ responses }: any) => (responses[0]?.data.messageId ? responses[0]?.data.messageId : 'NA')
  }
];


export const CouponList = [
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
  }
];

export const couponIntialvalues = {
  couponCode: '',
  description: '',
  discountType: 'percentageCartDiscount',
  percentage: 0,
  amount: 0,
  couponExpiry: undefined,
  minSpend: '',
  maxSpend: '',
  notForSaleCoupon: false,
  singleUsedCoupon: false,
  listOfProduct: [],
  excludeProdList: [],
  listOfCategory: [],
  excludeCatList: [],
  allowedEmail: [],
  redeem: 0,
  enableCoupon: true
}