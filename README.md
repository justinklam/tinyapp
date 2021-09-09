# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Purpose

This project was created and published by Justin Lam (https://github.com/justinklam) as part the learning curriculum at Lighthouse Labs. 

**_BEWARE:_ This project was published for learning purposes. It is _not_ intended for use in production-grade software.**

## Final Product

![login](https://user-images.githubusercontent.com/85145076/132162629-36cf0b6a-04c5-4326-a32b-7aa869696d78.png)
![newUser](https://user-images.githubusercontent.com/85145076/132162633-c242fa91-b82d-40e7-9765-4744b04f1884.png)
![myURLLinks](https://user-images.githubusercontent.com/85145076/132162632-94452415-511e-4d0a-b7b6-f9f613a07f81.png)
![myURLEmpty](https://user-images.githubusercontent.com/85145076/132162631-0860ff5f-72af-43ea-b022-a7de4823e9c3.png)
![edit](https://user-images.githubusercontent.com/85145076/132162626-972260d8-33b8-4bc5-b784-c324caf6bb0a.png)
![error](https://user-images.githubusercontent.com/85145076/132614543-cdf1bd9d-6a81-43b2-81eb-343c2967880d.png)



## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## DEV Dependencies
- Mocha
- Chai
- Nodemon

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## File Structure
#### [**express_server.js**](https://github.com/justinklam/tinyapp/blob/master/express_server.js): 
* This file contains all GET/POST route handlers and EJS renderers.
#### [**helper.js**](https://github.com/justinklam/tinyapp/blob/master/helper.js):
* Contains various helper functions for the project.
* Functions included:
    * generateRandomString(): generates a random string for URLs and userIDs.
    * getUserByEmail(email, usersDatabase): takes in an email and database and returns the userID if the email is in the database.
    * urlsForUser(userID, urlDatabase): takes in a userID and the full urlDatabase and returns the URLs associated with the userID.
#### [**error.ejs**](https://github.com/justinklam/tinyapp/blob/master/views/error.ejs):
* Error handler template.
#### [**login.ejs**](https://github.com/justinklam/tinyapp/blob/master/views/login.ejs):
* Login handler template.
#### [**registration.ejs**](https://github.com/justinklam/tinyapp/blob/master/views/registration.ejs):
* New user handler template.
#### [**urls_index.ejs**](https://github.com/justinklam/tinyapp/blob/master/views/urls_index.ejs):
* Main page displaying URLs template.
#### [**urls_new.ejs**](https://github.com/justinklam/tinyapp/blob/master/views/urls_new.ejs):
* New URL submission template.
#### [**urls_show.ejs**](https://github.com/justinklam/tinyapp/blob/master/views/urls_show.ejs):
* URL edit template.
#### [**_header.ejs**](https://github.com/justinklam/tinyapp/blob/master/views/partials/_header.ejs):
* This file contains the header ejs partial used in all pages.
#### [**helpersTest.js**](https://github.com/justinklam/tinyapp/blob/master/test/helpersTest.js):
* This file contains all Mocha/Chai tests for the Helper functions.