import dayjs from "dayjs";
import db from "./database";

type MenuEntry = {
  id?: number;
  name: string;
  description: string;
};

type MenuAvailability = {
  id?: number;
  menu_id: number;
  entry?: MenuEntry;
  day: dayjs.Dayjs;
  quantity?: number;
};

type UserInfos = {
  id?: number;
  name: string;
  email: string;
  phone: string;
};

type Order = {
  products: MenuAvailability[];
  user: UserInfos;
};

const addMenuEntry = async (menuEntry: MenuEntry) => {
  const query = `
    INSERT INTO MENU(id, name, description) 
    VALUES(DEFAULT, $1, $2)
    RETURNING id
  `;
  const result = await db
    .oneOrNone<{ id: number }>(query, [menuEntry.name, menuEntry.description])
    .catch(console.error);

  menuEntry.id = result?.id;
  return menuEntry;
};

const addMenuAvailability = async (availability: MenuAvailability) => {
  const query = `
    INSERT INTO MENU_AVAILABILITY(id, menu_id, day) 
    VALUES(DEFAULT, $1, $2)
    RETURNING id
  `;
  const result = await db
    .oneOrNone<{ id: number }>(query, [availability.menu_id, availability.day])
    .catch(console.error);
  availability.id = result?.id;
  return availability;
};

const getAvailableMenu = async (
  fromDate: dayjs.Dayjs | undefined,
  toDate: dayjs.Dayjs | undefined
) => {
  const today = dayjs();
  const query = `
    SELECT A.*, M.name, M.description
    FROM MENU_AVAILABILITY A
    JOIN MENU M ON M.id = A.menu_id
    WHERE day >= $1 AND day <= $2
  `;
  const result = await db
    .manyOrNone(query, [
      fromDate || today,
      toDate || (fromDate || today).add(7, "day"),
    ])
    .catch(console.error);

  if (typeof result !== "undefined") {
    return result.map((row) => {
      return {
        id: row.id,
        day: dayjs(row.day),
        entry: {
          id: row.menu_id,
          name: row.name,
          description: row.description,
        },
      };
    });
  } else {
    return undefined;
  }
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
    const queries = order.products
      .filter((p) => p.quantity !== undefined && p.quantity > 0)
      .map((product) => {
        return transaction.none(
          `INSERT INTO ORDERS(customer_id, avail_id, quantity) 
          VALUES($1, $2, $3)`,
          [userResult.id, product.id, product.quantity]
        );
      });
    return transaction.batch(queries);
  });

  return { ok: true };
};

export { addMenuEntry, getAvailableMenu, addMenuAvailability, placeOrder };
