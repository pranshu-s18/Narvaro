import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "./auth/helper";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Attendance from "./core/Attendance";
import { HostelList } from "./core/Commons";
import StudentAttendance from "./core/StudentAttendance";

const LoginRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? <Component {...props} /> : <Redirect to="/" />
    }
  />
);

const AttRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (isAuthenticated()) {
        let hostel = rest.computedMatch.params.hostel;
        if (HostelList.includes(hostel)) return <Component {...props} />;
        else return <Redirect to="/attendance/BH1" />;
      } else return <Redirect to="/" />;
    }}
  />
);

const NonLoginRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (isAuthenticated()) return <Redirect to="/attendance" />;
      else return <Component {...props} />;
    }}
  />
);

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <NonLoginRoute path="/" component={Login} exact />
        <NonLoginRoute path="/register" component={Register} exact />
        <AttRoute path="/attendance/:hostel?" component={Attendance} exact />
        <LoginRoute path="/attendance/student/:rollNo" component={StudentAttendance} exact />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
