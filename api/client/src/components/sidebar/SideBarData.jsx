import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/",
    // isHeading: true, // Indicate it's a heading
  },
  {
    title: "My Vacations",
    isHeading: true,
  },
  {
    title: "Request Vacation",
    path: "/addVacations",
    
    cName: "nav-text",
  },
  {
    title: "List View",
    path: "/viewVacations",
    
    cName: "nav-text",
  },
  {
    title: "My Absences",
    isHeading: true,
  },
  {
    title: "New Absence Entry",
    path: "/addAbsence",
    
    cName: "nav-text",
  },
  {
    title: "List View",
    path: "/viewAbsenses",
    
    cName: "nav-text",
  },
  // {
  //   title: "Calendar View",
  //   path: "/calendarView",
    
  //   cName: "nav-text",
  // },
  {
    title: "Time Tracking",
    isHeading: true,
  },
  {
    title: "Enter Working Time",
    path: "/addWorkingTime",
    
    cName: "nav-text",
  },
  {
    title: "List View",
    path: "/viewWorkingTime",
    
    cName: "nav-text",
  },
  {
    title: "Employee Requests",
    isHeading: true,
  },
  {
    title: "View Requets",
    path: "/viewRequests",
    
    cName: "nav-text",
  },
];
