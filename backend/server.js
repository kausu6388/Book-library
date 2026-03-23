const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 📚 Schema
const bookSchema = new mongoose.Schema({
  name: String,
  author: String,
  price: Number
});

const Book = mongoose.model("Book", bookSchema);

// ✅ ROUTES
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/books", async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.send("Deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/books/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedBook);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 🚀 PORT
const PORT = process.env.PORT || 3000;

// 🔥 IMPORTANT: DB connect FIRST, then start server
mongoose.connect("mongodb+srv://admin:admin123@cluster0.ffn2gxe.mongodb.net/libraryDB")
.then(() => {
  console.log("MongoDB connected");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

})
.catch(err => console.log("MongoDB error:", err));