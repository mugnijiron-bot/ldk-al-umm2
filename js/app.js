// ============================================================
// LDK AL UMM - App Router & UI Utils
// ============================================================

const App = {
  currentPage: 'dashboard',
  notifOpen: false,

  init() {
    DB.init();
    Auth.init();
    this.render();
  },

  navigate(page, params = {}) {
    this.currentPage = page;
    this.currentParams = params;
    this.render();
    window.scrollTo(0, 0);
  },

  render() {
    const root = document.getElementById('app');
    if (!Auth.current) {
      root.innerHTML = Pages.auth();
      Pages.initAuth();
      return;
    }
    root.innerHTML = `
      <div class="app-wrapper">
        ${UI.sidebar()}
        <div class="main-content" id="mainContent">
          ${UI.topbar()}
          <div class="page-content" id="pageContent">
            ${this.renderPage()}
          </div>
        </div>
      </div>
      ${UI.modals()}
    `;
    this.bindEvents();
    if (typeof this.afterRender === 'function') { this.afterRender(); this.afterRender = null; }
  },

  renderPage() {
    switch (this.currentPage) {
      case 'dashboard': return Pages.dashboard();
      case 'divisions': return Pages.divisions();
      case 'division-detail': return Pages.divisionDetail(this.currentParams.id);
      case 'programs': return Pages.programs(this.currentParams);
      case 'program-detail': return Pages.programDetail(this.currentParams.id);
      case 'calendar': return Pages.calendar();
      case 'announcements': return Pages.announcements();
      case 'finance': return Pages.finance();
      case 'documentation': return Pages.documentation();
      case 'users': return Pages.users();
      case 'profile': return Pages.profile();
      default: return Pages.dashboard();
    }
  },

  bindEvents() {
    // Sidebar toggle
    document.querySelectorAll('.sidebar-toggle').forEach(btn => {
      btn.onclick = () => {
        const sb = document.getElementById('sidebar');
        const mc = document.getElementById('mainContent');
        if (window.innerWidth <= 768) {
          sb.classList.toggle('open');
        } else {
          sb.classList.toggle('collapsed');
          mc.classList.toggle('expanded');
        }
      };
    });

    // Nav items
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
      item.onclick = () => {
        const page = item.dataset.page;
        App.navigate(page);
        if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('open');
      };
    });

    // Notification toggle
    const notifBtn = document.getElementById('notifBtn');
    if (notifBtn) {
      notifBtn.onclick = (e) => {
        e.stopPropagation();
        document.getElementById('notifPanel').classList.toggle('show');
      };
    }
    document.addEventListener('click', () => {
      const p = document.getElementById('notifPanel');
      if (p) p.classList.remove('show');
    }, { once: false });

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.onclick = () => { Auth.logout(); App.render(); };
  }
};

const UI = {
  sidebar() {
    const u = Auth.current;
    const pages = [
      { page: 'dashboard', icon: '🏠', label: 'Beranda' },
      { page: 'divisions', icon: '🏛️', label: 'Divisi & Bidang' },
      { page: 'programs', icon: '📋', label: 'Program Kerja' },
      { page: 'calendar', icon: '📅', label: 'Kalender Kegiatan' },
      { page: 'documentation', icon: '📁', label: 'Dokumentasi' },
      { page: 'announcements', icon: '📢', label: 'Pengumuman' },
    ];
    const adminPages = [
      { page: 'finance', icon: '💰', label: 'Keuangan', badge: '' },
      { page: 'users', icon: '👥', label: 'Manajemen User' },
    ];
    const nav = pages.map(p => `
      <a class="nav-item ${App.currentPage === p.page ? 'active' : ''}" data-page="${p.page}">
        <span class="nav-icon">${p.icon}</span>${p.label}
      </a>`).join('');
    const adminNav = (u.role === 'admin' || u.role === 'ketua') ? `
      <div class="nav-section-label">Admin</div>
      ${adminPages.map(p => `
        <a class="nav-item ${App.currentPage === p.page ? 'active' : ''}" data-page="${p.page}">
          <span class="nav-icon">${p.icon}</span>${p.label}
          ${p.badge ? `<span class="nav-badge">${p.badge}</span>` : ''}
        </a>`).join('')}
    ` : '';
    return `
      <div class="sidebar" id="sidebar">
        <div class="sidebar-logo">
          <div class="logo-img">🕌</div>
          <h2>LDK Al Umm</h2>
          <span>UMMI Sukabumi</span>
        </div>
        <nav class="sidebar-nav">
          <div class="nav-section-label">Menu Utama</div>
          ${nav}
          ${adminNav}
        </nav>
        <div class="sidebar-footer">
          <div class="user-pill">
            <div class="user-avatar">${u.name.charAt(0)}</div>
            <div class="user-info">
              <div class="user-name">${u.name}</div>
              <div class="user-role">${this.roleLabel(u.role)}</div>
            </div>
          </div>
        </div>
      </div>`;
  },

  topbar() {
    const pageLabels = { dashboard:'Dashboard', divisions:'Divisi & Bidang', programs:'Program Kerja', calendar:'Kalender Kegiatan', announcements:'Pengumuman', finance:'Keuangan', documentation:'Dokumentasi', users:'Manajemen User', profile:'Profil', 'division-detail':'Detail Divisi', 'program-detail':'Detail Program' };
    const announcements = DB.get('announcements');
    const unread = announcements.length;
    return `
      <div class="topbar">
        <div class="topbar-left">
          <button class="sidebar-toggle">☰</button>
          <span class="page-title">${pageLabels[App.currentPage] || 'LDK Al Umm'}</span>
        </div>
        <div class="topbar-right" style="position:relative">
          <button class="topbar-btn" id="notifBtn">
            🔔<span class="notif-dot"></span>
          </button>
          <div class="notif-panel" id="notifPanel">
            <div style="padding:14px 16px;font-weight:700;border-bottom:1px solid var(--gray-200);font-size:.85rem">Pengumuman Terbaru</div>
            ${announcements.slice(0,4).map(a => `
              <div class="notif-item" onclick="App.navigate('announcements')">
                <div class="notif-item-icon">📢</div>
                <div>
                  <div class="notif-item-text">${a.title}</div>
                  <div class="notif-item-time">${a.created_at} · ${a.user_name}</div>
                </div>
              </div>`).join('')}
          </div>
          <button class="topbar-btn" onclick="App.navigate('profile')">👤</button>
          <button class="topbar-btn" id="logoutBtn" title="Keluar">🚪</button>
        </div>
      </div>`;
  },

  modals() {
    return `
      <div class="modal-overlay" id="modalOverlay">
        <div class="modal" id="modal">
          <div class="modal-header">
            <span class="modal-title" id="modalTitle">Modal</span>
            <button class="modal-close" onclick="UI.closeModal()">✕</button>
          </div>
          <div class="modal-body" id="modalBody"></div>
          <div class="modal-footer" id="modalFooter"></div>
        </div>
      </div>`;
  },

  openModal(title, body, footer = '') {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = body;
    document.getElementById('modalFooter').innerHTML = footer;
    document.getElementById('modalOverlay').classList.add('show');
  },

  closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
  },

  toast(msg, type = 'success') {
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `${type === 'success' ? '✅' : '❌'} ${msg}`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  },

  roleLabel(role) {
    const map = { admin: 'Administrator', ketua: 'Ketua Bidang', pengurus: 'Pengurus', anggota: 'Anggota/Kader' };
    return map[role] || role;
  },

  formatRp(n) {
    return 'Rp ' + Number(n).toLocaleString('id-ID');
  },

  confirmDelete(msg, cb) {
    UI.openModal('Konfirmasi Hapus',
      `<div class="alert alert-warning">⚠️ ${msg}</div><p class="text-sm text-muted">Tindakan ini tidak dapat dibatalkan.</p>`,
      `<button class="btn btn-secondary" onclick="UI.closeModal()">Batal</button>
       <button class="btn btn-danger" onclick="(${cb})();UI.closeModal()">Hapus</button>`
    );
  }
};

