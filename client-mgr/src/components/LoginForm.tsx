import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import API from "../API";
import { Credentials, UserLoginInfo } from "../commonTypes";

interface LoginFormProps {
  handleCorrectLogin: (user: UserLoginInfo) => void;
  handleWrongLogin: () => void;
}

function LoginForm({ handleCorrectLogin, handleWrongLogin }: LoginFormProps) {
  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((oldCredentials) => {
      oldCredentials[e.target.id as keyof Credentials] = e.target.value;
      return { ...oldCredentials };
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    API.login(credentials).then((user) => {
      if (user.isLogged) {
        handleCorrectLogin(user);
      } else {
        handleWrongLogin();
      }
    });
  };

  return (
    <Form
      className="d-flex flex-column align-items-center"
      style={{ width: "300px" }}
    >
      <h2 className="m-3">Admin login</h2>
      <Form.Group>
        <Form.Label>Username</Form.Label>
        <Form.Control
          id="username"
          type="text"
          onChange={handleChange}
          placeholder="Enter username"
        />
        <Form.Text className="text-muted">Insert your username here</Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control
          id="password"
          type="password"
          onChange={handleChange}
          placeholder="Enter your password"
        />
      </Form.Group>
      <Button variant="primary" type="submit" onClick={handleLogin}>
        Login
      </Button>
    </Form>
  );
}

export default LoginForm;
