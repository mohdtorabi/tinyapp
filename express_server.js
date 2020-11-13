const express = require('express');
const app = express();
const PORT = 8080;
const bcrypt = require('bcrypt');
const { generateRandomString, findUserByEmail, urlsForUser, users, urlDatabase} = require("./helpers");
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const { request } = require('express');
const methodOverride = require('method-override');

app.use(methodOverride('_method'));

// .use and .set for packages installed
app.use(cookieSession({
  name: 'session',
  keys: ["lilduck"],
  maxAge: 24 * 60 * 60 * 1000
}));

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");


//GET and POST login and logout
app.get("/login", (req, res) => {
  
  const templateVars = {user: users[req.session.user_ID]};
  res.render("urls_login", templateVars);
});


app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const foundUser = findUserByEmail(email, users);
  if (!foundUser) {
    return res.status(403).send("Password or username was incorrect!");
  }
  if (bcrypt.compareSync(password, hashedPassword) === false) {
    return res.status(403).send("Password or username was incorrect!");
  }
  
  req.session.user_ID = foundUser.id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});


//GET and POST register

app.get("/register", (req, res) => {
  const templateVars = {user: users[req.session.user_ID]};
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: id,
    email: req.body.email,
    password: hashedPassword,
  };
  if (!newUser.email || !newUser.password) {
    res.statusCode = 400;
    return res.send("Email or Password was not found. Please try again!");
  }
  const foundUser = findUserByEmail(newUser.email);
  if (foundUser) {
    
    res.status(400).send("Email has been registered!");
  }
  users[id] = newUser;

  req.session.user_ID = newUser.id;
  res.redirect("/urls");
});



//GET and POST urls
app.get("/urls", (req, res) => {
  //const user = users[req.session];
  //const userURL = urlsForUser(req.session);
  const templateVars = {users: users, user: users[req.session.user_ID], userURL: urlsForUser(req.session.user_ID), urls: urlDatabase};
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const newShortURL = generateRandomString();
  const newLongURL = req.body.longURL;
  const user = users[req.session.user_ID];
  urlDatabase[newShortURL] = {longURL: newLongURL, userID: user.id};
  const templateVars = { shortURL: newShortURL, longURL: newLongURL, user: users[req.session.user_ID] };
  res.render("urls_show", templateVars);
});



//GET and POST urls/extensions(new, shorturl, u/shorturl, edit, delete)

app.get("/urls/new", (req, res) => {
  const templateVars = {user: users[req.session.user_ID]};
  //const email = req.body.email;
  //const foundUser = findUserByEmail(email);
  if (!users[req.session.user_ID]) {
    return res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.session.user_ID]};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.put("/urls/:shortURL/edit", (req, res) => {
  if (urlsForUser(req.session.user_ID)) {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    res.redirect("/urls/");
  }

});

//deleting the urls
app.delete("/urls/:shortURL/delete", (req, res) =>{
  if (urlsForUser(req.session.user_ID)) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  }
});


//GET for JSON
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//Server listen
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});