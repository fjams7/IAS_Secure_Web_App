const express  = require('express');
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

// TODO: Add session middleware for authentication (Checkpoint 2)
// TODO: Add security headers (Checkpoint 2)

/* ══════════════════════════════════════════════════════════════════
   ROUTES
   ══════════════════════════════════════════════════════════════════ */
app.use('/', routes);

/* ══════════════════════════════════════════════════════════════════
   STARTUP
   ══════════════════════════════════════════════════════════════════ */
async function bootstrap() {
  // 1. Initialise database
  const { needsAdminSeed } = await initDB();
  const queries = getQueries();

  // 2. Seed a default admin if the DB is brand-new
  // TODO: Hash password with bcrypt (Checkpoint 2)
  if (needsAdminSeed) {
    // WARNING: Storing plaintext password for now - MUST FIX in Checkpoint 2!
    queries.insertUser.run('admin', 'admin@example.com', 'admin123!', 'admin');
    console.log('✅  Seeded default admin  →  username: admin  |  password: admin123!');
    console.log('⚠️  WARNING: Password is stored in PLAINTEXT - needs hashing!');
  }

  // 3. Start the HTTP server
  app.listen(PORT, () => {
    console.log(`🚀  User Management System running on http://localhost:${PORT}`);
    console.log('    • Login      →  /login');
    console.log('    • Register   →  /register');
    console.log('    • Admin panel →  /admin');
    console.log('');
    console.log('⚠️  CHECKPOINT 1 - Basic features only:');
    console.log('    ✅ Login + Registration');
    console.log('    ✅ Role-Based Access (Admin / User)');
    console.log('    ✅ Input validation (SQL Injection & XSS prevention)');
    console.log('');
    console.log('📝 TODO for Checkpoint 2:');
    console.log('    ❌ Password hashing (bcrypt)');
    console.log('    ❌ Protected routes/pages');
    console.log('    ❌ Session management');
    console.log('    ❌ Password strength meter');
  });
}

bootstrap();
