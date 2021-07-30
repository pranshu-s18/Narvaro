const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB CONNECTED"))
  .catch((e) => console.log("Database Connection Failed", e));

const app = express();
app.use(express.static("client"));
app.use(express.json());
app.use(cookieParser());
app.use("/api", authRouter);
app.use("/api", adminRouter);
app.use("/app", userRouter);

app.listen(8000, () => console.log("Server started at 8000"));
