import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "app", "data");
const booksPath = path.join(dataDir, "books.json");

function readBooks() {
  const raw = fs.readFileSync(booksPath, "utf-8");
  return JSON.parse(raw);
}
// http://localhost:3000/api/featured

export async function GET() {
  const data = readBooks();
  const books = data.books;

  const featuredBooks = books.filter(book => book.featured === true);

  return new Response(JSON.stringify(featuredBooks), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
