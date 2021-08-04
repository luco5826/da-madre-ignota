import LoginForm from "../components/LoginForm";
import { Redirect } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "../Utils";
import { Alert, Container } from "react-bootstrap";
import { UserLoginInfo } from "../commonTypes";

interface LoginViewProps {
  handleLogin: (user: UserLoginInfo) => void;
}

function LoginView({ handleLogin }: LoginViewProps) {
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState(false);

  const isAlreadyLogged = useContext(AuthenticationContext).isLogged;

  useEffect(() => {
    // Avoid already logged user to end up in /login
    if (isAlreadyLogged && !redirect) setRedirect(true);
  }, [isAlreadyLogged, redirect]);

  const handleCorrectLogin = (user: UserLoginInfo) => {
    handleLogin(user);
    setRedirect(true);
  };
  const handleWrongLogin = () => setError(true);

  return redirect ? (
    <Redirect to="/home" />
  ) : (
    <Container className="d-flex flex-column justify-content-center align-items-center">
      <LoginForm
        handleCorrectLogin={handleCorrectLogin}
        handleWrongLogin={handleWrongLogin}
      />
      {error && (
        <Alert className="m-3" variant="danger">
          Username/password wrong
        </Alert>
      )}
    </Container>
  );
}

export default LoginView;
