import {
  Credentials,
  Product,
  StoredProduct,
  UserLoginInfo,
} from "./commonTypes";

const login = async (credentials: Credentials): Promise<UserLoginInfo> => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const result: UserLoginInfo = {
    isLogged: false,
    user: {},
  };
  if (response.status === 200) {
    result.user = await response.json();
    result.isLogged = true;
  }

  return result;
};

const isLogged = async (): Promise<UserLoginInfo> => {
  const response = await fetch("/api/islogged");

  const result: UserLoginInfo = {
    isLogged: false,
    user: {},
  };
  if (response.status === 200) {
    result.user = await response.json();
    result.isLogged = true;
  }

  return result;
};
const logout = async () => {
  const response = await fetch("/api/logout");
  return response.status === 200;
};

const getProducts = async () => {
  const response = await fetch("/api/products");
  return response.json();
};

const saveProduct = async (newProd: Product): Promise<StoredProduct> => {
  const response = await fetch("/api/product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newProd),
  });
  return response.json();
};

const API = {
  login,
  isLogged,
  logout,
  getProducts,
  saveProduct,
};

export default API;
