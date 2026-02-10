const express        = require('express');
const bcrypt             = require('bcryptjs');
const { getQueries }    = require('./db');
const { sanitize, validateRegistration, validateLogin, validateUpdate } = require('./validation');
const { requireAuth, requireAdmin, protectPage } = require('./middleware');
const { renderLogin, renderRegister, renderDashboard, renderAdmin, renderProfile } = require('./views/index');

const router = express.Router();

/* ══════════════════════════════════════════════════════════════════
   PAGE ROUTES  (return HTML)
   ══════════════════════════════════════════════════════════════════ */

router.get('/', (req, res) => {
  if (req.session && req.session.userId) return res.redirect('/dashboard');
  res.redirect('/login');
});

router.get('/login', (req, res) => {
  if (req.session && req.session.userId) return res.redirect('/dashboard');
  res.send(renderLogin());
});

router.get('/register', (req, res) => {
  if (req.session && req.session.userId) return res.redirect('/dashboard');
  res.send(renderRegister());
});

router.get('/dashboard', protectPage, (req, res) => {
  const queries = getQueries();
  const user = queries.findById.get(req.session.userId);
  res.send(renderDashboard(user));
});

router.get('/admin', protectPage, requireAdmin, (req, res) => {
  const queries = getQueries();
  const users = queries.getAllUsers.all();
  res.send(renderAdmin(users));
});

router.get('/profile', protectPage, (req, res) => {
  const queries = getQueries();
  const user = queries.findById.get(req.session.userId);
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
    const password = req.body.password; // hash, never sanitise passwords

    // Duplicate checks
    if (queries.findByUsername.get(username))
      return res.status(409).json({ errors: ['Username already taken.'] });
    if (queries.findByEmail.get(email))
      return res.status(409).json({ errors: ['Email already registered.'] });

    const hashedPassword = await bcrypt.hash(password, 10);

    // First registered user becomes admin automatically
    const { count } = queries.userCount.get();
    const role = count === 0 ? 'admin' : 'user';

    queries.insertUser.run(username, email, hashedPassword, role);

    const newUser = queries.findByUsername.get(username);

    // Auto-login after registration
    req.session.userId   = newUser.id;
    req.session.username  = newUser.username;
    req.session.role      = newUser.role;

    return res.status(201).json({ message: 'Registration successful.', role });
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

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(401).json({ errors: ['Invalid username or password.'] });

    req.session.userId   = user.id;
    req.session.username  = user.username;
    req.session.role      = user.role;

    return res.status(200).json({ message: 'Login successful.', role: user.role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ errors: ['Internal server error.'] });
  }
});

// POST /api/auth/logout
router.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({ message: 'Logged out.' });
  });
});

/* ══════════════════════════════════════════════════════════════════
   CRUD ROUTES  (admin only)
   ══════════════════════════════════════════════════════════════════ */

// GET /api/users  — list all users
router.get('/api/users', requireAuth, requireAdmin, (req, res) => {
  const queries = getQueries();
  const users = queries.getAllUsers.all();
  res.json({ users });
});

// PUT /api/users/:id  — update user
router.put('/api/users/:id', requireAuth, requireAdmin, async (req, res) => {
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
    if (req.body.password && req.body.password.length >= 8) {
      const hashed = await bcrypt.hash(req.body.password, 10);
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
router.delete('/api/users/:id', requireAuth, requireAdmin, (req, res) => {
  try {
    const queries = getQueries();
    const id   = parseInt(req.params.id, 10);
    const user = queries.findById.get(id);
    if (!user) return res.status(404).json({ errors: ['User not found.'] });

    // Can't delete yourself
    if (id === req.session.userId) return res.status(400).json({ errors: ['You cannot delete your own account.'] });

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
   PROFILE ROUTE  (current user can update own password)
   ══════════════════════════════════════════════════════════════════ */

router.put('/api/profile/password', requireAuth, async (req, res) => {
  try {
    const queries = getQueries();
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ errors: ['Both fields are required.'] });
    if (newPassword.length < 8 || newPassword.length > 64) return res.status(400).json({ errors: ['Password must be 8–64 characters.'] });

    const user = queries.findById.get(req.session.userId);
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ errors: ['Current password is incorrect.'] });

    const hashed = await bcrypt.hash(newPassword, 10);
    queries.updatePassword.run(hashed, req.session.userId);
    return res.json({ message: 'Password updated.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ errors: ['Internal server error.'] });
  }
});

module.exports = router;
