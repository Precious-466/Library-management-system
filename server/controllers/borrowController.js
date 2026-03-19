const Borrow = require("../models/Borrow");
const Book = require("../models/Book");

// BORROW
exports.borrowBook = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.body;

    const book = await Book.findById(bookId);

    if (!book || !book.available) {
      return res.status(400).json({ msg: "Book not available" });
    }

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

// RETURN
exports.returnBook = async (req, res) => {
  try {
    const { borrowId } = req.body;

    const record = await Borrow.findById(borrowId);

    if (!record || record.returnDate) {
      return res.status(400).json({ msg: "Invalid return request" });
    }

    record.returnDate = new Date();
    await record.save();

    const book = await Book.findById(record.book);
    book.available = true;
    await book.save();

    res.json({ msg: "Book returned successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
