// material-ui
import { Chip, Link, Paper, Stack } from '@mui/material';
import { format } from 'date-fns';

const productStyles = { height: "40px", overflow: 'hidden', background: 'transparent', "&:hover": { minHeight: "40px", height: "max-content", transition: 'height 1s', } }

export const columns = () => {
  return [
    {
      Header: 'Date',
      disableFilters: true,
      accessor: ({ createdAt }: any) => (createdAt ? format(new Date(createdAt), 'dd MMM yyyy') : 'NA')
    },
    {
      Header: 'Time',
      disableFilters: true,
      accessor: ({ createdAt }: any) => (createdAt ? format(new Date(createdAt), 'HH:mm') : 'NA')
    },
    {
      Header: 'User Name',
      disableFilters: true,
      accessor: ({ userId }: any) => {
        return <div>
          <Link href={`admin/user-list/detail/${userId?._id}`} underline="none">
            {userId?.name}
          </Link>
        </div>
      }
    },
    {
      Header: 'Mobile',
      disableFilters: true,
      accessor: ({ userId }: any) => {
        return <div>
          <Link href={`admin/user-list/detail/${userId?._id}`} underline="none">
            {userId?.mobile}
          </Link>
        </div>
      }
    },
    {
      Header: 'Email',
      disableFilters: true,
      accessor: ({ userId }: any) => {
        return <div>
          <Link href={`admin/user-list/detail/${userId?._id}`} underline="none">
            {userId?.email}
          </Link>
        </div>
      }
    },
    {
      Header: 'PRODUCT',
      disableFilters: true,
      accessor: ({ programSessions, advisoryId }: any) => {
        return (<div>
          {
            <Paper elevation={0} sx={productStyles}>
              {programSessions && programSessions.map((x: any) => <Chip label={x.sessionName} size="small" sx={{
                m: 1, bgcolor: "#ECEFFF"
              }} />)}
              {
                advisoryId && <Stack direction="column"><Chip label={advisoryId.productTitle} size="small" sx={{ m: 1, bgcolor: "#ECEFFF" }} /></Stack>
              }
            </Paper>
          }

        </div>)
      }
    },
    {
      Header: 'Status',
      accessor: ({ active }: any) => {
        const value = active;
        if (!value) return null;

        switch (value) {
          case true:
            return <Chip label="active" sx={{
              borderRadius: "12px", width: "100px",
              background: 'linear-gradient(97.01deg, rgba(233, 255, 231, 0.6) 0%, rgba(15, 173, 0, 0.366) 93.34%)',
              color: "#117D07"

            }} />;
          default:
            return <Chip color="warning" label="In-active" sx={{
              borderRadius: "12px", width: "100px",
              background: "linear-gradient(96.79deg, rgba(253, 244, 225, 0.6) 6.61%, rgba(255, 186, 53, 0.6) 95.19%)",
              color: '#DA9104'
            }} />;
        }
      }
    },
    {
      Header: 'Current Start',
      accessor: ({ startTime }: any) => (startTime ? format(new Date(startTime), 'dd MMM yyyy') : 'NA')
    },
    {
      Header: 'Current End',
      accessor: ({ endTime }: any) => (endTime ? format(new Date(endTime), 'dd MMM yyyy') : 'NA')
    },
    // {
    //   Header: 'Charge At',
    //   accessor: ({ chargeAt }: any) => (chargeAt ? format(new Date(chargeAt), 'dd MMM yyyy') : 'NA')
    // },
    // {
    //   Header: 'Short Url',
    //   accessor: ({ shortUrl }: any) => {
    //     return <div>
    //       <Link href={`${shortUrl}`} underline="none">
    //         {shortUrl}
    //       </Link>
    //     </div>
    //   }
    // },
  ];
};
