import React from 'react'
import "./dashboard.scss"
import TimeBox from '../../components/timeBox/TimeBox'

function Dashboard() {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const name = currentUser?.user?.name;
  const timerData = [
    { title: "Remaining work Time", time: "07:00" },
    { title: "out of 8h worked", time: "01:30" },
    { title: "Overtime", time: "02:15" }, // Add more timers as neede
    { title: "Over time Balance", time: "02:15" }, // Add more timers as needed
  ];
  return (
    <div>
      <h1>Welcome to {name}</h1>
      <div className='timerBoxes-container'>
        
      {timerData.map((timer, index) => (
        <TimeBox key={index} title={timer.title} time={timer.time} />
      ))}
    </div>
    </div>
  )
}

export default Dashboard
