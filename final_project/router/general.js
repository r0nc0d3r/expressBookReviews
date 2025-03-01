const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (username === "" || password === "") {
        return res
            .status(400)
            .send({ message: "Username or password cannot be empty" });
    }
    if (isValid(username)) {
        users.push({ username, password });
        return res.send({ message: "User created successfully" });
    } else {
        return res
            .status(400)
            .send({ message: "Username already exists or its invalid" });
    }
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
    try {
        const bookData = await new Promise((resolve, reject) => {
            setTimeout(() => resolve(books), 100);
        });
        return res.status(200).send({ books: bookData });
    } catch (error) {
        return res.status(500).send({ message: "Error fetching books" });
    }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
    try {
        const isbn = req.params.isbn;
        if (isNaN(isbn)) {
            return res.status(400).send({ message: "ISBN should be numeric" });
        }
        const bookByIsbn = await new Promise((resolve, reject) => {
            setTimeout(() => resolve(books[isbn]), 100);
        });
        if (bookByIsbn) {
            return res.status(200).send(bookByIsbn);
        } else {
            return res.status(400).send({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).send({ message: "Error fetching book" });
    }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
    try {
        const author = req.params.author;
        if (author !== "" && author.length > 0) {
            const booksByAuthor = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    const bookEntries = Object.entries(books);
                    const filteredBooks = bookEntries.filter(([_, values]) => {
                        return (
                            values.author.toLowerCase() === author.toLowerCase()
                        );
                    });
                    resolve(filteredBooks);
                }, 100);
            });
            if (booksByAuthor.length > 0) {
                const books = booksByAuthor.map(([_, values]) => values);
                return res.send(books);
            } else {
                return res.status(400).send({ message: "Book not found" });
            }
        } else {
            return res
                .status(400)
                .send({ message: "Author should not be blank" });
        }
    } catch (error) {
        return res.status(500).send({ message: "Error fetching book" });
    }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
    try {
        const title = req.params.title;
        if (title !== "" && title.length > 0) {
            const booksByTitle = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    const bookEntries = Object.entries(books);
                    const filteredBooks = bookEntries.filter(([_, values]) => {
                        return (
                            values.title.toLowerCase() === title.toLowerCase()
                        );
                    });
                    resolve(filteredBooks);
                }, 100);
            });
            if (booksByTitle.length > 0) {
                const books = booksByTitle.map(([_, values]) => values);
                return res.send(books);
            } else {
                return res.status(400).send({ message: "Book not found" });
            }
        } else {
            return res
                .status(400)
                .send({ message: "Title should not be blank" });
        }
    } catch (error) {
        return res.status(500).send({ message: "Error fetching book" });
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
        return res
            .status(400)
            .send({ message: "No Book found for given ISBN" });
    }
});

module.exports.general = public_users;
