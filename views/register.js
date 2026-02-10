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
            <div style="position:relative;">
              <input type="password" id="password" placeholder="••••••••" oninput="checkStrength()"/>
            </div>
            <div class="strength-bar-track">
              <div class="strength-bar-fill" id="barFill"></div>
            </div>
            <div class="strength-label" id="strengthLabel">Enter a password</div>
          </div>

          <button class="btn btn-primary btn-block mt-1" onclick="register()">Create Account</button>
        </div>
        <p class="auth-footer">Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>

    <script>
      /* ── Live password strength meter ─────────────────────── */
      function checkStrength() {
        const p     = document.getElementById('password').value;
        const fill  = document.getElementById('barFill');
        const label = document.getElementById('strengthLabel');

        let score = 0;
        if (p.length >= 8)                          score++;
        if (p.length >= 12)                         score++;
        if (/[A-Z]/.test(p) && /[a-z]/.test(p))    score++;
        if (/[0-9]/.test(p))                        score++;
        if (/[^A-Za-z0-9]/.test(p))                 score++;

        const map = [
          { w: '0%',   c: 'var(--border)',  t: 'Enter a password', tc: 'var(--text-dim)' },
          { w: '20%',  c: 'var(--danger)',  t: 'Very weak',        tc: 'var(--danger)'  },
          { w: '40%',  c: 'var(--danger)',  t: 'Weak',             tc: 'var(--danger)'  },
          { w: '60%',  c: 'var(--warn)',    t: 'Okay',             tc: 'var(--warn)'    },
          { w: '80%',  c: 'var(--accent)',  t: 'Strong',           tc: 'var(--accent)'  },
          { w: '100%', c: 'var(--success)', t: 'Very strong',      tc: 'var(--success)' }
        ];

        const s = p.length === 0 ? 0 : Math.min(score, 5);
        fill.style.width      = map[s].w;
        fill.style.background = map[s].c;
        label.style.color     = map[s].tc;
        label.textContent     = map[s].t;
      }

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

      document.addEventListener('DOMContentLoaded', () => initToggle('password'));
    </script>
  `, authNav());
}

module.exports = { renderRegister };