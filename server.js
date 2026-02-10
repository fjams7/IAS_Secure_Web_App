const express  = require('express');
const session  = require('express-session');
const bcrypt   = require('bcryptjs');
const { initDB, getQueries } = require('./db');
const routes   = require('./routes');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ══════════════════════════════════════════════════════════════════
   MIDDLEWARE
   ══════════════════════════════════════════════════════════════════ */

// Parse JSON bodies
app.use(express.json());

// Serve static assets (CSS, images, etc.) from /public
app.use(express.static(require('path').join(__dirname, 'public')));

// Session (in-memory store — swap to DB / Redis in production)
app.use(session({
  secret:            'ums_secret_key_change_in_production',
  resave:            false,
  saveUninitialized: false,
  cookie: {
    secure:   process.env.NODE_ENV === 'production',
    httpOnly: true,           // JS can't read the cookie → XSS can't steal it
    sameSite: 'lax'           // CSRF mitigation
  }
}));

// Disable X-Powered-By (hide Express fingerprint)
app.disable('x-powered-by');

// Security headers on every response
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com;"
  );
  next();
});

/* ══════════════════════════════════════════════════════════════════
   ROUTES
   ══════════════════════════════════════════════════════════════════ */
app.use('/', routes);

/* ══════════════════════════════════════════════════════════════════
   STARTUP  —  seed admin if the DB is empty
   ══════════════════════════════════════════════════════════════════ */
async function bootstrap() {
  // 1. Initialise database (creates tables, returns seed flag)
  const { needsAdminSeed } = await initDB();
  const queries = getQueries();

  // 2. Seed a default admin if the DB is brand-new
  if (needsAdminSeed) {
    const hash = await bcrypt.hash('admin123!', 10);     // ← change this default password
    queries.insertUser.run('admin', 'admin@example.com', hash, 'admin');
    console.log('✅  Seeded default admin  →  username: admin  |  password: admin123!');
  }

  // 3. Start the HTTP server
  app.listen(PORT, () => {
    console.log(`🚀  User Management System running on http://localhost:${PORT}`);
    console.log('    • Login      →  /login');
    console.log('    • Register   →  /register');
    console.log('    • Admin panel →  /admin  (admin only)');
  });
}

bootstrap();
