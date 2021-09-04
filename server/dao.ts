import dayjs from "dayjs";
import { Product, StoredProduct } from "./commonTypes";
import db from "./database";

type MenuAvailability = {
  id?: number;
  menu_id: number;
  product?: StoredProduct;
  day: dayjs.Dayjs;
  quantity?: number;
  hidden: boolean;
};

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

const addMenuEntry = async (
  product: Product
): Promise<StoredProduct | undefined> => {
  const query = `
    INSERT INTO MENU(id, name, description) 
    VALUES(DEFAULT, $1, $2)
    RETURNING id
  `;
  const result = await db
    .oneOrNone<{ id: number }>(query, [product.name, product.description])
    .catch(console.error);

  if (result) return { ...product, id: result?.id };
  else return undefined;
};

const addMenuAvailability = async (availability: MenuAvailability) => {
  const query = `
    INSERT INTO MENU_AVAILABILITY(id, menu_id, day, hidden, quantity) 
    VALUES(DEFAULT, $1, $2, $3, $4)
    RETURNING id
  `;

  const result = await db
    .oneOrNone<{ id: number }>(query, [
      availability.menu_id,
      dayjs(availability.day),
      availability.hidden,
      availability.quantity,
    ])
    .catch(console.error);
  return result?.id!;
};

const getAvailableMenu = async (
  fromDate: dayjs.Dayjs | undefined,
  toDate: dayjs.Dayjs | undefined,
  includeHidden: boolean
) => {
  const today = dayjs();
  const query = `
    SELECT A.*, M.name, M.description
    FROM MENU_AVAILABILITY A
    JOIN MENU M ON M.id = A.menu_id
    WHERE day >= $1 AND day <= $2
    AND M.deleted = false ${includeHidden ? "" : "AND A.hidden = false"}
  `;
  const result = await db
    .manyOrNone(query, [
      fromDate || today,
      toDate || (fromDate || today).add(7, "day"),
    ])
    .catch(console.error);

  if (result) {
    return result.map((row) => {
      return {
        id: row.id,
        day: dayjs(row.day),
        product: {
          id: row.menu_id,
          name: row.name,
          description: row.description,
        },
        hidden: row.hidden,
        quantity: row.quantity,
      };
    });
  } else {
    return undefined;
  }
};

const toggleHideAvailiability = async (
  availiability: MenuAvailability
): Promise<boolean> => {
  const query = `
  UPDATE MENU_AVAILABILITY
  SET hidden = $1
  WHERE id = $2
`;

  const result = await db
    .none(query, [!availiability.hidden, availiability.id])
    .catch(console.error);

  return true;
};
const updateQuantity = async (
  availiability: MenuAvailability
): Promise<boolean> => {
  const query = `
  UPDATE MENU_AVAILABILITY
  SET quantity = $1
  WHERE id = $2
`;

  const result = await db
    .none(query, [availiability.quantity || 0, availiability.id])
    .catch(console.error);

  return true;
};
const updateAvailabilityProduct = async (
  availiability: MenuAvailability
): Promise<boolean> => {
  const query = `
  UPDATE MENU_AVAILABILITY
  SET menu_id = $1
  WHERE id = $2
`;

  const result = await db
    .none(query, [availiability.product?.id || 0, availiability.id])
    .catch(console.error);

  return true;
};
const getProducts = async () => {
  const query = `SELECT * FROM MENU M WHERE M.deleted = false`;
  return await db.manyOrNone(query).catch(console.error);
};

const placeOrder = async (order: Order) => {
  // Insert the customer
  // TODO: Do not insert customer if it already exists
  const userResult = await db.one<{ id: number }>(
    `INSERT INTO CUSTOMERS(id, name, phone_no, email) 
    VALUES(DEFAULT, $1, $2, $3) 
    RETURNING id`,
    [order.user.name, order.user.phone, order.user.email]
  );

  // Insert orders in a transaction
  await db.tx(async (transaction) => {
    const queries = order.availabilities
      .filter((a) => a.quantity !== undefined && a.quantity > 0)
      .map((availability) => {
        return transaction.none(
          `INSERT INTO ORDERS(customer_id, avail_id, quantity) 
          VALUES($1, $2, $3)`,
          [userResult.id, availability.id, availability.quantity]
        );
      });
    return transaction.batch(queries);
  });

  return { ok: true };
};

const saveProduct = async (product: Product): Promise<StoredProduct> => {
  const query = `
  INSERT INTO MENU(name, description) 
  VALUES($1, $2)
  RETURNING id
`;

  const result = await db
    .one<{ id: number }>(query, [product.name, product.description])
    .catch(console.error);

  const addedProduct: StoredProduct = {
    id: result?.id || -1,
    ...product,
  };
  return addedProduct;
};
const updateProduct = async (
  product: StoredProduct
): Promise<StoredProduct> => {
  const query = `
  UPDATE MENU
  SET name = $2, description = $3
  WHERE id = $1
`;

  const result = await db
    .none(query, [product.id, product.name, product.description])
    .catch(console.error);

  return product;
};
const deleteProduct = async (product: StoredProduct): Promise<boolean> => {
  const query = `
  UPDATE MENU
  SET deleted = true
  WHERE id = $1
`;

  const result = await db.none(query, [product.id]).catch(console.error);

  return true;
};

export {
  addMenuEntry,
  getAvailableMenu,
  getProducts,
  addMenuAvailability,
  toggleHideAvailiability,
  updateQuantity,
  updateAvailabilityProduct,
  placeOrder,
  saveProduct,
  updateProduct,
  deleteProduct,
};
