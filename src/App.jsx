import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    name: "",
    author: "",
    price: ""
  });

  const [editId, setEditId] = useState(null);

  const fetchBooks = async () => {
    const res = await fetch("http://localhost:3000/books");
    const data = await res.json();
    setBooks(data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await fetch(`http://localhost:3000/books/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      setEditId(null);
    } else {
      await fetch("http://localhost:3000/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
    }

    fetchBooks();
    setForm({ name: "", author: "", price: "" });
  };

  const deleteBook = async (id) => {
    await fetch(`http://localhost:3000/books/${id}`, {
      method: "DELETE"
    });
    fetchBooks();
  };

  const editBook = (book) => {
    setForm({
      name: book.name,
      author: book.author,
      price: book.price
    });
    setEditId(book._id);
  };

  return (
    <div className="container">
      <h1 className="title">📚 Book Library</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="form">
        <input
          name="name"
          placeholder="Book Name"
          value={form.name}
          onChange={handleChange}
          className="input"
        />
        <input
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          className="input"
        />
        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="input"
        />
        <button type="submit" className="button">
          {editId ? "Update" : "Add"}
        </button>
      </form>

      <hr />

      {/* LIST */}
      <div className="list">
        {books.map((b) => (
          <div key={b._id} className="card">
            <div>
              <strong>{b.name}</strong>
              <p>{b.author}</p>
              <p>₹{b.price}</p>
            </div>

            <div>
              <button onClick={() => editBook(b)} className="editBtn">
                ✏️
              </button>
              <button onClick={() => deleteBook(b._id)} className="deleteBtn">
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;