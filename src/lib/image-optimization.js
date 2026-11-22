const optimizedRemoteHosts = new Set([
  "images.unsplash.com",
  "i.ibb.co",
  "lh3.googleusercontent.com",
]);

const fallbackImage = "/avatar-default.svg";

function isLoopbackHost(hostname) {
  const host = hostname.toLowerCase();
  return host === "localhost"
    || host.endsWith(".localhost")
    || host.startsWith("127.")
    || host === "[::1]";
}

export function getImageSource(src) {
  if (typeof src !== "string" || !src.trim()) return fallbackImage;

  try {
    const url = new URL(src);
    if (isLoopbackHost(url.hostname)) return fallbackImage;
  } catch {
    return src;
  }

  return src;
}

export function getImageValue(src) {
  if (typeof src !== "string" || !src.trim()) return "";

  try {
    if (isLoopbackHost(new URL(src).hostname)) return "";
  } catch {
    return src;
  }

  return src;
}

export function shouldOptimizeImage(src) {
  src = getImageSource(src);
  if (typeof src !== "string" || !src.trim()) return false;
  if (src.startsWith("/") && !src.startsWith("//")) return true;

  try {
    const url = new URL(src);
    return url.protocol === "https:" && optimizedRemoteHosts.has(url.hostname);
  } catch {
    return false;
  }
}
