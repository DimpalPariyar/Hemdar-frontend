import { createContext } from "react"

type TypeCalendarContext = {
    MonthIndex: any
    setMonthIndex: Function
    // selectedDate: Date
}

export const CalendarContext = createContext<TypeCalendarContext>({
     MonthIndex: 0,
     setMonthIndex: () => {},
    // selectedDate: new Date(),
})
