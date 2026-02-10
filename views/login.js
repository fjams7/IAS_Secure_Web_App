const { shell, authNav } = require('./shell');

function renderLogin() {
  return shell('Login', `
    <div class="auth-wrap">
      <div class="auth-card">
        <div class="card">
          <h2>Welcome back</h2>
          <p class="sub">Sign in to your account</p>
          <div class="alert alert-error" id="err"></div>

          <div class="form-group">
            <label>Username</label>
            <input type="text" id="username" autocomplete="username" placeholder="john_doe"/>
          </div>

          <div class="form-group">
            <label>Password</label>
            <div style="position:relative;">
              <input type="password" id="password" placeholder="••••••••"/>
            </div>
          </div>

          <button class="btn btn-primary btn-block mt-1" onclick="login()">Sign In</button>
        </div>
        <p class="auth-footer">No account? <a href="/register">Register</a></p>
      </div>
    </div>

    <script>
      async function login() {
        const el = (id) => document.getElementById(id);
        const [u, p] = [el('username').value, el('password').value];

        el('err').className  = 'alert alert-error';
        el('err').textContent = '';

        if (!u || !p) {
          el('err').textContent = 'Fill in both fields.';
          el('err').classList.add('show');
          return;
        }

        const r = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: u, password: p })
        });
        const d = await r.json();

        if (!r.ok) {
          el('err').textContent = d.errors.join(' ');
          el('err').classList.add('show');
          return;
        }

        window.location.href = '/dashboard';
      }

      document.addEventListener('keydown', e => { if (e.key === 'Enter') login(); });

      document.addEventListener('DOMContentLoaded', () => initToggle('password'));
    </script>
  `, authNav());
}

module.exports = { renderLogin };