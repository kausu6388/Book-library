import React from "react";

function BookInput({ input, setInput, addBook }) {
  return (
    <div>
      <input
        type="text"
        placeholder="Enter book name"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={addBook}>Add Book</button>
    </div>
  );
}

export default BookInput;