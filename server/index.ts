import "./passport";
import dayjs from "dayjs";
import express from "express";
import session from "express-session";
import passport from "passport";
import * as dao from "./dao";
import cors from "cors";
import morgan from "morgan";

const app = express();
const PORT = 3000;
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  })
);

app.use(passport.initialize());
app.use(passport.session());

const isAuth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.sendStatus(401);
  }
};

app.get("/api/avail", async (req, res) => {
  res.json(await dao.getAvailableMenu(undefined, undefined, false));
});
app.get("/api/allavail", isAuth, async (req, res) => {
  res.json(await dao.getAvailableMenu(undefined, undefined, true));
});
app.put("/api/avail", isAuth, async (req, res) => {
  res.json(await dao.toggleHideAvailiability(req.body));
});
app.post("/api/avail", isAuth, async (req, res) => {
  res.json(await dao.addMenuAvailability(req.body));
});
app.put("/api/avail/qty", isAuth, async (req, res) => {
  res.json(await dao.updateQuantity(req.body));
});
app.put("/api/avail/prod", isAuth, async (req, res) => {
  res.json(await dao.updateAvailabilityProduct(req.body));
});

app.get("/api/orders", async (req, res) => {
  res.json(await dao.getOrders(undefined, undefined));
});

app.post("/api/order", async (req, res) => {
  res.json(await dao.placeOrder(req.body));
});

app.get("/api/products", isAuth, async (req, res) => {
  res.json(await dao.getProducts());
});

app.post("/api/product", isAuth, async (req, res) => {
  res.json(await dao.saveProduct(req.body));
});
app.put("/api/product", isAuth, async (req, res) => {
  res.json(await dao.updateProduct(req.body));
});
app.delete("/api/product", isAuth, async (req, res) => {
  res.json(await dao.deleteProduct(req.body));
});

app.post("/api/login", passport.authenticate("local"), (req, res) => {
  res.json({ isLogged: true, user: {} });
});

app.get("/api/islogged", isAuth, (req, res) => {
  res.json({ isLogged: true, user: {} });
});

app.listen(PORT, () => {
  console.log("Server started at port", PORT);
});
