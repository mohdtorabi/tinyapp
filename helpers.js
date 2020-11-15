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

const findUserByID = (ownerID, userID) => {
  if (ownerID === userID) {
    return true;
  }
  return false;
};

const generateRandomString = () => {
  let result = '';
 
  const alphanumeric = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
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
};

const users = {
};


module.exports = {findUserByEmail, generateRandomString,urlsForUser, findUserByID, users, urlDatabase};