const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

// PORT
const PORT = 8080;
// default port 8080

// MIDDLEWARE
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const generateRandomString = function() {
  return Math.floor((1 + Math.random()) * 0x100000).toString(16).substring();
};

// FEED DATA
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
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
    userID: req.cookies['userID']
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    userID: req.cookies['userID']
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
    userID: req.cookies['userID']
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

// POST ROUTE HANDLER

app.post("/urls", (req, res) => { // when new URL receives new submission
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  // add into array with index of shortURL and value of longURL?
  console.log(urlDatabase);  // Log the POST request body to the console
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  // : <- use req.params to pull out input
  // console.log ('shortURL delete -----', shortURL)
  delete urlDatabase[shortURL];
  res.redirect(`/urls/`);
});

app.post("/urls/:shortURL/update", (req, res) => {
  const shortURL = req.params.shortURL;
  // whatever we input
  urlDatabase[shortURL] = req.body.newLongURL;
  res.redirect(`/urls/`);
});

app.post("/login/", (req, res) => {
  // set the cookie here then redirect
  res.cookie('userID', req.body.userID);
  // userID from name in form in header
  res.redirect(`/urls/`);
});

app.post("/logout/", (req, res) => {
  res.clearCookie('userID', req.body.userID);
  // res.clearCookie('name', { path: '/admin' })
  res.redirect(`/urls/`);
});

// PORT LISTENER

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});