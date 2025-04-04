using Microsoft.AspNetCore.Mvc;
using Mission11_KarenSakuma.API.Data;

namespace Mission11_KarenSakuma.API.Controllers;

[ApiController]
[Route("[controller]")]

public class BookController : Controller
{
    private BookstoreDbContext _context;
    
    public BookController(BookstoreDbContext temp)
    {
        _context = temp;
    }
    
    //the url will be /Book/GetBooks
    [HttpGet("GetBooks")]
    public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string? sortBy = null, bool descending = false, [FromQuery] List<string> bookTypes = null)
    { 
        var booksQuery = _context.Books.AsQueryable();

        if (bookTypes != null && bookTypes.Any())
        {
            booksQuery = booksQuery.Where(b=> bookTypes.Contains(b.Category));
        }
       

        //make it sortable
        if (!string.IsNullOrEmpty(sortBy))
        {
            if (sortBy.ToLower() == "title")
            {
                booksQuery = descending ? booksQuery.OrderByDescending(b => b.Title) : booksQuery.OrderBy(b => b.Title);
            }
        }
        var totalNumBooks = booksQuery.Count(); //count after sorting but before pagination
          
        var books = booksQuery
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        //return multiple things
        return Ok(new
        {
            Books = books,
            totalNumBooks = totalNumBooks
        });
    }

    [HttpGet("GetBookCategories")]
    public IActionResult GetBookCategories()
    {
        var bookCategories = _context.Books
            .Select(b => b.Category)
            .Distinct()
            .ToList();
        return Ok(bookCategories);
    }

    [HttpPost("AddBook")]
    public IActionResult AddBook([FromBody] Book newBook) 
    {
        _context.Books.Add(newBook);
        _context.SaveChanges();
        return Ok(newBook);
    }


    [HttpPut("UpdatedBook/{bookID}")]
    public IActionResult UpdateBook(int bookID, [FromBody] Book updatedBook) 
    {
        var existingBook = _context.Books.Find(bookID);
        existingBook.Title = updatedBook.Title;
        existingBook.Author = updatedBook.Author;
        existingBook.Publisher = updatedBook.Publisher;
        existingBook.ISBN = updatedBook.ISBN;
        existingBook.Classification= updatedBook.Classification;
        existingBook.Category = updatedBook.Category;
        existingBook.PageCount = updatedBook.PageCount;
        existingBook.Price = updatedBook.Price;

        _context.Books.Update(existingBook);
        _context.SaveChanges();

        return Ok(existingBook);
    }

    [HttpDelete("DeleteBook/{bookID}")]
    public IActionResult DeleteBook(int bookID) 
    {
        var book = _context.Books.Find(bookID);

        if (book == null)
        {
            return NotFound(new {message = "Book not found"});
        }

        _context.Books.Remove(book);
        _context.SaveChanges();

        return NoContent();
    }
}