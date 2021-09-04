const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// PORT
const PORT = 8080;
// default port 8080

// MIDDLEWARE
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const generateRandomString = function () {
  return Math.floor((1 + Math.random()) * 0x100000)
    .toString(16)
    .substring();
};

// FEED DATA
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "123",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

// GET ROUTE HANDLERS

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    userID: req.cookies["userID"],
    user: users[req.cookies["userID"]]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    userID: req.cookies["userID"],
    user: users[req.cookies["userID"]]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  // console.log("shortURL -----", shortURL);
  let longURL = urlDatabase[shortURL];
  // console.log("longURL -----", longURL);
  // console.log("urlDatabase -----", urlDatabase[shortURL]);
  const templateVars = {
    longURL: longURL,
    shortURL: shortURL,
    userID: req.cookies["userID"],
    user: users[req.cookies["userID"]]
  };
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  // whatever is entered into browser
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const templateVars = {
    userID: req.cookies["userID"],
    user: users[req.cookies["userID"]]
  };
  res.render("registration", templateVars);
});

app.get("/login", (req, res) => {
  // const userID = req.cookies["userID"];
  const templateVars = {
    userID: null,
    user: users[req.cookies["userID"]]
  };
  res.render("login", templateVars);
});

// POST ROUTE HANDLER

app.post("/urls", (req, res) => {
  // when new URL receives new submission
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  // add into array with index of shortURL and value of longURL?
  // console.log(urlDatabase);  // Log the POST request body to the console
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  // : <- use req.params to pull out input
  // console.log ('shortURL delete -----', shortURL)
  delete urlDatabase[shortURL];
  res.redirect(`/urls`);
});

app.post("/urls/:shortURL/update", (req, res) => {
  const shortURL = req.params.shortURL;
  // whatever we input
  urlDatabase[shortURL] = req.body.newLongURL;
  res.redirect(`/urls`);
});

// Login Handler
app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  for (const user in users) {
    // console.log(`user -----`, user);
    // console.log("users ------1", users[user].email);
    // console.log(`email----- `, email);
    if (users[user].email !== email) {
      // console.log("users ------2", users[user]);
      return res.status(403).send(`Status 403: Account does not exist`);
    }
    // console.log("users ------", users[user]);
    if (users[user].password === password) {
      res.cookie("userID", users[user].id);
      return res.redirect(`/urls`);
    }
    return res.status(403).send(`Status 403: Password is Incorrect`);
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("userID", users[req.cookies.userID]);
  res.redirect(`/urls`);
});

// For Registration form data
app.post("/register/", (req, res) => {
  let email = req.body.email;

  if (!req.body.email || !req.body.password) {
    return res.status(400).send(`Status 400: Bad Request. A field is empty`);
  }

  for (const user in users) {
    if (users[user].email === email) {
      return res.status(400).send(`Status 400: Account already exists`);
    }
  }

  let ID = generateRandomString();
  users[ID] = {
    id: ID,
    email: req.body.email,
    password: req.body.password,
  };
  // console.log('users ------', users);
  res.cookie("userID", ID);
  res.redirect(`/urls`);
});

// PORT LISTENER

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
