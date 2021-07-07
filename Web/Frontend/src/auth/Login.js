import React, { useState } from "react";
import { loginAPI, auth, isAuthenticated } from "./helper";

const Login = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const { email, password } = values;

  const [status, setStatus] = useState({
    error: "",
    loading: false,
    success: false,
  });
  const { error, loading, success } = status;
  const { user } = isAuthenticated();

  const handleChange = (field) => (event) =>
    setValues({ ...values, [field]: event.target.value });

  const onSubmit = (event) => {
    event.preventDefault();
    setStatus({ ...status, error: false, loading: true });

    loginAPI({ email, password })
      .then((data) => {
        if (data.error) setStatus({ ...status, error: data.error.trim(), loading: false });
        else auth(data, () => setStatus({ ...status, success: true, error: false }));
      })
      .catch(() => console.log("Log-in Error"));
  };

  return <div></div>;
};

export default Login;
