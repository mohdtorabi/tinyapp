const express = require('express');
const app = express();
const PORT = 8080;
const bcrypt = require('bcrypt');
const { generateRandomString, findUserByEmail, urlsForUser, findUserByID, users, urlDatabase} = require("./helpers");
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const { request } = require('express');
const methodOverride = require('method-override');

app.use(methodOverride('_method'));


app.use(cookieSession({
  name: 'session',
  keys: ["lilduck"],
  maxAge: 24 * 60 * 60 * 1000
}));

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");


//GET and POST login and logout
app.get("/", (req, res) => {
  const userID = req.session.userID;
  if (userID) {
    res.redirect("/urls");
  } else {
    res.redirect("/register");
  }
});

app.get("/login", (req, res) => {
  const templateVars = {user: users[req.session.userID]};
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
  if (!password) {
    return res.status(403).send("Password or username was incorrect!");
  }
  if (bcrypt.compareSync(password, hashedPassword) === false) {
    return res.status(403).send("Password or username was incorrect!");
  }
  
  req.session.userID = foundUser.id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});


//GET and POST register

app.get("/register", (req, res) => {
  const templateVars = {user: users[req.session.userID]};
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
  const foundUser = findUserByEmail(newUser.email, users);
  if (foundUser) {
    
    res.status(400).send("Email has been registered!");
  }
  if (!password) {
    return res.status(403).send("Username or password not found!");
  }
  users[id] = newUser;

  req.session.userID = newUser.id;
  res.redirect("/urls");
});



app.get("/urls", (req, res) => {
  const templateVars = {users: users, user: users[req.session.userID], userURL: urlsForUser(req.session.userID), urls: urlDatabase};
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const newShortURL = generateRandomString();
  const newLongURL = req.body.longURL;
  const user = users[req.session.userID];
  urlDatabase[newShortURL] = {longURL: newLongURL, userID: user.id};
  //const templateVars = { shortURL: newShortURL, longURL: newLongURL, user: users[req.session.userID] };
  res.redirect("/urls");
});



//GET and POST urls/extensions(new, shorturl, u/shorturl, edit, delete)

app.get("/urls/new", (req, res) => {
  const templateVars = {user: users[req.session.userID]};
  if (!users[req.session.userID]) {
    return res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.session.userID]};
  if (!users[req.session.userID]) {
    return res.redirect("/login");
  }
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.put("/urls/:shortURL/edit", (req, res) => {
  const ownerID = urlDatabase[req.params.shortURL]["userID"];
  const userID = req.session.userID;
  if (findUserByID(ownerID, userID)) {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    res.redirect("/urls/");
  } else {
    res.status(403).send("Shorturl does not exist");
  }

});


app.delete("/urls/:shortURL/delete", (req, res) =>{
  const ownerID = urlDatabase[req.params.shortURL]["userID"];
  const userID = req.session.userID;
  if (findUserByID(ownerID, userID)) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    res.status(403).send("Shorturl does not exist");
  }
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//Server listen
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});