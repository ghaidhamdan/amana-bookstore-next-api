import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "app", "data");
const booksPath = path.join(dataDir, "books.json");

function readBooks() {
  const raw = fs.readFileSync(booksPath, "utf-8");
  return JSON.parse(raw);
}
//http://localhost:3000/api/books-range?from=2022-01-01&to=2022-12-31

export async function GET(request) {
  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  if (!from || !to) {
    return new Response(JSON.stringify({
      error: "Missing date range. Use: /api/books-range?from=YYYY-MM-DD&to=YYYY-MM-DD"
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = readBooks();
  const books = data.books;

  const fromDate = new Date(from);
  const toDate = new Date(to);

  const filtered = books.filter(book => {
    const publishedDate = new Date(book.datePublished);
    return publishedDate >= fromDate && publishedDate <= toDate;
  });

  return new Response(JSON.stringify(filtered), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
