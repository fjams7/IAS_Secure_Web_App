const { shell, userNav, LOGOUT_SCRIPT } = require('./shell');

function renderProfile(user) {
  return shell('Profile', `
    <div class="page">
      <div class="card">
        <h2>Your Profile</h2>
        <p class="sub">View and update your password.</p>
        <div class="alert alert-error"   id="err"></div>
        <div class="alert alert-success" id="ok"></div>

        <div class="profile-row">
          <span class="label">Username</span>
          <span class="value">${user.username}</span>
        </div>
        <div class="profile-row">
          <span class="label">Email</span>
          <span class="value">${user.email}</span>
        </div>
        <div class="profile-row">
          <span class="label">Role</span>
          <span class="value"><span class="role-badge ${user.role}">${user.role}</span></span>
        </div>
        <div class="profile-row">
          <span class="label">Joined</span>
          <span class="value">${user.created_at}</span>
        </div>

        <hr class="divider"/>
        <h3 style="margin-bottom:.8rem">Change Password</h3>

        <div class="form-group">
          <label>Current Password</label>
          <div style="position:relative;">
            <input type="password" id="curPass" placeholder="••••••••"/>
          </div>
        </div>

        <div class="form-group">
          <label>New Password</label>
          <div style="position:relative;">
            <input type="password" id="newPass" placeholder="••••••••" oninput="checkStrength()"/>
          </div>
          <div class="strength-bar-track">
            <div class="strength-bar-fill" id="barFill"></div>
          </div>
          <div class="strength-label" id="strengthLabel">Enter a password</div>
        </div>

        <button class="btn btn-primary btn-sm mt-1" onclick="changePassword()">Update Password</button>
      </div>
    </div>

    ${LOGOUT_SCRIPT}

    <script>
      /* ── Live password strength meter ─────────────────────── */
      function checkStrength() {
        const p     = document.getElementById('newPass').value;
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

      /* ── Submit new password ──────────────────────────────── */
      async function changePassword() {
        const cur = document.getElementById('curPass').value;
        const nw  = document.getElementById('newPass').value;

        document.getElementById('err').classList.remove('show');
        document.getElementById('ok').classList.remove('show');

        if (!cur || !nw) {
          document.getElementById('err').textContent = 'Fill in both fields.';
          document.getElementById('err').classList.add('show');
          return;
        }

        const r = await fetch('/api/profile/password', {
          method:  'PUT',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ currentPassword: cur, newPassword: nw })
        });
        const d = await r.json();

        if (!r.ok) {
          document.getElementById('err').textContent = d.errors.join(' ');
          document.getElementById('err').classList.add('show');
          return;
        }

        document.getElementById('ok').textContent = d.message;
        document.getElementById('ok').classList.add('show');

        // reset fields + meter
        document.getElementById('curPass').value  = '';
        document.getElementById('newPass').value  = '';
        checkStrength();
      }

      document.addEventListener('DOMContentLoaded', () => {
        initToggle('curPass');
        initToggle('newPass');
      });
    </script>
  `, userNav(user, '/profile'));
}

module.exports = { renderProfile };