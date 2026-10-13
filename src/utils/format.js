/** Small formatting helpers shared across the command center. */

export const isValidDate = (value) => {
  if (!value) return false;
  const date = value?.toDate ? value.toDate() : new Date(value);
  return !Number.isNaN(date.getTime());
};

export const toDate = (value) => {
  if (!value) return null;
  if (typeof value?.toDate === 'function') return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const pad = (n) => String(n).padStart(2, '0');

/** e.g. 07 Oct 2026, 18:42 */
export const formatDateTime = (value) => {
  const date = toDate(value);
  if (!date) return '—';
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${pad(date.getDate())} ${months[date.getMonth()]} ${date.getFullYear()}, ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
};

export const formatDate = (value) => {
  const date = toDate(value);
  if (!date) return '—';
  return formatDateTime(date).split(',')[0];
};

/** e.g. 18:42:07.481 */
export const formatClock = (value = new Date()) => {
  const date = toDate(value) || new Date();
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${String(
    date.getMilliseconds(),
  ).padStart(3, '0')}`;
};

/** Human "time ago" for the activity feed. */
export const timeAgo = (value) => {
  const date = toDate(value);
  if (!date) return '—';
  const diff = Math.max(0, Date.now() - date.getTime());
  const seconds = Math.floor(diff / 1000);
  if (seconds < 2) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

/** Upper-case initials for avatars: "Monkey D. Luffy" -> "ML" */
export const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || '??';

export const shortId = (id = '', head = 6, tail = 4) =>
  id.length <= head + tail + 1 ? id : `${id.slice(0, head)}…${id.slice(-tail)}`;

/** A playful "bounty" derived from real activity — never invented data. */
export const bountyFrom = (loginCount = 0) =>
  (Math.max(1, Number(loginCount) || 1) * 1_000_000).toLocaleString('en-US');

export const cn = (...classes) => classes.filter(Boolean).join(' ');
