// material-ui
import { IconButton, InputBase, InputLabel, Paper, Stack, Typography } from '@mui/material';
import { Chip, Link, SelectChangeEvent, Tooltip } from '@mui/material';
import SelectField from 'components/SelectField';
import { format } from 'date-fns';
import formatAmount from 'utils/formatAmount';
import EditIcon from '@mui/icons-material/Edit';
import { BASE_URL } from 'config';
import axios from '../../utils/axios';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box } from '@mui/system';

const productStyles = {
  height: '40px',
  overflow: 'hidden',
  background: 'transparent',
  '&:hover': { minHeight: '40px', height: 'max-content', transition: 'height 1s' }
};

export const adviceStatus = [
  {
    value: 0,
    label: 'All'
  },
  {
    value: 'paid',
    label: 'Paid'
  },
  {
    value: 'created',
    label: 'Attempted'
  }
];

export const columns = () => {
  return [
    {
      Header: 'DATE',
      disableFilters: true,
      accessor: ({ created_at }: any) => (created_at ? format(new Date(created_at), 'dd MMM yyyy') : 'NA')
    },
    {
      Header: 'TIME',
      disableFilters: true,
      accessor: ({ createdAt }: any) => (createdAt ? format(new Date(createdAt), 'HH:mm') : 'NA')
    },
    {
      Header: 'NAME',
      accessor: ({ userId }: any) => {
        return (
          <div>
            <Link href={`admin/user-list/detail/${userId?._id}`} underline="none">
              {userId?.name}
            </Link>
          </div>
        );
      }
    },
    {
      Header: 'MOBILE',
      disableFilters: true,
      accessor: ({ userId }: any) => {
        return (
          <div>
            <Link href={`/admin/user-list/detail/${userId?._id}`} underline="none">
              {userId?.mobile}
            </Link>
          </div>
        );
      }
    },
    {
      Header: 'EMAIL ID ',
      disableFilters: true,
      accessor: ({ userId }: any) => {
        return (
          <div>
            <Link href={`/admin/user-list/detail/${userId?._id}`} underline="none">
              {userId?.email}
            </Link>
          </div>
        );
      }
    },
    {
      Header: 'PRODUCT',
      disableFilters: true,
      accessor: ({ programSessions, advisoryId }: any) => {
        return (
          <div>
            {
              <Paper elevation={0} sx={productStyles}>
                {programSessions &&
                  programSessions.map((x: any) => (
                    <Chip
                      label={x.sessionName}
                      size="small"
                      sx={{
                        m: 1,
                        bgcolor: '#ECEFFF'
                      }}
                    />
                  ))}
                {advisoryId && (
                  <Stack direction="column">
                    <Chip label={advisoryId.productTitle} size="small" sx={{ m: 1, bgcolor: '#ECEFFF' }} />
                  </Stack>
                )}
              </Paper>
            }
          </div>
        );
      }
    },
    {
      Header: 'Status',
      accessor: ({ status }: any) => {
        const value = status;
        if (!value) return null;

        switch (value) {
          case 'paid':
            return (
              <Chip
                label={status}
                sx={{
                  borderRadius: '12px',
                  width: '100px',
                  background: 'linear-gradient(97.01deg, rgba(233, 255, 231, 0.6) 0%, rgba(15, 173, 0, 0.366) 93.34%)',
                  color: '#117D07'
                }}
              />
            );
          case 'created':
            return (
              <Chip
                color="warning"
                label="Attempted"
                sx={{
                  borderRadius: '12px',
                  width: '100px',
                  background: 'linear-gradient(96.79deg, rgba(253, 244, 225, 0.6) 6.61%, rgba(255, 186, 53, 0.6) 95.19%)',
                  color: '#DA9104'
                }}
              />
            );
          default:
            return <Chip color="warning" label={status || 'Not Active'} sx={{ borderRadius: '12px', width: '100px' }} />;
        }
      },
      Filter: ({ column: { filterValue = 0, setFilter } }: any) => {
        const handleChange = (event: SelectChangeEvent) => {
          setFilter(event.target.value as string);
        };

        return <SelectField options={adviceStatus} value={filterValue} onChange={handleChange} />;
      },
      filter: (rows: any, id: any, filterValue: any) => {
        return rows.filter((row: any) => {
          if (!filterValue) return true;
          return row.original.status === filterValue;
        });
      }
    },
    {
      Header: 'TOTAL AMOUNT',
      disableFilters: true,
      accessor: ({ totalAmount }: any) => formatAmount(totalAmount)
    },
    {
      Header: 'GST AMOUNT',
      disableFilters: true,
      accessor: ({ listGst }: any) => formatAmount(listGst)
    },
    {
      Header: 'Due',
      disableFilters: true,
      accessor: ({ amount_due }: any) => formatAmount(amount_due)
    },
    {
      Header: 'Paid Amount',
      disableFilters: true,
      accessor: ({ amount_paid }: any) => formatAmount(amount_paid)
    },
    // {
    //   Header: 'NEW CLIENTS?',
    //   disableFilters: true,
    //   accessor: 'attempts'
    // },
    // {
    //   Header: 'CLIENT CODE',
    //   disableFilters: true,
    //   accessor: 'currency'
    // },
    // {
    //   Header: 'RAZORPAY ID',
    //   disableFilters: true,
    //   accessor: 'razorPayOrderId',
    // },
    {
      Header: 'Invoice',
      disableFilters: true,
      accessor: ({ invoiceUrl, _id, status, userId }: any) => {
        // const handleClick = async () => {
        //   try {
        //     const params: any = {
        //       orderId: _id,
        //       name: userId.name,
        //       address: userId.address || "-",
        //       email: userId.email,
        //       mobile: userId.mobile
        //     };
        //     if (status = "paid") {
        //       if (!invoiceUrl) {
        //         let response = await axios.post(`${BASE_URL}/payments/invoice?${new URLSearchParams(params).toString()}`)
        //         window.location.reload();
        //         return response.data.url
        //       };
        //     }
        //   } catch (e) {
        //     console.log(e);
        //   }

        // }

        return (
          <Link href={invoiceUrl} target="_blank" sx={{ cursor: 'pointer' }}>
            {invoiceUrl && 'ViewInvoice'}
          </Link>
        );
      }
    },
    {
      Header: 'Send Invoice',
      disableFilters: true,
      accessor: ({ userId, invoiceUrl }: any) => {
        const bgColor = {
          background: '#ECEFFF',
          color: '#2D00D2',
          borderRadius: '10px'
        };
        const handleChange = async () => {
          try {
            const data = {
              email: userId?.email,
              url: invoiceUrl
            };
            if (userId.email && invoiceUrl) {
              const response = await axios.post(`${BASE_URL}/payments/invoice/email`, data);
              alert(response.data.message);
            } else {
              alert('email or url missing');
            }
          } catch (e) {
            console.log(e);
          }
        };
        return (
          <Button sx={bgColor} onClick={handleChange}>
            Email
          </Button>
        );
      }
    },
    {
      Header: 'Digio Agreement',
      disableFilters: true,
      accessor: ({ agreementId }: any) => {
        const bgColor = {
          background: '#ECEFFF',
          color: '#2D00D2',
          borderRadius: '10px'
        };
        const handleChange = async () => {
          try {
            if (agreementId) {
              const response = await axios.get(`${BASE_URL}/image/digio-document/${agreementId}`, { responseType: 'blob' });
              const blob = new Blob([response.data], { type: 'application/pdf' });
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              // link.download = "filename";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } else {
              alert('agreementId or url missing');
            }
          } catch (e) {
            console.log(e);
          }
        };
        return (
          <Button sx={bgColor} onClick={handleChange}>
            Agreement
          </Button>
        );
      }
    },
    {
      Header: 'State',
      disableFilters: true,
      accessor: ({ billingId }: any) => billingId?.state || '-'
    },
    {
      Header: 'GST NUMBER',
      disableFilters: true,
      accessor: ({ gst }: any) => gst || '-'
    },
    {
      Header: 'Edit',
      className: 'cell-right',
      accessor: ({ id }: any) => {
        return (
          <Link href={`/orders-edit/${id}`} underline="none">
            <Tooltip title="edit">
              <IconButton color="secondary">
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Link>
        );
      }
    },
    {
      Header: 'Rozorpay Payment Details',
      className: 'cell-right',
      accessor: 'payments',
      // {

      //   return (
      //     <>
      //       {payments?.[0]?.status && <><Typography>error Code: {payments?.[0].error_code}</Typography>
      //         <Typography>error Description: {payments?.[0].error_description}</Typography></>}
      //     </>
      //   );
      // },
      Cell: ({ value }: any) => {
        const [open, setOpen] = useState(false);
        const handleClickOpen = () => {
          setOpen(true);
        };

        const handleClose = () => {
          setOpen(false);
        };

        const errmsg = () => {
          for (var i = 0; i < value?.length; i++) {
            if (value[i].status === 'failed') {
              return (
                <Button variant="outlined" onClick={handleClickOpen}>
                  Error Msg
                </Button>
              );
            }
            break;
          }
        };
        return (
          <>
            {errmsg()}
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
              <DialogTitle id="alert-dialog-title">{'RazorPay Error Msg'}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {value?.map((x: any, i: number) => (
                    <>
                      <Box key={x.error_code}>
                        {x.status === 'failed' && (
                          <>
                            <InputLabel>({i}) Error Code :</InputLabel>
                            <Typography>{x.error_code}</Typography>
                            <InputLabel>Error Description :</InputLabel>
                            <Typography>{x.error_description}</Typography>
                          </>
                        )}
                        {x.status === 'captured' && (
                          <>
                            <Typography sx={{ color: 'green' }}> ({i}) Payment was Successfull </Typography>
                          </>
                        )}
                      </Box>
                    </>
                  ))}
                </DialogContentText>
              </DialogContent>
            </Dialog>
          </>
        );
      }
    },
    {
      Header: 'Delete',
      className: 'cell-right',
      accessor: ({ id }: any) => {
        const deleteOrderhandler = async () => {
          await axios.put(`${BASE_URL}/admin/orders/${id}`, { deleted: true }).then((response: any) => {
            const data = response.data;
            console.log(data);
            window.location.reload();
          });
        };
        return (
          <IconButton onClick={deleteOrderhandler}>
            <Tooltip title="edit">
              <IconButton color="secondary">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </IconButton>
        );
      }
    }
  ];
};

