import pgp from "pg-promise";
const db = pgp()({
  host: "localhost",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "changeme",
});

export default db;
