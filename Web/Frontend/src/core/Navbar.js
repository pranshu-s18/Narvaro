import React from "react";
import { Link, useLocation, withRouter } from "react-router-dom";
import { isAuthenticated, logout } from "../auth/helper";
import { HostelList } from "./Commons";

const navItem = (path, goto, name, selected = false) => (
  <li className="nav-item">
    <Link
      style={{ color: path === goto ? "#2ecc72" : "#fff" }}
      className={"nav-link p-3 ".concat(selected ? "selected" : "")}
      to={goto}>
      {name}
    </Link>
  </li>
);

const Navbar = () => {
  const location = useLocation();
  const curHostel =
    location.state && location.state.hostel ? location.state.hostel : "BH2";

  return (
    <div>
      <ul className="nav nav-tabs bg-dark">
        {isAuthenticated() ? (
          <>
            {navItem(location.pathname, "/attendance", "Attendance", true)}
            <li className="nav-item" onClick={logout}>
              <Link className="nav-link p-3 text-white" to="/">
                Logout
              </Link>
            </li>
            <li className="nav-item custom-dropdown ms-auto">
              <button className="nav-link text-white p-3">{curHostel}</button>
              <ul className="custom-dropdown-menu bg-dark">
                {HostelList.map((hostel, i) => {
                  const selected = curHostel === hostel ? "selected" : "";
                  return (
                    <Link
                      key={i}
                      className={`nav-link custom-dropdown-link ${selected}`}
                      to={{ pathname: "/attendance", state: { hostel } }}>
                      {hostel}
                    </Link>
                  );
                })}
              </ul>
            </li>
          </>
        ) : (
          <>
            {navItem(location.pathname, "/", "Login")}
            {navItem(location.pathname, "/register", "Register")}
          </>
        )}
      </ul>
    </div>
  );
};

export default withRouter(Navbar);
