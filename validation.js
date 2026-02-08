const xss = require('xss');

// ─── Sanitise a string: strip XSS vectors ─────────────────────────
function sanitize(str) {
  if (typeof str !== 'string') return str;
  // xss lib strips tags/event-handlers; then trim whitespace
  return xss(str, { whiteList: {}, stripIgnoreTag: true, stripIgnoreTagBody: ['script'] }).trim();
}

// ─── Regex Patterns ────────────────────────────────────────────────
const PATTERNS = {
  // alphanumeric + underscore, 3-30 chars
  username: /^[a-zA-Z0-9_]{3,30}$/,
  // basic email
  email:    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  // 8-64 chars password
  password: /^.{8,64}$/
};

// ─── Validate registration payload ────────────────────────────────
function validateRegistration(body) {
  const errors = [];
  const { username, email, password } = body;

  if (!username || !PATTERNS.username.test(sanitize(username))) {
    errors.push('Username must be 3–30 alphanumeric characters or underscores.');
  }
  if (!email || !PATTERNS.email.test(sanitize(email))) {
    errors.push('A valid email address is required.');
  }
  if (!password || !PATTERNS.password.test(password)) {
    errors.push('Password must be between 8 and 64 characters.');
  }
  return errors;
}

// ─── Validate login payload ───────────────────────────────────────
function validateLogin(body) {
  const errors = [];
  const { username, password } = body;

  if (!username || typeof username !== 'string' || !username.trim()) {
    errors.push('Username is required.');
  }
  if (!password || typeof password !== 'string' || !password.trim()) {
    errors.push('Password is required.');
  }
  return errors;
}

// ─── Validate update payload ──────────────────────────────────────
function validateUpdate(body) {
  const errors = [];
  const { username, email, role } = body;

  if (username !== undefined && !PATTERNS.username.test(sanitize(username))) {
    errors.push('Username must be 3–30 alphanumeric characters or underscores.');
  }
  if (email !== undefined && !PATTERNS.email.test(sanitize(email))) {
    errors.push('A valid email address is required.');
  }
  if (role !== undefined && !['admin', 'user'].includes(role)) {
    errors.push('Role must be "admin" or "user".');
  }
  return errors;
}

module.exports = { sanitize, validateRegistration, validateLogin, validateUpdate, PATTERNS };
