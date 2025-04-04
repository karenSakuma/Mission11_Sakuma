using Microsoft.EntityFrameworkCore;
using Mission11_KarenSakuma.API.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database Context
builder.Services.AddDbContext<BookstoreDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));

// CORS Configuration
builder.Services.AddCors(options => 
    options.AddPolicy("AllowReactAppBlah",
        policy => {
            policy.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        }));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Apply CORS policy
app.UseCors("AllowReactAppBlah");

//app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers(); 
app.Run();