//------DEPENDENCIES------//
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const { generateRandomString, getUserByEmail, urlsForUser } = require('./helper');
const methodOverride = require('method-override')

//------PORT------//
const PORT = 8080;
// default port 8080

//------MIDDLEWARE------//
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: "session",
  keys: ['key1', 'key2']
}));
app.use(methodOverride('X-HTTP-Method-Override'))

//------FEED DATA------//
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

//------GET ROUTE HANDLERS------//

app.get("/", (req, res) => {
  res.redirect(`/urls`);
});

// Prints urlDatabase in .json form
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Prints usersDatabase in .json form
app.get("/users.json", (req, res) => {
  res.json(users);
});

// Handler for Main Page/My URLs page
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlsForUser(req.session.userID, urlDatabase),
    userID: req.session.userID,
    user: users[req.session.userID],
  };
  res.render("urls_index", templateVars);
});

// Handler to render the Create New URL page, redirects to Login if not logged in
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

// Handler to direct to the new shortURL version of the page with Edit funcitonality
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

// Handler to redirect from the associated longURL page from shortURL link
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  // req.params.shortURL takes in what we entered into the field
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

// Renders the New User Sign up page
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.session.userID],
  };
  res.render("registration", templateVars);
});

// Renders the Login page
app.get("/login", (req, res) => {
  const templateVars = {
    // userID: null,
    user: users[req.session.userID],
  };

  if(!req.session.userID) {
    return res.render("login", templateVars);
  }

  return res.redirect("/urls");
});

// Error page redirector for all other pages entered
app.get('*', function(req, res) {
  const templateVars = {
    user: users[req.session.userID],
    error: "Status 404 - Page does not exist. Please click one of the links above to be redirected!"
  };
  return res.status(404).render("error", templateVars);
});

//------POST ROUTE HANDLER------//

// POST handler that adds new RNG shortURLs to the /urls page
app.post("/urls", (req, res) => {

  // Redirect to login page if not logged in
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

// POST handler that allows the deletion of URLs
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  // : <- use req.params to pull out input

  if (req.session.userID === urlDatabase[shortURL].userID) {
    delete urlDatabase[shortURL];
    return res.redirect(`/urls`);
  }

  // Error handler that only allows users to delete their own URLs
  const templateVars = {
    user: users[req.session.userID],
    error: "This URL does not belong to you. You cannot delete this URL!"
  };
  return res.render("error", templateVars);
});

// POST handler that allows the editing of pre-existing URLs
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

// POST handler for Login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userID = getUserByEmail(email, users);

  if (!email || !password) {
    const templateVars = {
      user: null,
      error: "Status 400: Bad Request. A field is empty!"
    };
    return res.status(400).render("error", templateVars);
  }

  if (!userID ||!bcrypt.compareSync(password, users[userID].password)) {
    const templateVars = {
      user: users[req.session.userID],
      error: "Status 403: Bad Request. Credentials are incorrect!"
    };
    return res.status(403).render("error", templateVars);
  }
  req.session.userID = userID;
  return res.redirect(`/urls`);
});

// POST handler to logout and delete cookie
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect(`/urls`);
});

// POST handler for New User registration
app.post("/register/", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userID = getUserByEmail(email, users);

  if (!email || !password) {
    const templateVars = {
      user: users[null],
      error: "Status 400: Bad Request. A field is empty!"
    };
    return res.status(400).render("error", templateVars);
  }

  if (userID) {
    if (users[userID].email === email) {
      const templateVars = {
        user: users[null],
        error: "Status 400: Bad Request. An account with this Email already exists!"
      };
      return res.status(400).render("error", templateVars);
    }
  }

  // ID generator for newUsers
  const ID = generateRandomString();
  // Password Hasher
  const hashedPassword = bcrypt.hashSync(password, 10);
  // SALT - random string that makes the password unpredictable, 10 is the encryption cost factor/Salt round

  users[ID] = {
    id: ID,
    email: email,
    password: hashedPassword,
  };
  req.session.userID = (ID);
  res.redirect(`/urls`);
});

//------PORT LISTENER------//

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});