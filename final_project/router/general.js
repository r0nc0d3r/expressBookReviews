const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    const isbn = req.params.isbn;
    if (isNaN(isbn)) {
        return res.status(400).send({ message: "ISBN should be numeric" });
    }
    const bookByIsbn = books[isbn];
    if (bookByIsbn) {
        return res.send(bookByIsbn);
    } else {
        return res.status(400).send({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    const author = req.params.author;
    if (author !== "" && author.length > 0) {
        const bookEntries = Object.entries(books);
        const booksByAuthor = bookEntries.filter(([_, values]) => {
            return values.author.toLowerCase() === author.toLowerCase();
        });
        if (booksByAuthor.length > 0) {
            const books = booksByAuthor.map(([_, values]) => values);
            return res.send(books);
        } else {
            return res.status(400).send({ message: "Book not found" });
        }
    } else {
        return res.status(400).send({ message: "Author should not be blank" });
    }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    const title = req.params.title;
    if (title !== "" && title.length > 0) {
        const bookEntries = Object.entries(books);
        const booksByTitle = bookEntries.filter(([_, values]) => {
            return values.title.toLowerCase() === title.toLowerCase();
        });
        if (booksByTitle.length > 0) {
            const books = booksByTitle.map(([_, values]) => values);
            return res.send(books);
        } else {
            return res.status(400).send({ message: "Book not found" });
        }
    } else {
        return res.status(400).send({ message: "Title should not be blank" });
    }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    const isbn = req.params.isbn;
    if (isNaN(isbn)) {
        return res.status(400).send({ message: "ISBN should be numeric" });
    }
    const bookByIsbn = books[isbn];
    if (bookByIsbn) {
        return res.send(bookByIsbn.reviews);
    } else {
        return res.status(400).send({ message: "No Book found for given ISBN" });
    }
});

module.exports.general = public_users;
