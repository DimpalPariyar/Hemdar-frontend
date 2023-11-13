import React, { useState } from 'react';
import { Button, IconButton, InputLabel, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { format } from 'date-fns';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
const grayBgColor = {
  bgcolor: (theme: any) => '#ECEFFF',
  borderRadius: '10px'
};
const CommonKeyValue = ({ label, value = '-', valuePrefix, isVerified = false, isTextArea }: any) => {
  return (
    <Stack gap={2} flexDirection="row">
      <Stack minWidth={160} px={2} py={1} component={Typography} sx={{ fontWeight: '600' }}>
        {label}
      </Stack>
      <Stack flexDirection="row" gap={1}>
        {valuePrefix && (
          <Stack component={Typography} justifyContent="center" alignItems="center" sx={grayBgColor} px={2}>
            {valuePrefix}
          </Stack>
        )}
        <Stack
          flexDirection="row"
          alignItems="flex-start"
          justifyContent="space-between"
          component={Typography}
          pl={2}
          pt={1}
          minWidth={250}
          sx={grayBgColor}
          height={isTextArea ? 200 : 'auto'}
        >
          {value}
        </Stack>
      </Stack>
    </Stack>
  );
};
const CkycTab = ({ data }: any) => {
  const [counter, setcounter] = useState(0);
  const prevpage = () => {
    setcounter((prev) => prev - 1);
    if (counter < 1) {
      setcounter(0);
    }
  };
  const nextpage = () => {
    setcounter((prev) => prev + 1);
    if (counter > data?.listofProof.length - 2) {
      setcounter(counter);
    }
  };
  return (
    <div>
      {Object.keys(data).length === 0 && (
        <>
          <InputLabel>NO Records Found</InputLabel>
        </>
      )}
      {Object.keys(data).length > 0 && (
        <>
          <Stack p={3} my={2} justifyContent="space-between" direction="row">
            <Stack flexDirection="column" gap={2}>
              <CommonKeyValue label="CKYC Number" value={data.ckyc_number} />
              <CommonKeyValue label="CKYC Name" value={data.name} />
              <CommonKeyValue label="Fathers Name" value={data.fathers_name} />
              <CommonKeyValue label="Age" value={data.age} />
              <CommonKeyValue label="Kyc date" value={data.kyc_date} />
              <CommonKeyValue label="Update kyc date" value={data.updated_date} />
            </Stack>
            <Stack flexDirection="column" gap={2}>
              {/* <CommonKeyValue label="PAN No" value={data.panNumber} isVerified={!!info.kycStatus?.value} />
          <CommonKeyValue label="Last Risk" value={info.score || 0} /> */}
              <Stack direction="row" gap={2}>
                <Stack direction="column" justifyContent="center">
                  <Stack minWidth={200} px={2} py={1} alignContent="center" component={Typography} sx={{ fontWeight: '600' }}>
                    LIST OF DOCUMENTS UPLOADED :
                  </Stack>
                  <Stack minWidth={200} px={2} py={1} alignContent="center" component={Typography} sx={{ fontWeight: '600' }}>
                    {data?.listofProof[counter]?.image_type}
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Stack direction="column" justifyContent="center">
                      <IconButton onClick={prevpage}>
                        <ArrowBackIosNewIcon />
                      </IconButton>
                    </Stack>
                    <img
                      style={{ width: '200px', height: '200px' }}
                      src={`data:image/jpeg;base64,${data?.listofProof[counter]?.data}`}
                      alt={data?.listofProof[counter]?.image_type}
                      loading="lazy"
                    />
                    <Stack direction="column" justifyContent="center">
                      <IconButton onClick={nextpage}>
                        <ArrowForwardIosIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            <Stack direction="column">
              <Stack minWidth={200} px={2} py={1} alignContent="center" component={Typography} sx={{ fontWeight: '600' }}>
                PHOTO :
              </Stack>
              <img style={{ width: '200px', height: '200px' }} src={`data:image/jpeg;base64,${data.photo}`} alt="chart" loading="lazy" />
            </Stack>
          </Stack>
        </>
      )}
    </div>
  );
};

export default CkycTab;
