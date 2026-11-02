/* Nhịp workflow prototype — shared runtime.
   Builds the presentation bar, app shell, epic badges, notifications drawer and demo timer.
   Pages declare what they are through <body data-*> attributes:
     data-root   relative path to the prototype root ("../" for role pages)
     data-role   member | pm | admin | client      (omit on index / scope board)
     data-step   1-based step number inside the role flow
     data-shell  app (default) | client | none
     data-area   active top-menu item (home, projects, planner, reporting, finance, portal, teamreports, settings)
     data-rail   active rail item id
*/
(function () {
  'use strict';

  var STORE = {
    scope: 'wlProto.scope.v1',
    timer: 'wlProto.timer.v1',
    logs: 'wlProto.timelogs.v1',
    notes: 'wlProto.notesCollapsed',
    notifRead: 'wlProto.notifRead.v1'
  };

  // ---------- Reference data ----------

  var PHASES = {
    mvp: { label: 'MVP', cls: 'ph-mvp' },
    p2: { label: 'Phase 2', cls: 'ph-p2' },
    p3: { label: 'Phase 3', cls: 'ph-p3' },
    drop: { label: 'Bỏ', cls: 'ph-drop' }
  };
  var PHASE_ORDER = ['mvp', 'p2', 'p3', 'drop'];

  var EPICS = [
    { code: 'E01', short: 'Xác thực', name: 'Xác thực và onboarding', phase: 'mvp', src: '1',
      desc: 'Đăng ký, đăng nhập (email, Google, Apple), quên mật khẩu, lời mời qua email hoặc link, wizard thiết lập 3 bước.',
      story: 'Là nhân viên mới, tôi muốn nhận link mời qua email để vào workspace mà không cần admin tạo mật khẩu giúp.' },
    { code: 'E02', short: 'Team & phân quyền', name: 'Team, thành viên, phân quyền', phase: 'mvp', src: '2',
      desc: 'Nhiều team, mời thành viên, 5 vai trò (Owner, Admin, Team Lead, Member, Guest), cây Team Lead, khách mời vào project.',
      story: 'Là Admin, tôi muốn gán vai trò Team Lead cho một người để họ xem báo cáo của nhóm mình.' },
    { code: 'E03', short: 'Project', name: 'Quản lý project', phase: 'mvp', src: '4',
      desc: 'Danh sách project, tạo từ trống, template hoặc CSV; Project Settings (status, health, client, timeline, privacy); lưu trữ.',
      story: 'Là PM, tôi muốn đặt status và health cho project để ban giám đốc thấy dự án nào đang gặp rủi ro.' },
    { code: 'E04', short: 'Task', name: 'Quản lý task', phase: 'mvp', src: '5',
      desc: 'Các trường của task, subtask nhiều cấp, Task Drawer (comment, file, activity log), thao tác hàng loạt, status và phase.',
      story: 'Là thành viên, tôi muốn chia task thành subtask và giao cho từng người để theo dõi phần việc nhỏ.' },
    { code: 'E05', short: 'List & Board', name: 'View List và Board', phase: 'mvp', src: '6.1, 6.2',
      desc: 'Task List nhóm theo status, priority hoặc phase, sửa trực tiếp, bộ lọc; Board Kanban kéo thả.',
      story: 'Là thành viên, tôi muốn kéo thẻ task sang cột Done trên Board để cập nhật tiến độ nhanh.' },
    { code: 'E06', short: 'Time tracking', name: 'Time tracking và Time Entries', phase: 'mvp', src: '7',
      desc: 'Timer trên task, log giờ thủ công, trang Time Entries, billable và non-billable, ước lượng so với thực tế.',
      story: 'Là nhân viên, tôi muốn bấm timer trên task để ghi giờ làm chính xác.' },
    { code: 'E07', short: 'Thông báo', name: 'Thông báo, email, real-time', phase: 'mvp', src: '12',
      desc: 'Ngăn thông báo in-app, @mention, email theo sự kiện, digest theo lịch, đồng bộ real-time.',
      story: 'Là người được giao việc, tôi muốn nhận thông báo khi bị @mention để không bỏ lỡ trao đổi.' },
    { code: 'E08', short: 'Home & Settings', name: 'Home cá nhân và Settings', phase: 'p2', src: '3, 13',
      desc: 'Dashboard widget, My Tasks, Calendar, Log Time nhanh, Todo cá nhân, Settings cá nhân.',
      story: 'Là thành viên, tôi muốn xem mọi task đến hạn hôm nay của mình ở một trang.' },
    { code: 'E09', short: 'Roadmap & template', name: 'Roadmap, dependency, custom field, recurring, template', phase: 'p2', src: '4.7, 5.5–5.8, 6.6',
      desc: 'Gantt kéo thả, phụ thuộc giữa task, trường tuỳ biến, task lặp lại, template project và task.',
      story: 'Là PM, tôi muốn kéo thanh Gantt để dời lịch task và thấy task phụ thuộc bị ảnh hưởng.' },
    { code: 'E10', short: 'Báo cáo', name: 'Reporting và Insights', phase: 'p2', src: '6.8, 9',
      desc: 'Insights từng project; báo cáo toàn tổ chức về project, thành viên, timesheet, utilization; Team-lead Reports.',
      story: 'Là giám đốc, tôi muốn xem project quá hạn và người có task trễ trên một trang tổng quan.' },
    { code: 'E11', short: 'Planner', name: 'Planner, workload, time off, ngày lễ', phase: 'p2', src: '6.7, 8, 14.1',
      desc: 'Lịch phân công theo người × ngày, mức tải, timeline liên project, nghỉ phép, ngày lễ.',
      story: 'Là Admin, tôi muốn thấy ai đang quá tải tuần này để chia lại việc.' },
    { code: 'E12', short: 'Docs, Files, Chat', name: 'Updates, Docs, Files, Inbox', phase: 'p2', src: '3.4, 6.9',
      desc: 'Chat của project, wiki Docs, quản lý file, Inbox gom tin nhắn.',
      story: 'Là thành viên, tôi muốn viết tài liệu đặc tả trong project và nhắc tới task bằng #.' },
    { code: 'E13', short: 'Finance', name: 'Finance và rate card', phase: 'p3', src: '10',
      desc: 'Rate card theo job title, ngân sách và chi phí từng project, lợi nhuận, invoice, dự báo.',
      story: 'Là kế toán, tôi muốn so ngân sách với chi phí thực tế của từng project.' },
    { code: 'E14', short: 'Client Portal', name: 'Client Portal', phase: 'p3', src: '11',
      desc: 'App riêng cho khách hàng: xem tiến độ, duyệt file và milestone, change request, trao đổi, invoice.',
      story: 'Là khách hàng, tôi muốn duyệt bản thiết kế ngay trên portal thay vì qua email.' },
    { code: 'E15', short: 'Project Software', name: 'Project Software (backlog, sprint, epic, release)', phase: 'p3', src: '4.5, 6.3–6.5',
      desc: 'Backlog, sprint, epic, story point, release, báo cáo burndown và velocity.',
      story: 'Là Scrum Master, tôi muốn kết thúc sprint và chuyển issue chưa xong sang sprint sau.' },
    { code: 'E16', short: 'Tích hợp & Admin', name: 'Tích hợp, import, Admin Center, audit log', phase: 'p3', src: '4.2, 6.10, 13, 14.1–14.4',
      desc: 'Slack, Teams, GitHub; import từ Asana, Jira, Trello; quản trị tổ chức; nhật ký bảo mật.',
      story: 'Là Owner, tôi muốn xem nhật ký đổi quyền để kiểm tra khi có sự cố.' },
    { code: 'E17', short: 'Billing', name: 'Billing, gói dịch vụ, AppSumo', phase: 'drop', src: '14.5, 14.6',
      desc: 'Gói Free/Pro/Business, seat, thanh toán Paddle/DirectPay, redeem code. Chỉ cần nếu bán app dạng SaaS.',
      story: 'Chỉ cần nếu bán app dưới dạng SaaS.' }
  ];

  var PEOPLE = {
    vy: { name: 'Thảo Vy', initials: 'TV', color: 'c5', title: 'Designer' },
    anh: { name: 'Minh Anh', initials: 'MA', color: 'c4', title: 'Frontend Developer' },
    long: { name: 'Đức Long', initials: 'ĐL', color: 'c7', title: 'Backend Developer' },
    nam: { name: 'Hoàng Nam', initials: 'HN', color: 'c6', title: 'QA Engineer' },
    bao: { name: 'Quốc Bảo', initials: 'QB', color: 'c2', title: 'Project Manager' },
    ha: { name: 'Thu Hà', initials: 'TH', color: 'c3', title: 'Giám đốc' },
    huy: { name: 'Gia Huy', initials: 'GH', color: 'c1', title: 'Client Admin · Hoa Sen' },
    tram: { name: 'Ngọc Trâm', initials: 'NT', color: 'c8', title: 'Content Writer' },
    tri: { name: 'Minh Trí', initials: 'MT', color: 'c9', title: 'Tư vấn SEO (Guest)' }
  };

  var FLOWS = {
    member: {
      label: 'Thành viên', person: 'vy', color: '#eb2f96',
      intro: 'Một ngày của designer: xem việc hôm nay, cập nhật tiến độ, ghi giờ, trao đổi.',
      steps: [
        { file: 'member/1-my-tasks.html', title: 'Bắt đầu ngày với My Tasks', epics: ['E08', 'E04'] },
        { file: 'member/2-board.html', title: 'Cập nhật tiến độ trên Board', epics: ['E05', 'E09'] },
        { file: 'member/3-task-detail.html', title: 'Trong task: timer, bình luận, @mention', epics: ['E04', 'E06', 'E07', 'E09'] },
        { file: 'member/4-notifications.html', title: 'Thông báo và giờ đã log cuối ngày', epics: ['E07', 'E06', 'E08'] }
      ]
    },
    pm: {
      label: 'PM / Team Lead', person: 'bao', color: '#7265e6',
      intro: 'PM dựng project, chia việc, xếp lịch và xem hiệu suất nhóm.',
      steps: [
        { file: 'pm/1-create-project.html', title: 'Tạo project từ template', epics: ['E03', 'E09', 'E15'] },
        { file: 'pm/2-task-list.html', title: 'Lên danh sách việc và giao người', epics: ['E05', 'E04'] },
        { file: 'pm/3-roadmap.html', title: 'Xếp lịch trên Roadmap (Gantt)', epics: ['E09'] },
        { file: 'pm/4-team-report.html', title: 'Báo cáo nhóm cuối tuần', epics: ['E10', 'E06'] }
      ]
    },
    admin: {
      label: 'Admin / Giám đốc', person: 'ha', color: '#00a2ae',
      intro: 'Giám đốc quản lý con người, cân tải nguồn lực, nhìn toàn cảnh dự án và tiền.',
      steps: [
        { file: 'admin/1-members.html', title: 'Mời người và phân quyền', epics: ['E01', 'E02'] },
        { file: 'admin/2-planner.html', title: 'Cân tải nguồn lực trên Planner', epics: ['E11'] },
        { file: 'admin/3-reporting.html', title: 'Theo dõi toàn bộ dự án', epics: ['E10'] },
        { file: 'admin/4-finance.html', title: 'Ngân sách và chi phí dự án', epics: ['E13'] }
      ]
    },
    client: {
      label: 'Khách hàng', person: 'huy', color: '#f56a00',
      intro: 'Khách hàng vào portal riêng: xem tiến độ, duyệt thiết kế, gửi yêu cầu thay đổi.',
      steps: [
        { file: 'client/1-dashboard.html', title: 'Xem tiến độ trên Client Portal', epics: ['E14'] },
        { file: 'client/2-approval.html', title: 'Duyệt bản thiết kế', epics: ['E14'] },
        { file: 'client/3-discussion.html', title: 'Trao đổi và gửi yêu cầu thay đổi', epics: ['E14', 'E12'] }
      ]
    }
  };
  var ROLE_ORDER = ['member', 'pm', 'admin', 'client'];

  // Top menu differs per role: this is itself part of the permission story.
  var MENUS = {
    member: ['home', 'projects'],
    pm: ['home', 'projects', 'teamreports'],
    admin: ['home', 'projects', 'planner', 'reporting', 'finance', 'portal']
  };
  var MENU_LABELS = {
    home: 'Home', projects: 'Projects', planner: 'Planner', reporting: 'Reporting',
    finance: 'Finance', portal: 'Client Portal', teamreports: 'My Team Reports', settings: 'Settings'
  };
  var RAILS = {
    home: ['Overview', 'My Tasks', 'Calendar', 'Inbox', 'Log Time', 'Todo List', 'My Team'],
    projects: ['Overview', 'Time Entries', 'Recurring Tasks', 'Files', 'Templates'],
    planner: ['Schedule', 'Timeline', 'Workload'],
    reporting: ['Overview', 'Projects', 'Members', 'Time Reports', 'Tasks', 'Progress Tracking'],
    finance: ['Overview', 'Profitability', 'Budgets', 'Invoices', 'Expenses', 'Billable Time', 'Utilization', 'Forecasts'],
    teamreports: ['Tổng quan nhóm', 'Time Tracking', 'Team Performance', 'Detailed Logs'],
    settings: ['Profile', 'Notifications', 'Team Members', 'Team Hierarchy', 'Guest Members', 'Job Titles', 'Clients', 'Labels', 'Rate Card', 'Integrations']
  };

  var NOTIFS = {
    member: [
      { id: 'm1', who: 'bao', text: 'đã nhắc bạn trong <b>WEB-12 Thiết kế trang chủ v2</b>: “@Thảo Vy khách muốn xem bản v2 trước thứ Sáu nhé”', time: '10 phút trước', tag: 'Mention' },
      { id: 'm2', who: 'huy', text: 'Khách hàng <b>Hoa Sen</b> đã duyệt file <b>Trang chủ v2.fig</b> trên Client Portal', time: '35 phút trước', tag: 'Client activity' },
      { id: 'm3', who: 'bao', text: 'đã giao cho bạn <b>WEB-15 Thiết kế trang Liên hệ</b>', time: '1 giờ trước', tag: 'Giao việc' },
      { id: 'm4', who: 'anh', text: 'đã bình luận trong <b>WEB-9 Bộ icon mới</b>: “Mình cần thêm bản SVG 24px”', time: 'Hôm qua', tag: 'Bình luận', read: true },
      { id: 'm5', who: 'ha', text: 'đã thêm bạn vào project <b>Chiến dịch Tết 2027</b>', time: 'Hôm qua', tag: 'Project', read: true }
    ],
    pm: [
      { id: 'p1', who: 'vy', text: 'đã chuyển <b>WEB-12 Thiết kế trang chủ v2</b> sang <b>Chờ duyệt</b>', time: '20 phút trước', tag: 'Status' },
      { id: 'p2', who: 'long', text: 'đã log 6 giờ cho <b>WEB-20 API đăng ký nhận tin</b>, vượt ước lượng 2 giờ', time: '2 giờ trước', tag: 'Time log' },
      { id: 'p3', who: 'huy', text: 'Khách hàng <b>Hoa Sen</b> gửi change request “Thêm trang Tuyển dụng”', time: 'Hôm qua', tag: 'Client activity', read: true }
    ],
    admin: [
      { id: 'a1', who: 'bao', text: 'đã tạo project <b>Website Hoa Sen</b> từ template Website Redesign', time: '1 giờ trước', tag: 'Project' },
      { id: 'a2', who: 'anh', text: 'đã đánh dấu nghỉ phép <b>Thứ Sáu 06/11</b> (Vacation)', time: '3 giờ trước', tag: 'Time off' },
      { id: 'a3', who: 'bao', text: 'đổi health của <b>App giao hàng</b> sang <b>At risk</b>', time: 'Hôm qua', tag: 'Project', read: true }
    ]
  };

  // ---------- Storage helpers ----------

  function load(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable: demo still works without persistence */ }
  }

  function decisions() { return load(STORE.scope, {}); }
  function phaseOf(code) {
    var d = decisions()[code];
    if (d && PHASES[d.phase]) return d.phase;
    var epic = EPICS.filter(function (e) { return e.code === code; })[0];
    return epic ? epic.phase : 'mvp';
  }

  // ---------- DOM helpers ----------

  function el(tag, attrs, html) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (html != null) node.innerHTML = html;
    return node;
  }
  function avatar(id, extra) {
    var p = PEOPLE[id];
    if (!p) return '';
    return '<span class="av ' + p.color + (extra ? ' ' + extra : '') + '" title="' + p.name + '">' + p.initials + '</span>';
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var toastWrap;
  function toast(msg, type) {
    if (!toastWrap) { toastWrap = el('div', { 'class': 'toast-wrap', role: 'status', 'aria-live': 'polite' }); document.body.appendChild(toastWrap); }
    var t = el('div', { 'class': 'toast ' + (type || 'success') }, escapeHtml(msg));
    toastWrap.appendChild(t);
    setTimeout(function () { t.remove(); }, 2800);
  }

  // ---------- Epic badges ----------

  function renderEpics(scope) {
    var root = document.body.dataset.root || '';
    (scope || document).querySelectorAll('.epic[data-epic]').forEach(function (b) {
      var code = b.dataset.epic;
      var ph = phaseOf(code);
      var epic = EPICS.filter(function (e) { return e.code === code; })[0];
      b.className = 'epic ' + PHASES[ph].cls;
      b.textContent = code + ' · ' + PHASES[ph].label;
      b.title = (epic ? epic.name : code) + ' — bấm để mở bảng chốt phạm vi';
      b.setAttribute('role', 'link');
      b.tabIndex = 0;
      if (!b.dataset.bound) {
        b.dataset.bound = '1';
        var go = function () { window.location.href = root + 'scope-board.html#' + code; };
        b.addEventListener('click', go);
        b.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
      }
    });
  }

  // ---------- Timer (shared across pages) ----------

  function fmtDuration(sec) {
    sec = Math.max(0, Math.floor(sec));
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }
  var timer = {
    get: function () { return load(STORE.timer, null); },
    start: function (key, name) { save(STORE.timer, { key: key, name: name, startedAt: Date.now() }); refreshTimerChip(); },
    stop: function () {
      var t = timer.get();
      if (!t) return null;
      // Demo speed-up: every real second counts as one minute so the log is visible in a short presentation.
      var seconds = Math.max(60, Math.round((Date.now() - t.startedAt) / 1000) * 60);
      var logs = load(STORE.logs, []);
      logs.unshift({ key: t.key, name: t.name, seconds: seconds, source: 'Timer', at: Date.now() });
      save(STORE.logs, logs);
      try { window.localStorage.removeItem(STORE.timer); } catch (e) { /* ignore */ }
      refreshTimerChip();
      return seconds;
    },
    elapsed: function () {
      var t = timer.get();
      return t ? Math.round((Date.now() - t.startedAt) / 1000) * 60 : 0;
    },
    logs: function () { return load(STORE.logs, []); },
    fmt: fmtDuration
  };
  var timerChip;
  function refreshTimerChip() {
    if (!timerChip) return;
    var t = timer.get();
    if (t) {
      timerChip.classList.add('running');
      timerChip.innerHTML = '● ' + escapeHtml(t.key) + ' · ' + fmtDuration(timer.elapsed());
      timerChip.title = 'Timer đang chạy: ' + t.name + ' (demo: 1 giây = 1 phút)';
    } else {
      timerChip.classList.remove('running');
    }
  }

  // ---------- Notifications drawer ----------

  var drawer;
  function notifReadSet() { return load(STORE.notifRead, {}); }
  function unreadCount(role) {
    var read = notifReadSet();
    return (NOTIFS[role] || []).filter(function (n) { return !n.read && !read[n.id]; }).length;
  }
  function renderNotifs(role, tab) {
    var read = notifReadSet();
    var list = (NOTIFS[role] || []).filter(function (n) {
      var isRead = n.read || read[n.id];
      return tab === 'read' ? isRead : !isRead;
    });
    var body = drawer.querySelector('.drawer-body');
    if (!list.length) {
      body.innerHTML = '<div style="padding:40px 20px;text-align:center" class="muted">' +
        (tab === 'read' ? 'Chưa có thông báo đã đọc.' : 'Bạn đã đọc hết thông báo. 🎉') + '</div>';
      return;
    }
    body.innerHTML = list.map(function (n) {
      var p = PEOPLE[n.who];
      return '<div class="notif-item" data-id="' + n.id + '" style="display:flex;gap:10px;padding:12px 18px;border-bottom:1px solid var(--border);' +
        (tab === 'read' ? '' : 'background:#f0f7ff;') + '">' + avatar(n.who, 'lg') +
        '<div style="flex:1;min-width:0"><div><b>' + (p ? p.name : '') + '</b> ' + n.text + '</div>' +
        '<div class="row small muted mt8"><span class="tag gray">' + n.tag + '</span><span>' + n.time + '</span>' +
        (tab === 'read' ? '' : '<span class="spacer"></span><button class="btn sm text" data-mark="' + n.id + '">Đánh dấu đã đọc</button>') +
        '</div></div></div>';
    }).join('');
  }
  function openNotifications(role) {
    role = role || document.body.dataset.role;
    if (!drawer) {
      drawer = el('aside', { 'class': 'drawer', 'aria-label': 'Thông báo' });
      drawer.innerHTML = '<div class="drawer-head">Thông báo <span class="epic" data-epic="E07"></span><span class="spacer"></span>' +
        '<button class="btn sm text" data-markall>Đọc tất cả</button><button class="btn sm text" data-close aria-label="Đóng">✕</button></div>' +
        '<div class="tabs" style="padding:0 12px;margin:0"><button class="active" data-tab="unread">Chưa đọc</button><button data-tab="read">Đã đọc</button></div>' +
        '<div class="drawer-body"></div>';
      document.body.appendChild(drawer);
      renderEpics(drawer);
      drawer.addEventListener('click', function (e) {
        var t = e.target;
        if (t.closest('[data-close]')) { closeDrawer(); return; }
        var tabBtn = t.closest('[data-tab]');
        if (tabBtn) {
          drawer.querySelectorAll('[data-tab]').forEach(function (b) { b.classList.toggle('active', b === tabBtn); });
          renderNotifs(role, tabBtn.dataset.tab);
          return;
        }
        var mark = t.closest('[data-mark]');
        var read = notifReadSet();
        if (mark) { read[mark.dataset.mark] = true; save(STORE.notifRead, read); }
        else if (t.closest('[data-markall]')) { (NOTIFS[role] || []).forEach(function (n) { read[n.id] = true; }); save(STORE.notifRead, read); toast('Đã đánh dấu tất cả là đã đọc'); }
        else return;
        renderNotifs(role, drawer.querySelector('[data-tab].active').dataset.tab);
        refreshBell(role);
      });
    }
    drawer.hidden = false;
    document.body.classList.add('drawer-open');
    drawer.querySelectorAll('[data-tab]').forEach(function (b) { b.classList.toggle('active', b.dataset.tab === 'unread'); });
    renderNotifs(role, 'unread');
  }
  function closeDrawer() {
    if (drawer) drawer.hidden = true;
    document.body.classList.remove('drawer-open');
  }
  var bell;
  function refreshBell(role) {
    if (!bell) return;
    var n = unreadCount(role);
    var dot = bell.querySelector('.dot');
    if (n) { dot.style.display = ''; dot.textContent = n; } else { dot.style.display = 'none'; }
  }

  // ---------- Chrome builders ----------

  function buildProtoBar() {
    var body = document.body;
    var root = body.dataset.root || '';
    var roleId = body.dataset.role;
    var bar = el('div', { 'class': 'proto-bar no-print', role: 'navigation', 'aria-label': 'Điều hướng prototype' });
    var html = '<a class="pb-home" href="' + root + 'index.html" title="Về trang đầu (phím H)">◆ Prototype Nhịp</a>';
    var prevHref = null, nextHref = null, nextLabel = 'Tiếp →';
    if (roleId && FLOWS[roleId]) {
      var flow = FLOWS[roleId];
      var step = parseInt(body.dataset.step, 10) || 1;
      var cur = flow.steps[step - 1];
      html += '<span class="pb-role" style="color:' + flow.color + ';background:#fff">' + flow.label + '</span>';
      html += '<span class="pb-title">Bước ' + step + '/' + flow.steps.length + ' · ' + cur.title + '</span>';
      html += '<span class="pb-steps">' + flow.steps.map(function (s, i) {
        var cls = i + 1 === step ? 'current' : (i + 1 < step ? 'done' : '');
        return '<a class="pb-step ' + cls + '" href="' + root + s.file + '" title="' + s.title + '">' + (i + 1) + '</a>';
      }).join('') + '</span>';
      prevHref = step > 1 ? root + flow.steps[step - 2].file : root + 'index.html';
      if (step < flow.steps.length) {
        nextHref = root + flow.steps[step].file;
      } else {
        var nextRole = ROLE_ORDER[ROLE_ORDER.indexOf(roleId) + 1];
        if (nextRole) { nextHref = root + FLOWS[nextRole].steps[0].file; nextLabel = 'Vai trò tiếp: ' + FLOWS[nextRole].label + ' →'; }
        else { nextHref = root + 'scope-board.html'; nextLabel = 'Sang bảng chốt phạm vi →'; }
      }
      html += '<button class="pb-btn" data-nav="prev" title="Phím ←">← Trước</button>';
      html += '<button class="pb-btn primary" data-nav="next" title="Phím →">' + nextLabel + '</button>';
    } else {
      html += '<span class="pb-steps"></span>';
    }
    html += '<a class="pb-scope" href="' + root + 'scope-board.html">☰ Bảng chốt phạm vi</a>';
    bar.innerHTML = html;
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('[data-nav]');
      if (!b) return;
      var href = b.dataset.nav === 'prev' ? prevHref : nextHref;
      if (href) window.location.href = href;
    });
    body.insertBefore(bar, body.firstChild);

    document.addEventListener('keydown', function (e) {
      var tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.defaultPrevented) return;
      if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && e.shiftKey) return;
      if (e.key === 'ArrowRight' && nextHref) window.location.href = nextHref;
      else if (e.key === 'ArrowLeft' && prevHref) window.location.href = prevHref;
      else if (e.key === 'h' || e.key === 'H') window.location.href = root + 'index.html';
      else if (e.key === 'n' || e.key === 'N') toggleNotes();
    });
  }

  function buildAppShell() {
    var body = document.body;
    var roleId = body.dataset.role;
    var flow = FLOWS[roleId];
    var me = flow ? PEOPLE[flow.person] : null;
    var area = body.dataset.area || 'home';
    var menu = MENUS[roleId] || MENUS.admin;

    var nav = el('header', { 'class': 'app-nav' });
    nav.innerHTML =
      '<span class="app-logo">Nhịp<small>Sao Mai Digital</small></span>' +
      '<nav class="app-menu" aria-label="Menu chính">' + menu.map(function (m) {
        return '<a href="#" class="' + (m === area ? 'active' : '') + '" data-inert>' + MENU_LABELS[m] + '</a>';
      }).join('') + '</nav>' +
      '<div class="nav-right">' +
      '<span class="nav-timer" aria-live="off"></span>' +
      '<span class="nav-search">🔍 Tìm task, project, thành viên…</span>' +
      '<button class="btn sm primary" data-inert>＋ New</button>' +
      '<button class="nav-icon" data-bell aria-label="Thông báo">🔔<span class="dot" style="display:none"></span></button>' +
      (me ? '<span class="person" title="' + me.name + ' · ' + me.title + '">' + avatar(flow.person, 'lg') + '</span>' : '') +
      '</div>';

    var main = document.querySelector('main');
    var shell = el('div', { 'class': 'app-body' });
    var rail = RAILS[area];
    if (rail && body.dataset.rail !== 'none') {
      var railEl = el('nav', { 'class': 'rail', 'aria-label': MENU_LABELS[area] });
      railEl.innerHTML = '<div class="rail-title">' + MENU_LABELS[area] + '</div>' + rail.map(function (r) {
        return '<a href="#" data-inert class="' + (r === body.dataset.rail ? 'active' : '') + '">' + r + '</a>';
      }).join('');
      shell.appendChild(railEl);
    }
    main.parentNode.insertBefore(nav, main);
    main.parentNode.insertBefore(shell, main);
    shell.appendChild(main);
    main.classList.add('content');

    timerChip = nav.querySelector('.nav-timer');
    refreshTimerChip();
    setInterval(refreshTimerChip, 1000);

    bell = nav.querySelector('[data-bell]');
    refreshBell(roleId);
    bell.addEventListener('click', function () { openNotifications(roleId); });
  }

  function buildClientShell() {
    var body = document.body;
    body.classList.add('shell-client');
    var area = body.dataset.area || 'dashboard';
    var items = [['dashboard', 'Dashboard'], ['projects', 'Projects'], ['approvals', 'Approvals'], ['requests', 'Change Requests'], ['discussions', 'Discussions'], ['invoices', 'Invoices']];
    var nav = el('header', { 'class': 'client-nav' });
    nav.innerHTML =
      '<span class="client-brand"><span class="logo">HS</span><span>Hoa Sen Group<br><small>Client Portal · do Sao Mai Digital cung cấp</small></span></span>' +
      '<nav class="app-menu" aria-label="Menu Client Portal">' + items.map(function (i) {
        return '<a href="#" data-inert class="' + (i[0] === area ? 'active' : '') + '">' + i[1] + '</a>';
      }).join('') + '</nav>' +
      '<div class="nav-right" style="margin-left:auto;display:flex;gap:10px;align-items:center">' +
      '<button class="nav-icon" data-inert aria-label="Thông báo">🔔<span class="dot">2</span></button>' +
      '<span class="person">' + avatar('huy', 'lg') + '<span class="small"><b>Gia Huy</b><br><span class="muted">Client Admin</span></span></span></div>';
    var main = document.querySelector('main');
    main.parentNode.insertBefore(nav, main);
    main.classList.add('client-content');
  }

  // ---------- Project header (inside a project) ----------

  var PROJECT_TABS = ['Task List', 'Board', 'Roadmap', 'Workload', 'Insights', 'Files', 'Members', 'Updates', 'Docs', 'Finance'];
  function buildProjectHeaders() {
    document.querySelectorAll('[data-project-header]').forEach(function (host) {
      var active = host.dataset.projectHeader;
      host.innerHTML =
        '<div class="row wrap" style="gap:10px;margin-bottom:10px">' +
        '<span style="width:12px;height:12px;border-radius:3px;background:#eb2f96;display:inline-block"></span>' +
        '<h1 style="font-size:20px">Website Hoa Sen</h1>' +
        '<span class="tag blue">In Progress</span><span class="tag green">Health: Good</span>' +
        '<span class="muted small">Client: Hoa Sen Group · PM: Quốc Bảo · 03/11 – 31/12/2026</span>' +
        '<span class="spacer"></span>' +
        '<span>' + avatar('bao') + avatar('vy') + avatar('anh') + avatar('long') + avatar('nam') + '</span>' +
        '<button class="btn sm" data-inert>Chia sẻ</button><button class="btn sm" data-inert aria-label="Cài đặt project">⚙</button>' +
        '<button class="btn sm primary" data-inert>＋ Tạo task</button>' +
        '</div>' +
        '<div class="tabs" style="margin-bottom:16px">' + PROJECT_TABS.map(function (t) {
          return '<a href="#" data-inert class="' + (t === active ? 'active' : '') + '">' + t + '</a>';
        }).join('') + '</div>';
    });
  }

  // ---------- Presenter notes ----------

  function toggleNotes(force) {
    var n = document.querySelector('.notes');
    if (!n) return;
    var collapsed = typeof force === 'boolean' ? force : !n.classList.contains('collapsed');
    n.classList.toggle('collapsed', collapsed);
    try { window.sessionStorage.setItem(STORE.notes, collapsed ? '1' : '0'); } catch (e) { /* ignore */ }
  }
  function buildNotes() {
    var n = document.querySelector('.notes');
    if (!n) return;
    var inner = n.innerHTML;
    n.innerHTML = '<div class="notes-head" role="button" tabindex="0" aria-label="Ẩn hoặc hiện ghi chú">📝 Ghi chú trình bày <span class="kbd">phím N</span></div><div class="notes-body">' + inner + '</div>';
    n.classList.add('no-print');
    var head = n.querySelector('.notes-head');
    head.addEventListener('click', function () { toggleNotes(); });
    head.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleNotes(); } });
    var collapsed = false;
    try { collapsed = window.sessionStorage.getItem(STORE.notes) === '1'; } catch (e) { /* ignore */ }
    toggleNotes(collapsed);
  }

  // ---------- Generic behaviours ----------

  function bindGeneric() {
    // Elements outside the demonstrated flow: tell the presenter instead of doing nothing silently.
    document.addEventListener('click', function (e) {
      var inert = e.target.closest('[data-inert]');
      if (!inert) return;
      e.preventDefault();
      toast('Mục này không nằm trong chuỗi trình bày', 'info');
    });
    // Tabs: <div class="tabs" data-tabs="group"> buttons with data-tab, panels with data-panel="group:name"
    document.querySelectorAll('.tabs[data-tabs]').forEach(function (tabs) {
      var group = tabs.dataset.tabs;
      tabs.addEventListener('click', function (e) {
        var b = e.target.closest('[data-tab]');
        if (!b) return;
        tabs.querySelectorAll('[data-tab]').forEach(function (x) { x.classList.toggle('active', x === b); });
        document.querySelectorAll('[data-panel^="' + group + ':"]').forEach(function (p) {
          p.hidden = p.dataset.panel !== group + ':' + b.dataset.tab;
        });
      });
    });
    // Modal open/close: [data-open="#id"], [data-dismiss]
    document.addEventListener('click', function (e) {
      var open = e.target.closest('[data-open]');
      if (open) { var m = document.querySelector(open.dataset.open); if (m) m.hidden = false; return; }
      var dismiss = e.target.closest('[data-dismiss]');
      if (dismiss) { var o = dismiss.closest('.overlay'); if (o) o.hidden = true; }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.overlay:not([hidden])').forEach(function (o) { o.hidden = true; });
      closeDrawer();
    });
  }

  function init() {
    var shell = document.body.dataset.shell || 'app';
    buildProtoBar();
    if (shell === 'app') buildAppShell();
    else if (shell === 'client') buildClientShell();
    buildProjectHeaders();
    buildNotes();
    bindGeneric();
    renderEpics();
  }

  window.WL = {
    EPICS: EPICS, PHASES: PHASES, PHASE_ORDER: PHASE_ORDER, FLOWS: FLOWS, ROLE_ORDER: ROLE_ORDER, PEOPLE: PEOPLE,
    STORE: STORE, load: load, save: save, decisions: decisions, phaseOf: phaseOf,
    avatar: avatar, escapeHtml: escapeHtml, toast: toast, renderEpics: renderEpics,
    timer: timer, openNotifications: openNotifications, el: el
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
