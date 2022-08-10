import { message } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../_actions/user_action";

export default function Auth(SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    let user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(auth())
        .then((result) => {
          if (!result.payload.isAuth) {
            //Not loginned

            if (option) {
              message.warning("로그인을 해주세요.");
              props.history.push("/login");
            }
          } else {
            //Logged in
            if (adminRoute && !result.payload.isAdmin) {
              props.history.push("/");
            } else {
              if (option === false) {
                props.history.push("/");
              }
            }
          }
        })
        .catch((err) => {});
    }, []);

    return <SpecificComponent {...props} user={user} />;
  }

  return AuthenticationCheck;
}
