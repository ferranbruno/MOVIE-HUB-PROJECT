export async function parseJSON(response) {
  // Safely parse a response that may have an empty body or invalid JSON
  if (!response) return null;
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch (err) {
    // If parsing fails, return the raw text so callers can surface it
    return { _raw: text };
  }
}
