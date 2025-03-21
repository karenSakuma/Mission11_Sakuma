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
    public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string? sortBy = null, bool descending = false)
    {
        var booksQuery = _context.Books.AsQueryable();

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
}