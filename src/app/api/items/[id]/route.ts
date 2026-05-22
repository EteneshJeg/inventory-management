import { db } from "@/db";
import { items } from "@/db/schema";
import { deleteImage, uploadImage } from "@/lib/cloudinary";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const quantity = parseInt(formData.get("quantity") as string);
    const price = formData.get("price") as string;
    const imageFile = formData.get("image") as File | null;
    const existingImageUrl = formData.get("existingImageUrl") as string | null;

    let imageUrl: string | null = existingImageUrl;

    if (imageFile && imageFile.size > 0) {
      if (existingImageUrl) {
        await deleteImage(existingImageUrl).catch(() => {});
      }
      imageUrl = await uploadImage(imageFile);
    }

    const [updatedItem] = await db
      .update(items)
      .set({ name, description, category, quantity, price, imageUrl })
      .where(eq(items.id, parseInt(id)))
      .returning();

    if (!updatedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("PUT /api/items/[id] error:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const [item] = await db.select().from(items).where(eq(items.id, parseInt(id)));
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (item.imageUrl) {
      await deleteImage(item.imageUrl).catch(() => {});
    }

    await db.delete(items).where(eq(items.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/items/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
