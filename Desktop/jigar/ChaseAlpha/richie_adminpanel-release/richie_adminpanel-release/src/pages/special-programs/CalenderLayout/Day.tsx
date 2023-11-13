
import dayjs from 'dayjs'
import CalenderItems from './CalenderItems';
import { Typography } from '@mui/material'

interface DayProps {
    day: dayjs.Dayjs,
    session: any,
    monthidx: number
}

const Day = ({ day, session, monthidx }: DayProps) => {
    function getCurrentdate() {
        return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY") ? { "color": "#ECEFFF", "border-radius": "25px", "width": "30px", "background": "linear-gradient(103.4deg, #2D00D2 12.04%, #2C00D3 30.87%, #3700C8 46.11%, #3E00C0 63.54%, #4B00B4 80.82%, #5400AA 93.76%)" }
            : { "width": "max-content", "fontSize": "1.2rem", "fontWeight": "bold" }
    }

    return (<>
        {monthidx === Number(day.format("MM")) ?
            <div style={{ textAlign: "center" }}>
                <span style={{ position: "absolute", bottom: "0px", left: "80%", fontWeight: "bold" }}>
                    <Typography sx={getCurrentdate()}>{day.format("DD")}</Typography>
                </span>
                {session.map((item: any) => {
                    return <CalenderItems Sessionitems={item} />
                })}

            </div>
            : ""}

    </>
    )
}

export default Day
