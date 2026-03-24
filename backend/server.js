import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

const app = express();
app.use(express.json());
app.use(cors());

const SECRET = "mysecretkey";

// 📚 Book Schema
const bookSchema = new mongoose.Schema({
  name: String,
  author: String,
  price: Number,
});

const Book = mongoose.model("Book", bookSchema);

// ================= BOOK ROUTES =================

// GET
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST
app.post("/books", async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE
app.delete("/books/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.send("Deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// UPDATE
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

// ================= AUTH =================

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });

    await user.save();

    res.json({ message: "User created" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Wrong password");

    const token = jwt.sign({ id: user._id }, SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ================= SERVER =================

const PORT = process.env.PORT || 3000;

mongoose
  .connect("mongodb+srv://admin:admin123@cluster0.ffn2gxe.mongodb.net/libraryDB")
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("MongoDB error:", err));