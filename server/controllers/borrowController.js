const Borrow = require("../models/Borrow");
const Book = require("../models/Book");
const mongoose = require("mongoose");

// BORROW BOOK
exports.borrowBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.body;

    // validate ID
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ msg: "Invalid book ID" });
    }

    const book = await Book.findById(bookId);

    if (!book || !book.available) {
      return res.status(400).json({ msg: "Book not available" });
    }

    // prevent duplicate borrow
    const alreadyBorrowed = await Borrow.findOne({
      user: userId,
      book: bookId,
      returnDate: null,
    });

    if (alreadyBorrowed) {
      return res.status(400).json({ msg: "You already borrowed this book" });
    }

    // max 3 books limit
    const activeBorrows = await Borrow.countDocuments({
      user: userId,
      returnDate: null,
    });

    if (activeBorrows >= 3) {
      return res.status(400).json({ msg: "Limit reached (max 3 books)" });
    }

    const borrow = new Borrow({
      user: userId,
      book: bookId,
    });

    await borrow.save();

    book.available = false;
    await book.save();

    res.json({ msg: "Book borrowed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RETURN BOOK
exports.returnBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const { borrowId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(borrowId)) {
      return res.status(400).json({ msg: "Invalid borrow ID" });
    }

    const record = await Borrow.findById(borrowId);

    if (!record || record.returnDate) {
      return res.status(400).json({ msg: "Invalid return request" });
    }

    // ownership check
    if (record.user.toString() !== userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    record.returnDate = new Date();
    await record.save();

    const book = await Book.findById(record.book);
    if (book) {
      book.available = true;
      await book.save();
    }

    res.json({ msg: "Book returned successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET MY BORROWED BOOKS
exports.getMyBooks = async (req, res) => {
  try {
    const records = await Borrow.find({
      user: req.user.id,
      returnDate: null,
    }).populate("book");

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
