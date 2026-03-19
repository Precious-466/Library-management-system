require("dotenv").config();

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db"); // import database connection
const bookRoutes = require("./routes/bookRoutes"); // import routes

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/books", bookRoutes); // routes AFTER app is declared

app.get("/", (req, res) => {
  res.send("Library API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

const borrowRoutes = require("./routes/borrowRoutes");

app.use("/api/borrow", borrowRoutes);
