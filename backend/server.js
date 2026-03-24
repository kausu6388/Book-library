import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());
app.use(cors());

const SECRET = "mysecretkey";

// 📚 BOOK MODEL
const bookSchema = new mongoose.Schema({
  name: String,
  author: String,
  price: Number,
  userId: String
});

const Book = mongoose.model("Book", bookSchema);

// 👤 USER MODEL
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

// 🔐 AUTH
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send("No token");

    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;

    next();
  } catch {
    res.status(401).send("Invalid token");
  }
};

// 🔑 REGISTER
app.post("/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    email: req.body.email,
    password: hashed
  });

  await user.save();
  res.json({ message: "User registered" });
});

// 🔑 LOGIN
app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User not found");

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).send("Wrong password");

  const token = jwt.sign({ id: user._id }, SECRET);
  res.json({ token });
});

// 🔍 GET BOOKS WITH SEARCH
app.get("/books", auth, async (req, res) => {
  const search = req.query.search || "";

  const books = await Book.find({
    userId: req.userId,
    name: { $regex: search, $options: "i" }
  });

  res.json(books);
});

// ➕ ADD BOOK
app.post("/books", auth, async (req, res) => {
  const book = new Book({
    ...req.body,
    userId: req.userId
  });

  await book.save();
  res.json(book);
});

// ❌ DELETE
app.delete("/books/:id", auth, async (req, res) => {
  await Book.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId
  });

  res.send("Deleted");
});

// ✏️ UPDATE
app.put("/books/:id", auth, async (req, res) => {
  const updated = await Book.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );

  res.json(updated);
});

// 🚀 START
const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb+srv://admin:admin123@cluster0.ffn2gxe.mongodb.net/libraryDB")
.then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log("Server running"));
});