const initSqlJs = require('sql.js');
const path       = require('path');
const fs         = require('fs');

const DB_PATH = path.join(__dirname, 'app.db');

// ─── Module-level state (populated by initDB) ─────────────────────
let db      = null;
let queries = null;

// ─── One-time async bootstrap ─────────────────────────────────────
async function initDB() {
  // 1. Load the sql.js WASM module
  const SQL = await initSqlJs();

  // 2. Open existing file OR create a new one
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // 3. Enable foreign keys
  db.run('PRAGMA foreign_keys = ON;');

  // 4. Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      username    TEXT    NOT NULL UNIQUE,
      email       TEXT    NOT NULL UNIQUE,
      password    TEXT    NOT NULL,
      role        TEXT    NOT NULL DEFAULT 'user' CHECK(role IN ('admin','user')),
      created_at  TEXT    NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at  TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
  `);

  // 5. Persist to disk after every write
  function save() {
    const buffer = Buffer.from(db.export());
    fs.writeFileSync(DB_PATH, buffer);
  }

  // 6. Check whether we need to seed an admin
  const adminRow = db.exec("SELECT 1 FROM users WHERE role = 'admin' LIMIT 1");
  const needsAdminSeed = !(adminRow.length && adminRow[0].values.length);

  // ── Query helpers ────────────────────────────────────────────────
  // sql.js does NOT support db.exec(sql, params) or db.run(sql, params[]).
  // All parameterised queries must use prepare / bind / step / free.

  function getOne(sql, params = []) {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const row  = stmt.step() ? stmt.getAsObject() : undefined;
    stmt.free();
    return row;
  }

  function getAll(sql, params = []) {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    stmt.free();
    return rows;
  }

  function run(sql, params = []) {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    stmt.step();
    stmt.free();
    save();
  }

  // ── Queries object (same .get/.all/.run shape routes.js expects) ─
  queries = {
    insertUser: {
      run: (username, email, password, role) =>
        run('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, password, role])
    },
    findByUsername: {
      get: (username) => getOne('SELECT * FROM users WHERE username = ?', [username])
    },
    findByEmail: {
      get: (email) => getOne('SELECT * FROM users WHERE email = ?', [email])
    },
    findById: {
      get: (id) => getOne('SELECT * FROM users WHERE id = ?', [id])
    },
    getAllUsers: {
      all: () => getAll('SELECT id, username, email, role, created_at, updated_at FROM users ORDER BY created_at DESC')
    },
    updateUser: {
      run: (username, email, role, id) =>
        run("UPDATE users SET username = ?, email = ?, role = ?, updated_at = datetime('now', 'localtime') WHERE id = ?",
            [username, email, role, id])
    },
    updatePassword: {
      run: (password, id) =>
        run("UPDATE users SET password = ?, updated_at = datetime('now', 'localtime') WHERE id = ?",
            [password, id])
    },
    deleteUser: {
      run: (id) => run('DELETE FROM users WHERE id = ?', [id])
    },
    userCount: {
      get: () => getOne('SELECT COUNT(*) as count FROM users')
    }
  };

  return { needsAdminSeed };
}

function getQueries() { return queries; }
function getDb()      { return db;      }

module.exports = { initDB, getQueries, getDb };
