import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, body, topic } = await req.json();

    if (!title || !body) {
      return NextResponse.json({ error: "title and body are required" }, { status: 400 });
    }

    const { adminMessaging } = await import("@/lib/firebase-admin-sdk");

    const message = {
      notification: { title, body },
      topic: topic === "all" ? "all" : `trazago_${topic}`,
    };

    const messageId = await adminMessaging.send(message);
    return NextResponse.json({ messageId });
  } catch (err) {
    console.error("FCM error:", err);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
