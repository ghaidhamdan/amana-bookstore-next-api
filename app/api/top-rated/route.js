import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "app", "data");
const booksPath = path.join(dataDir, "books.json");

function readBooks() {
  const raw = fs.readFileSync(booksPath, "utf-8");
  return JSON.parse(raw);
}
 // http://localhost:3000/api/top-rated
export async function GET() {
  const data = readBooks();
  const books = data.books;

  
  const scoredBooks = books.map(book => ({
    ...book,
    score: book.rating * book.reviewCount
  }));


  scoredBooks.sort((a, b) => b.score - a.score);


  const top10 = scoredBooks.slice(0, 10);

  return new Response(JSON.stringify(top10), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
