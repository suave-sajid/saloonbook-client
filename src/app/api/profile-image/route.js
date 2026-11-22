import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function POST(request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return Response.json({ error: "Sign in to upload a profile photo." }, { status: 401 });
  }
  if (session.user.isBlocked) {
    return Response.json({ error: "Blocked accounts cannot upload a profile photo." }, { status: 403 });
  }

  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Profile image uploads are not configured." },
      { status: 500 },
    );
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (contentLength > MAX_IMAGE_SIZE + 64 * 1024) {
    return Response.json(
      { error: "Choose an image smaller than 5 MB." },
      { status: 413 },
    );
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid image upload." }, { status: 400 });
  }

  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return Response.json({ error: "Choose an image to upload." }, { status: 400 });
  }
  if (!ALLOWED_IMAGE_TYPES.has(image.type)) {
    return Response.json(
      { error: "Use a PNG, JPG or WEBP image." },
      { status: 415 },
    );
  }
  if (image.size > MAX_IMAGE_SIZE) {
    return Response.json(
      { error: "Choose an image smaller than 5 MB." },
      { status: 413 },
    );
  }

  const uploadData = new FormData();
  uploadData.set("image", image, image.name);

  let uploadResponse;
  try {
    uploadResponse = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      { method: "POST", body: uploadData },
    );
  } catch {
    return Response.json(
      { error: "The image hosting service could not be reached." },
      { status: 502 },
    );
  }

  let result;
  try {
    result = await uploadResponse.json();
  } catch {
    return Response.json(
      { error: "The image hosting service returned an invalid response." },
      { status: 502 },
    );
  }

  if (
    !uploadResponse.ok
    || result?.success !== true
    || typeof result?.data?.url !== "string"
  ) {
    return Response.json(
      { error: result?.error?.message || "The image could not be uploaded." },
      { status: 502 },
    );
  }

  return Response.json({ url: result.data.url });
}
