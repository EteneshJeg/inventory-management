import { getDb } from "@/db";
import { items } from "@/db/schema";
import { uploadImage } from "@/lib/cloudinary";
import { desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();
    const allItems = await db.select().from(items).orderBy(desc(items.createdAt));
    return NextResponse.json(allItems);
  } catch (error) {
    console.error("GET /api/items error:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const quantity = parseInt(formData.get("quantity") as string);
    const price = formData.get("price") as string;
    const imageFile = formData.get("image") as File | null;

    let imageUrl: string | null = null;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile);
    }

    const [newItem] = await db
      .insert(items)
      .values({ name, description, category, quantity, price, imageUrl })
      .returning();

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("POST /api/items error:", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
