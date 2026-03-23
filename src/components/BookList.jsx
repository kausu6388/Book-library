import React from "react";
import BookItem from "./BookItem";

function BookList({ books, deleteBook }) {
  return (
    <ul>
      {books.map((book, index) => (
        <BookItem
          key={index}
          book={book}
          index={index}
          deleteBook={deleteBook}
        />
      ))}
    </ul>
  );
}

export default BookList;