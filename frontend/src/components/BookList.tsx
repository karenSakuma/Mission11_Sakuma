import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [descending, setDescending] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((cat) => `bookTypes=${encodeURIComponent(cat)}`)
        .join('&');
      const queryParams = new URLSearchParams();
      queryParams.append('pageSize', pageSize.toString());
      queryParams.append('pageNum', pageNum.toString());
      if (sortBy) {
        queryParams.append('sortBy', sortBy);
        queryParams.append('descending', descending.toString());
      }

      const response = await fetch(
        `http://localhost:5056/Book/GetBooks?${queryParams.toString()}${selectedCategories.length ? `&${categoryParams}` : ''}`
      );
      const data = await response.json();
      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(totalItems / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNum, totalItems, sortBy, descending, selectedCategories]);

  return (
    <>
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
      {/*use boostrap to add emojis to each detail on the book card*/}
      {books.map((b) => (
        <div id="bookCard" className="card p-3 shadow-sm">
          <h3 className="card-title">
            <i className="bi bi-book"></i> {b.title}
          </h3>
          <div className="card-body">
            <ul className="list-unstyled">
              <li>
                <i className="bi bi-person-fill"></i> <strong>Author:</strong>{' '}
                {b.author}
              </li>
              <li>
                <i className="bi bi-building"></i> <strong>Publisher:</strong>{' '}
                {b.publisher}
              </li>
              <li>
                <i className="bi bi-upc-scan"></i> <strong>ISBN:</strong>{' '}
                {b.isbn}
              </li>
              <li>
                <i className="bi bi-journal-code"></i>{' '}
                <strong>Classification:</strong> {b.classification}
              </li>
              <li>
                <i className="bi bi-folder"></i> <strong>Category:</strong>{' '}
                {b.category}
              </li>
              <li>
                <i className="bi bi-file-earmark-text"></i>{' '}
                <strong>Page Count:</strong> {b.pageCount}
              </li>
              <li>
                <i className="bi bi-tag-fill text-success"></i>{' '}
                <strong>Price:</strong> ${b.price}
              </li>
            </ul>
            <button
              className="btn btn-success"
              onClick={() =>
                navigate(`/buy/${b.title}/${b.bookID}`, {
                  state: { title: b.title, price: b.price, bookId: b.bookID },
                })
              }
            >
              <i className="bi bi-cart"></i> Buy
            </button>
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
