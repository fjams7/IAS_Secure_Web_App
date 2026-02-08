const { shell, authNav } = require('./shell');

function renderRegister() {
  return shell('Register', `
    <div class="auth-wrap">
      <div class="auth-card">
        <div class="card">
          <h2>Create account</h2>
          <p class="sub">Join and get started in seconds</p>
          <div class="alert alert-error"   id="err"></div>
          <div class="alert alert-success" id="ok"></div>

          <div class="form-group">
            <label>Username</label>
            <input type="text" id="username" placeholder="john_doe" oninput="clearAlert()"/>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" id="email" placeholder="john@example.com" oninput="clearAlert()"/>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" id="password" placeholder="••••••••" oninput="clearAlert()"/>
            <!-- TODO: Add password strength meter (Checkpoint 2) -->
          </div>

          <button class="btn btn-primary btn-block mt-1" onclick="register()">Create Account</button>
        </div>
        <p class="auth-footer">Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>

    <script>
      /* ── Helpers ──────────────────────────────────────────── */
      function clearAlert() {
        ['err', 'ok'].forEach(id => {
          const el = document.getElementById(id);
          el.textContent = '';
          el.classList.remove('show');
        });
      }

      function showErr(msg) {
        const el = document.getElementById('err');
        el.textContent = msg;
        el.classList.add('show');
      }

      /* ── Submit ───────────────────────────────────────────── */
      async function register() {
        const el = (id) => document.getElementById(id);
        const [u, e, p] = [el('username').value, el('email').value, el('password').value];
        clearAlert();

        if (!u || !e || !p) { showErr('Fill in all fields.'); return; }

        const r = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: u, email: e, password: p })
        });
        const d = await r.json();

        if (!r.ok) { showErr(d.errors.join(' ')); return; }

        window.location.href = '/dashboard';
      }

      document.addEventListener('keydown', e => { if (e.key === 'Enter') register(); });
    </script>
  `, authNav());
}

module.exports = { renderRegister };