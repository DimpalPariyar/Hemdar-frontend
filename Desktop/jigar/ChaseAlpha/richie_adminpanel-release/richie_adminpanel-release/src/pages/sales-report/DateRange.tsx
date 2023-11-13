import React, { useState } from 'react';
import { Stack, TextField, Button } from '@mui/material';
import moment from 'moment';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setattempted: React.Dispatch<React.SetStateAction<boolean>>;
}
// type loading = React.Dispatch<React.SetStateAction<DateRangePickerProps>>;

const bgColor = {
  background: 'linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)',
  color: ' #FFFFFF',
  borderRadius: '10px'
};
const DateRangePicker: React.FC<DateRangePickerProps> = ({ setStartDate, setEndDate, setLoading, startDate, endDate, setattempted }) => {
  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value);
    if (!isNaN(date.getTime())) {
      setStartDate(date);
    }
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value);
    if (!isNaN(date.getTime())) {
      setEndDate(date);
    }
  };

  return (
    <div>
      <Stack direction="row" spacing={2}>
        <TextField
          type="datetime-local"
          label="Start Date"
          value={startDate ? startDate.toISOString().slice(0, 16) : ''}
          onChange={handleStartDateChange}
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          type="datetime-local"
          label="End Date"
          value={endDate ? endDate.toISOString().slice(0, 16) : ''}
          onChange={handleEndDateChange}
          InputLabelProps={{
            shrink: true
          }}
        />
        <Button sx={bgColor} onClick={() => setLoading(true)}>
          {`Generate Reports for Paid orders`}
          {startDate && endDate && <>{` from ${moment(startDate).format('LL')} to ${moment(endDate).format('LL')}`}</>}
        </Button>
        <Button sx={bgColor} onClick={() => setattempted(true)}>
          {`Generate Reports for Attempted orders`}
          {startDate && endDate && <>{` from ${moment(startDate).format('LL')} to ${moment(endDate).format('LL')}`}</>}
        </Button>
      </Stack>
    </div>
  );
};

export default DateRangePicker;
