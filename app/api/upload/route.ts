import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Upload one image to ImgBB (login required). Key stays on the server.
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return Response.json({ message: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ message: "No file provided" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return Response.json({ message: "Only image files are allowed" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return Response.json({ message: "Image must be smaller than 5MB" }, { status: 400 });
  }

  // ImgBB accepts the image as form data
  const imgbbForm = new FormData();
  imgbbForm.append("image", file);
  try {
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      { method: "POST", body: imgbbForm }
    );
    const data = await res.json();
    if (!res.ok || !data?.data?.url) {
      throw new Error(data?.error?.message || "Image upload failed");
    }
    return Response.json({ url: data.data.url });
  } catch (error) {
    return Response.json(
      { message: error instanceof Error ? error.message : "Image upload failed" },
      { status: 502 }
    );
  }
}
