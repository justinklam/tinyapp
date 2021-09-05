//------DEPENDENCIES------//

const bcrypt = require('bcrypt');

//------HELPER FUNCTIONS------//

// Function that generates a random string for IDs and shortURLs
const generateRandomString = function() {
  return Math.floor((1 + Math.random()) * 0x100000).toString(16).substring();
};

// Function used to check if email is in the userDatabase
const getUserByEmail = function(email, usersDatabase) {
  for (const userID in usersDatabase) {
    if (usersDatabase[userID].email === email) {
      return userID;
    }
  } 
  return;
};

// Function to check the URLs for each User
const urlsForUser = function(userID, urlDatabase) {
  const filterURLS = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].userID === userID) {
      filterURLS[url] = urlDatabase[url];
    }
  }
  return filterURLS;
};

module.exports = {
  generateRandomString,
  getUserByEmail,
  urlsForUser,
};