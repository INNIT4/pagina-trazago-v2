import { NextRequest, NextResponse } from "next/server";
import { getStorage } from "firebase-admin/storage";
import { adminApp } from "@/lib/firebase-admin-sdk";

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const lugarId = (formData.get("lugarId") as string | null) ?? "temp";

    if (!file) {
      return NextResponse.json({ error: "No se recibió ningún archivo." }, { status: 400 });
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Usa JPG, PNG o WebP." },
        { status: 415 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "La imagen no puede superar 10 MB." },
        { status: 413 }
      );
    }

    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!storageBucket) {
      return NextResponse.json({ error: "Storage bucket no configurado." }, { status: 500 });
    }

    const bucket = getStorage(adminApp).bucket(storageBucket);

    // Sanitizar nombre de archivo
    const ext = file.type.split("/")[1].replace("jpeg", "jpg");
    const safeName = file.name
      .replace(/[^a-z0-9._-]/gi, "_")
      .toLowerCase()
      .slice(0, 60);
    const timestamp = Date.now();
    const folderName = lugarId === "nuevo" ? `temp-${timestamp}` : lugarId;
    const storagePath = `lugares/${folderName}/${timestamp}-${safeName}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const bucketFile = bucket.file(storagePath);
    await bucketFile.save(buffer, {
      metadata: { contentType: file.type },
    });
    await bucketFile.makePublic();

    const publicUrl = `https://storage.googleapis.com/${storageBucket}/${storagePath}`;
    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error("upload-image error:", err);
    return NextResponse.json({ error: "Error al subir la imagen." }, { status: 500 });
  }
}
