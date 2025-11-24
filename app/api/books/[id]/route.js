import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "app", "data");
const booksPath = path.join(dataDir, "books.json");

function readBooks() {
  const raw = fs.readFileSync(booksPath, "utf-8");
  return JSON.parse(raw);
}
// http://localhost:3000/api/books/1
export async function GET(request, context) {
  const { id } = await context.params;

  const data = readBooks();

  // data = { books: [...] }
  const books = data.books;

  if (!Array.isArray(books)) {
    return new Response(JSON.stringify({ error: "Books data is not an array!" }), {
      status: 500,
    });
  }

  const book = books.find((b) => String(b.id) === String(id));

  if (!book) {
    return new Response(JSON.stringify({ error: "Book not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(book), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
