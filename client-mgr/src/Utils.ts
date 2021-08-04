import React from "react";
import { UserLoginInfo } from "./commonTypes";

const AuthenticationContext = React.createContext<UserLoginInfo>({
  isLogged: false,
  user: {},
});

const isStringEmpty = (s: string) => s === undefined || s === null || s === "";

export { AuthenticationContext, isStringEmpty };
