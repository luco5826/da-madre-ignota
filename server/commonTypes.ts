type UserLoginInfo = {
  isLogged: boolean;
  user: object;
};

type Credentials = {
  username: string;
  password: string;
};

interface Product {
  name: string;
  description: string;
}

interface StoredProduct extends Product {
  id: number;
}

export type { UserLoginInfo, Credentials, Product, StoredProduct };
