import { useEffect, useState } from 'react';
import { Book } from './types/Book';

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [descending, setDescending] = useState<boolean>(false);

  useEffect(() => {
    const fetchBooks = async () => {
      const queryParams = new URLSearchParams();
      queryParams.append('pageSize', pageSize.toString());
      queryParams.append('pageNum', pageNum.toString());
      if (sortBy) {
        queryParams.append('sortBy', sortBy);
        queryParams.append('descending', descending.toString());
      }

      const response = await fetch(
        `http://localhost:5056/Book/GetBooks?${queryParams.toString()}`
      );
      const data = await response.json();
      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(totalItems / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNum, totalItems, sortBy, descending]);

  return (
    <>
      <h1>Books</h1>

      {/*when clicked the user can sort alphabetically*/}
      <button
        onClick={() => {
          setSortBy('title');
          setDescending(!descending);
        }}
      >
        Sort by Title {descending ? '(Z → A)' : '(A → Z)'}
      </button>

      <br />
      {/*use boostrap to make each card look nice */}
      {books.map((b) => (
        <div id="bookCard" className="card">
          <h3 className="card-title">{b.title}</h3>
          <div className="card-body">
            <ul className="list-unstyled">
              <li>
                <strong>Author:</strong> {b.author}
              </li>
              <li>
                <strong>Publisher:</strong> {b.publisher}
              </li>
              <li>
                <strong>ISBN:</strong> {b.isbn}
              </li>
              <li>
                <strong>Classification:</strong> {b.classification}
              </li>
              <li>
                <strong>Category:</strong> {b.category}
              </li>
              <li>
                <strong>Page Count:</strong> {b.pageCount}
              </li>
              <li>
                <strong>Price:</strong> {b.price}
              </li>
            </ul>
          </div>
        </div>
      ))}

      {/*disable button according to condition and show what page its on*/}
      <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>
        Previous
      </button>
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => setPageNum(index + 1)}
          disabled={pageNum === index + 1}
        >
          {index + 1}
        </button>
      ))}

      <button
        disabled={pageNum === totalPages}
        onClick={() => setPageNum(pageNum + 1)}
      >
        Next
      </button>
      <br />
      <br />
      <label>Results per page: </label>
      <select
        value={pageSize}
        onChange={(p) => {
          setPageSize(Number(p.target.value));
          setPageNum(1);
        }}
      >
        {/*let user choose how many books to show*/}
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>
    </>
  );
}

export default BookList;
