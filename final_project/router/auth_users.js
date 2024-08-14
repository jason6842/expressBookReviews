const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
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
  // Extract ISBN from request URL
  const isbn = req.params.isbn;
  let book = books[isbn]; // Retrieve the book object associated with ISBN

  if (book) {
      const review = req.body.review; // Extract review from the request body
      const reviewId = req.body.reviewId; // Expecting a review ID from the request body

      if (!book.reviews) {
          book.reviews = {}; // Initialize reviews if not already present
      }

      if (review && reviewId) {
          book.reviews[reviewId] = review; // Add or update the review with the given review ID
          res.status(200).send(`Review with ID ${reviewId} added/modified for book with ISBN ${isbn}.`);
      } else {
          res.status(400).send("Review and review ID must be provided.");
      }
  } else {
      // Respond if the book with the specified ISBN is not found
      res.status(404).send("Unable to find book!");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
