const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const { response } = require("express");
const bcrypt = require('bcrypt');
// const cookieParser = require("cookie-parser");

// PORT
const PORT = 8080;
// default port 8080

// MIDDLEWARE
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: "session",
  keys: ['key1', 'key2']
}));
// app.use(cookieParser());

const generateRandomString = function() {
  return Math.floor((1 + Math.random()) * 0x100000).toString(16).substring();
};

const urlsForUser = function(userID) {
  const filterURLS = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].userID === userID) {
      filterURLS[url] = urlDatabase[url];
    }
  }
  return filterURLS;
};

// FEED DATA
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "user2RandomID" }
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "$2b$10$FKz7NASf/B588iRMEbhZr.VRK2hnht96SAxRfQrDOOvEPac5UyVDe",
    // pw = 123
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "$2b$10$eZoOWWypcjzlrbm/onZVve/VmVFh0w71DefDbidt8CHan4GOlfm.2",
    // pw = 321
  },
};

// GET ROUTE HANDLERS

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/users.json", (req, res) => {
  res.json(users);
});

app.get("/urls", (req, res) => {
  // if (!req.cookies["userID"]) {
  //   return res.send("<html><body>Please login to access this feature!</body></html>\n");
  //   return res.redirect("/login")
  // }
  
  const templateVars = {
    urls: urlsForUser(req.session.userID),
    userID: req.session.userID,
    user: users[req.session.userID],
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!req.session.userID) {
    return res.redirect("/login");
  }
  const templateVars = {
    userID: req.session.userID,
    user: users[req.session.userID],
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;

  if (!urlDatabase[shortURL]) {
    const templateVars = {
      user: users[req.session.userID],
      error: "This URL does not exist."
    };
    return res.render("error", templateVars);
  }

  if (req.session.userID !== urlDatabase[shortURL].userID) {
    // return res.send(`You cannot edit this URL`)
    const templateVars = {
      user: users[req.session.userID],
      error: "This is not your link!  Please sign in to the proper account to access this link!"
    };
    return res.render("error", templateVars);
  }

  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = {
    longURL: longURL,
    shortURL: shortURL,
    userID: req.session.userID,
    user: users[req.session.userID],
  };
  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  // whatever is entered into browser
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const templateVars = {
    // userID: req.session.userID,
    user: users[req.session.userID],
  };
  res.render("registration", templateVars);
});

app.get("/login", (req, res) => {
  // const userID = req.cookies["userID"];
  const templateVars = {
    userID: null,
    user: users[req.session.userID],
  };
  res.render("login", templateVars);
});

// app.get("/error", (req, res) => {
//   const error = req.params.error;

//   const templateVars = {
//     user: users[req.cookies["userID"]],
//     error: error
//   };
//   res.render("error", templateVars);
// });

// POST ROUTE HANDLER

app.post("/urls", (req, res) => {
  // when new URL receives new submission
  if (!req.session.userID) {
    return res.redirect('/login');
  }

  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: req.session.userID
  };

  return res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  // : <- use req.params to pull out input

  if (req.session.userID === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
    res.redirect(`/urls`);
  // } else {
  //   res.send('You are not authorized to delete this. Please login!')
  }

  const templateVars = {
    user: users[req.session.userID],
    error: "This URL does not belong to you. You cannot delete this URL!"
  };
  return res.render("error", templateVars);
  // return res.send(`You cannot delete this URL`);
});

app.post("/urls/:shortURL/update", (req, res) => {
  const shortURL = req.params.shortURL;
  // : <- use req.params to pull out input
  if (req.session.userID !== urlDatabase[shortURL].userID) {
    const templateVars = {
      user: users[req.session.userID],
      error: "This URL does not belong to you. You cannot edit this URL!"
    };
    return res.render("error", templateVars);
  }
  urlDatabase[shortURL].longURL = req.body.newLongURL;
  return res.redirect(`/urls`);
});

// Login Handler
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  for (const user in users) {
    if (users[user].email === email) {
      // if (users[user].password === password) {
      if (bcrypt.compareSync(password, users[user].password)) {
        // res.cookie("userID", users[user].id);
        req.session.userID = user;
        return res.redirect(`/urls`);
      } else {
        const templateVars = {
          user: users[req.session.userID],
          error: "Status 403: Bad Request. Password is Incorrect!"
        };
        return res.status(403).render("error", templateVars);
        // return res.status(403).send(`Status 403: Password is Incorrect`);
      }
    }
  }
  const templateVars = {
    user: users[req.session.userID],
    error: "Status 403: Bad Request. Account does not exist!"
  };
  return res.status(403).render("error", templateVars);
  // res.status(403).send(`Status 403: Account does not exist`);
});

app.post("/logout", (req, res) => {
  // res.clearCookie("userID");
  req.session = null;
  res.redirect(`/urls`);
});

// For Registration form data
app.post("/register/", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    const templateVars = {
      // user: users[req.session.userID],
      user: users[null],
      error: "Status 400: Bad Request. A field is empty!"
    };
    return res.status(400).render("error", templateVars);
    // return res.status(400).send(`Status 400: Bad Request. A field is empty`);
  }

  for (const user in users) {
    if (users[user].email === email) {
      const templateVars = {
        user: users[req.session.userID],
        error: "Status 400: Bad Request. An account with this Email already exists!"
      };
      return res.status(400).render("error", templateVars);
      // return res.status(400).send(`Status 400: Account already exists`);
    }
  }

  const ID = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, 10);

  users[ID] = {
    id: ID,
    email: email,
    password: hashedPassword,
  };
  req.session.userID = (ID);
  res.redirect(`/urls`);
});

// PORT LISTENER

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});