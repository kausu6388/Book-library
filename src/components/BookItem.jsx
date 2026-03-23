import React from "react";

function BookItem({ book, index, deleteBook }) {
  return (
    <li>
      {book}
      <button onClick={() => deleteBook(index)}>❌</button>
    </li>
  );
}

export default BookItem;