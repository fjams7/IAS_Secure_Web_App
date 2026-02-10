// ─── Require an active session ─────────────────────────────────────
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  // API request (JSON) → 401; browser → redirect login
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.status(401).json({ error: 'Unauthorised — please log in.' });
  }
  return res.redirect('/login');
}

// ─── Require admin role ────────────────────────────────────────────
function requireAdmin(req, res, next) {
  if (req.session && req.session.role === 'admin') return next();
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.status(403).json({ error: 'Forbidden — admin access required.' });
  }
  return res.redirect('/dashboard');
}

// ─── Block direct page access if not authenticated ─────────────────
// Attach to every protected PAGE route (not API).
// Uses the session cookie; works even if someone bookmarks the URL.
function protectPage(req, res, next) {
  if (req.session && req.session.userId) return next();
  return res.redirect('/login');
}

module.exports = { requireAuth, requireAdmin, protectPage };
