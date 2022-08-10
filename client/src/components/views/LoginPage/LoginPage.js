import React, { useState } from "react";
import { Form, Button, Typography, Input, Divider, message } from "antd";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../../_actions/user_action";
import { withRouter } from "react-router-dom";
function LoginPage(props) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onEmailChange = (e) => {
    setEmail(e.currentTarget.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.currentTarget.value);
  };

  const onSubmit = () => {
    let body = {
      email,
      password,
    };

    dispatch(login(body))
      .then((result) => {
        if (result.payload.loginSuccess) {
          message.success("Login Success!!");
          localStorage.setItem("userId", result.payload.userId);
          props.history.push("/");
        } else {
          message.warning(result.payload.message);
        }
      })
      .catch((err) => {
        message.error("Error");
      });
  };
  return (
    <div style={{ margin: "3rem auto", maxWidth: "400px" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h2>Login</h2>
      </div>
      <Divider />
      <Form
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        onSubmit={onSubmit}
      >
        <Form.Item
          label="email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email",
            },
          ]}
        >
          <Input
            size="large"
            placeholder="input your email..."
            type="text"
            value={email}
            onChange={onEmailChange}
          />
        </Form.Item>

        <Form.Item
          label="password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password",
            },
          ]}
        >
          <Input
            size="large"
            placeholder="input your assword..."
            type="password"
            value={password}
            onChange={onPasswordChange}
          />
        </Form.Item>

        <a href="/register">register now!</a>
        <Button
          style={{ float: "right" }}
          type="primary"
          size="large"
          onClick={onSubmit}
          htmlType="submit"
        >
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default withRouter(LoginPage);
