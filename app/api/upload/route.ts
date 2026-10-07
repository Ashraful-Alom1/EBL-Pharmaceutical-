import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const folder = (formData.get("folder") as string) || "ebl-pharmaceutical/media";

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await uploadToCloudinary(buffer, folder);

      return NextResponse.json({
        success: true,
        url: result.secureUrl,
        publicId: result.publicId,
      });
    }

    if (contentType.includes("application/json")) {
      const body = await request.json();
      const { data, folder = "ebl-pharmaceutical/media" } = body;

      if (!data) {
        return NextResponse.json({ error: "No image data provided" }, { status: 400 });
      }

      const result = await uploadToCloudinary(data, folder);

      return NextResponse.json({
        success: true,
        url: result.secureUrl,
        publicId: result.publicId,
      });
    }

    return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
