import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "app", "data");
const booksPath = path.join(dataDir, "books.json");

function readBooks() {
  const raw = fs.readFileSync(booksPath, "utf-8");
  return JSON.parse(raw);
}

// GET ALL BOOKS
//http://localhost:3000/api/books
export async function GET() {
  const data = readBooks();
  return Response.json(data.books);
}

// POST (Protected)
export async function POST(request) {
  try {
  
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid API Key" }),
        { status: 401 }
      );
    }

    const body = await request.json();

    const data = readBooks();
    const books = data.books;

    const newBook = {
      id: String(Date.now()),
      ...body,
    };

    books.push(newBook);

    fs.writeFileSync(booksPath, JSON.stringify({ books }, null, 2));

    return new Response(JSON.stringify(newBook), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
