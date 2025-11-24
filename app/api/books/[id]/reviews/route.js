import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "app", "data");
const reviewsPath = path.join(dataDir, "reviews.json");

function readReviews() {
  const raw = fs.readFileSync(reviewsPath, "utf-8");
  return JSON.parse(raw);
}
// http://localhost:3000/api/books/2/reviews
export async function GET(request, context) {
  const { id } = await context.params;

  const data = readReviews();
  const reviews = data.reviews;


  const bookReviews = reviews.filter(r => String(r.bookId) === String(id));

  return new Response(JSON.stringify(bookReviews), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
