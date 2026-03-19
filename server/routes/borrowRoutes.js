const express = require("express");
const router = express.Router();

const {
  borrowBook,
  returnBook,
  getMyBooks,
} = require("../controllers/borrowController");

const auth = require("../middleware/authMiddleware");

// borrow book
router.post("/", auth, borrowBook);

// return book
router.post("/return", auth, returnBook);

// get my borrowed books
router.get("/my", auth, getMyBooks);

module.exports = router;
