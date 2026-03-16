const express = require("express");
const router = express.Router();

const {
  addBook,
  getBooks,
  updateBook,
  deleteBook,
} = require("../controllers/ControllerBook");

router.post("/add", addBook);
router.get("/", getBooks);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

module.exports = router;
