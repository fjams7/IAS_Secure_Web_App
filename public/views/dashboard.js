const { shell, userNav, LOGOUT_SCRIPT } = require('./shell');

function renderDashboard(user) {
  return shell('Dashboard', `
    <div class="page">
      <div class="card">
        <h2>👋 Hello, <strong>${user.username}</strong></h2>
        <p class="sub">Welcome to your dashboard. Here's a snapshot of your account.</p>

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

        ${user.role === 'admin' ? `
          <hr class="divider"/>
          <p style="color:var(--text-dim); font-size:.88rem;">
            You have <strong style="color:var(--accent2)">admin access</strong>.
            Use the <a href="/admin" style="color:var(--accent); text-decoration:none">Admin panel</a> to manage users.
          </p>
        ` : ''}
      </div>
    </div>
    ${LOGOUT_SCRIPT}
  `, userNav(user, '/dashboard'));
}

module.exports = { renderDashboard };
