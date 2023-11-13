import { CalendarContext } from "./CalendarContext";
import dayjs from "dayjs";
import { ReactNode, useState } from "react";

interface ChildrenProps {
    children: ReactNode
}

export default function ContextWrapper(props: ChildrenProps) {
    const [MonthIndex, setMonthIndex] = useState(dayjs().month())
    return (<CalendarContext.Provider value={{ MonthIndex, setMonthIndex }}>{props.children}</CalendarContext.Provider>)
}