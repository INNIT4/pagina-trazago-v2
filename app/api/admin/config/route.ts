import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const { adminRemoteConfig } = await import("@/lib/firebase-admin-sdk");
    const template = await adminRemoteConfig.getTemplate();
    const params = Object.entries(template.parameters ?? {}).map(([key, param]) => ({
      key,
      value: (param.defaultValue as { value?: string })?.value ?? "",
      description: param.description ?? "",
    }));
    return NextResponse.json({ params });
  } catch (err) {
    console.error("Remote config GET error:", err);
    return NextResponse.json({ params: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { key, value } = await req.json();
    const { adminRemoteConfig } = await import("@/lib/firebase-admin-sdk");
    const template = await adminRemoteConfig.getTemplate();

    if (!template.parameters[key]) {
      return NextResponse.json({ error: "Parameter not found" }, { status: 404 });
    }

    template.parameters[key].defaultValue = { value: String(value) };
    await adminRemoteConfig.publishTemplate(template);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Remote config POST error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
