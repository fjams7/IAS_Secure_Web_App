/* ─── shell(title, bodyHTML, navHTML) ─────────────────────────────
   Wraps any page body in the full HTML document.
   CSS is served as a static file; nav is injected by the caller.   */
function shell(title, bodyInner, navExtra = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${title} — UserMgmt</title>
  <link rel="stylesheet" href="/styles.css"/>
  <script src="/togglePassword.js"></script>
</head>
<body>
  <nav>
    <div class="logo">User<span>Mgmt</span></div>
    <div class="nav-links">${navExtra}</div>
  </nav>
  ${bodyInner}
</body>
</html>`;
}

/* ─── Nav fragment: unauthenticated visitors ──────────────────── */
function authNav() {
  return `<a href="/login">Login</a><a href="/register">Register</a>`;
}

/* ─── Nav fragment: logged-in users ───────────────────────────── */
function userNav(user, activePath) {
  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    ...(user.role === 'admin' ? [{ href: '/admin', label: 'Admin' }] : []),
    { href: '/profile',   label: 'Profile'   }
  ];

  const rendered = links
    .map(l => `<a href="${l.href}" class="${activePath === l.href ? 'active' : ''}">${l.label}</a>`)
    .join('');

  return `${rendered}<span class="badge ${user.role}">${user.role}</span><button onclick="logout()">Logout</button>`;
}

/* ─── Shared logout snippet (inlined once per authenticated page) */
const LOGOUT_SCRIPT = `<script>
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    location.href = '/login';
  }
</script>`;

module.exports = { shell, authNav, userNav, LOGOUT_SCRIPT };