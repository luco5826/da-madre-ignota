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
const getOrders = async (
  fromDate: dayjs.Dayjs | undefined,
  toDate: dayjs.Dayjs | undefined
): Promise<Order[] | undefined> => {
  const today = dayjs();

  const query = `
    SELECT C.*, O.*, A.DAY, A.MENU_ID, M.ID AS PRODUCT_ID, M.NAME AS PRODUCT_NAME, M.DESCRIPTION
    FROM ORDERS O 
    JOIN MENU_AVAILABILITY A ON A.ID = O.AVAIL_ID 
    JOIN MENU M ON M.ID = A.MENU_ID 
    JOIN CUSTOMERS C ON C.ID = O.CUSTOMER_ID
    WHERE day >= $1 AND day <= $2
    ORDER BY id;
  `;
  const results = await db
    .manyOrNone(query, [
      fromDate || today,
      toDate || (fromDate || today).add(10, "day"),
    ])
    .catch(console.error);

  if (results)
    return results.reduce((acc: Order[], entry) => {
      const index = acc.findIndex((e) => e.user.email === entry.email);
      if (index === -1) {
        acc.push({
          user: {
            id: entry.id,
            name: entry.name,
            email: entry.email,
            phone: entry.phone_no,
          },
          availabilities: [
            {
              id: entry.avail_id,
              day: dayjs(entry.day),
              quantity: entry.quantity,
              hidden: false,
              menu_id: entry.menu_id,
              product: {
                id: entry.product_id,
                name: entry.product_name,
                description: entry.description,
              },
            },
          ],
        });
      } else {
        acc[index].availabilities.push({
          id: entry.avail_id,
          day: dayjs(entry.day),
          quantity: entry.quantity,
          hidden: false,
          menu_id: entry.menu_id,
          product: {
            id: entry.product_id,
            name: entry.product_name,
            description: entry.description,
          },
        });
      }
      return acc;
    }, []);
};

const placeOrder = async (order: Order) => {
  // Insert the customer if it does not exist yet
  const fetchedUser = await db.oneOrNone(
    `
    SELECT *
    FROM CUSTOMERS
    WHERE email = $1 AND phone_no = $2`,
    [order.user.email, order.user.phone]
  );

  let userID = -1;
  if (fetchedUser) {
    userID = fetchedUser.id;
  } else {
    const userResult = await db.one<{ id: number }>(
      `INSERT INTO CUSTOMERS(id, name, phone_no, email) 
      VALUES(DEFAULT, $1, $2, $3) 
      RETURNING id`,
      [order.user.name, order.user.phone, order.user.email]
    );
    userID = userResult.id;
  }

  // Insert orders in a transaction
  await db.tx(async (transaction) => {
    const queries = order.availabilities
      .filter((a) => a.quantity !== undefined && a.quantity > 0)
      .map((availability) => {
        // Insert the order but if the order is already present just update the quantity
        return transaction.none(
          `INSERT INTO ORDERS(customer_id, avail_id, quantity) 
          VALUES($1, $2, $3)
          ON CONFLICT (customer_id, avail_id) DO UPDATE SET quantity = ORDERS.quantity + EXCLUDED.quantity;`,
          [userID, availability.id, availability.quantity]
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
  getOrders,
  saveProduct,
  updateProduct,
  deleteProduct,
};
