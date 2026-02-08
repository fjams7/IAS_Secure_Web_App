const express        = require('express');
const { getQueries }    = require('./db');
const { sanitize, validateRegistration, validateLogin, validateUpdate } = require('./validation');
const { renderLogin, renderRegister, renderDashboard, renderAdmin, renderProfile } = require('./views/index');

const router = express.Router();

/* ══════════════════════════════════════════════════════════════════
   PAGE ROUTES  (return HTML)
   ══════════════════════════════════════════════════════════════════ */

router.get('/', (req, res) => {
  // TODO: Check session and redirect (Checkpoint 2)
  res.redirect('/login');
});

router.get('/login', (req, res) => {
  res.send(renderLogin());
});

router.get('/register', (req, res) => {
  res.send(renderRegister());
});

// TODO: Add protectPage middleware (Checkpoint 2)
router.get('/dashboard', (req, res) => {
  const queries = getQueries();
  // TODO: Get user from session instead of hardcoded ID (Checkpoint 2)
  const user = queries.findById.get(1); // Temporary: assuming user ID 1
  if (!user) return res.redirect('/login');
  res.send(renderDashboard(user));
});

// TODO: Add protectPage + requireAdmin middleware (Checkpoint 2)
router.get('/admin', (req, res) => {
  const queries = getQueries();
  const users = queries.getAllUsers.all();
  res.send(renderAdmin(users));
});

// TODO: Add protectPage middleware (Checkpoint 2)
router.get('/profile', (req, res) => {
  const queries = getQueries();
  // TODO: Get user from session instead of hardcoded ID (Checkpoint 2)
  const user = queries.findById.get(1); // Temporary: assuming user ID 1
  if (!user) return res.redirect('/login');
  res.send(renderProfile(user));
});

/* ══════════════════════════════════════════════════════════════════
   AUTH ROUTES
   ══════════════════════════════════════════════════════════════════ */

