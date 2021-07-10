import { API } from "../core/Commons";

export const loginAPI = (user) =>
  fetch(`${API}/login`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));

export const auth = (data, next) => {
  if (typeof window !== "undefined")
    localStorage.setItem("jwt", JSON.stringify(data));
  next();
};

export const registerAPI = (user) =>
  fetch(`${API}/register`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));

export const attendanceAPI = ({ id, token, hostel }) =>
  fetch(`${API}/attendance/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ hostel }),
  })
    .then((res) => res.json())
    .catch((e) => console.log(e));

export const isAuthenticated = () => {
  if (typeof window == "undefined") return false;
  else
    return localStorage.getItem("jwt")
      ? JSON.parse(localStorage.getItem("jwt"))
      : false;
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
    return fetch(`${API}/logout`, { method: "GET" }).catch((e) =>
      console.log(e)
    );
  }
};
