const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");

mongoose
  .connect(process.env.NODE_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB CONNECTED"))
  .catch((e) => console.log("Database Connection Failed", e));

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api", authRouter);
app.use("/api", adminRouter);
app.use("/app", userRouter);
app.use(express.static("client/"));

const https = require("https");
const fs = require("fs");
const httpsServer = https.createServer(
  {
    cert: fs.readFileSync("/etc/letsencrypt/live/narvaro.tech/fullchain.pem"),
    key: fs.readFileSync("/etc/letsencrypt/live/narvaro.tech/privkey.pem"),
  },
  app
);

httpsServer.listen(8000, () => console.log("Secure server started at 8000"));
