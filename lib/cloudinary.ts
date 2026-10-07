import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "web8vmww",
  api_key: process.env.CLOUDINARY_API_KEY || "898349595447971",
  api_secret: process.env.CLOUDINARY_API_SECRET || "IGju5tzebtnACCVN5HlShNnDwao",
  secure: true,
});

/**
 * Upload an image buffer or base64 data URI to Cloudinary
 */
export async function uploadToCloudinary(
  fileData: string | Buffer,
  folder: string = "ebl-pharmaceutical/products"
): Promise<{ url: string; publicId: string; secureUrl: string }> {
  return new Promise((resolve, reject) => {
    if (Buffer.isBuffer(fileData)) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error("Cloudinary upload failed"));
          }
          resolve({
            url: result.url,
            secureUrl: result.secure_url,
            publicId: result.public_id,
          });
        }
      );
      uploadStream.end(fileData);
    } else {
      cloudinary.uploader.upload(
        fileData,
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error("Cloudinary upload failed"));
          }
          resolve({
            url: result.url,
            secureUrl: result.secure_url,
            publicId: result.public_id,
          });
        }
      );
    }
  });
}

/**
 * Delete a media asset from Cloudinary by public ID
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("Failed to delete from Cloudinary:", error);
    return false;
  }
}

export default cloudinary;
