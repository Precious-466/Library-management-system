const express = require("express");
const router = express.Router();

const {
  addBook,
  getBooks,
  updateBook,
  deleteBook,
} = require("../controllers/ControllerBook");

const auth = require("../middleware/authMiddleware");

// CREATE book (protected)
router.post("/add", auth, addBook);

// READ books (public)
router.get("/", getBooks);

// UPDATE book (protected)
router.put("/:id", auth, updateBook);

// DELETE book (protected)
router.delete("/:id", auth, deleteBook);

module.exports = router;
