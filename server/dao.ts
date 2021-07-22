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

export { addMenuEntry, getAvailableMenu, addMenuAvailability };
