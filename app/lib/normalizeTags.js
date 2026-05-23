/**
 * Ensure blog tags are always a string array (DB may store text/json).
 */
export function normalizeTags(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map(String);
  }

  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean).map(String);
      }
    } catch {
      // fall through to comma-separated
    }
    return value.split(',').map((tag) => tag.trim()).filter(Boolean);
  }

  return [];
}
