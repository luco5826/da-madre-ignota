import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { AuthenticationContext } from "../Utils";

const AuthenticatedRoute: React.FC = ({ children }) => {
  const loggedUser = useContext(AuthenticationContext);
  return loggedUser.isLogged ? <>{children}</> : <Redirect to="/login" />;
};

export default AuthenticatedRoute;
