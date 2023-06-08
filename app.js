const express = require("express");
const user = require("./routers/userRouter");
const service = require("./routers/serviceRouter");
const order = require("./routers/orderRouter");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

//Define Each Routes Here

app.use("/", user);
app.use("/services", service);
app.use("/orders", order);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
