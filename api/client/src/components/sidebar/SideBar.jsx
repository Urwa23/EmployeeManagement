import React from "react";
import { Link } from "react-router-dom";
import { SidebarData } from "./SideBarData";
import './sidebar.scss';

function SideBar() {
  return (
    <div className="sidebar-x">
      <ul>
        {SidebarData.map((item, index) => (
          <li key={index} className={item.isHeading ? "heading" : "nav-item"}>
            {item.isHeading ? (
              // Render as a heading
              <span className="sidebar-heading">{item.title}</span>
            ) : (
              // Render as a link
              <Link to={item.path}>
                {item.icon}
                <span>{item.title}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideBar;