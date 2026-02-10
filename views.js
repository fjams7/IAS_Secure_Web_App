// ─── Shared CSS & shell ────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #0f1117;
    --card:     #181b24;
    --card-hi:  #1e2230;
    --border:   #2a2f3f;
    --text:     #e2e4e9;
    --text-dim: #7a7f8e;
    --accent:   #6c63ff;
    --accent2:  #a78bfa;
    --danger:   #f0574f;
    --success:  #34d399;
    --warn:     #fbbf24;
    --radius:   10px;
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    line-height: 1.55;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Nav ──────────────────────────────────────────────── */
  nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(15,17,23,.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0 2rem;
    display: flex; align-items: center; justify-content: space-between;
    height: 58px;
  }
  nav .logo { font-weight: 700; font-size: 1.15rem; letter-spacing: -.02em; }
  nav .logo span { color: var(--accent); }
  nav .nav-links { display: flex; gap: 1rem; align-items: center; }
  nav .nav-links a {
    color: var(--text-dim); text-decoration: none; font-size: .9rem;
    padding: .35rem .7rem; border-radius: 6px; transition: background .2s, color .2s;
  }
  nav .nav-links a:hover { background: var(--card-hi); color: var(--text); }
  nav .nav-links a.active { color: var(--accent); background: rgba(108,99,255,.1); }
  nav .nav-links button {
    background: none; border: 1px solid var(--border); color: var(--text-dim);
    padding: .35rem .9rem; border-radius: 6px; cursor: pointer;
    font-family: inherit; font-size: .9rem; transition: .2s;
  }
  nav .nav-links button:hover { border-color: var(--danger); color: var(--danger); }
  nav .badge {
    font-size: .68rem; text-transform: uppercase; letter-spacing: .06em;
    background: rgba(108,99,255,.15); color: var(--accent2);
    padding: .2rem .5rem; border-radius: 99px; margin-left: .4rem;
  }
  nav .badge.admin { background: rgba(167,139,250,.15); color: var(--accent2); }

  /* ── Main layout ─────────────────────────────────────── */
  .page { max-width: 680px; margin: 3rem auto; padding: 0 1.5rem; }
  .page.wide { max-width: 960px; }

  /* ── Cards ───────────────────────────────────────────── */
  .card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 2rem;
  }
  .card h2 { font-size: 1.25rem; margin-bottom: .35rem; }
  .card .sub { color: var(--text-dim); font-size: .88rem; margin-bottom: 1.4rem; }

  /* ── Form ────────────────────────────────────────────── */
  .form-group { margin-bottom: 1.15rem; }
  .form-group label { display: block; font-size: .82rem; color: var(--text-dim); margin-bottom: .35rem; font-weight: 500; text-transform: uppercase; letter-spacing: .04em; }
  .form-group input, .form-group select {
    width: 100%; padding: .6rem .75rem; background: var(--card-hi);
    border: 1px solid var(--border); border-radius: 7px; color: var(--text);
    font-family: inherit; font-size: .92rem; transition: border-color .2s;
  }
  .form-group input:focus, .form-group select:focus { outline: none; border-color: var(--accent); }
  .form-group .hint { font-size: .78rem; color: var(--text-dim); margin-top: .3rem; }

  /* ── Buttons ─────────────────────────────────────────── */
  .btn {
    display: inline-flex; align-items: center; justify-content: center;
    padding: .6rem 1.3rem; border-radius: 7px; border: none;
    font-family: inherit; font-size: .9rem; font-weight: 600; cursor: pointer;
    transition: opacity .2s, transform .08s; user-select: none;
  }
  .btn:active { transform: scale(.97); }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { opacity: .88; }
  .btn-block { width: 100%; }
  .btn-sm { padding: .3rem .7rem; font-size: .8rem; }
  .btn-danger { background: transparent; color: var(--danger); border: 1px solid var(--danger); }
  .btn-danger:hover { background: rgba(240,87,79,.12); }
  .btn-ghost { background: transparent; color: var(--text-dim); border: 1px solid var(--border); }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }

  /* ── Alerts ──────────────────────────────────────────── */
  .alert { border-radius: 7px; padding: .7rem 1rem; font-size: .88rem; margin-bottom: 1rem; display: none; }
  .alert.show { display: block; }
  .alert-error { background: rgba(240,87,79,.1); border: 1px solid rgba(240,87,79,.25); color: var(--danger); }
  .alert-success { background: rgba(52,211,153,.1); border: 1px solid rgba(52,211,153,.25); color: var(--success); }

  /* ── Password strength meter ─────────────────────────── */
  .strength-bar-track { background: var(--card-hi); border-radius: 99px; height: 5px; margin-top: .5rem; overflow: hidden; }
  .strength-bar-fill { height: 100%; width: 0%; border-radius: 99px; transition: width .35s, background .35s; }
  .strength-label { font-size: .75rem; margin-top: .3rem; color: var(--text-dim); transition: color .3s; font-weight: 500; }

  /* ── User table ──────────────────────────────────────── */
  .user-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
  .user-table th {
    text-align: left; font-size: .75rem; text-transform: uppercase;
    letter-spacing: .06em; color: var(--text-dim); border-bottom: 1px solid var(--border);
    padding: .6rem .75rem; font-weight: 600;
  }
  .user-table td { padding: .7rem .75rem; border-bottom: 1px solid rgba(42,47,63,.5); font-size: .9rem; }
  .user-table tr:last-child td { border-bottom: none; }
  .user-table .actions { display: flex; gap: .5rem; }
  .role-badge { font-size: .72rem; padding: .18rem .5rem; border-radius: 99px; font-weight: 600; }
  .role-badge.admin { background: rgba(167,139,250,.15); color: var(--accent2); }
  .role-badge.user  { background: rgba(108,99,255,.12); color: var(--accent); }

  /* ── Profile grid ────────────────────────────────────── */
  .profile-row { display: flex; justify-content: space-between; align-items: center; padding: .75rem 0; border-bottom: 1px solid var(--border); }
  .profile-row:last-child { border-bottom: none; }
  .profile-row .label { color: var(--text-dim); font-size: .85rem; }
  .profile-row .value { font-weight: 600; }

  /* ── Modal overlay ───────────────────────────────────── */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.55); z-index: 200; display: none; align-items: center; justify-content: center; }
  .modal-overlay.show { display: flex; }
  .modal { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 1.8rem; width: 90%; max-width: 420px; position: relative; }
  .modal h3 { margin-bottom: .3rem; }
  .modal .sub { color: var(--text-dim); font-size: .85rem; margin-bottom: 1.2rem; }
  .modal-close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: var(--text-dim); font-size: 1.3rem; cursor: pointer; }

  /* ── Auth page centering ─────────────────────────────── */
  .auth-wrap { min-height: calc(100vh - 58px); display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; }
  .auth-card { width: 100%; max-width: 400px; }
  .auth-footer { text-align: center; margin-top: 1.2rem; font-size: .85rem; color: var(--text-dim); }
  .auth-footer a { color: var(--accent); text-decoration: none; }
  .auth-footer a:hover { text-decoration: underline; }

  /* ── Loader spinner ──────────────────────────────────── */
  .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,.25); border-top-color: #fff; border-radius: 50%; animation: spin .5s linear infinite; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Misc ────────────────────────────────────────────── */
  .mt-1 { margin-top: .5rem; }
  .mt-2 { margin-top: 1rem; }
  .flex-gap { display: flex; gap: .6rem; flex-wrap: wrap; }
  .divider { border: none; border-top: 1px solid var(--border); margin: 1.5rem 0; }
`;

function shell(title, bodyInner, activeLink = '', navExtra = '') {
  return `<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>${title} — UserMgmt</title>
    <style>${CSS}</style>
  </head><body>
    <nav>
      <div class="logo">User<span>Mgmt</span></div>
      <div class="nav-links">${navExtra}</div>
    </nav>
    ${bodyInner}
  </body></html>`;
}

function authNav() {
  return `<a href="/login">Login</a><a href="/register">Register</a>`;
}

function userNav(user, active) {
  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    ...(user.role === 'admin' ? [{ href: '/admin', label: 'Admin' }] : []),
    { href: '/profile', label: 'Profile' }
  ];
  const rendered = links.map(l =>
    `<a href="${l.href}" class="${active === l.href ? 'active' : ''}">${l.label}</a>`
  ).join('');
  return `${rendered}<span class="badge ${user.role}">${user.role}</span><button onclick="logout()">Logout</button>`;
}

/* ══════════════════════════════════════════════════════════════════
   PAGES
   ══════════════════════════════════════════════════════════════════ */

function renderLogin() {
  return shell('Login', `
    <div class="auth-wrap"><div class="auth-card">
      <div class="card">
        <h2>Welcome back</h2>
        <p class="sub">Sign in to your account</p>
        <div class="alert alert-error" id="err"></div>
        <div class="form-group"><label>Username</label><input type="text" id="username" autocomplete="username" placeholder="john_doe"/></div>
        <div class="form-group"><label>Password</label><input type="password" id="password" autocomplete="current-password" placeholder="••••••••"/></div>
        <button class="btn btn-primary btn-block mt-1" onclick="login()">Sign In</button>
      </div>
      <p class="auth-footer">No account? <a href="/register">Register</a></p>
    </div></div>
    <script>
      async function login() {
        const el = document.getElementById;
        const [u, p] = [el('username').value, el('password').value];
        el('err').className = 'alert alert-error'; el('err').textContent = '';
        if (!u || !p) { el('err').textContent = 'Fill in both fields.'; el('err').classList.add('show'); return; }
        const r = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username:u, password:p}) });
        const d = await r.json();
        if (!r.ok) { el('err').textContent = d.errors.join(' '); el('err').classList.add('show'); return; }
        window.location.href = '/dashboard';
      }
      document.addEventListener('keydown', e => { if (e.key === 'Enter') login(); });
    </script>
  </div>`, '', authNav());
}

function renderRegister() {
  return shell('Register', `
    <div class="auth-wrap"><div class="auth-card">
      <div class="card">
        <h2>Create account</h2>
        <p class="sub">Join and get started in seconds</p>
        <div class="alert alert-error" id="err"></div>
        <div class="alert alert-success" id="ok"></div>
        <div class="form-group"><label>Username</label><input type="text" id="username" placeholder="john_doe" oninput="clearAlert()"/></div>
        <div class="form-group"><label>Email</label><input type="email" id="email" placeholder="john@example.com" oninput="clearAlert()"/></div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="password" placeholder="••••••••" oninput="checkStrength()"/>
          <div class="strength-bar-track"><div class="strength-bar-fill" id="barFill"></div></div>
          <div class="strength-label" id="strengthLabel">Enter a password</div>
        </div>
        <button class="btn btn-primary btn-block mt-1" onclick="register()">Create Account</button>
      </div>
      <p class="auth-footer">Already have an account? <a href="/login">Login</a></p>
    </div></div>
    <script>
      // ── Live password strength ────────────────────────────
      function checkStrength() {
        const p = document.getElementById('password').value;
        const fill = document.getElementById('barFill');
        const label = document.getElementById('strengthLabel');
        let score = 0;
        if (p.length >= 8)  score++;
        if (p.length >= 12) score++;
        if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;

        const map = [
          { w: '0%',  c: 'var(--border)',  t: 'Enter a password',  tc: 'var(--text-dim)' },
          { w: '20%', c: 'var(--danger)',  t: 'Very weak',         tc: 'var(--danger)' },
          { w: '40%', c: 'var(--danger)',  t: 'Weak',              tc: 'var(--danger)' },
          { w: '60%', c: 'var(--warn)',    t: 'Okay',              tc: 'var(--warn)' },
          { w: '80%', c: 'var(--accent)',  t: 'Strong',            tc: 'var(--accent)' },
          { w: '100%',c: 'var(--success)', t: 'Very strong',       tc: 'var(--success)' }
        ];
        const s = p.length === 0 ? 0 : Math.min(score, 5);
        fill.style.width = map[s].w;
        fill.style.background = map[s].c;
        label.style.color = map[s].tc;
        label.textContent = map[s].t;
      }
      function clearAlert() {
        ['err','ok'].forEach(id => { const e = document.getElementById(id); e.textContent = ''; e.className = e.className.replace('show',''); });
      }

      async function register() {
        const el = document.getElementById;
        const [u, e, p] = [el('username').value, el('email').value, el('password').value];
        clearAlert();
        if (!u || !e || !p) { showErr('Fill in all fields.'); return; }
        const r = await fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username:u, email:e, password:p}) });
        const d = await r.json();
        if (!r.ok) { showErr(d.errors.join(' ')); return; }
        window.location.href = '/dashboard';
      }
      function showErr(msg) { const e = document.getElementById('err'); e.textContent = msg; e.classList.add('show'); }
      document.addEventListener('keydown', e => { if (e.key === 'Enter') register(); });
    </script>
  </div>`, '', authNav());
}

function renderDashboard(user) {
  return shell('Dashboard', `
    <div class="page">
      <div class="card">
        <h2>👋 Hello, <strong>${user.username}</strong></h2>
        <p class="sub">Welcome to your dashboard. Here's a snapshot of your account.</p>
        <div class="profile-row"><span class="label">Username</span><span class="value">${user.username}</span></div>
        <div class="profile-row"><span class="label">Email</span><span class="value">${user.email}</span></div>
        <div class="profile-row"><span class="label">Role</span><span class="value"><span class="role-badge ${user.role}">${user.role}</span></span></div>
        <div class="profile-row"><span class="label">Joined</span><span class="value">${user.created_at}</span></div>
        ${user.role === 'admin' ? `<hr class="divider"/><p style="color:var(--text-dim);font-size:.88rem;">You have <strong style="color:var(--accent2)">admin access</strong>. Use the <a href="/admin" style="color:var(--accent);text-decoration:none">Admin panel</a> to manage users.</p>` : ''}
      </div>
    </div>
    <script>async function logout(){await fetch('/api/auth/logout',{method:'POST'});location.href='/login';}</script>
  `, '/dashboard', userNav(user, '/dashboard'));
}

function renderAdmin(users) {
  const rows = users.map(u => `
    <tr>
      <td>${u.id}</td>
      <td>${u.username}</td>
      <td>${u.email}</td>
      <td><span class="role-badge ${u.role}">${u.role}</span></td>
      <td>${u.created_at}</td>
      <td class="actions">
        <button class="btn btn-ghost btn-sm" onclick="openEdit(${u.id},'${u.username}','${u.email}','${u.role}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteUser(${u.id})">Delete</button>
      </td>
    </tr>
  `).join('');

  return shell('Admin', `
    <div class="page wide">
      <div class="card">
        <h2>User Management</h2>
        <p class="sub">Create, edit, and remove users from the system.</p>
        <div class="alert alert-error" id="err"></div>
        <div class="alert alert-success" id="ok"></div>
        <table class="user-table">
          <thead><tr><th>#</th><th>Username</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody id="tbody">${rows}</tbody>
        </table>
      </div>
    </div>

    <!-- Edit Modal ──────────────────────────────────────── -->
    <div class="modal-overlay" id="editModal">
      <div class="modal">
        <button class="modal-close" onclick="closeModal()">&times;</button>
        <h3>Edit User</h3>
        <p class="sub">Update details below.</p>
        <div class="alert alert-error" id="modalErr"></div>
        <input type="hidden" id="editId"/>
        <div class="form-group"><label>Username</label><input type="text" id="editUsername"/></div>
        <div class="form-group"><label>Email</label><input type="email" id="editEmail"/></div>
        <div class="form-group"><label>Role</label>
          <select id="editRole"><option value="user">User</option><option value="admin">Admin</option></select>
        </div>
        <div class="form-group"><label>New Password <span style="color:var(--text-dim)">(leave blank to keep)</span></label><input type="password" id="editPassword" placeholder="••••••••"/></div>
        <div class="flex-gap mt-2">
          <button class="btn btn-primary btn-sm" onclick="saveEdit()">Save</button>
          <button class="btn btn-ghost btn-sm" onclick="closeModal()">Cancel</button>
        </div>
      </div>
    </div>

    <script>
      async function logout(){await fetch('/api/auth/logout',{method:'POST'});location.href='/login';}

      function openEdit(id,username,email,role){
        document.getElementById('editId').value=id;
        document.getElementById('editUsername').value=username;
        document.getElementById('editEmail').value=email;
        document.getElementById('editRole').value=role;
        document.getElementById('editPassword').value='';
        document.getElementById('modalErr').textContent='';document.getElementById('modalErr').classList.remove('show');
        document.getElementById('editModal').classList.add('show');
      }
      function closeModal(){ document.getElementById('editModal').classList.remove('show'); }
      document.getElementById('editModal').addEventListener('click', e => { if(e.target===e.currentTarget) closeModal(); });

      async function saveEdit(){
        const id = document.getElementById('editId').value;
        const body = {
          username: document.getElementById('editUsername').value,
          email:    document.getElementById('editEmail').value,
          role:     document.getElementById('editRole').value,
          password: document.getElementById('editPassword').value || undefined
        };
        const r = await fetch('/api/users/'+id, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
        const d = await r.json();
        if(!r.ok){ document.getElementById('modalErr').textContent=d.errors.join(' '); document.getElementById('modalErr').classList.add('show'); return; }
        closeModal(); location.reload();
      }

      async function deleteUser(id){
        if(!confirm('Delete this user? This cannot be undone.')) return;
        const r = await fetch('/api/users/'+id, { method:'DELETE' });
        const d = await r.json();
        if(!r.ok){ document.getElementById('err').textContent=d.errors.join(' '); document.getElementById('err').classList.add('show'); return; }
        document.getElementById('ok').textContent=d.message; document.getElementById('ok').classList.add('show');
        location.reload();
      }
    </script>
  `, '/admin', userNav(users[0] ? { username: '', role: 'admin' } : {}, '/admin'));  // nav uses session, we pass a placeholder
}

function renderProfile(user) {
  return shell('Profile', `
    <div class="page">
      <div class="card">
        <h2>Your Profile</h2>
        <p class="sub">View and update your password.</p>
        <div class="alert alert-error" id="err"></div>
        <div class="alert alert-success" id="ok"></div>
        <div class="profile-row"><span class="label">Username</span><span class="value">${user.username}</span></div>
        <div class="profile-row"><span class="label">Email</span><span class="value">${user.email}</span></div>
        <div class="profile-row"><span class="label">Role</span><span class="value"><span class="role-badge ${user.role}">${user.role}</span></span></div>
        <div class="profile-row"><span class="label">Joined</span><span class="value">${user.created_at}</span></div>
        <hr class="divider"/>
        <h3 style="margin-bottom:.8rem">Change Password</h3>
        <div class="form-group"><label>Current Password</label><input type="password" id="curPass" placeholder="••••••••"/></div>
        <div class="form-group">
          <label>New Password</label>
          <input type="password" id="newPass" placeholder="••••••••" oninput="checkStrength()"/>
          <div class="strength-bar-track"><div class="strength-bar-fill" id="barFill"></div></div>
          <div class="strength-label" id="strengthLabel">Enter a password</div>
        </div>
        <button class="btn btn-primary btn-sm mt-1" onclick="changePassword()">Update Password</button>
      </div>
    </div>
    <script>
      async function logout(){await fetch('/api/auth/logout',{method:'POST'});location.href='/login';}
      function checkStrength() {
        const p = document.getElementById('newPass').value;
        const fill = document.getElementById('barFill');
        const label = document.getElementById('strengthLabel');
        let score = 0;
        if (p.length >= 8)  score++;
        if (p.length >= 12) score++;
        if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        const map = [
          { w:'0%',  c:'var(--border)',  t:'Enter a password',  tc:'var(--text-dim)' },
          { w:'20%', c:'var(--danger)',  t:'Very weak',         tc:'var(--danger)' },
          { w:'40%', c:'var(--danger)',  t:'Weak',              tc:'var(--danger)' },
          { w:'60%', c:'var(--warn)',    t:'Okay',              tc:'var(--warn)' },
          { w:'80%', c:'var(--accent)',  t:'Strong',            tc:'var(--accent)' },
          { w:'100%',c:'var(--success)', t:'Very strong',       tc:'var(--success)' }
        ];
        const s = p.length === 0 ? 0 : Math.min(score, 5);
        fill.style.width=map[s].w; fill.style.background=map[s].c;
        label.style.color=map[s].tc; label.textContent=map[s].t;
      }
      async function changePassword(){
        const cur=document.getElementById('curPass').value;
        const nw =document.getElementById('newPass').value;
        document.getElementById('err').classList.remove('show');
        document.getElementById('ok').classList.remove('show');
        if(!cur||!nw){document.getElementById('err').textContent='Fill in both fields.';document.getElementById('err').classList.add('show');return;}
        const r=await fetch('/api/profile/password',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({currentPassword:cur,newPassword:nw})});
        const d=await r.json();
        if(!r.ok){document.getElementById('err').textContent=d.errors.join(' ');document.getElementById('err').classList.add('show');return;}
        document.getElementById('ok').textContent=d.message;document.getElementById('ok').classList.add('show');
        document.getElementById('curPass').value='';document.getElementById('newPass').value='';checkStrength();
      }
    </script>
  `, '/profile', userNav(user, '/profile'));
}

module.exports = { renderLogin, renderRegister, renderDashboard, renderAdmin, renderProfile };
