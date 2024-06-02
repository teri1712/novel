import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import authenRouter from "./router/authen.js";
import novelRouter from "./router/novels.js";
import userRouter from "./router/user.js";

const app = express();
const PORT = 8080;

app.listen(PORT, () => console.log("Server started"));
mongoose
  .connect("mongodb://127.0.0.1:27017/novel")
  .then(() => console.log("Novel database connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionContext = session({
  secret: "vcl",
  saveUninitialized: false,
  resave: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
});

app.use(sessionContext);

/* For authentication, disable for testing */
// app.use((req, res, next) => {
//   const { authenContext } = req.session;
//   if (!req.originalUrl.startsWith("/auth")) {
//     if (!authenContext) {
//       res.status(401).send("Un-Authorzied.");
//       return;
//     }
//   }
//   next();
// });
app.use(userRouter);
app.use("/auth", authenRouter);
app.use("/novels", novelRouter);
