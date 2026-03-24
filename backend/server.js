import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());
app.use(cors());

// 🔐 SECRET KEY
const SECRET = "mysecretkey";

// ======================
// 📚 BOOK MODEL
// ======================
const bookSchema = new mongoose.Schema({
  name: String,
  author: String,
  price: Number,
  userId: String   // 🔥 user-wise data
});

const Book = mongoose.model("Book", bookSchema);

// ======================
// 👤 USER MODEL
// ======================
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

// ======================
// 🔐 AUTH MIDDLEWARE
// ======================
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) return res.status(401).send("No token");

    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;

    next();
  } catch (err) {
    res.status(401).send("Invalid token");
  }
};

// ======================
// 🔑 REGISTER
// ======================
app.post("/register", async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      email: req.body.email,
      password: hashed
    });

    await user.save();

    res.json({ message: "User registered" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ======================
// 🔑 LOGIN
// ======================
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(400).send("User not found");

    const valid = await bcrypt.compare(req.body.password, user.password);

    if (!valid) return res.status(400).send("Wrong password");

    const token = jwt.sign({ id: user._id }, SECRET);

    res.json({ token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ======================
// 📚 GET BOOKS (USER BASED)
// ======================
app.get("/books", auth, async (req, res) => {
  try {
    const books = await Book.find({ userId: req.userId });
    res.json(books);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ======================
// ➕ ADD BOOK
// ======================
app.post("/books", auth, async (req, res) => {
  try {
    const book = new Book({
      ...req.body,
      userId: req.userId
    });

    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ======================
// ❌ DELETE BOOK
// ======================
app.delete("/books/:id", auth, async (req, res) => {
  try {
    await Book.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    res.send("Deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ======================
// ✏️ UPDATE BOOK
// ======================
app.put("/books/:id", auth, async (req, res) => {
  try {
    const updated = await Book.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ======================
// 🚀 CONNECT DB + START
// ======================
const PORT = process.env.PORT || 3000;

mongoose
  .connect("mongodb+srv://admin:admin123@cluster0.ffn2gxe.mongodb.net/libraryDB")
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));