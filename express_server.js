const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// PORT
const PORT = 8080;
// default port 8080

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
  // console.log("shortURL -----", shortURL);
  // console.log("longURL -----", longURL);
  // console.log("urlDatabase -----", urlDatabase[shortURL]);
  const templateVars = { longURL: longURL, shortURL: shortURL };
  res.render("urls_show", templateVars);
  // passing templateVars into urls_show
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// POST ROUTE HANDLER

app.post("/urls", (req, res) => { // when new URL receives new submission
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok'
});

// PORT LISTENER

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
