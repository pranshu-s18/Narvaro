import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "./auth/helper";
import Login from "./auth/Login";
import Attendance from "./Attendance";

const LoginRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? <Component {...props} /> : <Redirect to={"/"} />
    }
  />
);

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Login} exact />
        <LoginRoute path="/attendance/:hostel" component={Attendance} />
      </Switch>
    </BrowserRouter>
  );
};
