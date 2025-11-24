import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(),"app", "data", "reviews.json");

function readReviews() {
  if (!fs.existsSync(filePath)) return { reviews: [] };
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeReviews(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

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

    const data = readReviews();
    const reviews = data.reviews || [];

    const newReview = {
      id: String(Date.now()),
      ...body,
      date: new Date().toISOString(),
    };

    reviews.push(newReview);
    writeReviews({ reviews });

    return Response.json(
      { message: "Review added successfully", review: newReview },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { error: "Failed to add review" },
      { status: 500 }
    );
  }
}
