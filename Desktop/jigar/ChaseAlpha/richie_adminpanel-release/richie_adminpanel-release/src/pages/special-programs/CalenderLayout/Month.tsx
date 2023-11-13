import React from 'react';
import dayjs from 'dayjs';
import Day from './Day';
import { Box } from '@mui/system';
import { Paper } from '@mui/material';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'store';
import { getProgramSessions } from 'store/reducers/programSessions';
import { reset as programPlansReset } from 'store/reducers/programPlans';
//import { Grid } from '@mui/material'
import { useEffect } from 'react';
//import SessionItem from './SessionItem';
interface MonthProps {
  month: dayjs.Dayjs[][];
  monthindex: number;
}
const Month = ({ month, monthindex }: MonthProps) => {
  const Item = styled(Paper)(({ theme }) => ({
    position: 'relative',
    //maxWidth: "185px",
    lg: { maxWidth: '165px' },
    md: { maxWidth: '145px' },
    minwidth: '-webkit-fill-available',
    height: '152px',
    backgroundColor: '#FFFFFF',
    padding: 5,
    textAlign: 'left',
    borderRadius: 5,
    marginBottom: 7,
    boxShadow: 'none',
    overflow: 'hidden',
    transitionDelay: '0.2s',
    transitionProperty: 'min-height',
    '&:hover': {
      height: 'max-content',
      minHeight: '152px',
      zIndex: 100,
      background: 'white'
    }
  }));

  const { programSessions } = useSelector((state) => state.programSessions);
  const dispatch = useDispatch();

  const init = async () => {
    try {
      dispatch(programPlansReset());
      await dispatch(getProgramSessions());
    } catch (error) {
      console.log({ error: error });
    }
  };

  useEffect(() => {
    (async () => {
      await init();
    })();
  }, []);
  const MonthIndexvalue = (monthindex % 12) + 1;
  return (
    <div style={{ display: 'flex' }}>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          background: '#ECEFFF'
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateRows: 'repeat(5,1fr)', width: '-webkit-fill-available' }}>
          {month.map((row, i) => (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                position: 'relative',
                ml: 1,
                mr: 1,
                '&:hover': { height: '152px' },
                gridGap: '10px'
              }}
            >
              {row.map((day, idx) => {
                const session: any = [];
                programSessions.forEach((element: any) => {
                  if (element.date.split('T')[0] === day.format('YYYY-MM-DD')) {
                    session.push(element);
                  }
                });

                return (
                  <Item>
                    <Day day={day} key={idx} session={session} monthidx={MonthIndexvalue} />
                  </Item>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default Month;