export const paymentColumns = [
  {
    Header: 'Email',
    disableFilters: true,
    accessor: 'email'
  },
  {
    Header: 'Amount',
    disableFilters: true,
    accessor: 'amount'
  },
  {
    Header: 'Refunded',
    disableFilters: true,
    accessor: 'amount_refunded'
  },
  {
    Header: 'Currency',
    disableFilters: true,
    accessor: 'currency'
  },
  {
    Header: 'Fee',
    disableFilters: true,
    accessor: 'fee'
  },
  {
    Header: 'Tax',
    disableFilters: true,
    accessor: 'tax'
  },
  {
    Header: 'Payment Method',
    disableFilters: true,
    accessor: 'method'
  },
  {
    Header: 'Bank',
    disableFilters: true,
    accessor: 'bank'
  },
  {
    Header: 'Contact',
    disableFilters: true,
    accessor: 'contact'
  },
  {
    Header: 'Description',
    disableFilters: true,
    accessor: 'description'
  },
  {
    Header: 'Vpa',
    disableFilters: true,
    accessor: 'vpa'
  },
  {
    Header: 'Status',
    disableFilters: true,
    accessor: ({ status }: any) => {
      const value = status;
      if (!value) return null;

      return <Chip color="warning" label={status} size="small" variant="light" />;
    }
  }
];
