const { assert } = require('chai');

const { generateRandomString, getUserByEmail, urlsForUser } = require('../helper.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "user3": {
    id: "user3",
    email: "user3@example.com",
    password: "123"
  }
};

const testUrlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
  "9sm5xK": { longURL: "http://www.google.ca", userID: "user2RandomID" },
  "Sa4H9a": { longURL: "http://www.ufc.com", userID: "userRandomID" }
};

describe('generateRandomString', () => {

  it('should return string length of 6', function() {
    const randomString = generateRandomString();
    const expectedOutput = 6;
    assert.strictEqual(randomString.length, expectedOutput);
  });

});

describe('getUserByEmail', () => {

  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    // Write your assert statement here
    assert.strictEqual(user, expectedOutput);
  });

  it('should return undefined with an invalid email', function() {
    const user = getUserByEmail("use@example.com", testUsers);
    // Write your assert statement here
    assert.isUndefined(user);
  });

});

describe('urlsForUser', () => {

  it('should return an object containing the urls that are associated with the user ID provided', function() {
    const urls = urlsForUser("userRandomID", testUrlDatabase);
    const expectedOutput = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
      "Sa4H9a": { longURL: "http://www.ufc.com", userID: "userRandomID" }
    };
    assert.deepInclude(urls, expectedOutput);
    // deepInclude(haystack, needle, [message])
  });

  it('should return an empty object with an id - no attached URLs', function() {
    const urls = urlsForUser("newUser", testUrlDatabase);
    const expectedOutput = {};
    assert.deepInclude(urls, expectedOutput);
  });

});