import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "app", "data");
const reviewsPath = path.join(dataDir, "reviews.json");

function readReviews() {
  const raw = fs.readFileSync(reviewsPath, "utf-8");
  return JSON.parse(raw);
}

export async function GET(request, context) {
  const { id } = await context.params;

  const data = readReviews();
  const reviews = data.reviews;

  // فلترة المراجعات حسب رقم الكتاب
  const bookReviews = reviews.filter(r => String(r.bookId) === String(id));

  return new Response(JSON.stringify(bookReviews), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
