const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// 🔗 MongoDB connect
mongoose.connect("mongodb+srv://admin:admin123@cluster0.ffn2gxe.mongodb.net/libraryDB")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// 📚 Schema
const bookSchema = new mongoose.Schema({
  name: String,
  author: String,
  price: Number
});

const Book = mongoose.model("Book", bookSchema);

// ✅ GET all books
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// ✅ POST new book
app.post("/books", async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.json(book);
});

// ❌ DELETE book
app.delete("/books/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

// update route
app.put("/books/:id", async (req, res) => {
  const updatedBook = await Book.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedBook);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});