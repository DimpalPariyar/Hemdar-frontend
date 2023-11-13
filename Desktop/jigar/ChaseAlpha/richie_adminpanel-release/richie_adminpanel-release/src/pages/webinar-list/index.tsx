import MainCard from 'components/MainCard';
import RichieHeader from 'components/RichieHeader';
import { PlusOutlined } from '@ant-design/icons';
import { Box, Button } from '@mui/material';
import { useEffect } from 'react';
//import WebinarCard from './WebinarCard';
import { useDispatch, useSelector } from 'store';
import { getWebinars } from '../../store/reducers/webinars';
import { columns } from "./Constant"
import BasicTable from 'components/react-table/BasicTable';

const RenderAdvisory = () => {
  const dispatch = useDispatch();
  const { webinars } = useSelector((state) => state.webinars)

  useEffect(() => {
    dispatch(getWebinars());
  }, [])



  const bgColor = {
    background: 'linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)',
    color: " #FFFFFF", borderRadius: "10px"
  }
  return (
    <>
      <MainCard sx={{ width: '100%', background: "transparent" }} content={false}>
        <RichieHeader title="List of Webinars">
          <Box display="flex" alignItems="flex-end" gap={2}>
            <Button sx={bgColor} startIcon={<PlusOutlined />} href="/webinar-create">
              Add Webinar
            </Button>
          </Box>

          {/* {webinars &&
              webinars.map((product: any) => {
                return <WebinarCard webinar={product} />;
              })} */}
          <Box>
            <BasicTable
              columns={columns}
              data={webinars}
            />
          </Box>

        </RichieHeader>
      </MainCard>
    </>
  );
};

export default RenderAdvisory;
