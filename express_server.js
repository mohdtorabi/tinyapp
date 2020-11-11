const express = require('express');
const app = express();
const PORT = 8080;

const CookieParser = require('cookie-parser');
app.use(CookieParser());

const generateRandomString = () => {
  let result = '';
 
  let alphanumeric = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 6; i > 0; --i) {
    result += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
  }
  
  return result;
};



app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));



//adding new sumbiteed longURL and assigned random shortURL




app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_ID");
  res.redirect("/urls");
});




//saying hello at hello page.
app.get("/", (req, res) => {
  res.send("Hello!");

});
//making new urls
app.get("/urls/new", (req, res) => {
  const templateVars = {user: users[req.cookies["user_ID"]]};
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = {user: users[req.cookies["user_ID"]]};
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const newUser = {
    id: id,
    email: req.body.email,
    password: req.body.password,
  };
  users[id] = newUser;
  console.log(users[id]);
  res.cookie("user_ID", newUser.id);
  res.redirect("/urls");
});

//bringing html style to urls page
app.get("/urls", (req, res) => {
  const user = users[req.cookies["user_ID"]];
  const templateVars = { urls: urlDatabase, user};
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const newShortURL = generateRandomString();
  const newLongURL = req.body.longURL;
  urlDatabase[newShortURL] = newLongURL;
  const templateVars = { shortURL: newShortURL, longURL: newLongURL };
  res.render("urls_show", templateVars);
});

//bringing html style to new pages
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.cookies["user_ID"]]};
  res.render("urls_show", templateVars);
});

//redirected to website
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//updating the urls
app.post("/urls/:shortURL/edit", (req, res) => {
  /* console.log(req.body.longURL);
  console.log(req.params.shortURL); */
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls/");

});

//deleting the urls
app.post("/urls/:shortURL/delete", (req, res) =>{
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});