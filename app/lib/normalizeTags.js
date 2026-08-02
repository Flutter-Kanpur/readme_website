/**
 * Ensure blog tags are always a string array (DB may store text/json).
 * Trims, drops empties, dedupes case-insensitively, keeps first casing.
 */
export function normalizeTags(value) {
  let list = [];

  if (Array.isArray(value)) {
    list = value.filter(Boolean).map(String);
  } else if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        list = parsed.filter(Boolean).map(String);
      } else {
        list = value.split(',').map((tag) => tag.trim()).filter(Boolean);
      }
    } catch {
      list = value.split(',').map((tag) => tag.trim()).filter(Boolean);
    }
  }

  const seen = new Set();
  const result = [];
  for (const raw of list) {
    const trimmed = String(raw).trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
  }
  return result;
}
