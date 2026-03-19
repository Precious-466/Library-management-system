const express = require("express");
const router = express.Router();

const { borrowBook, returnBook } = require("../controllers/borrowController");
const auth = require("../middleware/authMiddleware");

router.post("/borrow", auth, borrowBook);
router.post("/return", auth, returnBook);

module.exports = router;
