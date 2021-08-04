import React, { useEffect, useState } from "react";
import { Redirect, useLocation } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Error, FormInputDiv } from "../core/Commons";
import { loginAPI, auth } from "./helper";
import Base from "../core/Base";

const Login = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });
  const { email, password } = values;

  const location = useLocation();
  useEffect(() => {
    if (location.state !== undefined)
      setValues({ email: location.state.email, password: "" });
  }, [location]);

  const handleChange = (field) => (event) =>
    setValues({ ...values, [field]: event.target.value });

  const onSubmit = (event) => {
    event.preventDefault();

    loginAPI({ email, password })
      .then((data) => {
        if (data.error) setError(data.error.trim());
        else auth(data, () => setSuccess(true));
      })
      .catch(() => setError("Server Error Occurred"));
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
              focus={location.state === undefined}
              onChange={handleChange("email")}
              text="E-Mail ID"
            />

            <div className="d-flex flex-row">
              <div className="d-flex flex-fill">
                <FormInputDiv
                  id="pass"
                  val={password}
                  type={visible ? "text" : "password"}
                  focus={location.state !== undefined}
                  onChange={handleChange("password")}
                  text="Password"
                  css="form-control mb-3 left-rounded-corners"
                />
                <span
                  className="input-group-text mb-3 right-rounded-corners"
                  style={{ cursor: "pointer" }}
                  onClick={() => setVisible(!visible)}>
                  {visible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </span>
              </div>
            </div>

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
