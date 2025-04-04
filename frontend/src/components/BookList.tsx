import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { fetchBooks } from '../api/BooksAPI';
import Pagination from './Pagination';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [descending, setDescending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks(
          pageSize,
          pageNum,
          sortBy!,
          descending,
          selectedCategories
        );
        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [pageSize, pageNum, sortBy, descending, selectedCategories]);

  if (loading) return <p>Loading books...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
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
                  state: { title: b.title, price: b.price, bookID: b.bookID },
                })
              }
            >
              <i className="bi bi-cart"></i> Buy
            </button>
          </div>
        </div>
      ))}
      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1);
        }}
      />
    </>
  );
}

export default BookList;
