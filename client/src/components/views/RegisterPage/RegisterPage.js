import React, { useState } from "react";
import { Form, Button, Typography, Input, Divider, message, Radio } from "antd";
import Axios from "axios";
import { Gender } from "../../../Config";
import { withRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { register } from "../../../_actions/user_action";
import moment from "moment";

function RegisterPage(props) {
  const dispatch = useDispatch();
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState(1);
  const [age, setAge] = useState(0);
  const onEmailChange = (e) => {
    setEmail(e.currentTarget.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.currentTarget.value);
  };

  const onUsernameChange = (e) => {
    setname(e.currentTarget.value);
  };

  const onGenderChange = (e) => {
    setGender(e.target.value);
  };

  const onAgeChange = (e) => {
    setAge(e.currentTarget.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    let body = {
      email,
      password,
      name,
      gender,
      age,
      image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`,
    };

    dispatch(register(body))
      .then((result) => {
        if (result.payload.success) {
          message.success("Register Success!!");
          props.history.push("/login");
        } else {
          message.warning("Failed to Register");
        }
      })
      .catch((err) => {
        message.error("Error");
      });
  };

  return (
    <div style={{ margin: "3rem auto", maxWidth: "400px" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h2>Register</h2>
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
          label="username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username",
            },
          ]}
        >
          <Input
            size="large"
            placeholder="input your username..."
            type="text"
            value={name}
            onChange={onUsernameChange}
          />
        </Form.Item>
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

        <Form.Item
          label="gender"
          name="gender"
          rules={[
            {
              required: true,
              message: "Please check your gender",
            },
          ]}
        >
          <Radio.Group onChange={onGenderChange} value={gender}>
            {Gender.map((gender, index) => {
              return <Radio value={gender.value}>{gender.label}</Radio>;
            })}
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Age"
          name="Age"
          rules={[
            {
              required: true,
              message: "Please input your Age",
            },
          ]}
        >
          <Input
            size="large"
            placeholder="input your Age..."
            type="number"
            value={age}
            onChange={onAgeChange}
          />
        </Form.Item>
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

export default withRouter(RegisterPage);
