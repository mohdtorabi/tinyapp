const express = require('express');
const app = express();
const PORT = 8080;

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

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//adding new sumbiteed longURL and assigned random shortURL
app.post("/urls", (req, res) => {
  const newShortURL = generateRandomString();
  const newLongURL = req.body.longURL;
  urlDatabase[newShortURL] = newLongURL;
  const templateVars = { shortURL: newShortURL, longURL: newLongURL};
  res.render("urls_show", templateVars);
});



// deleting the url


//saying hello at hello page.
app.get("/", (req, res) => {
  res.send("Hello!");

});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//bringing html style to urls page
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//bringing html style to new pages
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

//redirected to website
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/edit", (req, res) => {
  console.log(req.body.longURL);
  console.log(req.params.shortURL);
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls/");

});

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