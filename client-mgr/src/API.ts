import dayjs from "dayjs";
import {
  Credentials,
  MenuAvailability,
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
const updateProduct = async (
  newProd: StoredProduct
): Promise<StoredProduct> => {
  const response = await fetch("/api/product", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newProd),
  });
  return response.json();
};
const deleteProduct = async (product: StoredProduct): Promise<boolean> => {
  const response = await fetch("/api/product", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
  return response.json();
};

const getAvailability = async () => {
  const response = await fetch("/api/allavail");
  const availability = await response.json();
  return availability.map((a: MenuAvailability) => {
    return { ...a, day: dayjs(a.day) };
  });
};
const toggleHideAvailiability = async (
  availability: MenuAvailability
): Promise<boolean> => {
  const response = await fetch("/api/avail", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(availability),
  });
  return response.json();
};

const updateQuantity = async (
  availability: MenuAvailability,
  newQuantity: number
) => {
  const response = await fetch("/api/avail/qty", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...availability, quantity: newQuantity }),
  });
  return response.json();
};
const updateAvailabilityProduct = async (
  availability: MenuAvailability,
  newProduct: StoredProduct
) => {
  const response = await fetch("/api/avail/prod", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...availability, product: newProduct }),
  });
  return response.json();
};

const API = {
  login,
  isLogged,
  logout,
  getProducts,
  saveProduct,
  updateProduct,
  deleteProduct,
  getAvailability,
  toggleHideAvailiability,
  updateQuantity,
  updateAvailabilityProduct,
};

export default API;
