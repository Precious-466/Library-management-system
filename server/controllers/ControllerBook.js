const Book = require("../models/Book");

// CREATE BOOK
exports.addBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL BOOKS
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE BOOK
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE BOOK
exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
