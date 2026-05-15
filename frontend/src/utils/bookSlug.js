/**
 * Creates a URL-friendly slug from a book title + MongoDB ID.
 * Example: "The Great Gatsby" + "64abc123def" → "the-great-gatsby-64abc123def"
 *
 * @param {string} title - The book title
 * @param {string} id - The MongoDB ObjectId
 * @returns {string} URL slug with ID appended
 */
export const createBookSlug = (title, id) => {
  if (!title || !id) return id || '';

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')   // remove special chars
    .replace(/\s+/g, '-')           // spaces → hyphens
    .replace(/-+/g, '-')            // collapse multiple hyphens
    .replace(/^-|-$/g, '')          // trim leading/trailing hyphens
    .substring(0, 80);              // limit length

  return `${slug}-${id}`;
};

/**
 * Extracts the MongoDB ObjectId from a slug-based URL param.
 * Handles both new slug format ("book-title-64abc123def456789abcdef")
 * and old plain ID format ("64abc123def456789abcdef") for backward compatibility.
 *
 * @param {string} slugOrId - The URL parameter (slug or plain ID)
 * @returns {string} The MongoDB ObjectId
 */
export const extractIdFromSlug = (slugOrId) => {
  if (!slugOrId) return '';

  // If the entire param is a valid 24-char hex ObjectId (old format), return as-is
  if (/^[0-9a-fA-F]{24}$/.test(slugOrId)) {
    return slugOrId;
  }

  // Extract the last 24 hex characters (the MongoDB ObjectId appended to slug)
  const match = slugOrId.match(/([0-9a-fA-F]{24})$/);
  return match ? match[1] : slugOrId;
};

/**
 * Creates a full book detail path.
 * @param {string} title - The book title
 * @param {string} id - The MongoDB ObjectId
 * @returns {string} Full path like "/view-book-details/the-great-gatsby-64abc..."
 */
export const getBookDetailPath = (title, id) => {
  return `/view-book-details/${createBookSlug(title, id)}`;
};