// POST /api/auth/register
router.post('/api/auth/register', async (req, res) => {
  try {
    const queries = getQueries();
    const errors = validateRegistration(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const username = sanitize(req.body.username);
    const email    = sanitize(req.body.email);
    const password = req.body.password; // TODO: Hash with bcrypt (Checkpoint 2)

    // Duplicate checks
    if (queries.findByUsername.get(username))
      return res.status(409).json({ errors: ['Username already taken.'] });
    if (queries.findByEmail.get(email))
      return res.status(409).json({ errors: ['Email already registered.'] });

    // WARNING: Storing plaintext password - MUST FIX in Checkpoint 2!
    const hashedPassword = password; // TODO: await bcrypt.hash(password, 10);

    // First registered user becomes admin automatically
    const { count } = queries.userCount.get();
    const role = count === 0 ? 'admin' : 'user';

    queries.insertUser.run(username, email, hashedPassword, role);

    const newUser = queries.findByUsername.get(username);

    // TODO: Create session instead of just returning success (Checkpoint 2)
    return res.status(201).json({ 
      message: 'Registration successful.', 
      role,
      userId: newUser.id  // Temporary: returning ID for testing
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ errors: ['Internal server error.'] });
  }
});

// POST /api/auth/login
router.post('/api/auth/login', async (req, res) => {
  try {
    const queries = getQueries();
    const errors = validateLogin(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const username = sanitize(req.body.username);
    const user     = queries.findByUsername.get(username);

    if (!user) return res.status(401).json({ errors: ['Invalid username or password.'] });

    // TODO: Use bcrypt.compare instead of plaintext comparison (Checkpoint 2)
    const validPassword = req.body.password === user.password; // INSECURE! Plaintext comparison
    if (!validPassword) return res.status(401).json({ errors: ['Invalid username or password.'] });

    // TODO: Create session (Checkpoint 2)
    return res.status(200).json({ 
      message: 'Login successful.', 
      role: user.role,
      userId: user.id  // Temporary: returning ID for testing
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ errors: ['Internal server error.'] });
  }
});

// POST /api/auth/logout
router.post('/api/auth/logout', (req, res) => {
  // TODO: Destroy session (Checkpoint 2)
  res.status(200).json({ message: 'Logged out.' });
});

/* ══════════════════════════════════════════════════════════════════
   CRUD ROUTES  (admin only)
   ══════════════════════════════════════════════════════════════════ */

// GET /api/users  — list all users
// TODO: Add requireAuth + requireAdmin middleware (Checkpoint 2)
router.get('/api/users', (req, res) => {
  const queries = getQueries();
  const users = queries.getAllUsers.all();
  res.json({ users });
});

// PUT /api/users/:id  — update user
// TODO: Add requireAuth + requireAdmin middleware (Checkpoint 2)
router.put('/api/users/:id', async (req, res) => {
  try {
    const queries = getQueries();
    const id   = parseInt(req.params.id, 10);
    const user = queries.findById.get(id);
    if (!user) return res.status(404).json({ errors: ['User not found.'] });

    const errors = validateUpdate(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const username = req.body.username !== undefined ? sanitize(req.body.username) : user.username;
    const email    = req.body.email    !== undefined ? sanitize(req.body.email)    : user.email;
    const role     = req.body.role     !== undefined ? req.body.role               : user.role;

    // Duplicate checks (excluding current user)
    const dupUser  = queries.findByUsername.get(username);
    if (dupUser && dupUser.id !== id) return res.status(409).json({ errors: ['Username already taken.'] });

    const dupEmail = queries.findByEmail.get(email);
    if (dupEmail && dupEmail.id !== id) return res.status(409).json({ errors: ['Email already registered.'] });

    // Prevent removing the last admin
    if (role === 'user' && user.role === 'admin') {
      const admins = queries.getAllUsers.all().filter(u => u.role === 'admin');
      if (admins.length <= 1) return res.status(400).json({ errors: ['Cannot remove the last admin.'] });
    }

    queries.updateUser.run(username, email, role, id);

    // If password provided, update it too
    // TODO: Hash password with bcrypt (Checkpoint 2)
    if (req.body.password && req.body.password.length >= 8) {
      const hashed = req.body.password; // TODO: await bcrypt.hash(req.body.password, 10);
      queries.updatePassword.run(hashed, id);
    }

    const updated = queries.findById.get(id);
    return res.json({ message: 'User updated.', user: { id: updated.id, username: updated.username, email: updated.email, role: updated.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ errors: ['Internal server error.'] });
  }
});

// DELETE /api/users/:id
// TODO: Add requireAuth + requireAdmin middleware (Checkpoint 2)
router.delete('/api/users/:id', (req, res) => {
  try {
    const queries = getQueries();
    const id   = parseInt(req.params.id, 10);
    const user = queries.findById.get(id);
    if (!user) return res.status(404).json({ errors: ['User not found.'] });

    // TODO: Check if trying to delete self (Checkpoint 2)
    
    // Can't delete the last admin
    if (user.role === 'admin') {
      const admins = queries.getAllUsers.all().filter(u => u.role === 'admin');
      if (admins.length <= 1) return res.status(400).json({ errors: ['Cannot delete the last admin.'] });
    }

    queries.deleteUser.run(id);
    return res.json({ message: 'User deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ errors: ['Internal server error.'] });
  }
});

/* ══════════════════════════════════════════════════════════════════
   PROFILE ROUTE
   ══════════════════════════════════════════════════════════════════ */

// TODO: Add requireAuth middleware (Checkpoint 2)
router.put('/api/profile/password', async (req, res) => {
  try {
    const queries = getQueries();
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ errors: ['Both fields are required.'] });
    if (newPassword.length < 8 || newPassword.length > 64) return res.status(400).json({ errors: ['Password must be 8–64 characters.'] });

    // TODO: Get user from session instead of hardcoded ID (Checkpoint 2)
    const user = queries.findById.get(1); // Temporary
    if (!user) return res.status(401).json({ errors: ['Not authenticated.'] });

    // TODO: Use bcrypt.compare (Checkpoint 2)
    const valid = currentPassword === user.password; // INSECURE! Plaintext comparison
    if (!valid) return res.status(401).json({ errors: ['Current password is incorrect.'] });

    // TODO: Hash with bcrypt (Checkpoint 2)
    const hashed = newPassword; // TODO: await bcrypt.hash(newPassword, 10);
    queries.updatePassword.run(hashed, user.id);
    return res.json({ message: 'Password updated.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ errors: ['Internal server error.'] });
  }
});

module.exports = router;
