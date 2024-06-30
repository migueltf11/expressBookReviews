const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
       return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {

    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  
  const isbn = req.params.isbn;
  let book = books[isbn];  // Retrieve book object associated with email
  if (book) {  // Check if book exists
    let review = {"username": "test", "review" : req.body.reviews};
    if (review) {
      book["reviews"] = review;
    }
      books[isbn] = book;  // Update book details in 'books' object
      console.log('3- ',books);
      res.send(`review with isBN ${isbn} updated.`);
  } else {
      res.send("Unable to find review!");
  }
});

// DELETE request: Delete a user by email ID
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Extract the isbn parameter from the request URL
  const isbn = req.params.isbn;    
  // Filter the users array to exclude the user with the specified isbn
  book = books[isbn];
  // Send a success message as the response, indicating the user has been deleted
  res.send(`User with the review ${isbn} delete`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