// ============================================================
// PAGES
// ============================================================
const Pages = {

  // ---- AUTH ----
  auth() {
    return `
      <div class="auth-wrapper" id="authWrapper">
        <div class="auth-bg-pattern"></div>
        <div class="auth-card" id="authCard">
          <div class="auth-logo">
            <div class="logo-circle">🕌</div>
            <h1>LDK Al Umm</h1>
            <p>Universitas Muhammadiyah Sukabumi</p>
          </div>
          <div id="authForm">${this.loginForm()}</div>
        </div>
      </div>`;
  },

  loginForm() {
    return `
      <div class="form-group">
        <label class="form-label">Email</label>
        <input class="form-control" id="loginEmail" type="email" placeholder="email@example.com" value="admin@ldkalumm.com">
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <input class="form-control" id="loginPassword" type="password" placeholder="••••••••" value="password">
      </div>
      <div id="authError" class="alert alert-warning" style="display:none"></div>
      <button class="btn btn-primary w-full" onclick="Pages.doLogin()" style="justify-content:center;padding:12px">Masuk</button>
      <div class="auth-divider">atau</div>
      <div class="auth-toggle">Belum punya akun? <a onclick="document.getElementById('authForm').innerHTML=Pages.registerForm()">Daftar sekarang</a></div>
      <div style="margin-top:16px;padding:12px;background:var(--green-pale);border-radius:var(--radius-sm);font-size:.75rem;color:var(--green-dark)">
        <strong>Demo:</strong> admin@ldkalumm.com / password
      </div>`;
  },

  registerForm() {
    const divisions = DB.get('divisions');
    return `
      <h3 style="font-weight:800;margin-bottom:16px">Daftar Akun</h3>
      <div class="form-group"><label class="form-label">Nama Lengkap</label><input class="form-control" id="regName" placeholder="Nama lengkap"></div>
      <div class="form-group"><label class="form-label">Email</label><input class="form-control" id="regEmail" type="email" placeholder="email@example.com"></div>
      <div class="form-group"><label class="form-label">Nomor HP</label><input class="form-control" id="regHp" placeholder="08xxxxxxxxxx"></div>
      <div class="form-group"><label class="form-label">Password</label><input class="form-control" id="regPass" type="password" placeholder="Min. 8 karakter"></div>
      <div class="form-group">
        <label class="form-label">Minat Divisi</label>
        <select class="form-control" id="regDiv">
          ${divisions.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
        </select>
      </div>
      <div id="authError" class="alert alert-warning" style="display:none"></div>
      <button class="btn btn-primary w-full" onclick="Pages.doRegister()" style="justify-content:center;padding:12px">Daftar</button>
      <div class="auth-toggle mt-3">Sudah punya akun? <a onclick="document.getElementById('authForm').innerHTML=Pages.loginForm()">Masuk</a></div>`;
  },

  initAuth() {},

  doLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const res = Auth.login(email, password);
    if (res.ok) { App.render(); }
    else {
      const err = document.getElementById('authError');
      err.style.display = 'flex'; err.textContent = res.msg;
    }
  },

  doRegister() {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const no_hp = document.getElementById('regHp').value.trim();
    const password = document.getElementById('regPass').value;
    const divisi_id = parseInt(document.getElementById('regDiv').value);
    if (!name || !email || !password) { document.getElementById('authError').style.display='flex'; document.getElementById('authError').textContent='Semua field wajib diisi.'; return; }
    const res = Auth.register({ name, email, password, no_hp, divisi_id });
    if (res.ok) {
      document.getElementById('authForm').innerHTML = `<div class="alert alert-success">✅ Registrasi berhasil! Akun Anda sedang menunggu verifikasi admin.</div><button class="btn btn-primary w-full mt-4" onclick="document.getElementById('authForm').innerHTML=Pages.loginForm()" style="justify-content:center">Kembali ke Login</button>`;
    } else {
      document.getElementById('authError').style.display='flex'; document.getElementById('authError').textContent=res.msg;
    }
  },

  // ---- DASHBOARD ----
  dashboard() {
    const divisions = DB.get('divisions');
    const programs = DB.get('work_programs');
    const users = DB.get('users');
    const announcements = DB.get('announcements');
    const events = DB.get('events').sort((a,b) => new Date(a.start_date) - new Date(b.start_date));
    const today = new Date().toISOString().split('T')[0];
    const upcoming = events.filter(e => e.start_date >= today).slice(0, 4);
    const u = Auth.current;

    const totalBudget = programs.reduce((s, p) => s + (p.anggaran_realistis || 0), 0);
    const budgetReports = DB.get('budget_reports');
    const totalRealisasi = budgetReports.reduce((s, b) => s + (b.realisasi_anggaran || 0), 0);

    return `
      <div class="hero-banner">
        <div class="hero-arabic">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</div>
        <h2>Selamat Datang, ${u.name.split(' ')[0]}! 👋</h2>
        <p>Lembaga Dakwah Kampus Al Umm — Universitas Muhammadiyah Sukabumi</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card" onclick="App.navigate('divisions')" style="cursor:pointer">
          <div class="stat-icon green">🏛️</div>
          <div><div class="stat-value">${divisions.length}</div><div class="stat-label">Divisi & Bidang</div></div>
        </div>
        <div class="stat-card" onclick="App.navigate('programs')" style="cursor:pointer">
          <div class="stat-icon gold">📋</div>
          <div><div class="stat-value">${programs.length}</div><div class="stat-label">Program Kerja</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue">👥</div>
          <div><div class="stat-value">${users.filter(u=>u.status_verifikasi==='terverifikasi').length}</div><div class="stat-label">Anggota Aktif</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon red">💰</div>
          <div><div class="stat-value">${Math.round(totalRealisasi/1000)}K</div><div class="stat-label">Realisasi Anggaran</div></div>
        </div>
      </div>

      <div class="grid-2" style="gap:20px">
        <div>
          <div class="section-title">📅 Kegiatan Mendatang</div>
          ${upcoming.length ? upcoming.map(ev => {
            const prog = DB.getOne('work_programs', ev.work_program_id);
            const div = prog ? DB.getOne('divisions', prog.division_id) : null;
            return `
              <div class="card mb-3" style="padding:16px">
                <div class="flex items-center gap-3">
                  <div style="width:44px;height:44px;background:var(--green-pale);border-radius:var(--radius-sm);display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0">
                    <span style="font-size:.65rem;font-weight:700;color:var(--green-dark)">${ev.start_date.split('-')[2]}</span>
                    <span style="font-size:.6rem;color:var(--green-main);font-weight:600">${['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][parseInt(ev.start_date.split('-')[1])-1]}</span>
                  </div>
                  <div>
                    <div class="fw-700" style="font-size:.875rem">${ev.title}</div>
                    <div class="text-xs text-muted">📍 ${ev.location} ${div ? '· ' + div.name : ''}</div>
                  </div>
                </div>
              </div>`;
          }).join('') : '<div class="empty-state"><div class="empty-icon">📅</div><p>Tidak ada kegiatan mendatang</p></div>'}
          <button class="btn btn-secondary btn-sm w-full mt-2" onclick="App.navigate('calendar')">Lihat Semua Kegiatan</button>
        </div>

        <div>
          <div class="section-title">📢 Pengumuman Terbaru</div>
          ${announcements.slice(0,3).map(a => `
            <div class="announcement-card mb-3">
              <div class="ann-icon">${a.penting ? '🔴' : '📢'}</div>
              <div>
                <div class="ann-date">${a.created_at} · ${a.user_name}</div>
                <div class="ann-title">${a.title}</div>
                <div class="ann-content">${a.content.substring(0,100)}...</div>
              </div>
            </div>`).join('')}
          <button class="btn btn-secondary btn-sm w-full mt-2" onclick="App.navigate('announcements')">Semua Pengumuman</button>
        </div>
      </div>

      <div class="section-title mt-6">🏛️ Divisi & Bidang</div>
      <div class="divisions-grid">
        ${divisions.map(d => {
          const ketua = DB.where('division_boards', 'division_id', d.id).find(b => b.position === 'Ketua');
          const progs = DB.where('work_programs', 'division_id', d.id);
          const anggota = DB.where('division_boards', 'division_id', d.id).filter(b => b.position === 'Anggota');
          return `
            <div class="division-card" onclick="App.navigate('division-detail',{id:${d.id}})">
              <div class="division-card-header">
                <div class="div-icon">${d.icon}</div>
                <h3>${d.name}</h3>
                <p>${d.description.substring(0,60)}...</p>
              </div>
              <div class="division-card-body">
                ${ketua ? `<div class="div-leader">
                  <div class="div-leader-avatar">${ketua.name.charAt(0)}</div>
                  <div><div class="div-leader-name">${ketua.name}</div><div class="div-leader-role">Ketua</div></div>
                </div>` : ''}
                <div class="div-stats">
                  <div class="div-stat"><div class="div-stat-val">${progs.length}</div><div class="div-stat-label">Program</div></div>
                  <div class="div-stat"><div class="div-stat-val">${anggota.length + 2}</div><div class="div-stat-label">Anggota</div></div>
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>`;
  },

  // ---- DIVISIONS ----
  divisions() {
    const divisions = DB.get('divisions');
    const canEdit = Auth.can('edit_division');
    return `
      <div class="page-header">
        <div><h1>Divisi & Bidang</h1><p class="text-sm text-muted">Struktur organisasi LDK Al Umm</p></div>
        ${Auth.current.role === 'admin' ? `<button class="btn btn-primary" onclick="Pages.showDivisionForm()">➕ Tambah Divisi</button>` : ''}
      </div>
      <div class="divisions-grid">
        ${divisions.map(d => {
          const boards = DB.where('division_boards', 'division_id', d.id);
          const ketua = boards.find(b => b.position === 'Ketua');
          const progs = DB.where('work_programs', 'division_id', d.id);
          return `
            <div class="division-card">
              <div class="division-card-header" onclick="App.navigate('division-detail',{id:${d.id}})" style="cursor:pointer">
                <div class="div-icon">${d.icon}</div>
                <h3>${d.name}</h3>
                <p>${d.description.substring(0,70)}...</p>
              </div>
              <div class="division-card-body">
                ${ketua ? `<div class="div-leader">
                  <div class="div-leader-avatar">${ketua.name.charAt(0)}</div>
                  <div><div class="div-leader-name">${ketua.name}</div><div class="div-leader-role">Ketua</div></div>
                </div>` : ''}
                <div class="div-stats">
                  <div class="div-stat"><div class="div-stat-val">${progs.length}</div><div class="div-stat-label">Program Kerja</div></div>
                  <div class="div-stat"><div class="div-stat-val">${boards.length}</div><div class="div-stat-label">Pengurus</div></div>
                </div>
                <div class="program-actions mt-3">
                  <button class="btn btn-secondary btn-sm" onclick="App.navigate('division-detail',{id:${d.id}})">👁️ Detail</button>
                  <button class="btn btn-secondary btn-sm" onclick="App.navigate('programs',{division_id:${d.id}})">📋 Program</button>
                  ${(Auth.current.role === 'admin' || (Auth.current.role === 'ketua' && Auth.current.divisi_id == d.id)) ? `<button class="btn btn-secondary btn-sm" onclick="Pages.showDivisionForm(${d.id})">✏️</button>` : ''}
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>`;
  },

  showDivisionForm(id = null) {
    const d = id ? DB.getOne('divisions', id) : null;
    const body = `
      <div class="form-group"><label class="form-label">Nama Divisi</label><input class="form-control" id="fDivName" value="${d?.name||''}"></div>
      <div class="form-group"><label class="form-label">Icon (Emoji)</label><input class="form-control" id="fDivIcon" value="${d?.icon||'🏛️'}" style="font-size:1.5rem;text-align:center"></div>
      <div class="form-group"><label class="form-label">Deskripsi</label><textarea class="form-control" id="fDivDesc">${d?.description||''}</textarea></div>
      <div class="form-group"><label class="form-label">Tugas & Wewenang</label><textarea class="form-control" id="fDivTugas" style="min-height:120px">${d?.tugas_wewenang||''}</textarea></div>`;
    const footer = `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="Pages.saveDivision(${id})">💾 Simpan</button>`;
    UI.openModal(id ? 'Edit Divisi' : 'Tambah Divisi', body, footer);
  },

  saveDivision(id) {
    const data = {
      name: document.getElementById('fDivName').value,
      icon: document.getElementById('fDivIcon').value,
      description: document.getElementById('fDivDesc').value,
      tugas_wewenang: document.getElementById('fDivTugas').value,
    };
    if (!data.name) { UI.toast('Nama divisi wajib diisi', 'error'); return; }
    if (id) DB.update('divisions', id, data);
    else DB.insert('divisions', data);
    UI.closeModal(); UI.toast('Divisi berhasil disimpan');
    App.navigate('divisions');
  },

  // ---- DIVISION DETAIL ----
  divisionDetail(id) {
    const div = DB.getOne('divisions', id);
    if (!div) return '<div class="empty-state">Divisi tidak ditemukan</div>';
    const boards = DB.where('division_boards', 'division_id', id);
    const ketua = boards.find(b => b.position === 'Ketua');
    const sekretaris = boards.find(b => b.position === 'Sekretaris');
    const anggota = boards.filter(b => b.position === 'Anggota');
    const progs = DB.where('work_programs', 'division_id', id);
    const canEdit = Auth.current.role === 'admin' || (Auth.current.role === 'ketua' && Auth.current.divisi_id == id);

    return `
      <div class="breadcrumb"><span onclick="App.navigate('divisions')">Divisi</span> › <span>${div.name}</span></div>
      <div class="page-header">
        <div style="display:flex;align-items:center;gap:16px">
          <div style="font-size:3rem">${div.icon}</div>
          <div><h1>${div.name}</h1><p class="text-sm text-muted">LDK Al Umm UMMI Sukabumi</p></div>
        </div>
        ${canEdit ? `<div class="flex gap-2">
          <button class="btn btn-secondary" onclick="Pages.showDivisionForm(${id})">✏️ Edit</button>
          <button class="btn btn-primary" onclick="Pages.showBoardForm(${id})">➕ Tambah Pengurus</button>
        </div>` : ''}
      </div>

      <div class="grid-2 mb-4" style="gap:20px">
        <div class="card">
          <div class="card-header"><span class="card-title">📝 Deskripsi</span></div>
          <div class="card-body"><p style="font-size:.875rem;line-height:1.7">${div.description}</p></div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">⚖️ Tugas & Wewenang</span></div>
          <div class="card-body"><p style="font-size:.875rem;line-height:1.7">${div.tugas_wewenang}</p></div>
        </div>
      </div>

      <div class="section-title">👥 Susunan Pengurus Harian</div>
      <div class="card mb-4">
        <div class="card-body">
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px">
            ${boards.map(b => `
              <div style="text-align:center;padding:16px;background:var(--green-pale);border-radius:var(--radius-sm)">
                <div style="width:52px;height:52px;border-radius:50%;background:var(--green-main);color:white;display:flex;align-items:center;justify-content:center;font-size:1.3rem;font-weight:700;margin:0 auto 10px">${b.name.charAt(0)}</div>
                <div style="font-weight:700;font-size:.9rem">${b.name}</div>
                <div><span class="badge ${b.position==='Ketua'?'badge-gold':b.position==='Sekretaris'?'badge-blue':'badge-green'} mt-2">${b.position}</span></div>
                ${canEdit ? `<button class="btn btn-danger btn-sm mt-2" onclick="Pages.deleteBoard(${b.id},${id})">🗑️</button>` : ''}
              </div>`).join('')}
          </div>
        </div>
      </div>

      <div class="section-title">📋 Program Kerja</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <span class="text-sm text-muted">${progs.length} program kerja</span>
        ${canEdit ? `<button class="btn btn-primary btn-sm" onclick="App.navigate('programs',{division_id:${id}});setTimeout(()=>Pages.showProgramForm(null,${id}),100)">➕ Tambah Program</button>` : ''}
      </div>
      ${progs.map(p => `
        <div class="program-card mb-3">
          <div class="program-card-top">
            <div>
              <div class="program-name">${p.name}</div>
              <div class="program-desc">${p.description}</div>
            </div>
            <span class="badge badge-green">${p.status}</span>
          </div>
          <div class="program-meta">
            <div class="program-meta-item">📅 ${p.waktu}</div>
            <div class="program-meta-item">📍 ${p.tempat}</div>
            <div class="program-meta-item">💰 ${UI.formatRp(p.anggaran_realistis)}</div>
          </div>
          <div class="program-actions">
            <button class="btn btn-secondary btn-sm" onclick="App.navigate('program-detail',{id:${p.id}})">👁️ Detail</button>
            ${canEdit ? `<button class="btn btn-secondary btn-sm" onclick="App.navigate('programs',{division_id:${id}});setTimeout(()=>Pages.showProgramForm(${p.id},${id}),100)">✏️ Edit</button>` : ''}
          </div>
        </div>`).join('')}`;
  },

  showBoardForm(divId) {
    const body = `
      <div class="form-group"><label class="form-label">Nama</label><input class="form-control" id="fBoardName" placeholder="Nama pengurus"></div>
      <div class="form-group"><label class="form-label">Jabatan</label>
        <select class="form-control" id="fBoardPos">
          <option>Ketua</option><option>Sekretaris</option><option>Bendahara</option><option>Anggota</option>
        </select>
      </div>`;
    UI.openModal('Tambah Pengurus', body, `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="Pages.saveBoard(${divId})">Simpan</button>`);
  },

  saveBoard(divId) {
    const name = document.getElementById('fBoardName').value.trim();
    const position = document.getElementById('fBoardPos').value;
    if (!name) { UI.toast('Nama wajib diisi', 'error'); return; }
    DB.insert('division_boards', { division_id: divId, name, position });
    UI.closeModal(); UI.toast('Pengurus berhasil ditambahkan');
    App.navigate('division-detail', { id: divId });
  },

  deleteBoard(id, divId) {
    UI.confirmDelete('Hapus pengurus ini?', `()=>{DB.delete('division_boards',${id});UI.toast('Pengurus dihapus');App.navigate('division-detail',{id:${divId}});}`);
  },

  // ---- PROGRAMS ----
  programs(params = {}) {
    const { division_id, search } = params;
    const divisions = DB.get('divisions');
    let programs = DB.get('work_programs');
    if (division_id) programs = programs.filter(p => p.division_id == division_id);

    const activeDiv = division_id ? DB.getOne('divisions', division_id) : null;
    const canAdd = Auth.current.role === 'admin' || (Auth.current.role === 'ketua');

    return `
      <div class="page-header">
        <div><h1>Program Kerja</h1><p class="text-sm text-muted">${activeDiv ? activeDiv.name : 'Semua Divisi'} · ${programs.length} program</p></div>
        ${canAdd ? `<button class="btn btn-primary" onclick="Pages.showProgramForm(null,${division_id||Auth.current.divisi_id||1})">➕ Tambah Program</button>` : ''}
      </div>

      <div class="flex gap-3 mb-4" style="flex-wrap:wrap">
        <div class="search-box">🔍 <input placeholder="Cari program..." id="progSearch" oninput="Pages.filterPrograms()" value="${search||''}"></div>
        <select class="form-control" style="width:auto;padding:8px 14px" id="progDivFilter" onchange="App.navigate('programs',{division_id:this.value||undefined})">
          <option value="">Semua Divisi</option>
          ${divisions.map(d => `<option value="${d.id}" ${division_id==d.id?'selected':''}>${d.name}</option>`).join('')}
        </select>
      </div>

      <div id="programList">
        ${programs.map(p => this.programCard(p)).join('') || '<div class="empty-state"><div class="empty-icon">📋</div><p>Tidak ada program kerja ditemukan</p></div>'}
      </div>`;
  },

  filterPrograms() {
    const q = document.getElementById('progSearch').value.toLowerCase();
    const allCards = document.querySelectorAll('.program-card[data-id]');
    allCards.forEach(card => {
      const txt = card.textContent.toLowerCase();
      card.style.display = txt.includes(q) ? '' : 'none';
    });
  },

  programCard(p) {
    const div = DB.getOne('divisions', p.division_id);
    const canEdit = Auth.current.role === 'admin' || (Auth.current.role === 'ketua' && Auth.current.divisi_id == p.division_id);
    return `
      <div class="program-card mb-3" data-id="${p.id}">
        <div class="program-card-top">
          <div>
            <div class="program-name">${p.name}</div>
            ${div ? `<span class="badge badge-blue mb-2">${div.icon} ${div.name}</span>` : ''}
            <div class="program-desc">${p.description}</div>
          </div>
          <span class="badge ${p.status==='aktif'?'badge-green':p.status==='selesai'?'badge-gold':'badge-gray'}">${p.status}</span>
        </div>
        <div class="program-meta">
          <div class="program-meta-item">📅 ${p.waktu}</div>
          <div class="program-meta-item">📍 ${p.tempat}</div>
          <div class="program-meta-item">👤 ${p.penanggung_jawab}</div>
          <div class="program-meta-item">💰 ${UI.formatRp(p.anggaran_realistis)}</div>
        </div>
        <div class="program-actions">
          <button class="btn btn-secondary btn-sm" onclick="App.navigate('program-detail',{id:${p.id}})">👁️ Detail</button>
          ${canEdit ? `
            <button class="btn btn-secondary btn-sm" onclick="Pages.showProgramForm(${p.id})">✏️ Edit</button>
            <button class="btn btn-danger btn-sm" onclick="Pages.deleteProgram(${p.id})">🗑️</button>
          ` : ''}
        </div>
      </div>`;
  },

  showProgramForm(id = null, divId = null) {
    const p = id ? DB.getOne('work_programs', id) : null;
    const divisions = DB.get('divisions');
    const body = `
      <div class="form-row">
        <div class="form-group"><label class="form-label">Nama Program</label><input class="form-control" id="fProgName" value="${p?.name||''}"></div>
        <div class="form-group"><label class="form-label">Divisi</label>
          <select class="form-control" id="fProgDiv">
            ${divisions.map(d => `<option value="${d.id}" ${(p?.division_id||divId)==d.id?'selected':''}>${d.name}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-group"><label class="form-label">Deskripsi</label><textarea class="form-control" id="fProgDesc">${p?.description||''}</textarea></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Dasar</label><input class="form-control" id="fProgDasar" value="${p?.dasar||''}"></div>
        <div class="form-group"><label class="form-label">Penanggung Jawab</label><input class="form-control" id="fProgPJ" value="${p?.penanggung_jawab||''}"></div>
      </div>
      <div class="form-group"><label class="form-label">Tujuan</label><textarea class="form-control" id="fProgTujuan" style="min-height:70px">${p?.tujuan||''}</textarea></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Sasaran</label><input class="form-control" id="fProgSasaran" value="${p?.sasaran||''}"></div>
        <div class="form-group"><label class="form-label">Waktu</label><input class="form-control" id="fProgWaktu" value="${p?.waktu||''}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Tempat</label><input class="form-control" id="fProgTempat" value="${p?.tempat||''}"></div>
        <div class="form-group"><label class="form-label">Status</label>
          <select class="form-control" id="fProgStatus">
            <option ${p?.status==='aktif'?'selected':''}>aktif</option>
            <option ${p?.status==='selesai'?'selected':''}>selesai</option>
            <option ${p?.status==='pending'?'selected':''}>pending</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Anggaran Optimis (Rp)</label><input class="form-control" id="fProgAngOpt" type="number" value="${p?.anggaran_optimis||0}"></div>
        <div class="form-group"><label class="form-label">Anggaran Realistis (Rp)</label><input class="form-control" id="fProgAngReal" type="number" value="${p?.anggaran_realistis||0}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Indikator Kualitatif</label><textarea class="form-control" id="fProgIndKual" style="min-height:70px">${p?.indikator_kualitatif||''}</textarea></div>
        <div class="form-group"><label class="form-label">Indikator Kuantitatif</label><textarea class="form-control" id="fProgIndKuan" style="min-height:70px">${p?.indikator_kuantitatif||''}</textarea></div>
      </div>`;
    UI.openModal(id ? 'Edit Program Kerja' : 'Tambah Program Kerja', body, `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="Pages.saveProgram(${id})">💾 Simpan</button>`);
  },

  saveProgram(id) {
    const data = {
      division_id: parseInt(document.getElementById('fProgDiv').value),
      name: document.getElementById('fProgName').value,
      description: document.getElementById('fProgDesc').value,
      dasar: document.getElementById('fProgDasar').value,
      tujuan: document.getElementById('fProgTujuan').value,
      sasaran: document.getElementById('fProgSasaran').value,
      waktu: document.getElementById('fProgWaktu').value,
      tempat: document.getElementById('fProgTempat').value,
      anggaran_optimis: parseInt(document.getElementById('fProgAngOpt').value)||0,
      anggaran_realistis: parseInt(document.getElementById('fProgAngReal').value)||0,
      penanggung_jawab: document.getElementById('fProgPJ').value,
      indikator_kualitatif: document.getElementById('fProgIndKual').value,
      indikator_kuantitatif: document.getElementById('fProgIndKuan').value,
      status: document.getElementById('fProgStatus').value,
    };
    if (!data.name) { UI.toast('Nama program wajib diisi', 'error'); return; }
    if (id) DB.update('work_programs', id, data);
    else DB.insert('work_programs', data);
    UI.closeModal(); UI.toast('Program berhasil disimpan');
    App.navigate('programs', { division_id: data.division_id });
  },

  deleteProgram(id) {
    UI.confirmDelete('Hapus program kerja ini?', `()=>{DB.delete('work_programs',${id});UI.toast('Program dihapus');App.navigate('programs');}`);
  },

  // ---- PROGRAM DETAIL ----
  programDetail(id) {
    const p = DB.getOne('work_programs', id);
    if (!p) return '<div class="empty-state">Program tidak ditemukan</div>';
    const div = DB.getOne('divisions', p.division_id);
    const activities = DB.where('program_activities', 'work_program_id', id);
    const budgets = DB.where('budget_reports', 'work_program_id', id);
    const achievements = DB.where('achievement_indicators', 'work_program_id', id);
    const canEdit = Auth.current.role === 'admin' || (Auth.current.role === 'ketua' && Auth.current.divisi_id == p.division_id);
    const totalRealisasi = budgets.reduce((s,b) => s + b.realisasi_anggaran, 0);
    const pct = p.anggaran_realistis ? Math.min(100, Math.round(totalRealisasi / p.anggaran_realistis * 100)) : 0;

    return `
      <div class="breadcrumb"><span onclick="App.navigate('divisions')">Divisi</span> › <span onclick="App.navigate('division-detail',{id:${div?.id}})">${div?.name||'-'}</span> › <span>${p.name}</span></div>
      <div class="page-header">
        <div><h1>${p.name}</h1><span class="badge ${p.status==='aktif'?'badge-green':'badge-gold'} mt-2">${p.status}</span></div>
        ${canEdit ? `<div class="flex gap-2">
          <button class="btn btn-secondary" onclick="Pages.showProgramForm(${id})">✏️ Edit</button>
          <button class="btn btn-gold" onclick="Pages.exportProgramPDF(${id})">📄 Export PDF</button>
        </div>` : ''}
      </div>

      <div class="tabs mb-4" id="progTabs">
        <button class="tab active" onclick="Pages.switchTab('info')">📋 Info</button>
        <button class="tab" onclick="Pages.switchTab('keuangan')">💰 Keuangan</button>
        <button class="tab" onclick="Pages.switchTab('dokumentasi')">📁 Dokumentasi</button>
        <button class="tab" onclick="Pages.switchTab('indikator')">📊 Indikator</button>
      </div>

      <div class="tab-content active" id="tab-info">
        <div class="grid-2" style="gap:20px">
          <div class="card"><div class="card-body">
            <table style="width:100%">
              ${[['Dasar', p.dasar],['Tujuan', p.tujuan],['Sasaran', p.sasaran],['Waktu', p.waktu],['Tempat', p.tempat],['Penanggung Jawab', p.penanggung_jawab]].map(([k,v]) => `
                <tr><td style="padding:8px 4px;font-weight:600;font-size:.82rem;color:var(--gray-600);width:40%">${k}</td><td style="padding:8px 4px;font-size:.875rem">${v||'-'}</td></tr>`).join('')}
            </table>
          </div></div>
          <div>
            <div class="card mb-3"><div class="card-body">
              <div class="fw-700 mb-2">📝 Deskripsi</div>
              <p style="font-size:.875rem;line-height:1.7">${p.description}</p>
            </div></div>
            <div class="card"><div class="card-body">
              <div class="fw-700 mb-2">🎯 Indikator Keberhasilan</div>
              <div class="text-sm mb-2"><strong>Kualitatif:</strong> ${p.indikator_kualitatif||'-'}</div>
              <div class="text-sm"><strong>Kuantitatif:</strong> ${p.indikator_kuantitatif||'-'}</div>
            </div></div>
          </div>
        </div>
      </div>

      <div class="tab-content" id="tab-keuangan">
        <div class="card mb-3"><div class="card-body">
          <div class="fw-700 mb-3">💰 Rekapitulasi Anggaran</div>
          <div class="grid-2 mb-4" style="gap:16px">
            <div style="background:var(--green-pale);padding:16px;border-radius:var(--radius-sm);text-align:center">
              <div class="stat-value" style="font-size:1.4rem">${UI.formatRp(p.anggaran_optimis)}</div>
              <div class="text-sm text-muted mt-1">Anggaran Optimis</div>
            </div>
            <div style="background:var(--gold-pale);padding:16px;border-radius:var(--radius-sm);text-align:center">
              <div class="stat-value" style="font-size:1.4rem">${UI.formatRp(p.anggaran_realistis)}</div>
              <div class="text-sm text-muted mt-1">Anggaran Realistis</div>
            </div>
          </div>
          <div class="budget-bar-wrap">
            <div class="budget-bar-labels"><span>Realisasi: ${UI.formatRp(totalRealisasi)}</span><span>${pct}%</span></div>
            <div class="budget-bar-bg"><div class="budget-bar-fill ${pct>100?'over':''}" style="width:${pct}%"></div></div>
          </div>
        </div></div>
        <div class="flex justify-between items-center mb-3">
          <div class="fw-700">Riwayat Pengeluaran</div>
          ${canEdit ? `<button class="btn btn-primary btn-sm" onclick="Pages.showBudgetForm(${id})">➕ Tambah</button>` : ''}
        </div>
        <div class="card"><div class="table-wrap"><table>
          <thead><tr><th>Tanggal</th><th>Realisasi</th><th>Keterangan</th>${canEdit?'<th>Aksi</th>':''}</tr></thead>
          <tbody>
            ${budgets.length ? budgets.map(b => `
              <tr>
                <td>${b.created_at}</td>
                <td>${UI.formatRp(b.realisasi_anggaran)}</td>
                <td>${b.keterangan}</td>
                ${canEdit ? `<td><button class="btn btn-danger btn-sm" onclick="DB.delete('budget_reports',${b.id});UI.toast('Dihapus');App.navigate('program-detail',{id:${id}})">🗑️</button></td>` : ''}
              </tr>`).join('') : '<tr><td colspan="4" class="text-center text-muted" style="padding:24px">Belum ada data pengeluaran</td></tr>'}
          </tbody>
        </table></div></div>
      </div>

      <div class="tab-content" id="tab-dokumentasi">
        <div class="flex justify-between items-center mb-3">
          <div class="fw-700">Dokumentasi Kegiatan</div>
          ${canEdit ? `<button class="btn btn-primary btn-sm" onclick="Pages.showActivityForm(${id})">➕ Tambah Laporan</button>` : ''}
        </div>
        ${activities.length ? activities.map(a => `
          <div class="card mb-3"><div class="card-body">
            <div class="flex justify-between items-center mb-2">
              <div class="fw-700 text-sm">📅 ${a.tgl_pelaksanaan}</div>
            </div>
            <p style="font-size:.875rem;line-height:1.7">${a.laporan}</p>
            ${canEdit ? `<div class="flex gap-2 mt-3"><button class="btn btn-danger btn-sm" onclick="DB.delete('program_activities',${a.id});UI.toast('Laporan dihapus');App.navigate('program-detail',{id:${id}})">🗑️ Hapus</button></div>` : ''}
          </div></div>`).join('') : '<div class="empty-state"><div class="empty-icon">📁</div><p>Belum ada dokumentasi kegiatan</p></div>'}
      </div>

      <div class="tab-content" id="tab-indikator">
        <div class="flex justify-between items-center mb-3">
          <div class="fw-700">Data Indikator Keberhasilan</div>
          ${canEdit ? `<button class="btn btn-primary btn-sm" onclick="Pages.showAchievementForm(${id})">➕ Input Data</button>` : ''}
        </div>
        ${achievements.length ? achievements.map(a => `
          <div class="card mb-3"><div class="card-body">
            <div class="fw-600 text-sm mb-2">📅 ${a.bulan_tahun}</div>
            <div class="grid-2" style="gap:12px">
              <div style="background:var(--green-pale);padding:12px;border-radius:var(--radius-sm)">
                <div class="text-xs text-muted mb-1">Target Kuantitatif</div>
                <div class="fw-600 text-sm">${a.target_kuantitatif}</div>
                <div class="text-xs text-muted mt-2 mb-1">Realisasi Kuantitatif</div>
                <div class="fw-700 text-green">${a.realisasi_kuantitatif}</div>
              </div>
              <div style="background:var(--gold-pale);padding:12px;border-radius:var(--radius-sm)">
                <div class="text-xs text-muted mb-1">Target Kualitatif</div>
                <div class="fw-600 text-sm">${a.target_kualitatif}</div>
                <div class="text-xs text-muted mt-2 mb-1">Realisasi Kualitatif</div>
                <div class="fw-700" style="color:#7a5c00">${a.realisasi_kualitatif}</div>
              </div>
            </div>
            ${canEdit ? `<div class="mt-3"><button class="btn btn-danger btn-sm" onclick="DB.delete('achievement_indicators',${a.id});UI.toast('Data dihapus');App.navigate('program-detail',{id:${id}})">🗑️ Hapus</button></div>` : ''}
          </div></div>`).join('') : '<div class="empty-state"><div class="empty-icon">📊</div><p>Belum ada data indikator</p></div>'}
      </div>`;
  },

  switchTab(name) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + name).classList.add('active');
    event.target.classList.add('active');
  },

  showBudgetForm(progId) {
    const body = `
      <div class="form-group"><label class="form-label">Jumlah Realisasi (Rp)</label><input class="form-control" id="fBudAmt" type="number" placeholder="0"></div>
      <div class="form-group"><label class="form-label">Keterangan</label><textarea class="form-control" id="fBudKet" placeholder="Keterangan pengeluaran..."></textarea></div>`;
    UI.openModal('Input Pengeluaran', body, `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="Pages.saveBudget(${progId})">Simpan</button>`);
  },

  saveBudget(progId) {
    const amt = parseInt(document.getElementById('fBudAmt').value)||0;
    const ket = document.getElementById('fBudKet').value;
    DB.insert('budget_reports', { work_program_id: progId, realisasi_anggaran: amt, keterangan: ket });
    UI.closeModal(); UI.toast('Pengeluaran berhasil dicatat');
    App.navigate('program-detail', { id: progId });
  },

  showActivityForm(progId) {
    const body = `
      <div class="form-group"><label class="form-label">Tanggal Pelaksanaan</label><input class="form-control" id="fActDate" type="date"></div>
      <div class="form-group"><label class="form-label">Laporan Kegiatan</label><textarea class="form-control" id="fActLap" style="min-height:140px" placeholder="Tuliskan laporan kegiatan..."></textarea></div>`;
    UI.openModal('Tambah Laporan Kegiatan', body, `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="Pages.saveActivity(${progId})">Simpan</button>`);
  },

  saveActivity(progId) {
    const date = document.getElementById('fActDate').value;
    const laporan = document.getElementById('fActLap').value;
    if (!date || !laporan) { UI.toast('Semua field wajib diisi', 'error'); return; }
    DB.insert('program_activities', { work_program_id: progId, tgl_pelaksanaan: date, laporan });
    UI.closeModal(); UI.toast('Laporan berhasil disimpan');
    App.navigate('program-detail', { id: progId });
  },

  showAchievementForm(progId) {
    const body = `
      <div class="form-group"><label class="form-label">Periode (Bulan Tahun)</label><input class="form-control" id="fAchBulan" placeholder="April 2024"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Target Kuantitatif</label><input class="form-control" id="fAchTQ" placeholder="50 peserta"></div>
        <div class="form-group"><label class="form-label">Realisasi Kuantitatif</label><input class="form-control" id="fAchRQ" placeholder="67 peserta"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Target Kualitatif</label><textarea class="form-control" id="fAchTKual" placeholder="Kajian berlangsung kondusif"></textarea></div>
        <div class="form-group"><label class="form-label">Realisasi Kualitatif</label><textarea class="form-control" id="fAchRKual" placeholder="Tercapai..."></textarea></div>
      </div>`;
    UI.openModal('Input Indikator Keberhasilan', body, `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="Pages.saveAchievement(${progId})">Simpan</button>`);
  },

  saveAchievement(progId) {
    const data = {
      work_program_id: progId,
      bulan_tahun: document.getElementById('fAchBulan').value,
      target_kuantitatif: document.getElementById('fAchTQ').value,
      realisasi_kuantitatif: document.getElementById('fAchRQ').value,
      target_kualitatif: document.getElementById('fAchTKual').value,
      realisasi_kualitatif: document.getElementById('fAchRKual').value,
    };
    DB.insert('achievement_indicators', data);
    UI.closeModal(); UI.toast('Data indikator berhasil disimpan');
    App.navigate('program-detail', { id: progId });
  },

  exportProgramPDF(id) {
    const p = DB.getOne('work_programs', id);
    const div = DB.getOne('divisions', p.division_id);
    const w = window.open('', '_blank');
    w.document.write(`
      <html><head><title>Program Kerja - ${p.name}</title>
      <style>body{font-family:Arial,sans-serif;padding:40px;max-width:800px;margin:0 auto}h1{color:#0d4a2f}table{width:100%;border-collapse:collapse;margin:16px 0}td,th{border:1px solid #ddd;padding:10px;text-align:left}th{background:#e8f7f1;color:#0d4a2f;font-weight:bold}.header{text-align:center;border-bottom:2px solid #2d9e6b;padding-bottom:20px;margin-bottom:30px}</style>
      </head><body>
      <div class="header"><h2>LDK Al Umm - Universitas Muhammadiyah Sukabumi</h2><h1>${p.name}</h1><p>${div?.name||''}</p></div>
      <table>
        <tr><th width="30%">Dasar</th><td>${p.dasar}</td></tr>
        <tr><th>Tujuan</th><td>${p.tujuan}</td></tr>
        <tr><th>Sasaran</th><td>${p.sasaran}</td></tr>
        <tr><th>Waktu Pelaksanaan</th><td>${p.waktu}</td></tr>
        <tr><th>Tempat</th><td>${p.tempat}</td></tr>
        <tr><th>Penanggung Jawab</th><td>${p.penanggung_jawab}</td></tr>
        <tr><th>Anggaran Optimis</th><td>${UI.formatRp(p.anggaran_optimis)}</td></tr>
        <tr><th>Anggaran Realistis</th><td>${UI.formatRp(p.anggaran_realistis)}</td></tr>
        <tr><th>Indikator Kualitatif</th><td>${p.indikator_kualitatif}</td></tr>
        <tr><th>Indikator Kuantitatif</th><td>${p.indikator_kuantitatif}</td></tr>
      </table>
      <p style="margin-top:40px;font-size:12px;color:#666">Dicetak pada: ${new Date().toLocaleDateString('id-ID')}</p>
      <script>window.print();setTimeout(()=>window.close(),1000)<\/script>
      </body></html>`);
  },

  // ---- CALENDAR ----
  calendar() {
    const now = new Date();
    let year = App.currentParams?.year || now.getFullYear();
    let month = App.currentParams?.month !== undefined ? App.currentParams.month : now.getMonth();
    const events = DB.get('events');
    const programs = DB.get('work_programs');
    const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = now.toISOString().split('T')[0];
    const canAdd = Auth.current.role === 'admin' || Auth.current.role === 'ketua';

    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push({ day: null });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d });
    while (cells.length % 7 !== 0) cells.push({ day: null });

    return `
      <div class="page-header">
        <div><h1>Kalender Kegiatan</h1><p class="text-sm text-muted">Jadwal program kerja LDK Al Umm</p></div>
        ${canAdd ? `<button class="btn btn-primary" onclick="Pages.showEventForm()">➕ Tambah Kegiatan</button>` : ''}
      </div>

      <div class="card mb-4">
        <div class="card-body">
          <div class="flex items-center justify-between mb-4">
            <button class="btn btn-secondary btn-sm" onclick="App.navigate('calendar',{month:${month===0?11:month-1},year:${month===0?year-1:year}})">‹ Prev</button>
            <h2 style="font-weight:800;font-size:1.3rem">${monthNames[month]} ${year}</h2>
            <button class="btn btn-secondary btn-sm" onclick="App.navigate('calendar',{month:${month===11?0:month+1},year:${month===11?year+1:year}})">Next ›</button>
          </div>
          <div class="calendar-grid">
            ${['Min','Sen','Sel','Rab','Kam','Jum','Sab'].map(d => `<div class="cal-day-header">${d}</div>`).join('')}
            ${cells.map(cell => {
              if (!cell.day) return '<div class="cal-day other-month"></div>';
              const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(cell.day).padStart(2,'0')}`;
              const dayEvents = events.filter(e => e.start_date <= dateStr && e.end_date >= dateStr);
              return `
                <div class="cal-day ${dateStr === todayStr ? 'today' : ''}">
                  <div class="cal-date">${cell.day}</div>
                  ${dayEvents.slice(0,2).map((e,i) => `<div class="cal-event ${i%2===1?'gold':''}" title="${e.title}">${e.title}</div>`).join('')}
                  ${dayEvents.length > 2 ? `<div class="cal-event" style="background:var(--gray-200);color:var(--gray-600)">+${dayEvents.length-2}</div>` : ''}
                </div>`;
            }).join('')}
          </div>
        </div>
      </div>

      <div class="section-title">📋 Semua Kegiatan</div>
      <div class="card"><div class="table-wrap"><table>
        <thead><tr><th>Kegiatan</th><th>Program</th><th>Tanggal</th><th>Lokasi</th>${canAdd?'<th>Aksi</th>':''}</tr></thead>
        <tbody>
          ${events.sort((a,b)=>new Date(a.start_date)-new Date(b.start_date)).map(ev => {
            const prog = programs.find(p => p.id == ev.work_program_id);
            return `
              <tr>
                <td><div class="fw-600">${ev.title}</div></td>
                <td>${prog ? `<span class="badge badge-blue">${prog.name}</span>` : '-'}</td>
                <td>${ev.start_date}${ev.end_date !== ev.start_date ? ' s/d ' + ev.end_date : ''}</td>
                <td>${ev.location}</td>
                ${canAdd ? `<td class="flex gap-2">
                  <button class="btn btn-secondary btn-sm" onclick="Pages.showEventForm(${ev.id})">✏️</button>
                  <button class="btn btn-danger btn-sm" onclick="DB.delete('events',${ev.id});UI.toast('Kegiatan dihapus');App.navigate('calendar',{month:${month},year:${year}})">🗑️</button>
                </td>` : ''}
              </tr>`;
          }).join('')}
        </tbody>
      </table></div></div>`;
  },

  showEventForm(id = null) {
    const ev = id ? DB.getOne('events', id) : null;
    const programs = DB.get('work_programs');
    const body = `
      <div class="form-group"><label class="form-label">Judul Kegiatan</label><input class="form-control" id="fEvTitle" value="${ev?.title||''}"></div>
      <div class="form-group"><label class="form-label">Program Kerja</label>
        <select class="form-control" id="fEvProg">
          ${programs.map(p => `<option value="${p.id}" ${ev?.work_program_id==p.id?'selected':''}>${p.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Tanggal Mulai</label><input class="form-control" id="fEvStart" type="date" value="${ev?.start_date||''}"></div>
        <div class="form-group"><label class="form-label">Tanggal Selesai</label><input class="form-control" id="fEvEnd" type="date" value="${ev?.end_date||''}"></div>
      </div>
      <div class="form-group"><label class="form-label">Lokasi</label><input class="form-control" id="fEvLoc" value="${ev?.location||''}"></div>`;
    UI.openModal(id ? 'Edit Kegiatan' : 'Tambah Kegiatan', body, `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="Pages.saveEvent(${id})">Simpan</button>`);
  },

  saveEvent(id) {
    const data = {
      title: document.getElementById('fEvTitle').value,
      work_program_id: parseInt(document.getElementById('fEvProg').value),
      start_date: document.getElementById('fEvStart').value,
      end_date: document.getElementById('fEvEnd').value || document.getElementById('fEvStart').value,
      location: document.getElementById('fEvLoc').value,
    };
    if (!data.title || !data.start_date) { UI.toast('Judul dan tanggal wajib diisi', 'error'); return; }
    if (id) DB.update('events', id, data);
    else DB.insert('events', data);
    UI.closeModal(); UI.toast('Kegiatan berhasil disimpan');
    App.navigate('calendar');
  },

  // ---- ANNOUNCEMENTS ----
  announcements() {
    const announcements = DB.get('announcements').sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    const canPost = Auth.can('post_announcement');
    return `
      <div class="page-header">
        <div><h1>Pengumuman</h1><p class="text-sm text-muted">${announcements.length} pengumuman</p></div>
        ${canPost ? `<button class="btn btn-primary" onclick="Pages.showAnnounceForm()">📢 Buat Pengumuman</button>` : ''}
      </div>
      ${announcements.map(a => `
        <div class="announcement-card mb-3">
          <div class="ann-icon" style="background:${a.penting?'#fff1f2':'var(--green-pale)'}">${a.penting ? '🔴' : '📢'}</div>
          <div style="flex:1">
            <div class="flex justify-between items-start">
              <div>
                <div class="ann-date">${a.created_at} · ${a.user_name}</div>
                <div class="ann-title">${a.title}</div>
                ${a.penting ? '<span class="badge badge-red">Penting</span>' : ''}
              </div>
              ${canPost ? `<div class="flex gap-2">
                <button class="btn btn-danger btn-sm" onclick="Pages.deleteAnn(${a.id})">🗑️</button>
              </div>` : ''}
            </div>
            <div class="ann-content mt-2" style="-webkit-line-clamp:unset">${a.content}</div>
          </div>
        </div>`).join('')}
      ${!announcements.length ? '<div class="empty-state"><div class="empty-icon">📢</div><p>Belum ada pengumuman</p></div>' : ''}`;
  },

  showAnnounceForm() {
    const body = `
      <div class="form-group"><label class="form-label">Judul Pengumuman</label><input class="form-control" id="fAnnTitle" placeholder="Judul pengumuman..."></div>
      <div class="form-group"><label class="form-label">Isi Pengumuman</label><textarea class="form-control" id="fAnnContent" style="min-height:140px" placeholder="Tulis isi pengumuman..."></textarea></div>
      <div class="form-group"><label class="form-label"><input type="checkbox" id="fAnnPenting"> Tandai sebagai Penting</label></div>`;
    UI.openModal('Buat Pengumuman', body, `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="Pages.saveAnnounce()">📢 Kirim</button>`);
  },

  saveAnnounce() {
    const title = document.getElementById('fAnnTitle').value.trim();
    const content = document.getElementById('fAnnContent').value.trim();
    const penting = document.getElementById('fAnnPenting').checked;
    if (!title || !content) { UI.toast('Judul dan isi wajib diisi', 'error'); return; }
    DB.insert('announcements', { title, content, penting, user_id: Auth.current.id, user_name: Auth.current.name });
    UI.closeModal(); UI.toast('Pengumuman berhasil dikirim');
    App.navigate('announcements');
  },

  deleteAnn(id) {
    UI.confirmDelete('Hapus pengumuman ini?', `()=>{DB.delete('announcements',${id});UI.toast('Pengumuman dihapus');App.navigate('announcements');}`);
  },

  // ---- FINANCE ----
  finance() {
    const divisions = DB.get('divisions');
    const programs = DB.get('work_programs');
    const budgets = DB.get('budget_reports');
    const totalAnggaranOpt = programs.reduce((s,p) => s+(p.anggaran_optimis||0),0);
    const totalAnggaranReal = programs.reduce((s,p) => s+(p.anggaran_realistis||0),0);
    const totalRealisasi = budgets.reduce((s,b) => s+b.realisasi_anggaran,0);
    return `
      <div class="page-header"><div><h1>Keuangan</h1><p class="text-sm text-muted">Rekapitulasi anggaran program kerja</p></div></div>
      <div class="stats-grid mb-6">
        <div class="stat-card"><div class="stat-icon green">💰</div><div><div class="stat-value" style="font-size:1.1rem">${UI.formatRp(totalAnggaranOpt)}</div><div class="stat-label">Total Anggaran Optimis</div></div></div>
        <div class="stat-card"><div class="stat-icon gold">📊</div><div><div class="stat-value" style="font-size:1.1rem">${UI.formatRp(totalAnggaranReal)}</div><div class="stat-label">Total Anggaran Realistis</div></div></div>
        <div class="stat-card"><div class="stat-icon blue">✅</div><div><div class="stat-value" style="font-size:1.1rem">${UI.formatRp(totalRealisasi)}</div><div class="stat-label">Total Realisasi</div></div></div>
        <div class="stat-card"><div class="stat-icon red">📉</div><div><div class="stat-value" style="font-size:1.1rem">${Math.round(totalRealisasi/totalAnggaranReal*100)||0}%</div><div class="stat-label">Serapan Anggaran</div></div></div>
      </div>

      <div class="section-title">Rekapitulasi per Divisi</div>
      ${divisions.map(div => {
        const divProgs = programs.filter(p => p.division_id == div.id);
        const divBudgetReal = divProgs.reduce((s,p) => s+(p.anggaran_realistis||0),0);
        const divRealisasi = divProgs.reduce((s,p) => { const bgt = budgets.filter(b => b.work_program_id == p.id); return s + bgt.reduce((ss,b)=>ss+b.realisasi_anggaran,0); },0);
        const pct = divBudgetReal ? Math.min(100, Math.round(divRealisasi/divBudgetReal*100)) : 0;
        return `
          <div class="card mb-3">
            <div class="card-header">
              <span class="card-title">${div.icon} ${div.name}</span>
              <span class="badge badge-green">${divProgs.length} program</span>
            </div>
            <div class="card-body">
              <div class="grid-2 mb-3" style="gap:12px">
                <div class="text-sm"><span class="text-muted">Anggaran Realistis:</span> <strong>${UI.formatRp(divBudgetReal)}</strong></div>
                <div class="text-sm"><span class="text-muted">Realisasi:</span> <strong class="text-green">${UI.formatRp(divRealisasi)}</strong></div>
              </div>
              <div class="budget-bar-wrap">
                <div class="budget-bar-labels"><span>Serapan ${pct}%</span><span>${UI.formatRp(divBudgetReal - divRealisasi)} sisa</span></div>
                <div class="budget-bar-bg"><div class="budget-bar-fill" style="width:${pct}%"></div></div>
              </div>
              <div class="table-wrap mt-3">
                <table>
                  <thead><tr><th>Program</th><th>Anggaran</th><th>Realisasi</th><th>Serapan</th></tr></thead>
                  <tbody>
                    ${divProgs.map(p => {
                      const r = budgets.filter(b => b.work_program_id == p.id).reduce((s,b)=>s+b.realisasi_anggaran,0);
                      const pp = p.anggaran_realistis ? Math.round(r/p.anggaran_realistis*100) : 0;
                      return `<tr>
                        <td><div class="fw-600">${p.name}</div></td>
                        <td>${UI.formatRp(p.anggaran_realistis)}</td>
                        <td>${UI.formatRp(r)}</td>
                        <td><span class="badge ${pp>80?'badge-red':pp>50?'badge-gold':'badge-green'}">${pp}%</span></td>
                      </tr>`;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>`;
      }).join('')}`;
  },

  // ---- DOCUMENTATION ----
  documentation() {
    const activities = DB.get('program_activities').sort((a,b) => new Date(b.tgl_pelaksanaan) - new Date(a.tgl_pelaksanaan));
    const programs = DB.get('work_programs');
    return `
      <div class="page-header"><div><h1>Dokumentasi Kegiatan</h1><p class="text-sm text-muted">${activities.length} laporan kegiatan</p></div></div>
      ${activities.length ? activities.map(a => {
        const prog = programs.find(p => p.id == a.work_program_id);
        const div = prog ? DB.getOne('divisions', prog.division_id) : null;
        return `
          <div class="card mb-3">
            <div class="card-body">
              <div class="flex items-center gap-3 mb-3">
                <div style="width:44px;height:44px;background:var(--green-pale);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0">📁</div>
                <div>
                  <div class="fw-700">${prog?.name || 'Program tidak dikenal'}</div>
                  <div class="text-xs text-muted">${div?.name||''} · ${a.tgl_pelaksanaan}</div>
                </div>
              </div>
              <p style="font-size:.875rem;line-height:1.7;color:var(--gray-800)">${a.laporan}</p>
              ${prog ? `<div class="mt-3"><button class="btn btn-secondary btn-sm" onclick="App.navigate('program-detail',{id:${prog.id}})">Lihat Program →</button></div>` : ''}
            </div>
          </div>`;
      }).join('') : '<div class="empty-state"><div class="empty-icon">📁</div><p>Belum ada dokumentasi kegiatan</p></div>'}`;
  },

  // ---- USERS ----
  users() {
    if (Auth.current.role !== 'admin') return '<div class="alert alert-warning">⚠️ Anda tidak memiliki akses ke halaman ini.</div>';
    const users = DB.get('users');
    const divisions = DB.get('divisions');
    const pending = users.filter(u => u.status_verifikasi === 'pending');
    return `
      <div class="page-header">
        <div><h1>Manajemen User</h1><p class="text-sm text-muted">${users.length} pengguna</p></div>
      </div>
      ${pending.length ? `<div class="alert alert-warning mb-4">⚠️ Ada ${pending.length} akun menunggu verifikasi</div>` : ''}
      <div class="card"><div class="table-wrap"><table>
        <thead><tr><th>Nama</th><th>Email</th><th>Divisi</th><th>Role</th><th>Status</th><th>Aksi</th></tr></thead>
        <tbody>
          ${users.map(u => {
            const div = u.divisi_id ? divisions.find(d => d.id == u.divisi_id) : null;
            return `
              <tr>
                <td><div class="flex items-center gap-2"><div class="user-avatar" style="width:28px;height:28px;font-size:.7rem;background:var(--green-main);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0">${u.name.charAt(0)}</div><span class="fw-600">${u.name}</span></div></td>
                <td>${u.email}</td>
                <td>${div ? div.name : '-'}</td>
                <td><span class="badge badge-blue">${UI.roleLabel(u.role)}</span></td>
                <td><span class="badge ${u.status_verifikasi==='terverifikasi'?'badge-green':'badge-gold'}">${u.status_verifikasi}</span></td>
                <td class="flex gap-2">
                  ${u.status_verifikasi === 'pending' ? `<button class="btn btn-primary btn-sm" onclick="Pages.verifyUser(${u.id})">✅ Verifikasi</button>` : ''}
                  ${u.id !== Auth.current.id ? `<button class="btn btn-danger btn-sm" onclick="Pages.deleteUser(${u.id})">🗑️</button>` : ''}
                  <button class="btn btn-secondary btn-sm" onclick="Pages.changeRole(${u.id})">✏️ Role</button>
                </td>
              </tr>`;
          }).join('')}
        </tbody>
      </table></div></div>`;
  },

  verifyUser(id) {
    DB.update('users', id, { status_verifikasi: 'terverifikasi' });
    UI.toast('User berhasil diverifikasi');
    App.navigate('users');
  },

  deleteUser(id) {
    UI.confirmDelete('Hapus user ini?', `()=>{DB.delete('users',${id});UI.toast('User dihapus');App.navigate('users');}`);
  },

  changeRole(id) {
    const u = DB.getOne('users', id);
    const body = `
      <div class="form-group"><label class="form-label">Nama: ${u.name}</label></div>
      <div class="form-group"><label class="form-label">Role</label>
        <select class="form-control" id="fUserRole">
          <option value="anggota" ${u.role==='anggota'?'selected':''}>Anggota/Kader</option>
          <option value="pengurus" ${u.role==='pengurus'?'selected':''}>Pengurus</option>
          <option value="ketua" ${u.role==='ketua'?'selected':''}>Ketua Bidang</option>
          <option value="admin" ${u.role==='admin'?'selected':''}>Administrator</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Divisi</label>
        <select class="form-control" id="fUserDiv">
          <option value="">-</option>
          ${DB.get('divisions').map(d=>`<option value="${d.id}" ${u.divisi_id==d.id?'selected':''}>${d.name}</option>`).join('')}
        </select>
      </div>`;
    UI.openModal('Ubah Role User', body, `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Batal</button>
      <button class="btn btn-primary" onclick="DB.update('users',${id},{role:document.getElementById('fUserRole').value,divisi_id:parseInt(document.getElementById('fUserDiv').value)||null});UI.closeModal();UI.toast('Role diperbarui');App.navigate('users')">Simpan</button>`);
  },

  // ---- PROFILE ----
  profile() {
    const u = Auth.current;
    const div = u.divisi_id ? DB.getOne('divisions', u.divisi_id) : null;
    return `
      <div class="page-header"><h1>Profil Saya</h1></div>
      <div class="grid-2" style="gap:20px">
        <div class="card">
          <div class="card-body" style="text-align:center;padding:32px">
            <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--green-main),var(--green-dark));color:white;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;margin:0 auto 16px">${u.name.charAt(0)}</div>
            <h2 style="font-weight:800;font-size:1.2rem">${u.name}</h2>
            <span class="badge badge-blue mt-2">${UI.roleLabel(u.role)}</span>
            ${div ? `<div class="text-sm text-muted mt-2">${div.name}</div>` : ''}
            <div class="text-sm text-muted mt-1">${u.email}</div>
            <div class="text-sm text-muted">${u.no_hp || '-'}</div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><span class="card-title">✏️ Edit Profil</span></div>
          <div class="card-body">
            <div class="form-group"><label class="form-label">Nama Lengkap</label><input class="form-control" id="pName" value="${u.name}"></div>
            <div class="form-group"><label class="form-label">Email</label><input class="form-control" id="pEmail" value="${u.email}" readonly style="background:var(--gray-100)"></div>
            <div class="form-group"><label class="form-label">Nomor HP</label><input class="form-control" id="pHp" value="${u.no_hp||''}"></div>
            <div class="form-group"><label class="form-label">Password Baru (kosongkan jika tidak ingin ubah)</label><input class="form-control" id="pPass" type="password" placeholder="Password baru..."></div>
            <button class="btn btn-primary w-full" onclick="Pages.saveProfile()" style="justify-content:center">💾 Simpan Perubahan</button>
          </div>
        </div>
      </div>
      <div class="card mt-4">
        <div class="card-header"><span class="card-title">⚙️ Pengaturan Lainnya</span></div>
        <div class="card-body">
          <button class="btn btn-danger" onclick="Auth.logout();App.render()">🚪 Keluar dari Akun</button>
          ${Auth.current.role === 'admin' ? `<button class="btn btn-secondary ml-4" onclick="if(confirm('Reset semua data ke default?')){DB.reset();UI.toast('Data direset');App.navigate('dashboard')}">🔄 Reset Data (Admin)</button>` : ''}
        </div>
      </div>`;
  },

  saveProfile() {
    const name = document.getElementById('pName').value.trim();
    const no_hp = document.getElementById('pHp').value.trim();
    const pass = document.getElementById('pPass').value;
    const update = { name, no_hp };
    if (pass) update.password = pass;
    DB.update('users', Auth.current.id, update);
    Auth.current = { ...Auth.current, ...update };
    localStorage.setItem('ldk_session', JSON.stringify(Auth.current));
    UI.toast('Profil berhasil diperbarui');
    App.navigate('profile');
  },
};
