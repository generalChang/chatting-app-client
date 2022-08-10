import Axios from "axios";
import { AUTH_USER, LOGIN_USER, LOGOUT_USER, REGISTER_USER } from "./types";

export function register(body) {
  const request = Axios.post("/api/user/register", body).then(
    (result) => result.data
  );

  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export function login(body) {
  const request = Axios.post("/api/user/login", body).then(
    (result) => result.data
  );

  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function auth() {
  const request = Axios.get("/api/user/auth").then((result) => result.data);

  console.log(request);
  return {
    type: AUTH_USER,
    payload: request,
  };
}

export function logout() {
  const request = Axios.get("/api/user/logout").then((result) => result.data);

  return {
    type: LOGOUT_USER,
    payload: request,
  };
}
