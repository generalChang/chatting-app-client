import {
  AUTH_USER,
  LOGIN_USER,
  LOGOUT_USER,
  REGISTER_USER,
} from "../_actions/types";

export default function (state = {}, action) {
  switch (action.type) {
    case REGISTER_USER:
      return { ...state, register: action.payload };
      break;
    case LOGIN_USER:
      return { ...state, login: action.payload };
      break;
    case AUTH_USER:
      return { ...state, userData: action.payload };
      break;
    case LOGOUT_USER:
      return { ...state };
      break;
    default:
      return state;
  }
}
