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
          <input type="password" id="curPass" placeholder="••••••••"/>
        </div>

        <div class="form-group">
          <label>New Password</label>
          <input type="password" id="newPass" placeholder="••••••••"/>
          <!-- TODO: Add password strength meter (Checkpoint 2) -->
        </div>

        <button class="btn btn-primary btn-sm mt-1" onclick="changePassword()">Update Password</button>
      </div>
    </div>

    ${LOGOUT_SCRIPT}

    <script>
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

        // reset fields
        document.getElementById('curPass').value  = '';
        document.getElementById('newPass').value  = '';
      }
    </script>
  `, userNav(user, '/profile'));
}

module.exports = { renderProfile };