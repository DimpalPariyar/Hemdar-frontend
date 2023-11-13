import { getMonth } from "utils/calenderUtils";

import React, { useContext, useEffect, useState } from 'react'
import Month from "./Month";
import { Paper, Toolbar } from "@mui/material";
import Button from '@mui/material/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Typography } from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { CalendarContext } from "contexts/CalenderContext/CalendarContext";
import dayjs from "dayjs";
import WeekView from "./WeekView";

const CalenderView = () => {
    const [view, setView] = useState(true)
    const [currenMonth, setCurrentMonth] = useState(getMonth());

    const { MonthIndex, setMonthIndex } = useContext(CalendarContext)
    function handleprevmonth() {
        setMonthIndex(Math.abs(MonthIndex - 1))
    }
    function handlenextmonth() {
        setMonthIndex(MonthIndex + 1)
    }
    useEffect(() => {
        setCurrentMonth(getMonth(MonthIndex));
    }, [MonthIndex]);

    const weekday = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]

    const buttonColur = {
        backgroundColor: `${view ? "white" : "#ECEFFF"}`, "&:hover": { bgcolor: "white", color: "black" }, color: "#2D00D2", fontSize: '20px', pl: 5, pr: 5, borderRadius: "10px", m: 1
    }
    const buttonColur1 = { ...buttonColur, backgroundColor: `${view ? "#ECEFFF" : "white"}` }

    return (
        <div>
                <div style={{ display: 'flex' }}>
                   <Toolbar sx={{ width: "-webkit-fill-available" }}>
                       <Button sx={buttonColur} onClick={() => setView(true)}>Month</Button>
                    <Button sx={buttonColur1} onClick={() => setView(false)}>Week</Button>
                    <div style={{ display: 'flex', width: "-webkit-fill-available", marginLeft: "15%" }}>
                        <Button onClick={handleprevmonth} sx={buttonColur}><ArrowBackIosNewIcon /></Button>
                        <Typography sx={{ fontSize: '20px', pt: 1.2 }}>{dayjs(new Date(dayjs().year(), MonthIndex)).format("MMMM YYYY")}</Typography>
                        <Button onClick={handlenextmonth} sx={buttonColur}><ArrowForwardIosIcon /></Button>
                    </div>
                </Toolbar>
            </div>
            {view ? <><Toolbar sx={{
                bgcolor: "#E5E9FF",
                borderRadius: '1em 1em 0 0',
                height: "51px"
            }}>{weekday.map((element) => { return <Paper elevation={0} sx={{ width: "-webkit-fill-available", background: "transparent", textAlign: "center", fontSize: "1rem", fontWeight: "600" }}>{element}</Paper> })}</Toolbar>
                <Month month={currenMonth} monthindex={MonthIndex} /></> : <><WeekView /></>}
        </div>
    )
}

export default CalenderView