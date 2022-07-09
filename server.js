const express = require("express");
const mongoose = require("mongoose");
const { nextTick } = require("process");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("./schemas/user-schema.js");
const ToDo = require("./schemas/user-toDo.js");
const app = express();

const uri =
  "mongodb+srv://adityayadav71:euShFTbBBbSQzXgW@cluster0.hlgyb91.mongodb.net/todo-app?retryWrites=true&w=majority";
async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("connected to database");
  } catch (e) {
    console.error(e);
  }
}
connect();

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", async (req, res) => {
  User.findOne(
    { username: req.body.username, password: req.body.password },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        if (docs !== null) {
          res.redirect("/");
        } else res.redirect("/register");
      }
    }
  );
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
    });
    await user.save();
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

app.post("/addToDo", async (req, res) => {
  const userToDo = new ToDo({
    username: req.body.username,
    toDo: req.body.toDo,
  });
  await userToDo.save();
});

app.listen(3000);
