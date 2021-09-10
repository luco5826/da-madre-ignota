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

interface OrderedProduct extends StoredProduct {
  quantity: number;
  day: dayjs.Dayjs;
}

interface MenuAvailability {
  id?: number;
  menu_id: number;
  product?: StoredProduct;
  day: dayjs.Dayjs;
  quantity?: number;
  hidden: boolean;
}

type UserInfos = {
  id?: number;
  name: string;
  email: string;
  phone: string;
};
type Order = {
  availabilities: MenuAvailability[];
  user: UserInfos;
};

export type {
  UserLoginInfo,
  Credentials,
  Product,
  StoredProduct,
  OrderedProduct,
  MenuAvailability,
  UserInfos,
  Order,
};
