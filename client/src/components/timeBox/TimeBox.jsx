import React from "react";
import "./timeBox.scss";

const TimeBox = ({ title = "Remaining work Time", time = "07:00" }) => {
  return (
    <div className="timer-box">
      <div className="timer-title">{title}</div>
      <div className="timer-time">{time}</div>
    </div>
  );
};

export default TimeBox;
