import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { Error, FormInputDiv } from "../core/Commons";
import { loginAPI, auth } from "./helper";
import Base from "../core/Base";

const Login = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const { email, password } = values;

  const [status, setStatus] = useState({ error: "", success: false });
  const { error, success } = status;

  const handleChange = (field) => (event) =>
    setValues({ ...values, [field]: event.target.value });

  const onSubmit = (event) => {
    event.preventDefault();
    setStatus({ ...status, error: false });

    loginAPI({ email, password })
      .then((data) => {
        if (data.error) setStatus({ ...status, error: data.error.trim() });
        else auth(data, () => setStatus({ ...status, success: true }));
      })
      .catch(() => console.log("Log-in Error"));
  };

  const redirect = () => {
    if (success) return <Redirect to="/attendance" />;
  };

  return (
    <Base title="Login" className="py-4">
      <div className="row">
        <div className="col-md-6 offset-sm-3">
          <form>
            <FormInputDiv
              id="email"
              val={email}
              type="email"
              focus={true}
              onChange={handleChange("email")}
              text="E-Mail ID"
            />

            <FormInputDiv
              id="pass"
              val={password}
              type="password"
              onChange={handleChange("password")}
              text="Password"
            />

            <button className="btn btn-success btn-block" onClick={onSubmit}>
              Submit
            </button>
          </form>
          <div className="mx-2 mt-5">
            <Error error={error} />
          </div>
        </div>
      </div>
      {redirect()}
    </Base>
  );
};

export default Login;
