const DB_PASSWORD = process.env.PASSWORD;
const PORT = process.env.PORT;

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("67092af36ae6458e782329eb")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoose
  .connect(
    `mongodb+srv://omarhashy:${DB_PASSWORD}@cluster0.qzjhm.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    console.log("Connected");
    return User.findOne();
  })
  .then((user) => {
    if (user) return;
    user = new User({
      name: "Max",
      email: "max@m.com",
      cart: {
        items: [],
      },
    });
    return user.save();
  })
  .then(() => app.listen(PORT))
  .catch((err) => console.error(err));
