import dayjs from "dayjs";

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

interface MenuAvailability {
  id?: number;
  menu_id: number;
  product?: StoredProduct;
  day: dayjs.Dayjs;
  quantity?: number;
  hidden: boolean;
}

export type {
  UserLoginInfo,
  Credentials,
  Product,
  StoredProduct,
  MenuAvailability,
};
