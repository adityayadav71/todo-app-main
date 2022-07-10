const express = require("express");
const mongoose = require("mongoose");
const { nextTick } = require("process");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo");
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

const sessionStorgae = MongoStore.create({
  mongoUrl: uri,
  dbName: "todo-app",
  collectionName: "session",
  ttl: 14 * 24 * 60 * 60,
  autoRemove: "native",
});
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static(__dirname + "/public"));

app.use(
  session({
    name: "sessiontodo",
    secret: "changethiskeylater",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    store: sessionStorgae,
  })
);

app.get("/", authChecker, (req, res) => {
  res.render("index.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

function authChecker(req, res, next) {
  if (req.session.username !== undefined) {
    next();
  } else {
    res.redirect("/register");
  }
}

app.post("/login", async (req, res) => {
  User.findOne({ username: req.body.username }, async function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      if (docs !== null) {
        const passwordMatch = await bcrypt.compare(
          req.body.password,
          docs.password
        );

        if (passwordMatch) {
          req.session.username = req.body.username;
          res.redirect("/");
        } else res.redirect("/register");
      } else res.redirect("/register");
    }
  });
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
  const data = req.body;
  const userToDo = new ToDo({
    username: req.session.username,
    toDo: data.input,
  });
  await userToDo.save();
  res.json({ success: true });
});

app.post("/removeToDo", async (req, res) => {
  const data = req.body;
  const result = await ToDo.deleteOne({
    username: req.session.username,
    toDo: data.toDo,
  });
  res.json({ success: true });
});

app.get("/getToDO", async (req, res) => {
  const docs = await ToDo.find({ username: req.session.username });
  res.json(docs);
});

app.post("/logout", (req, res) => {
  req.session.destroy();
});

app.listen(process.env.PORT || 3000);
