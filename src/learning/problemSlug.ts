/** Stable id from a LeetCode problem URL (e.g. two-sum). */
export function slugFromLeetcodeUrl(url: string): string {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    const i = parts.indexOf('problems');
    if (i >= 0 && parts[i + 1]) return parts[i + 1];
  } catch {
    /* ignore */
  }
  return url.replace(/\W+/g, '-').replace(/^-|-$/g, '').slice(0, 96) || 'problem';
}
