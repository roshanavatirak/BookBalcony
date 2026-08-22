/**
 * Transforms Cloudinary image URLs to automatically optimize format, quality, and width.
 * Example input: https://res.cloudinary.com/demo/image/upload/v12345/sample.jpg
 * Output (thumbnail w=400): https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_400,c_limit/v12345/sample.jpg
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url || typeof url !== "string") {
    return url || "";
  }

  // Only transform Cloudinary URLs
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  const { width = 400, quality = "auto", format = "auto", crop = "limit" } = options;
  const transformString = `f_${format},q_${quality},w_${width},c_${crop}/`;

  // Avoid duplicate transformations if already present
  if (url.includes("/f_auto") || url.includes("/w_")) {
    return url;
  }

  return url.replace("/upload/", `/upload/${transformString}`);
}
