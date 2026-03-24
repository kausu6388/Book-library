import { useEffect, useState } from "react";
import "./App.css";

const API = "https://book-library-gaac.onrender.com";

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    name: "",
    author: "",
    price: ""
  });

  const [editId, setEditId] = useState(null);

  // 🔑 TOKEN
  const token = localStorage.getItem("token");

  // 📚 GET BOOKS
  const fetchBooks = async () => {
    try {
      const res = await fetch(`${API}/books`, {
        headers: {
          Authorization: token
        }
      });

      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (token) fetchBooks();
  }, [token]);

  // 📝 INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ ADD / ✏️ UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await fetch(`${API}/books/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          },
          body: JSON.stringify(form)
        });
        setEditId(null);
      } else {
        await fetch(`${API}/books`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          },
          body: JSON.stringify(form)
        });
      }

      fetchBooks();
      setForm({ name: "", author: "", price: "" });

    } catch (err) {
      console.log(err);
    }
  };

  // ❌ DELETE
  const deleteBook = async (id) => {
    try {
      await fetch(`${API}/books/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token
        }
      });

      fetchBooks();
    } catch (err) {
      console.log(err);
    }
  };

  // ✏️ EDIT
  const editBook = (book) => {
    setForm({
      name: book.name,
      author: book.author,
      price: book.price
    });
    setEditId(book._id);
  };

  // 🚫 NO TOKEN UI
  if (!token) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>🔒 Please Login First</h2>
        <p>Token not found</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title">📚 Book Library</h1>

      {/* LOGOUT BUTTON */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
        style={{ marginBottom: "20px", background: "red", color: "white" }}
      >
        Logout
      </button>

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