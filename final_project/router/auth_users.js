const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    if (username !== "" && username.length > 0) {
        return users.filter((user) => user.username === username).length === 0;
    } else return false;
};

const authenticatedUser = (username, password) => {
    return (
        users.filter((user) => {
            return user.username === username && user.password === password;
        }).length > 0
    );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(404).send({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign(
            {
                data: password,
            },
            "access",
            { expiresIn: 60 * 60 }
        );

        req.session.authorization = {
            accessToken,
            username,
        };
        return res.status(200).send({ message: "User successfully logged in" });
    } else {
        return res
            .status(208)
            .send({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review, rating } = req.body;
    if (!isbn || isNaN(isbn) || !review) {
        return res.status(400).send({
            message: "Error adding review. ISBN or Review not provided",
        });
    }
    const bookByIsbn = books[isbn];
    if (bookByIsbn) {
        const username = req.session.authorization.username;
        const reviewByUsername = bookByIsbn.reviews[username];
        bookByIsbn.reviews[username] = {
            review,
            rating,
            timestamp: Date.now(),
        };
        const message = reviewByUsername ? "Review updated" : "Review added";
        return res.status(200).send({
            message,
        });
    } else {
        return res.status(400).send({ message: "Error adding review." });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
