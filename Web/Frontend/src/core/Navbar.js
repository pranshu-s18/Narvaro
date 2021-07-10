import React from "react";
import { Link, withRouter } from "react-router-dom";
import { isAuthenticated, logout } from "../auth/helper";

const navItem = (history, goto, name) => (
  <li className="nav-item">
    <Link
      style={{ color: history.location.pathname === goto ? "#2ecc72" : "#fff" }}
      className="nav-link p-3"
      to={goto}>
      {name}
    </Link>
  </li>
);

const Navbar = ({ history }) => (
  <div>
    <ul className="nav nav-tabs bg-dark">
      {isAuthenticated() ? (
        <>
          {navItem(history, "/attendance", "Attendance")}
          <li className="nav-item" onClick={logout}>
            <Link className="nav-link text-warning p-3" to="/">
              Logout
            </Link>
          </li>
        </>
      ) : (
        <>
          {navItem(history, "/", "Login")}
          {navItem(history, "/register", "Register")}
        </>
      )}
    </ul>
  </div>
);

export default withRouter(Navbar);
