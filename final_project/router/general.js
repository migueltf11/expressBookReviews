const express = require("express");
let books = require("./booksdb.js");
const router = require("../../../nodejs_PracticeProject_AuthUserMgmt/router/friends.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(400).json({ message: "User already exists!" });
    }
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const booksList = new Promise((resolve, reject) => {
    resolve(JSON.stringify(books, null, 4));
  });
  return booksList.then(
    (data) => res.status(200).send(data),
    (err) => console.log("Error search user ", err)
  );
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const validIsbn = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    console.log(books[isbn]);
    resolve(books[isbn]);
  });
  return validIsbn.then(
    (data) => res.status(200).send(data),
    (err) => console.log("Error search user ", err)
  );
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const bookAuthor = new Promise((resolve, reject) => {
    const author = req.params.author;
    const books_items = [];
    for (let i in books) books_items.push(JSON.parse(JSON.stringify(books[i])));
    const filterAuthor = books_items.filter((book) => book.author === author);
    resolve(filterAuthor);
  });
  return bookAuthor.then(
    (data) => res.status(200).send(data),
    (err) => console.log("Error search author ", err)
  );
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const bookTitle = new Promise((resolve, reject) => {
    const title = req.params.title;
    const books_items = [];
    for (let i in books) books_items.push(JSON.parse(JSON.stringify(books[i])));
    const filterTitle = books_items.filter((book) => book.title === title);
    resolve(filterTitle);
  });
  return bookTitle.then(
    (data) => res.status(200).send(data),
    (err) => console.log("Error search title ", err)
  );
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  //console.log(isbn);
  const book = books[isbn];
  console.log(book.reviews);
  return res.status(200).send(book.reviews);
});

public_users.get("/books", function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

module.exports.general = public_users;
