import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "./auth/helper";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Attendance from "./core/Attendance";
import StudentAttendance from "./core/StudentAttendance";

const LoginRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? <Component {...props} /> : <Redirect to="/" />
    }
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
        <LoginRoute path="/attendance" component={Attendance} exact />
        <LoginRoute path="/attendance/:rollNo" component={StudentAttendance} exact />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
