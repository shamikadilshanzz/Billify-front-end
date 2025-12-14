import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./DatePicker.module.css";

function MyCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="MMM dd, yyyy"
        showPopperArrow={false}
        todayButton="Today"
      />
    </div>
  );
}

export default MyCalendar;
