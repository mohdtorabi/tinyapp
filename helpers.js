//Functions to be exported
const findUserByEmail = (email, users) => {
  for (const user in users) {
    const userID = users[user];
    if (userID.email === email) {
      return userID;
    }
  }
  return null;
};

const generateRandomString = () => {
  let result = '';
 
  let alphanumeric = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 6; i > 0; --i) {
    result += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
  }
  
  return result;
};

const urlsForUser = (id) => {
  let userDataBase = {};
  for (const shortURL in urlDatabase) {
    
    if (urlDatabase[shortURL].userID === id) {
      userDataBase[shortURL] = {longURL: urlDatabase[shortURL].longURL, userID: id};
    }
  }
  
  return userDataBase;
};

//DATABASE
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID:"userRandomID"},
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "123"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};


module.exports = {findUserByEmail, generateRandomString,urlsForUser, users, urlDatabase};