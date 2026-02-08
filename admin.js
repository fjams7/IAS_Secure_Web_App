const { shell, userNav, LOGOUT_SCRIPT } = require('./shell');

function renderAdmin(users) {
  /* ── build table rows from the users array ─────────────────── */
  const rows = users.map(u => `
    <tr>
      <td>${u.id}</td>
      <td>${u.username}</td>
      <td>${u.email}</td>
      <td><span class="role-badge ${u.role}">${u.role}</span></td>
      <td>${u.created_at}</td>
      <td class="actions">
        <button class="btn btn-ghost btn-sm"  onclick="openEdit(${u.id},'${u.username}','${u.email}','${u.role}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteUser(${u.id})">Delete</button>
      </td>
    </tr>
  `).join('');

  /* ── nav needs a user-shaped object; role comes from session
         but we don't have it here — the first user in the list is
         guaranteed to exist (route guard) and is always an admin
         because only admins can reach /admin.                      */
  const navUser = { role: 'admin' };

  return shell('Admin', `
    <div class="page wide">
      <div class="card">
        <h2>User Management</h2>
        <p class="sub">Create, edit, and remove users from the system.</p>
        <div class="alert alert-error"   id="err"></div>
        <div class="alert alert-success" id="ok"></div>

        <table class="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="tbody">${rows}</tbody>
        </table>
      </div>
    </div>

    <!-- ── Edit Modal ──────────────────────────────────────── -->
    <div class="modal-overlay" id="editModal">
      <div class="modal">
        <button class="modal-close" onclick="closeModal()">&times;</button>
        <h3>Edit User</h3>
        <p class="sub">Update details below.</p>
        <div class="alert alert-error" id="modalErr"></div>

        <input type="hidden" id="editId"/>

        <div class="form-group">
          <label>Username</label>
          <input type="text" id="editUsername"/>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="editEmail"/>
        </div>
        <div class="form-group">
          <label>Role</label>
          <select id="editRole">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div class="form-group">
          <label>New Password <span style="color:var(--text-dim)">(leave blank to keep)</span></label>
          <input type="password" id="editPassword" placeholder="••••••••"/>
        </div>

        <div class="flex-gap mt-2">
          <button class="btn btn-primary btn-sm" onclick="saveEdit()">Save</button>
          <button class="btn btn-ghost btn-sm"  onclick="closeModal()">Cancel</button>
        </div>
      </div>
    </div>

    ${LOGOUT_SCRIPT}

    <script>
      /* ── Modal helpers ──────────────────────────────────── */
      function openEdit(id, username, email, role) {
        document.getElementById('editId').value       = id;
        document.getElementById('editUsername').value  = username;
        document.getElementById('editEmail').value     = email;
        document.getElementById('editRole').value      = role;
        document.getElementById('editPassword').value  = '';

        const modalErr = document.getElementById('modalErr');
        modalErr.textContent = '';
        modalErr.classList.remove('show');

        document.getElementById('editModal').classList.add('show');
      }

      function closeModal() {
        document.getElementById('editModal').classList.remove('show');
      }

      // Close modal when clicking the dark backdrop
      document.getElementById('editModal').addEventListener('click', e => {
        if (e.target === e.currentTarget) closeModal();
      });

      /* ── Save edited user ───────────────────────────────── */
      async function saveEdit() {
        const id   = document.getElementById('editId').value;
        const body = {
          username: document.getElementById('editUsername').value,
          email:    document.getElementById('editEmail').value,
          role:     document.getElementById('editRole').value,
          password: document.getElementById('editPassword').value || undefined
        };

        const r = await fetch('/api/users/' + id, {
          method:  'PUT',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(body)
        });
        const d = await r.json();

        if (!r.ok) {
          const modalErr = document.getElementById('modalErr');
          modalErr.textContent = d.errors.join(' ');
          modalErr.classList.add('show');
          return;
        }

        closeModal();
        location.reload();
      }

      /* ── Delete user ────────────────────────────────────── */
      async function deleteUser(id) {
        if (!confirm('Delete this user? This cannot be undone.')) return;

        const r = await fetch('/api/users/' + id, { method: 'DELETE' });
        const d = await r.json();

        if (!r.ok) {
          const err = document.getElementById('err');
          err.textContent = d.errors.join(' ');
          err.classList.add('show');
          return;
        }

        const ok = document.getElementById('ok');
        ok.textContent = d.message;
        ok.classList.add('show');

        location.reload();
      }
    </script>
  `, userNav(navUser, '/admin'));
}

module.exports = { renderAdmin };