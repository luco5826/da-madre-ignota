type UserLoginInfo = {
  isLogged: boolean;
  user: object;
};

type Credentials = {
  username: string;
  password: string;
};

export type { UserLoginInfo, Credentials };
