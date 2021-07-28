import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { registerAPI } from "./helper";
import { Success, Error, FormInputDiv } from "../core/Commons";
import Base from "../core/Base";

const Register = () => {
  const history = useHistory();
  const [values, setValues] = useState({
    name: "",
    email: "",
    passwordOne: "",
    passwordTwo: "",
  });
  const { name, email, passwordOne, passwordTwo } = values;

  const [status, setStatus] = useState({ error: false, success: false });
  const { error, success } = status;

  const [visible, setVisible] = useState({ P1: false, P2: false });
  const { P1, P2 } = visible;

  const handleChange = (field) => (event) =>
    setValues({ ...values, [field]: event.target.value });

  const onSubmit = (event) => {
    event.preventDefault();

    if (passwordOne === passwordTwo) {
      registerAPI({ name, email, password: passwordOne })
        .then((data) => {
          if (data.error)
            setStatus({ error: data.error.trim(), success: false });
          else {
            setValues({
              name: "",
              email: "",
              passwordOne: "",
              passwordTwo: "",
            });
            setStatus({ error: false, success: true });
            setTimeout(() => history.push("/", { email }), 1000);
          }
        })
        .catch(() => console.log("Error in registration"));
    } else
      setStatus({
        success: false,
        error: "Password and Confirm Password do not match",
      });
  };

  return (
    <Base className="py-4">
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
            <FormInputDiv
              id="name"
              val={name}
              focus={true}
              onChange={handleChange("name")}
              text="Name"
            />
            <FormInputDiv
              id="email"
              val={email}
              type="email"
              onChange={handleChange("email")}
              text="E-Mail ID"
            />
            <div className="d-flex flex-row">
              <div className="d-flex flex-fill">
                <FormInputDiv
                  id="pass"
                  val={passwordOne}
                  type={P1 ? "text" : "password"}
                  onChange={handleChange("passwordOne")}
                  text="Password"
                  css="form-control mb-3 left-rounded-corners"
                />
                <span
                  className="input-group-text mb-3 right-rounded-corners me-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => setVisible({ ...visible, P1: !P1 })}>
                  {P1 ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </span>
              </div>
              <div className="d-flex flex-fill">
                <FormInputDiv
                  id="confirmPass"
                  val={passwordTwo}
                  type={P2 ? "text" : "password"}
                  onChange={handleChange("passwordTwo")}
                  text="Confirm Password"
                  css="form-control mb-3 left-rounded-corners"
                />
                <span
                  className="input-group-text mb-3 right-rounded-corners"
                  style={{ cursor: "pointer" }}
                  onClick={() => setVisible({ ...visible, P2: !P2 })}>
                  {P1 ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </span>
              </div>
            </div>
            <button className="btn btn-success btn-block" onClick={onSubmit}>
              Submit
            </button>
          </form>
          <div className="mx-2 mt-5">
            <Success
              success={success}
              text="Registered"
              extraText="Redirecting to Login..."
            />
            <Error error={error} />
          </div>
        </div>
      </div>
    </Base>
  );
};

export default Register;
