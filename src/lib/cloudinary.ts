import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "inventory" }, (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      })
      .end(buffer);
  });
}

export async function deleteImage(imageUrl: string): Promise<void> {
  const parts = imageUrl.split("/");
  const filename = parts[parts.length - 1].split(".")[0];
  const folder = parts[parts.length - 2];
  const publicId = `${folder}/${filename}`;
  await cloudinary.uploader.destroy(publicId);
}
