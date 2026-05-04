import { NavLink, Outlet } from "react-router-dom";
import "../../Styles/tabs.css";
import { tabs } from "../../utils/tabs";
function NavBarCal(){
  return (
    <>
      <div className="tabs-container fixed-tabs">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={`/calculator/${tab.path}`}
            className={({ isActive }) =>
              isActive ? "tab-item active" : "tab-item"
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <div className="tab-content">
        <Outlet />
      </div>
    </>
  );
};

export default NavBarCal;