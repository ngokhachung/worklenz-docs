# Worklenz – Danh mục tính năng chi tiết

Oct 23, 2026 · @NGO KHAC HUNG

## Tổng quan

Worklenz là app quản lý dự án all-in-one: project, task, time tracking, lập kế hoạch nguồn lực, báo cáo, tài chính và client portal. Tài liệu này liệt kê các tính năng đọc được từ mã nguồn trong repo (route frontend, API backend, file ngôn ngữ), sắp xếp theo module để chuyển thành Epic và user story.

**Phạm vi mã nguồn**

| Ứng dụng | Thư mục | Người dùng | Công nghệ |
| --- | --- | --- | --- |
| Web app chính (admin + thành viên) | `worklenz-frontend` | Nhân viên trong công ty | React 18, Vite, Ant Design, Redux Toolkit, i18next, Socket.IO client |
| Backend API | `worklenz-backend` | Cả hai app | Node 22, Express, TypeScript, PostgreSQL 15 (nhiều logic trong function SQL), Socket.IO, Redis, cron job |
| Client Portal | `worklenz-client-portal` | Khách hàng bên ngoài | React, đăng nhập bằng client token riêng |
| Lưu trữ file | SeaweedFS / AWS S3 / Azure Blob |  | S3 API |

**Vai trò người dùng**

| Vai trò | Quyền chính |
| --- | --- |
| Owner (chủ team) | Toàn quyền, gồm billing và cài đặt team; quản lý mọi vai trò; truy cập Finance |
| Admin | Quản lý Admin, Team Lead, Member; mời thành viên; truy cập Finance, Planner, Reporting, Client Portal, Admin Center |
| Team Lead | Xem báo cáo của các thành viên mình quản lý (team-lead reports); không quản lý thành viên, không truy cập Finance |
| Member | Làm việc trên project và task được giao; không đổi vai trò, không truy cập Finance |
| Guest (khách mời trong team) | Chỉ vào được project được mời; không có trang Home |
| Project Manager | Vai trò cấp project: quản lý một project cụ thể dù không phải Admin |
| Client (khách hàng) | Đăng nhập Client Portal: xem project, invoice, quote, duyệt yêu cầu, trao đổi |

**Điều hướng chính của web app:** Home, Projects, Planner, Reporting, Finance, Client Portal, Team-lead Reports, Settings, Admin Center. Mỗi khu vực có một rail menu bên trái; người dùng chọn được trang mặc định của rail.

**Quy ước dùng tài liệu:** mỗi module dưới đây là một Epic gợi ý. Mỗi gạch đầu dòng là một khả năng có thể viết thành một hoặc nhiều user story theo mẫu *"Là \[vai trò\], tôi muốn \[hành động\] để \[giá trị\]"*. Tính năng chỉ là màn hình "Coming soon" trong code được ghi rõ là chưa hoàn thiện.

## 1. Xác thực và tài khoản

Người dùng vào app bằng email/mật khẩu, Google hoặc Apple. Lần đầu đăng nhập họ phải qua wizard 3 bước trước khi dùng app.

### 1.1 Đăng ký

- Form: họ tên (tối thiểu 4 ký tự), email, mật khẩu.
- Chính sách mật khẩu 8–32 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt; checklist hiển thị trực tiếp khi gõ; API kiểm tra độ mạnh mật khẩu.
- Kiểm tra trước email/mật khẩu hợp lệ (`signup/check`) trước khi tạo tài khoản.
- Chống bot bằng reCAPTCHA; báo lỗi khi xác minh thất bại.
- Đăng ký bằng Google hoặc Apple.
- Link Điều khoản dịch vụ và Chính sách bảo mật.

### 1.2 Đăng nhập và đăng xuất

- Đăng nhập 2 bước: nhập email → Next → nhập mật khẩu; có nút đổi email.
- Ghi nhớ đăng nhập (Remember me); phiên lưu phía server (session trong PostgreSQL).
- Đăng nhập bằng Google OAuth và Sign in with Apple (web); API riêng cho đăng nhập Google/Apple trên app mobile.
- Màn hình trung gian "Authenticating…" và "Logging out…"; thông báo lỗi đăng nhập rõ ràng.
- Tự chuyển hướng sau đăng nhập: thành viên đến Home, khách (guest) đến danh sách Project; quay lại trang định vào trước đó.
- Chuyển đổi giao diện sáng/tối ngay trên trang đăng nhập.

### 1.3 Quên và đặt lại mật khẩu

- Nhập email → hệ thống gửi link đặt lại qua email (có giới hạn số lần gửi).
- Trang đặt mật khẩu mới từ link (`verify-reset-email/:user/:hash`): nhập và xác nhận mật khẩu, checklist độ mạnh, gửi lại email.
- Thông báo thành công và quay về đăng nhập.

### 1.4 Lời mời tham gia

- Mời vào team qua email; gửi lại lời mời.
- Link mời vào team dùng chung (Owner/Admin tạo, xem trạng thái, thu hồi).
- Link mời vào một project cụ thể (`/invite/project/:token`).
- Trang nhận lời mời:
  - Hiển thị người mời, tên team hoặc project, mức quyền.
  - Tự điền tên/email nếu đã đăng nhập.
  - Nút Tham gia hoặc Từ chối.
  - Xử lý link hết hạn hoặc sai.
- Lời mời dành cho khách hàng vào tổ chức (`/organization-invite`), dẫn sang Client Portal.

### 1.5 Wizard thiết lập tài khoản lần đầu

Bắt buộc trước khi vào app; chưa xong thì mọi route bị chuyển về `/worklenz/setup`.

1. **Tổ chức:** đặt tên workspace, tự gợi ý từ tên miền email hoặc tên người dùng.
2. **Project đầu tiên:** nhập tên, chọn nhanh một gợi ý (Website Redesign, Marketing Campaign, Product Launch, Client Onboarding) hoặc tạo từ template.
3. **Mời team:** tối đa 5 email, có thể bỏ qua.

Sau đó app mở thẳng danh sách task của project vừa tạo. Người dùng có thể đổi tài khoản ngay trong wizard, và có khảo sát sau thiết lập (bỏ qua được, chọn "không hiện lại").

### 1.6 Kiểm soát truy cập theo trạng thái

- **Hết hạn gói/trial:** chuyển sang trang License expired; vẫn vào được Admin Center, Settings và trang project.
- **Không đủ quyền:** hiện trang Unauthorized.
- **Link rút gọn:** `/worklenz/t/:taskId` mở task, `/worklenz/c/:commentId` mở comment.

## 2. Team, thành viên và phân quyền

Một tổ chức (organization, do Owner sở hữu) có nhiều team. Một người có thể thuộc nhiều team và chuyển team đang hoạt động; mọi dữ liệu (project, task, label…) đều nằm trong phạm vi team.

### 2.1 Team

- Xem danh sách team mình tham gia, chuyển team đang hoạt động.
- Xem và chấp nhận lời mời vào team khác.
- Tạo team mới (Owner/Admin), đổi tên team.
- Ghim mục cài đặt lên menu chính.

### 2.2 Quản lý thành viên

- Danh sách thành viên:
  - Cột: tên, email, số project, job title, Team Lead, mức quyền.
  - Tìm theo tên, phân trang, làm mới.
  - Gắn nhãn "đang chờ chấp nhận" hoặc "đã vô hiệu hoá".
- Hiển thị số seat đã dùng / giới hạn theo gói. Khi hết seat, hiện popover kèm nút Nâng cấp hoặc Mua thêm seat.
- Mời qua email:
  - Nhập nhiều email cùng lúc.
  - Chọn job title, mức quyền, phòng ban (department), practice.
  - Thêm lời nhắn cá nhân.
  - Tuỳ chọn quyền "tạo project từ template": thành viên thành Project Manager của project mới, không có quyền tài chính.
- Mời qua link: tạo, sao chép, vô hiệu hoá link; link tự hết hạn sau N ngày.
- Gửi lại email mời; thành viên được thêm vào team ngay cả khi chưa chấp nhận.
- Sửa thành viên: mức quyền, job title, manager (Team Lead); đổi tên trực tiếp trên dòng.
- Vô hiệu hoá hoặc kích hoạt lại (thành viên bị vô hiệu không tính seat); xoá thành viên có xác nhận.
- Quản lý ngày nghỉ (time off) của từng thành viên.
- Xuất file dữ liệu toàn bộ thành viên hoặc từng người.
- Trang tổng quan một thành viên (Owner/Admin): số liệu, biểu đồ, các project họ tham gia.

### 2.3 Vai trò và quyền

- 5 mức cấp team: Owner, Admin, Team Lead, Member, Guest (chỉ đọc). Mức cấp project: Project Manager.
- Modal "Role Permissions" giải thích quyền của từng vai trò.
  - Mời và sửa thành viên.
  - Quản lý vai trò.
  - Gán Team Lead.
  - Truy cập Finance.
- Owner không thể bị đổi vai trò; Admin quản lý mọi tài khoản trừ Owner.
- Kiểm tra quyền ở cả frontend (guard route) và backend (validator theo vai trò, theo quyền truy cập project/task).

### 2.4 Team Lead và cây tổ chức

- Gán một Team Lead làm manager cho Member, gán hàng loạt (xem trước "sẽ quản lý N người"), gỡ gán.
- Trang Team Hierarchy:
  - Số liệu tóm tắt: tổng thành viên, số Team Lead, số đã gán, số chưa gán.
  - Khối Ban quản lý (Owner/Admin).
  - Khối của từng Team Lead, chia cấp dưới trực tiếp và gián tiếp.
  - Khối thành viên chưa được gán.
  - Tìm theo tên, email, vai trò, team.
- Team Lead được xem báo cáo của các thành viên mình quản lý (mục 9.4).

### 2.5 Khách (Guest)

- Mời khách vào một project cụ thể:
  - Chọn project, nhập nhiều email hoặc tạo link mời.
  - Project Manager mời được khách vào project mình quản lý.
- Khách chỉ thấy project được mời, không vào được cài đặt tổ chức. Quyền xem từng view (roadmap, workload…) có thể bị giới hạn riêng.
- Danh sách khách: project, job title; kích hoạt, vô hiệu hoá, xoá; tìm theo tên hoặc email.
- Giới hạn số khách theo gói; API theo dõi guest seat đã dùng.

### 2.6 Dữ liệu danh mục về con người

- **Job Titles:** tạo, sửa, xoá, tìm, phân trang; được dùng cho rate card tài chính.
- **Departments (phòng ban):** tạo, sửa, xoá, tìm.
- **Practices (mảng chuyên môn / service line):** tạo, sửa, xoá, tìm.

## 3. Home (không gian làm việc cá nhân)

Home gom việc của riêng người đang đăng nhập vào 8 trang trên rail trái. Người dùng sắp xếp, ẩn/hiện và chọn trang mở mặc định. Guest không có Home.

### 3.1 Overview (dashboard widget)

Các widget có sẵn:

- **Greeting:** lời chào kèm ngày và việc cần chú ý hôm nay.
- **Summary cards:** task hôm nay/tuần này, quá hạn, đã hoàn thành, Focus time (billable / non-billable).
- **Task priorities:** việc hôm nay hoặc tuần này; chuyển giữa task giao cho tôi và task tôi giao.
- **My progress:** biểu đồ donut Done / Doing / To do.
- **Continue where you left off:** 4 tab Projects, Tasks, Activity, Time Logged.
- **Team members:** danh sách thành viên team.
- **Tasks assigned by me:** task tôi đã giao để theo dõi.
- **Mentions:** comment có @mention tôi, trả lời ngay tại widget.
- **My todo list:** thêm và tích việc cá nhân.
- **Projects at Risk:** project bị gắn cờ rủi ro.

Tùy biến (Customize Home):

- Thêm, xoá widget; kéo thả giữa vùng chính và panel phụ, hỗ trợ bàn phím.
- Chọn kỳ hiển thị cho từng widget.
- Khôi phục mặc định.
- Tuỳ chọn được lưu trên server (home preferences).

### 3.2 My Tasks

- Bảng task của tôi: ID, tên task, project, status, priority, assignee, hạn.
- Tab lọc: All, Today, Upcoming, Overdue, No due date, Pinned. Người dùng chọn tab nào hiện và thứ tự.
- Chuyển giữa "Assigned to me" và "Assigned by me".
- Thống kê: tổng task, đến hạn hôm nay, đang làm.
- Lọc theo project, tìm theo key hoặc tên, phân trang; sắp xếp tuỳ chỉnh.
- Ghim task lên đầu (có giới hạn số task ghim).
- Thêm task nhanh:
  - Gõ tên, nhấn Tab để chọn hạn (Today, Tomorrow, Next week, Next month) và project.
  - Hoặc nhận một task chưa ai làm ("From Unassigned").
  - Mời email mới vào project hoặc team ngay khi giao việc.
- Quyền tạo task có thể bị giới hạn chỉ Admin/Team Lead ("Task Creation Restricted").
- Đánh dấu nghỉ phép (Mark Time-Off / Leave), loại Vacation / Sick / Personal / Other.

### 3.3 Calendar

- Lịch task cá nhân theo tuần, tháng, năm; nút Today.
- Thêm task trực tiếp vào ngày.
- Lọc theo status, client, project.

### 3.4 Inbox (tin nhắn)

- Gom mọi cuộc trò chuyện theo project và theo client; tab All / Projects / Clients.
- Tìm chat, bắt đầu chat mới với một project hoặc client.
- Ghim chat, ghim tin nhắn, xem tin đã ghim; tin nhắn có trạng thái "(edited)".
- Chat với client chỉ có ở gói Business.

### 3.5 Log Time (nhập giờ nhanh)

- Form Quick Time Entry:
  - Chọn project, rồi task; tạo task mới ngay trong form.
  - Nhập theo thời lượng (giờ/phút) hoặc theo khoảng giờ (bắt đầu – kết thúc).
  - Chọn ngày, ghi mô tả công việc.
- Chặn log giờ trước ngày bắt đầu của project, có cảnh báo.
- Tổng hôm nay và tuần này, tách billable / non-billable; biểu đồ theo ngày trong tuần.
- Bảng "Recently Logged": task, project, status, priority, billable, thời gian, ngày.

### 3.6 Todo List cá nhân

- Danh sách việc riêng, tách khỏi task của project.
- Thêm bằng Enter, đánh dấu xong, ẩn/hiện việc đã xong.
- Lọc theo All, Today, This Week, This Month, This Year; đếm số việc còn lại và đã xong.

### 3.7 My Team

- Bảng thành viên: email, job title, quyền, Team Lead, số project đang hoạt động.
- Sửa, kích hoạt/vô hiệu hoá, xoá thành viên; mời thành viên mới.

### 3.8 Add Client (Admin)

- Form tạo client nhanh.
- Bảng client kèm số liệu: mới trong tháng, thiếu thông tin liên hệ.
- Portal cho client yêu cầu gói Business.

## 4. Quản lý Project

Project có hai loại: **General** (task, phase) và **Software** (issue, backlog, sprint, epic, release). Mọi cấu hình nằm trong một modal Project Settings nhiều tab.

### 4.1 Danh sách project (Projects → Overview)

- Tab All, Favorites, Archived; tìm theo tên; phân trang.
- Hai kiểu hiển thị:
  - List view.
  - Group view, nhóm theo Priority, Category hoặc Client.
- Cột: tên, client, category, status, priority, tiến độ task, thành viên, ngày kết thúc, cập nhật lần cuối, yêu thích, nút cài đặt.
- Ẩn/hiện cột (Show Fields); lọc theo client, category, status, priority; bấm vào giá trị để lọc nhanh.
- Đánh dấu yêu thích; lưu trữ hoặc bỏ lưu trữ có xác nhận.
- Guest không mở được cài đặt project.
- Các mục khác trong rail Projects: Time Entries (mục 7), Recurring Tasks (mục 5), Files, Templates. Workload, Roadmap và Archived trong rail còn đang là trang "Coming soon".

### 4.2 Tạo project

- Modal "New project":
  - Nhập tên, chọn loại General hoặc Software, chọn màu.
  - Bắt đầu trống hoặc từ template: built-in hoặc "Your Library" (template của tổ chức).
  - Tìm và xem trước template, hiển thị số task và số phase.
- Tuỳ chọn "Customize before creating" để đặt client, status, ngày, manager trước khi tạo.
- Tạo project bằng cách import task từ CSV.
- Import từ công cụ khác: Asana, Jira, Trello, Monday.com, ClickUp.
  - Wizard: kết nối → chọn list/board → thiết lập project → map field → map status → chuyển user → xem lại → import.
  - Chạy nền, có tiến độ, log, huỷ được.
- Quyền: Owner/Admin tạo project trống. Thành viên có quyền "tạo từ template" chỉ tạo được từ template.
- Sau khi tạo, banner "Your project is ready!" nhắc vào cài đặt.

### 4.3 Project Settings (tab General)

- **Basic details:**
  - Tên, project key (tiền tố mã task, ví dụ `WEB-12`), màu.
  - Status: Proposed, In Planning, In Progress, On Hold, Blocked, Completed, Cancelled, Continuous.
  - Health: Not Set, Good, Needs Attention, At Risk.
  - Delivery Confidence: Not set, On track, At risk, Off track. Do Admin/PM đánh giá tay, kèm ghi chú.
  - Category (tạo mới ngay khi gõ), Notes.
- **Client và Manager:** tìm hoặc tạo client ngay tại đây; chọn Project Manager.
- **Timeline và ước lượng:**
  - Ngày bắt đầu và kết thúc (kiểm tra thứ tự).
  - Số ngày làm việc ước tính, số man-day.
  - Số giờ mỗi ngày (1–24).
- Hiển thị người tạo, ngày tạo, lần cập nhật cuối.

### 4.4 Project Settings (các tab còn lại)

- **Advanced:**
  - Cách tính tiến độ, chọn một: Manual, Weighted (theo trọng số subtask), Time-based (theo thời gian ước lượng).
  - Tự giao task cho người tạo.
  - Chỉ Admin/Team Lead được tạo và giao task (gói Business).
  - Phase Assignees: mỗi phase có người phụ trách; chỉ người đó được đẩy task sang phase sau, Admin có thể ghi đè.
  - Subtask tự kế thừa phase của task cha.
- **Project Privacy:** thành viên chỉ thấy task được giao cho mình. Owner/Admin/Team Lead/PM/Guest vẫn thấy tất cả.
- **Budget** (gói Business): ngân sách, tiền tệ.
- **Statuses, Phases, Custom Columns:** cấu hình luồng trạng thái, phase và cột tùy biến (chi tiết ở mục 5; số cột giới hạn theo gói).
- **Integrations:** Slack, Microsoft Teams, GitHub (chỉ cho project Software).
- **Task Export** (gói Business):
  - Chọn xuất Tasks, Comments, Files ra CSV hoặc ZIP.
  - Chạy nền, báo khi xong.
  - Lịch sử export với trạng thái Processing / Ready / Failed / Expired.
- **Danger Zone:** xoá project vĩnh viễn, xác nhận hai lớp. Xoá cả task, subtask, work log, comment, file, thành viên.

### 4.5 Cài đặt riêng cho project Software

- **Details:** project key (chữ, số, `-`, `_`), mô tả, status và tracking, timeline tổng.
- **Team & access:**
  - Project lead (gói trả phí).
  - Tự giao issue cho người tạo.
  - Chỉ Admin/Team Lead được tạo issue.
  - Thành viên chỉ thấy issue của mình.
- **Workflow:** status và sprint (lập kế hoạch, bắt đầu, hoàn thành, xử lý việc còn dở).
- **Estimation:**
  - Thang story point có sẵn: Fibonacci, Modified Fibonacci, Powers of two, Linear 1–10.
  - Hoặc tự nhập tối đa 30 giá trị.
- Thuật ngữ tự đổi: Task → Issue, Phase → Sprint, Unmapped → Backlog. Project mở mặc định ở tab Backlog.

### 4.6 Thanh header trong project

- Tạo task/issue, import task từ task template, import từ CSV.
- Mở Settings, làm mới dữ liệu, quay lại danh sách.
- Theo dõi hoặc bỏ theo dõi thông báo project; đăng ký email tóm tắt project mỗi tối.
- Save as Template:
  - Chọn thành phần project: status, phase, label, custom column.
  - Chọn cài đặt: category, PM, ước lượng, cài đặt nâng cao, budget.
  - Chọn thành phần task: tên, priority, status, phase, label, ước lượng, mô tả, subtask, assignee, recurring, dependency, billable.
  - Có nút chọn nhanh: tất cả, chỉ phần thiết yếu, bỏ chọn.
- Invite/Share: mời thành viên bằng email hoặc link (mục 6.7).
- Mỗi thành viên ghim tab mặc định khi mở project; bộ lọc được nhớ lại.

### 4.7 Template

Trang Templates có 3 tab: Project Templates, Task Templates, Built-in Templates.

- Tìm, xem trước, đổi tên, nhân bản, xoá template.
- **Edit definition:** sửa phase, status (kèm category), label, task (status, priority, phase, task cha, ước lượng phút).
- **Copy & Customize:** từ template built-in tạo template riêng; "Use this Template" để tạo project ngay.
- Chia sẻ template với cả tổ chức (Admin), hiện badge Organization.
- Task template được tạo từ thao tác hàng loạt trên task list, sau đó import lại vào project khác.

### 4.8 Danh mục dùng cho project

- **Project Categories:** tạo, sửa, xoá, đặt màu; xem category của nhiều team trong tổ chức.
- **Clients:** xem mục 11.
- **Project Managers:** danh sách PM toàn tổ chức, dùng cho bộ lọc báo cáo.

## 5. Quản lý Task

Task là đơn vị công việc trung tâm. Task có subtask nhiều cấp, được sửa trực tiếp trên list/board hoặc trong Task Drawer. Mọi thay đổi đồng bộ real-time tới người khác qua Socket.IO.

### 5.1 Các trường của task

| Trường | Ghi chú |
| --- | --- |
| Task key | Tự sinh theo project key (ví dụ `WEB-12`), sao chép được |
| Tên, mô tả | Mô tả soạn bằng rich text, đếm số từ, cảnh báo khi offline hoặc lưu lỗi |
| Status | Thuộc một trong 3 nhóm To do / Doing / Done; tùy biến theo project |
| Priority | Low, Medium, High, Critical |
| Phase / Sprint | Phase cho project General, Sprint cho Software |
| Assignees, Reporter | Nhiều assignee; mời email mới ngay trong ô chọn |
| Labels | Nhãn cấp team; tìm hoặc tạo mới bằng Enter |
| Start date, Due date, Due time | Ẩn/hiện start date |
| Time estimation | Giờ + phút |
| Progress, Weight | Progress 0–100% (chế độ manual); weight của subtask (chế độ weighted). Đạt 100% thì hỏi có chuyển sang Done không |
| Billable | Cờ tính tiền, dùng cho tài chính |
| When done, notify | Chọn người nhận thông báo khi task hoàn thành |
| Subscribers | Người theo dõi task |
| Recurring | Lặp lại theo lịch (mục 5.6) |
| Custom fields | Các cột tùy biến của project (mục 5.7) |
| Riêng project Software | Issue type, story points, epic, release, cờ Blocked |

### 5.2 Tạo và thao tác với task

- Tạo nhanh ngay trong nhóm (gõ tên, nhấn Enter), tạo từ Home, Roadmap, Board hoặc qua nút Create task/issue.
- Subtask:
  - Thêm ngay trên dòng task hoặc trong drawer.
  - Chuyển task thành subtask và ngược lại.
  - Di chuyển giữa các cấp cha/con; thanh breadcrumb quay về task cha.
- Menu chuột phải:
  - Duplicate, Assign to me, Copy link.
  - Move to (status, phase, sprint).
  - Archive / Unarchive.
  - Chuyển task ↔ subtask.
  - Delete có xác nhận.
- Duplicate task: chọn sao chép subtask, file đính kèm, ngày, dependency, assignee, label, giá trị custom field, subscriber.
- Copy task sang project khác:
  - So sánh khác biệt giữa hai project: cột thiếu, phase thiếu, status không khớp.
  - Tuỳ chọn tự tạo cột và phase còn thiếu.
  - Tuỳ chọn copy kèm các task phụ thuộc.
- Kéo thả để sắp xếp thứ tự và chuyển nhóm (status/phase/priority).
- Archive task; tùy chọn "Show archived" để xem lại.
- Tìm task toàn cục (quick search) và link rút gọn tới task.
- Chặn truy cập: khi bật privacy, thành viên mở task không được giao sẽ thấy "No access". Người chỉ được giao subtask thì xem task cha ở chế độ chỉ đọc.

### 5.3 Task Drawer (chi tiết task)

- **Tab Info:** chi tiết các trường, mô tả, custom fields (tự lưu), subtask, dependency, attachment, comment. Chuyển sang task trước/sau.
- **Dependencies:** quan hệ "Blocked By"; tìm task để liên kết, xoá liên kết; kiểm tra trạng thái phụ thuộc trước khi đổi status.
- **Attachments:**
  - Kéo thả, chọn file hoặc dán bằng Ctrl+V.
  - Giới hạn dung lượng theo gói; tải về, xoá.
  - Upload thẳng lên S3 qua presigned URL.
- **Comments:**
  - @mention, reaction, sửa (đánh dấu "(edited)"), xoá.
  - Đính kèm tối đa N file, 25MB mỗi file ở gói thường.
  - Copy link tới từng comment.
  - Enter để gửi, Shift+Enter để xuống dòng.
- **Tab Time Log:** chi tiết ở mục 7.
- **Tab Activity Log:** ghi lại mọi thay đổi (status, priority, phase, progress, weight, tên, ngày, ước lượng, label, mô tả, file, comment, assignee, archive).
- Giới hạn theo gói: gói thấp chỉ xem 90 ngày gần nhất của comment, time log và activity.

### 5.4 Thao tác hàng loạt (Bulk actions)

- Chọn nhiều task (hoặc cả nhóm), rồi:
  - Đổi status, priority, phase; chuyển sprint.
  - Thêm label (tạo mới ngay), Assign to me, gán thành viên.
  - Đặt hoặc xoá due date, start date.
  - Archive / Unarchive, Delete có xác nhận.
- Tạo Task Template từ các task đã chọn; tuỳ chọn giữ cấu trúc subtask.
- Thông báo kết quả "N task và M subtask đã archive".

### 5.5 Status và Phase

- **Status theo project:**
  - Thêm, đổi tên, đổi màu, đổi category.
  - Kéo để sắp xếp trong nhóm To do / Doing / Done.
  - Không cho để một category trống.
  - Xoá status phải chọn status thay thế cho các task đang dùng nó.
- **Phase:**
  - Đặt nhãn chung cho phase (ví dụ "Stage").
  - Thêm, đổi tên, đổi màu, kéo sắp xếp; ngày bắt đầu/kết thúc của phase.
  - Người phụ trách mặc định (khi bật Phase Assignees).
- **Sprint (Software):**
  - Tạo sprint tự đặt tên "Sprint N"; đặt tên, mục tiêu, ngày.
  - Start sprint.
  - Complete sprint: chuyển việc chưa xong sang sprint khác hoặc về Backlog; tuỳ chọn tự archive issue đã xong.
  - Tự bắt đầu sprint kế tiếp.
  - Xoá sprint: issue quay về Backlog.

### 5.6 Recurring tasks (gói Business)

- Cấu hình lặp lại:
  - Daily, Weekly (chọn thứ), Every X days, Every X weeks, Every X months, Yearly.
  - Monthly theo ngày cố định hoặc theo thứ của tuần thứ N (First…Last).
- Hai chế độ: tạo task mới theo lịch, hoặc đổi status của chính task đó sang status đích.
- Trang Recurring Tasks toàn team:
  - Cột: key, task, kiểu lặp, project, assignee, lịch, ngày, ước lượng, priority.
  - Trạng thái Active / Paused.
  - Lọc theo project, assignee, kiểu lặp, chu kỳ.
- Cron job phía server sinh task theo lịch.

### 5.7 Custom columns (trường tùy biến)

- Kiểu dữ liệu:
  - People, Text, Date, Checkbox, Key.
  - Number: Unformatted, Percentage, With label (trái/phải), Formatted; chọn số thập phân.
  - Selection (danh sách có màu), Labels.
  - Formula: cộng, trừ, nhân, chia giữa hai cột số.
- Tạo, sửa, xoá, ẩn/hiện trên list; không đổi được kiểu sau khi tạo; Guest không được thêm.
- Số custom field giới hạn theo gói, có popover nâng cấp.

### 5.8 Labels và Task templates

- **Labels cấp team:** tạo, đổi tên, đổi màu, xoá (Owner/Admin); xem label theo project hoặc theo task.
- **Task templates:**
  - Tạo, sửa, nhân bản, xoá.
  - Chia sẻ với tổ chức.
  - Import vào project hiện tại.

## 6. Các view trong một project

Mỗi project có tối đa 13 tab. Người dùng ghim một tab làm mặc định, các tab ít dùng nằm trong menu "More".

Khi người khác đổi status, health, ngày, category hoặc quyền của bạn, app hiện thông báo và tải lại view.

| Tab | General | Software | Guest |
| --- | --- | --- | --- |
| Task List / List | Có | Có (Software List) | Xem được |
| Board | Có | Có | Xem được |
| Backlog | Không | Có (tab mặc định) |  |
| Roadmap (Gantt) | Có | Có | Xem được nếu được cấp |
| Workload | Có | Có | Xem được nếu được cấp |
| Insights, Files, Members, Updates, Docs | Có | Có | Members xem được |
| Releases, Reports | Không | Có |  |
| Finance | Có (Business, có quyền tài chính) | Có | Không |

### 6.1 Task List

- Nhóm task theo Status, Priority hoặc Phase:
  - Đổi tên nhóm, đổi category ngay tại header nhóm.
  - Thu gọn hoặc mở rộng nhóm; chọn cả nhóm.
- Cột ẩn/hiện được:
  - Key, Task, Description, Progress, Assignees, Labels, Phase, Status, Priority.
  - Time tracking, Estimation.
  - Start date, Due date, Due time, Completed date, Created date, Last updated.
  - Reporter, Attachments, Latest comment, custom columns.
  - Cấu hình thứ tự cột trong "Configure Show Fields", lưu theo project.
- Sửa trực tiếp mọi ô (inline). Dòng task hiện biểu tượng số subtask, comment, file, subscriber, dependency, recurring.
- Bộ lọc:
  - Tìm theo tên (phím tắt `/`).
  - Lọc theo status, priority, phase/sprint, assignee, label, custom field.
  - Show archived.
  - Sắp xếp tăng/giảm theo từng trường.
  - Quick filter: My work, Bugs, Blocked.
  - Bộ lọc được nhớ theo người dùng.
- Export danh sách đã lọc ra CSV (gói Business).
- Kéo thả task giữa các nhóm; thao tác hàng loạt (mục 5.4).
- Quản lý Status, Phase hoặc Sprint ngay từ toolbar.

### 6.2 Board (Kanban)

- Cột theo Status, Priority hoặc Phase.
- Kéo thả thẻ giữa cột; kéo đổi thứ tự cột.
- Chặn chuyển sang Done khi dependency chưa hoàn thành.
- Thêm section (status hoặc phase mới), đổi tên, đổi category, xoá có xác nhận.
- Thẻ task:
  - Priority, hạn, assignee, label, story points, cờ Blocked.
  - Hiện hoặc ẩn subtask.
- Thêm task hoặc subtask ngay trên cột; đặt hạn nhanh (Today, Tomorrow, Next week); Assign to me; Archive.

### 6.3 Backlog và Software List (project Software)

- Backlog gồm issue chưa vào sprint, sprint đang chạy và các sprint đã lên kế hoạch.
- Mỗi sprint hiển thị số issue và điểm đã xong, scope thêm sau khi bắt đầu. Thao tác: Start, Complete, Edit, View on Board.
- Sprint health của sprint đang chạy:
  - % hoàn thành.
  - Số issue Blocked, số issue critical/high còn mở.
  - Trạng thái On track / At risk / Overdue.
- Epics:
  - Tạo và sửa epic: tên, mô tả, owner, màu.
  - Theo dõi tiến độ theo % và theo điểm.
  - Archive hoặc restore; lọc Backlog theo epic.
- Tạo issue đầy đủ:
  - Summary, mô tả.
  - Type: Task, Story, Bug, Subtask, Epic.
  - Assignee, issue cha, epic, estimate.
  - Tuỳ chọn "Create another" để tạo liên tục.
- Đặt story point trực tiếp trên dòng; chỉnh thang điểm (Point scale).
- Software List: bảng work item (status, epic, assignee, priority, points, sprint), tìm và lọc theo epic.

### 6.4 Releases (project Software)

- Tạo version: tên, ngày dự kiến, mô tả; thêm work item hoặc cả epic (chọn các item con đủ điều kiện).
- Bảng release gồm status (Released / Unreleased), ngày dự kiến, tiến độ, số critical bug.
- Độ tin cậy của release tự tính:
  - Planning, On track, At risk, Overdue, Released.
  - At risk khi còn critical bug, có việc bị chặn, hoặc dưới 80% khi còn 1 tuần tới hạn.
- Mark released: cảnh báo nếu còn việc chưa xong; version đã phát hành chuyển sang chỉ đọc.

### 6.5 Reports (project Software)

- **Sprint:**
  - Tiến độ so với nhịp lý tưởng; điểm cam kết so với hoàn thành; scope thêm sau khi bắt đầu.
  - Bug đang mở và bug critical.
  - Burndown (Ideal vs Remaining).
  - Velocity qua các sprint.
- **Flow:**
  - Phân bố issue theo status.
  - Số việc đang làm (WIP), hàng chờ lớn nhất, số Blocked.
  - Throughput so với kỳ trước.
- **Cycle time:**
  - Trung vị và P85 trong 30 ngày.
  - Xu hướng trung vị theo tuần trong 12 tuần.
  - Item đang làm lâu nhất, số lần mở lại.
- **Custom reports:**
  - Nguồn dữ liệu: work items, sprints, releases, time logs.
  - Metric: count, points, cycle time, blocked, time, committed, completed.
  - Nhóm theo: assignee, status, epic, priority, type, sprint, release.
  - Bộ lọc: all, active sprint, bugs, blocked.
  - Hiển thị dạng bar, line, donut, table hoặc KPI.
  - Phạm vi Project hoặc Private; xem trước, lưu, export CSV, xoá.

### 6.6 Roadmap (Gantt)

- Timeline theo Day, Week, Month, Quarter, Year:
  - Zoom, nút Today, toàn màn hình.
  - Expand/Collapse all.
  - Nhóm theo Phase, Status hoặc Priority.
  - Sắp xếp thủ công hoặc theo thời gian.
- Thao tác trên thanh task:
  - Kéo để dời; kéo hai đầu để đổi ngày.
  - Bấm vào timeline để đặt ngày cho task chưa có lịch.
  - Tạo task hoặc subtask trực tiếp trên Gantt.
- Dependency Finish-to-Start và Start-to-Finish vẽ trên Gantt; chặn vòng lặp phụ thuộc.
- Phase:
  - Tạo, sửa, kéo sắp xếp (gói Business).
  - Popup Phase Details: tổng task, % hoàn thành, timeline, trạng thái (Upcoming / In Progress / Overdue / Not Scheduled), task theo phase.

### 6.7 Workload và Members

- **Workload** của project có 3 kiểu: Chart, Calendar, Table.
  - Thống kê: số thành viên (quá tải / dưới tải / tối ưu), tổng giờ ước lượng và giờ đã log, tỉ lệ sử dụng trung bình, task critical.
  - Biểu đồ capacity so với allocated.
  - Lịch theo ngày: task được giao, ai còn trống; chỉnh capacity giờ/ngày của từng người.
- **Members:**
  - Danh sách: job title, email, số task, tiến độ, mức quyền trong project; số seat còn lại.
  - Xoá khỏi project (task của họ thành chưa giao); kích hoạt, vô hiệu hoá; quản lý time off.
  - Share Project: thêm thành viên theo tên hoặc email, mời email mới (tuỳ chọn mời cả vào team), tạo và sao chép link project.

### 6.8 Insights

- **Overview:**
  - Tổng giờ đã log so với ước lượng; số task xong, chưa xong, quá hạn.
  - Biểu đồ theo status và theo priority; task cập nhật gần đây.
  - Thống kê Project Deadline: task và giờ vượt ngày kết thúc project.
- **Members:**
  - Task theo từng thành viên: đóng góp, xong, chưa xong, quá hạn, tiến độ.
  - Ai đang có task quá hạn, ai chưa được giao việc.
- **Tasks:** quá hạn (số ngày), log vượt ước lượng, xong sớm, xong trễ.
- Tuỳ chọn tính cả task đã archive; export.

### 6.9 Files, Updates, Docs

- **Files** (3 tab):
  - Project Files: upload kéo thả, giới hạn dung lượng mỗi file, chặn một số đuôi file; xem trước, tải về, xoá; dung lượng đã dùng so với giới hạn.
  - Task Attachments: gom file của mọi task.
  - Links: tiêu đề, URL, mô tả, nguồn (kể cả link lấy từ task), người thêm.
- **Updates (chat của project):**
  - @mention, 10 loại reaction, reply.
  - Sửa (lưu lịch sử sửa), xoá, ghim tin.
  - Đính kèm file; chuyển tin nhắn thành task.
  - Gói thấp chỉ xem lịch sử 90 ngày.
- **Docs (wiki của project):**
  - Cây trang nhiều cấp: kéo để sắp xếp, kéo sang phải để lồng vào trang cha.
  - Editor khối: heading, list, to-do, quote, code, callout, divider, link; gõ `/` để chèn khối.
  - `@` để nhắc người, `#` để liên kết task; task hiện backlink "Mentioned in".
  - Outline, chế độ full width, tự lưu.
  - Báo xung đột khi người khác vừa lưu bản mới hơn.
  - Yêu thích riêng từng người, tìm trang, nhân bản, xoá (xoá cả trang con).

### 6.10 Integrations của project

- **Slack:** chọn channel và loại thông báo (task created, assigned, status changed, completed, comment, due date changed). Gói Business.
- **Microsoft Teams:** đăng cập nhật task và status lên channel.
- **GitHub** (project Software):
  - Link repository, chọn base branch.
  - Ghi issue key vào tên branch, commit hoặc PR để gắn vào issue; hiển thị tab Development trong issue.
  - Tự chuyển status khi tạo branch, mở PR, merge PR; không bao giờ lùi status.

## 7. Time tracking và Timesheet

Có hai cách ghi thời gian làm việc: bấm timer trên task, hoặc nhập tay. Mọi log đều gắn với một task, mang cờ billable của task đó và được dùng cho báo cáo, workload và tài chính.

### 7.1 Timer

- Start/Stop timer ngay trên dòng task hoặc trong drawer; đồng bộ real-time.
- Nút Running Timers trên navbar hiện các timer đang chạy và các log gần đây.
- Cảnh báo xung đột khi một timer khác đang chạy; cho phép dừng timer cũ để chạy timer mới.

### 7.2 Log thủ công (Time Log tab trong task)

- Nhập theo thời lượng (giờ + phút) hoặc theo khoảng giờ (bắt đầu – kết thúc); chọn ngày, ghi mô tả.
- Kiểm tra dữ liệu:
  - Thời lượng phải lớn hơn 0.
  - Giờ kết thúc phải sau giờ bắt đầu.
  - Không log trước ngày bắt đầu của project.
- Sửa và xoá log; chuyển log sang project hoặc task khác.
- Hiển thị tổng thời gian đã log của task và tổng từ các subtask (roll-up).
- Export time log của task ra Excel.
- Gói thấp chỉ xem lịch sử 90 ngày.
- Cấu hình tổ chức: giới hạn số ngày được log lùi (áp dụng cả Owner/Admin; không áp dụng cho timer và log import).

### 7.3 Trang Time Entries (Projects → Time Entries)

- Tổng hôm nay và tuần này, tách billable / non-billable.
- Phạm vi xem: "My Entries" hoặc "All Entries" (theo quyền).
- Bộ lọc nhanh:
  - Due Today, Logged for Today, Yesterday, This Week, Last Week.
  - Overdue, No Logged Time.
  - Khoảng ngày tuỳ chọn.
- Lọc theo project, thành viên, client; tìm theo tên task, ID hoặc mô tả.
- Nhóm theo Member, Client hoặc Project.
  - Hiển thị tổng thời gian và số entry.
  - Tách billable / non-billable theo entry, task và thời gian.
- Hai kiểu bảng: Flat (từng entry) hoặc By task.
- Sửa entry (ghi rõ ai đã log), xoá entry.
- Export CSV: theo bộ lọc hoặc toàn bộ.
- Quick Time Entry:
  - Chọn nhanh từ project gần đây, tìm task được giao.
  - Nhập thời lượng dạng tự do: `130`, `1:30` hoặc `2.5`.
- Tuỳ chọn hiển thị của người dùng được lưu lại.

### 7.4 Ước lượng và so sánh

- Ước lượng giờ trên từng task, ước lượng ngày/man-day trên project.
- Phát hiện task log vượt ước lượng (overlogged) ở Insights và Reporting.
- Báo cáo thời gian theo thành viên, project, ước lượng so với thực tế: xem mục 9.3.

## 8. Planner (lập kế hoạch nguồn lực)

Planner dành cho Owner/Admin, xem cùng lúc nhiều project và nhiều thành viên, gồm 3 view: Schedule, Timeline, Workload. Một số thao tác bị khoá theo gói và hiện bản xem trước làm mờ kèm lời mời nâng cấp.

### 8.1 Schedule (theo thành viên)

- Lưới thành viên × ngày theo Day, Week hoặc Month. Month chỉ để xem tổng hợp tuần có vấn đề; muốn giao lại việc thì chuyển sang Day hoặc Week.
- Mỗi thành viên có chỉ số LOAD/UTIL = giờ đã lên lịch ÷ capacity, chia màu:
  - Available: dưới 80%.
  - Near capacity: 80–100%.
  - Over-allocated: trên 100%.
  - Hiển thị số giờ còn trống hoặc vượt.
- Thêm việc vào ô ngày:
  - Tạo task mới, hoặc giao từ task chưa ai làm ("From Unassigned").
  - Đặt giờ ước lượng mỗi ngày.
  - Mời email mới vào project hoặc team ngay tại đây.
- Book project time: tạo "project block" giữ chỗ thời gian cho một project.
- Thao tác trên khối việc:
  - Kéo thả để đổi ngày hoặc người.
  - Reassign, Reschedule, Remove from view.
  - Undo.
- Time off và ngày lễ:
  - Ghi nghỉ theo loại Vacation / Sick / Personal / Other.
  - Nghỉ cả ngày hoặc vài giờ, kèm lý do.
  - Ngày lễ của tổ chức tự trừ khỏi capacity.
- Bộ lọc:
  - Project, client, category, status và priority của project.
  - Thành viên, vai trò, mức utilization.
  - Status và priority của task.
- Hiện hoặc ẩn cuối tuần; zoom; toàn màn hình; mở rộng hoặc thu gọn; làm mới.

### 8.2 Timeline (theo project)

- Gantt liên project: mỗi project một hàng, mở ra thấy phase và task.
- Kéo thanh để đổi ngày task; danh sách task chưa có ngày để xếp lịch.
- Xem chi tiết timeline của một project trong modal.
- Lọc giống Schedule.

### 8.3 Workload (toàn team)

- Thành viên × khoảng thời gian: giờ được giao so với capacity, tổng cả team (Team Total).
- Chú thích: subtask và task cha cùng giao cho một người thì giờ được tính riêng.

### 8.4 Cài đặt Workload (dùng chung cho cả 3 view)

- Ngày làm việc trong tuần và số giờ làm mỗi ngày.
- Số giờ ước lượng mặc định cho task chưa có ước lượng.
- Cấu hình mức tận dụng (utilization) ở Admin Center (mục 14.4).

### 8.5 API phân bổ nguồn lực

- Phân bổ theo project và theo user.
- Phân bổ thành viên vào project theo khoảng ngày, kéo đổi ngày real-time (`schedule-gannt-v2`, socket `schedule_member_allocation`).

## 9. Reporting (báo cáo)

Reporting dành cho Owner/Admin và xem được toàn tổ chức (nhiều team). Team Lead có trang báo cáo riêng cho những người mình quản lý. Hầu hết bảng đều có tuỳ chọn tính cả project đã archive và export Excel/CSV.

### 9.1 Overview

- Thẻ số liệu:
  - Số team, project, project đang chạy, project quá hạn.
  - Số thành viên, thành viên chưa được giao việc, thành viên có task quá hạn.
- Bảng team: tên, số project, số thành viên.
- Drawer chi tiết từng team.

### 9.2 Projects và Members

- **Projects:**
  - Bảng các cột:
    - Project, ước lượng so với thực tế, tiến độ task (To do / Doing / Done), hoạt động cuối.
    - Status, priority, ngày bắt đầu/kết thúc (sửa ngay trên bảng), số ngày còn lại hoặc quá hạn.
    - Health, category (sửa ngay), cập nhật project mới nhất, client, team, Project Manager.
  - Lọc theo team, status, health, category, PM, client, priority; ẩn/hiện cột.
  - Hai kiểu: Table hoặc Grouped (theo category, status, health, team, manager).
  - Drawer từng project gồm 3 tab:
    - Overview: task theo status, priority, hạn; giờ phân bổ so với giờ đã log.
    - Members: đóng góp và tiến độ của từng người.
    - Tasks: nhóm theo status, priority hoặc phase.
- **Members:**
  - Chọn kỳ: Today, Yesterday, Last 7 days, Last week, Last 30 days, Last month, This month, Last 3 months, All time, hoặc tự chọn.
  - Bảng thành viên: tiến độ task, số task được giao, đã xong, quá hạn, đang làm.
  - Drawer từng người gồm 4 tab:
    - Overview: task theo project, status, priority; giờ đã log.
    - Time Logs: lọc billable / non-billable.
    - Activity Logs.
    - Tasks.

### 9.3 Time Reports (Timesheet)

- **Overview / Projects Time Sheet / Members Time Sheet:**
  - Giờ đã log theo project hoặc theo người.
  - Lọc theo team, project, category, billable.
  - Nhóm theo category, team hoặc status.
- **Utilization:**
  - Tổng giờ đã log so với capacity dự kiến (tính theo lịch làm việc) và độ lệch.
  - Ba mức: dưới 90% (under-utilized), 90–110% (optimal), trên 110% (over-utilized).
  - Gợi ý phân bổ lại việc hoặc nhận thêm project.
- Lọc theo Team Lead; Team Lead chỉ thấy những người mình quản lý.
- **Estimate vs Actual:** so sánh ngày làm việc, man-day ước tính với thực tế theo project.
- **Time Logs:**
  - Danh sách log: ngày, người, project, task, mô tả, thời lượng.
  - Lọc theo project, practice, thành viên (kể cả người đã bị vô hiệu hoặc xoá), billable; kỳ có sẵn.

### 9.4 Tasks (toàn tổ chức) và Progress Tracking

- **All Tasks:**
  - Tìm theo tên, key hoặc mô tả.
  - Lọc theo team, project, client, status, priority, assignee, label, phase, archived.
  - Nhóm theo project, status, priority, assignee, hạn, phase.
  - Thẻ số liệu: tổng, đã xong, đang làm, quá hạn, chưa giao, đến hạn tuần này.
  - Cột: ước lượng, đã log, log vượt, số ngày quá hạn, subtask, tiến độ…; ẩn/hiện cột.
  - Export CSV hoặc Excel.
- **Progress Tracking:**
  - Thống kê số project theo Delivery Confidence: On track, At risk, Off track, Not set.
  - Lọc theo confidence, theo khoảng % hoàn thành, theo "Has blockers".
  - Cột: project, client, % hoàn thành, số task bị chặn bởi dependency, confidence, lần cập nhật cuối.
  - Đổi confidence và ghi chú ngay trên bảng; mở Insights của project.

### 9.5 Team-lead Reports

- Chọn kỳ báo cáo (Today … Last 90 days, hoặc tự chọn).
- Thẻ tóm tắt: số thành viên, tổng giờ đã log, số project đang chạy, tỉ lệ hoàn thành trung bình.
- Time Tracking Summary:
  - Biểu đồ và bảng theo người.
  - Cột: tổng giờ, số log, số ngày có hoạt động, số project, hoạt động cuối.
  - Tách log nhập tay và log từ timer.
- Team Performance: số task được giao, đã xong, quá hạn; tỉ lệ hoàn thành; giờ đã log.
- Detailed Time Logs của từng người; export.
- Mục Export trong rail còn đang là trang "Coming soon".

### 9.6 Báo cáo gửi qua email

- Email tóm tắt project mỗi tối (đăng ký theo từng project).
- Digest định kỳ (mục 12).
- Endpoint export báo cáo (`reporting-export`) dành cho file Excel.

## 10. Finance (tài chính dự án)

Finance tính chi phí theo hai nguồn:

- **Time-based cost** = giờ đã log × rate của job title.
- **Fixed cost** = khoản chi cố định gắn vào task.

Chi phí được so với ngân sách của từng project. Module này thuộc gói Business/Enterprise; gói thấp hơn chỉ thấy bản xem trước làm mờ. Chỉ Owner/Admin và PM có quyền tài chính mới sửa được.

### 10.1 Rate card và tiền tệ (cấp tổ chức)

- Rate card templates:
  - Tạo, sửa, xoá, tìm; chọn tiền tệ.
  - Thêm role theo job title (Add All / Remove All), đặt rate theo giờ hoặc theo man-day.
  - Tạo job title mới ngay trong rate card; cảnh báo khi rời trang mà chưa lưu.
- Phương pháp tính của tổ chức: Hourly hoặc Man days (kèm số giờ mỗi ngày).
- Organization Currency: chọn tiền tệ gốc, xem tỷ giá trực tiếp và làm mới. Tổng số các project khác tiền tệ được quy đổi về tiền tệ gốc.

### 10.2 Finance trong một project (tab Finance)

- Thống kê ngân sách:
  - Manual budget, tổng chi phí thực tế, chênh lệch (variance).
  - % sử dụng ngân sách, ngân sách còn lại.
  - Giờ ước lượng; tách fixed cost và time-based cost.
- Bảng chi phí theo task:
  - Nhóm theo status, phase hoặc priority; lọc billable / non-billable.
  - Cột giờ và man-day: giờ ước lượng, man-day ước lượng và thực tế, độ lệch công sức, giờ đã log.
  - Cột chi phí: chi phí ước tính, fixed cost (sửa ngay trên bảng), tổng chi phí dự toán, tổng chi phí thực tế, variance.
- Budget Settings:
  - Ngân sách, tiền tệ.
  - Cách tính: giờ ước lượng × rate theo giờ, hoặc man-day × rate theo ngày; số giờ làm mỗi ngày.
  - Đổi cách tính sẽ tính lại toàn bộ project ngay.
- Rate card của project:
  - Import từ template của tổ chức, rồi chỉnh riêng cho project; không ảnh hưởng bản gốc.
  - Gán thành viên vào role, ghi labour hours.
- Export Excel.
- Quyền: người không phải PM, Admin hay Owner chỉ được xem (Limited Access).

### 10.3 Finance toàn danh mục (menu Finance)

| Trang | Nội dung |
| --- | --- |
| Overview | Thẻ: tổng budget, tổng chi phí, tổng variance, % sử dụng ngân sách, giờ ước lượng. Danh sách "Projects Needing Attention". Phân bố trạng thái ngân sách: On track ≤65%, Watch 65–100%, Over >100%. Bảng sức khoẻ tài chính từng project. Cảnh báo khi lẫn nhiều tiền tệ. Export Excel |
| Profitability | Doanh thu (từ invoice đã thanh toán), chi phí, lợi nhuận, biên lợi nhuận, tỉ lệ billable. Biểu đồ xu hướng doanh thu và lợi nhuận. Cơ cấu chi phí. Bảng theo project |
| Budgets | Budget, đã chi, còn lại, burn rate, ETC (giờ còn lại × rate thực tế), cảnh báo High burn / Watch / OK |
| Invoices | Tổng đã xuất, đã thu, còn nợ. Danh sách invoice từ Client Portal với trạng thái Draft, Sent, Paid, Overdue, Cancelled |
| Expenses | Mọi fixed cost gắn vào task trong team. Thêm expense: chọn project, task, số tiền |
| Billable Time | Theo tuần/tháng: giờ đã log, billable, non-billable, giá trị billable theo rate card. Bảng từng entry kèm rate và giá trị |
| Utilization | Giờ billable so với capacity theo từng người. Quá tải khi vượt 85% capacity |
| Forecasts | Dự báo doanh thu và lợi nhuận 3 tháng tới theo xu hướng tuyến tính của 3 tháng trước |

Team Lead có quyền tài chính xem được các báo cáo này (validator `teamLeadFinance`).

## 11. Clients và Client Portal

Client có hai lớp:

- **Bản ghi client đơn giản:** gắn vào project, dùng cho lọc và báo cáo.
- **Client Portal** (gói Business): khách hàng đăng nhập một app riêng, chỉ thấy những gì team đánh dấu "Client visible".

Phía admin quản lý portal ngay trong web app chính, menu Client Portal.

### 11.1 Bản ghi client

- Settings → Clients: tạo, sửa, xoá, tìm; xem client đang gắn với project nào.
- Tạo client ngay trong form project hoặc trang Home → Add Client.
- Client dùng làm bộ lọc ở Projects, Calendar, Planner, Time Entries và Reporting.

### 11.2 Quản trị Client Portal (phía team)

- **Overview:** dashboard widget, kéo thả, đổi kích thước, ẩn/hiện, lưu bố cục.
  - KPI: approval đang chờ, change request cần duyệt, milestone trễ, discussion chưa đọc, invoice quá hạn.
  - Danh sách: Needs attention, Mentions of me.
  - Biểu đồ approval theo status, pipeline change request.
- **Clients:** 2 tab Clients (tổ chức) và Client users.
  - Cột: quyền truy cập portal, liên hệ chính, số project trên portal, số user, số việc đang chờ client.
  - Thao tác với user:
    - Sửa thông tin và role, gán project.
    - Gửi lại lời mời, tạo link đăng nhập (hiệu lực 7 ngày).
    - Vô hiệu hoá (mất quyền ngay) hoặc kích hoạt lại, xoá.
    - Nhắn tin.
  - Cảnh báo khi thao tác trên Client Admin cuối cùng.
  - Trang chi tiết client: thống kê, việc cần chú ý, hoạt động gần đây; export dữ liệu client.
- **Add client (wizard):**
  - Chọn cách thêm: tạo tổ chức mới (user đầu tiên là Client Admin) hoặc thêm user vào tổ chức có sẵn.
  - Nhập thông tin.
  - Chọn project: portal tự bật cho project được chọn.
  - Gửi lời mời.
  - Import client hàng loạt (validate rồi commit).
- **Portal Projects:**
  - Bật/tắt portal cho từng project: tắt thì client mất quyền ngay, không xoá dữ liệu.
  - Project phải được link với một client trước khi bật.
  - Workspace của project có các tab:
    - Overview: status hiển thị cho client, phase, ngày dự kiến hoàn thành, liên hệ chính, cho phép client upload, ghi chú nội bộ (không bao giờ hiện cho client), đăng bài cập nhật project.
    - Milestones: lấy từ phase của project hoặc nhập tay; trạng thái Upcoming / In Progress / Delayed / Completed; bật tắt client visible.
    - Tasks: chọn task nào client được thấy.
    - Files: category, version (upload bản mới, xem lịch sử version), client visible, đánh dấu file do client upload.
    - Discussions.
    - Client Access: gán hoặc gỡ user, xem lần truy cập cuối.
- **Approvals:**
  - Yêu cầu client duyệt một file (ghi lại đúng version), milestone, task, hoặc một mục tự do.
  - Chọn nhiều người duyệt; quyết định đầu tiên sẽ chốt kết quả. Đặt hạn và hướng dẫn.
  - Trạng thái: Draft, Awaiting, Approved, Changes Requested, Cancelled.
  - Thao tác: lưu nháp, gửi, huỷ, gửi lại (resubmit); lưu lịch sử các revision.
  - Cảnh báo khi file đã lên version mới hơn bản đã duyệt.
- **Change Requests:**
  - Luồng trạng thái: Submitted → Under Review → More Info Required → Approved / Rejected → In Progress → Completed, hoặc Cancelled.
  - Ghi đánh giá nội bộ; ước lượng giờ và chi phí phát sinh hiển thị cho client.
  - Gán người xử lý nội bộ; trao đổi với client.
  - Chuyển thành công việc: tạo task mới hoặc link task có sẵn; request tự chuyển sang In Progress.
  - Tạo quote hoặc invoice từ change request đã duyệt.
- **Discussions:**
  - Thread gắn với project, task, file, approval hoặc change request.
  - Hai loại tin: tin client thấy được, và comment nội bộ nằm cạnh.
  - @mention, chọn người nhận thông báo.
  - Đính kèm tối đa 100MB mỗi file; file đính kèm tự chia sẻ sang Files.
  - Lọc theo loại thread hoặc chưa đọc.
- **Invoices:**
  - Tạo từ request hoặc tạo độc lập: số tiền, tiền tệ, hạn thanh toán, ghi chú, dòng dịch vụ.
  - Thao tác: sửa, gửi, xem trước, in, tải về, nhân bản, xoá.
  - Ghi nhận thanh toán, đánh dấu đã trả.
- **Quotes:**
  - Tổng đã báo giá, đã chấp nhận, đang chờ.
  - Trạng thái: Draft, Sent, Accepted, Declined, Expired.
  - Dòng mục gồm số lượng, đơn giá, thành tiền; thuế và giảm giá; ngày hết hiệu lực.
  - Thao tác: nhân bản, tải về.
- **Audit Log:**
  - Ghi mọi hành động của client và team: access, approvals, change requests, comments, files, visibility.
  - Lọc theo client, theo người làm, theo khoảng ngày; export CSV.
  - Không sửa hay xoá được; không lưu nội dung comment.
- **Preview:** xem portal dưới góc nhìn của một client user cụ thể (dashboard, approvals, change requests theo đúng role).
- **Settings:**
  - Sharing & Visibility: mặc định cho phép client upload; bật/tắt trang Invoices cho client; thống kê số mục đang chia sẻ.
  - Client Roles: ma trận quyền; cho phép Client Admin tự mời hoặc xoá đồng nghiệp.
  - Notifications: bật/tắt email cho từng sự kiện, gửi cho client và cho team; thông báo in-app luôn bật.
  - Branding: logo tổ chức.

### 11.3 Vai trò của client user

| Quyền | Client Admin | Client Member | Client Viewer |
| --- | --- | --- | --- |
| Xem project, milestone, task và file được chia sẻ | Có | Có | Có |
| Comment trong discussion | Có | Có | Không |
| Upload file (nếu project cho phép) | Có | Có | Không |
| Gửi và theo dõi change request | Có | Có | Không |
| Duyệt hoặc yêu cầu sửa | Có | Không | Không |
| Quản lý user cùng tổ chức (nếu bật) | Có | Không | Không |

Quy tắc cố định:

- Mọi task, file, milestone, comment mặc định là Internal Only.
- Comment nội bộ, time log, ước lượng, chi phí và dependency không bao giờ lộ cho client.
- Mục bị ẩn không được đếm hay gợi ý ở bất kỳ đâu.
- Thu hồi quyền có hiệu lực ngay từ request kế tiếp.

### 11.4 Ứng dụng Client Portal (phía khách hàng)

- Đăng nhập không mật khẩu: nhập email, nhận mã 6 số qua email (có giới hạn số lần thử); refresh token; đăng xuất.
- Chấp nhận lời mời; một người có thể thuộc nhiều tổ chức và chuyển qua lại; trang báo khi bị thu hồi quyền.
- Dashboard tuỳ biến:
  - Project đang chạy, phase hiện tại, ngày dự kiến hoàn thành, milestone kế tiếp.
  - Việc cần client xử lý, hoạt động gần đây.
- Workspace của từng project: thành viên, milestone, task, file (upload nếu được phép).
- Approvals: lọc theo All / Awaiting / Completed; quyết định Approve hoặc Request changes.
- Change Requests: gửi yêu cầu, trả lời khi team cần thêm thông tin, xem ước lượng giờ và chi phí.
- Discussions: comment, sửa hoặc xoá tin của mình, @mention, đánh dấu đã đọc.
- Notifications: đánh dấu đã đọc hoặc chưa đọc, đọc tất cả.
- Invoices (nếu được bật): xem, tải về, thanh toán.
- Account và Settings: hồ sơ, múi giờ, tuỳ chọn thông báo; yêu cầu xoá tài khoản.
- Danh sách user cùng tổ chức (cho Client Admin).

## 12. Thông báo, real-time và tác vụ nền

Thông báo đến người dùng qua 4 kênh: in-app, popup trình duyệt, email tức thì và email digest theo lịch. Mọi thay đổi trên task và project được đẩy real-time qua Socket.IO tới người đang mở cùng project.

### 12.1 Thông báo in-app

- Ngăn Notifications trên navbar:
  - Tab Unread / Read; đánh dấu đã đọc từng mục hoặc tất cả; xoá thông báo.
  - Badge số chưa đọc.
  - Chấp nhận lời mời vào team ngay trong ngăn (Accept & Join).
  - Mục "Client activity" cho hoạt động từ Client Portal.
- Các loại thông báo:
  - Bị giao hoặc bị gỡ khỏi task.
  - Task được thêm vào hoặc xoá khỏi project.
  - Được thêm vào hoặc xoá khỏi project, team.
  - Comment mới trên task.
  - Được @mention trong comment task, trong Updates của project, trong Docs.
  - Được giao task khi task vào phase mình phụ trách.
  - Thay đổi quyền sở hữu team hoặc tổ chức.
- Theo dõi (subscribe) task hoặc project để nhận cập nhật; "When done, notify" trên task.

### 12.2 Email

- Email theo sự kiện:
  - Đổi assignee, comment trên task, comment trên project, task chuyển sang Done.
  - Yêu cầu và comment mới từ Client Portal.
- Email hệ thống:
  - Chào mừng, mời vào team (kể cả người chưa có tài khoản).
  - Đặt lại mật khẩu, thông báo đã đổi mật khẩu, mã OTP.
  - Mời client, chào mừng client.
  - Release note, bảo trì, thông báo gói/license.
- Gửi qua AWS SES hoặc SMTP (nodemailer). Template dùng Pug/HTML.

### 12.3 Digest và nhắc việc theo lịch

- Daily digest mỗi tối: tóm tắt hoạt động trong task.
- Project daily digest: tóm tắt từng project đã đăng ký.
- Scheduled Task Digest, người dùng chọn kênh và giờ gửi:
  - Daily Task Reminder: task hôm nay, ngày mai, quá hạn.
  - Weekly Start Summary: thứ Hai.
  - Weekly End Summary: thứ Sáu.
  - Admin và PM có thêm phần riêng theo vai trò.
- Link hủy đăng ký digest công khai.

### 12.4 Real-time (Socket.IO)

- Đồng bộ mọi trường của task:
  - Tên, mô tả, status, priority, phase, label.
  - Assignee, ngày, giờ hết hạn, ước lượng, billable, recurring.
  - Progress, weight, thứ tự sắp xếp, subscriber, timer.
- Đồng bộ project: status, health, category, ngày, subscriber.
- Đồng bộ khác:
  - Ngày của phase; kéo thả trên Gantt và Schedule.
  - Custom column; quick task.
  - Thay đổi trong template.
- Phòng (room) theo project và theo trang reporting; tự cập nhật khi quyền của người dùng thay đổi.

### 12.5 Tác vụ nền (cron job)

| Job | Việc làm |
| --- | --- |
| recurring-tasks | Sinh task hoặc đổi status theo lịch lặp |
| notifications-job | Gửi email thông báo dồn |
| daily-digest, project-digest, digest-scheduler | Gửi các loại digest |
| sprint-auto-schedule | Tự bắt đầu sprint kế tiếp |
| seat-reconciliation | Đối soát số seat với gói |
| plan-trial-expiration | Xử lý hết hạn trial |
| task-export-cleanup, project-files-cleanup | Dọn file export và file rác |
| audit-log-retention, audit-log-export-cleanup | Xóa log quá hạn lưu trữ, dọn file export |

## 13. Settings (cá nhân và workspace)

Settings có thanh tìm kiếm và chia thành 7 nhóm. Mục dành cho admin chỉ hiện với Owner/Admin; một số mục ghim được lên menu chính.

| Nhóm | Mục | Nội dung chính |
| --- | --- | --- |
| Account & Personal | Profile | Ảnh đại diện (JPG/PNG, tối đa 2MB, cắt ảnh, xoá ảnh); tên 2–50 ký tự; email; ngày tham gia |
|  | Notifications | Email thông báo, daily digest, popup trình duyệt, đếm số chưa đọc; lịch Daily reminder, Weekly start, Weekly end (kênh và giờ gửi) |
|  | Change Password | Mật khẩu hiện tại, mật khẩu mới, xác nhận. Tài khoản Google được đặt mật khẩu để đăng nhập bằng email |
|  | Language and Region | Ngôn ngữ (8: EN, DE, ES, FR, PL, PT, ZH, ALB), múi giờ |
|  | Appearance | Chế độ sáng / tối |
| Workspace Setup | Team Members, Team Hierarchy, Guest Members, Teams | Xem mục 2 |
|  | Departments, Practices, Job Titles | Danh mục về con người |
|  | Clients | Bản ghi client |
| Project & Workflow | Labels, Categories | Danh mục dùng cho task và project |
|  | Project Templates, Task Templates | Xem mục 4.7 và 5.8 |
| Financial & Billing | Rate Card, Currency | Xem mục 10.1 |
| System & Integrations | Integrations | Slack, Microsoft Teams, GitHub. Google Drive và Google Calendar đang hiện "Coming soon" |
|  | Configuration | Chỉ Admin/Team Lead được tạo và giao task, áp dụng toàn tổ chức (gói Business; cài đặt của project được ưu tiên). Giới hạn số ngày được log giờ lùi |
|  | Import / Export | Import từ Asana, Jira, Trello, Monday.com, ClickUp, CSV (mục 4.2) |
| Danger Zone | Delete Account | Gõ DELETE để xác nhận; dữ liệu bị xoá trong 30 ngày; huỷ được yêu cầu trước hạn |
| Help & Support | Help | Tài liệu, release notes, changelog, email hỗ trợ, link cộng đồng, privacy policy, phiên bản app |
|  | Mobile App | QR code và link tải app iOS/Android |

### Slack (cấp team)

- Kết nối workspace qua OAuth, mời bot vào channel bằng `/invite @Worklenz`.
- Cấu hình project nào gửi thông báo vào channel nào, xem thống kê cấu hình.
- Tạo task từ Slack bằng slash command.
- Ngắt kết nối: xoá toàn bộ cấu hình.

### GitHub (cấp team)

- Owner/Admin cài GitHub App và làm mới danh sách repository.
- Xem trạng thái đồng bộ; chạy lại event lỗi.
- Ngắt kết nối: tạm dừng đồng bộ nhưng giữ lịch sử.

## 14. Admin Center và Billing

Admin Center là nơi quản trị cấp tổ chức, dành cho Owner/Admin. Nó gồm Overview, Users, Teams, Projects, Billing, Utilization Settings và Security. Một số mục chỉ Owner được sửa.

### 14.1 Overview của tổ chức

- Thông tin tổ chức: tên (sửa được), owner, danh sách admin, số điện thoại liên hệ của owner.
- Logo (gói trả phí):
  - Định dạng PNG, JPG hoặc WEBP, tối đa 5MB.
  - Gợi ý kích thước 400×120px; cảnh báo khi logo quá nhỏ, quá lớn hoặc dạng dọc.
  - Dùng cho navbar và Client Portal.
- Ngày và giờ làm việc của tổ chức (theo từng thứ trong tuần).
- Phương pháp tính chi phí toàn tổ chức: Hourly hoặc Man days.
- Lịch ngày lễ:
  - Import ngày lễ chính thức theo quốc gia và năm.
  - Thêm ngày lễ riêng: tên, ngày, loại, lặp hằng năm.
  - Ngày lễ chính thức không sửa được.
  - Cài đặt quốc gia và bang, tự động đồng bộ ngày lễ.

### 14.2 Users, Teams, Projects

- **Users:** toàn bộ user của tổ chức với email và hoạt động cuối; tìm kiếm.
- **Teams:**
  - Tạo team, xem số thành viên, xoá team.
  - Team Settings: tên, mô tả; thêm thành viên, đổi vai trò (không đổi được Owner), đổi tên thành viên; hiện lời mời đang chờ.
- **Projects:** tất cả project trong mọi team (số thành viên, team, ngày tạo); xoá project.

### 14.3 Security: Audit Log của workspace

- Nhóm sự kiện:
  - Access & Auth: đăng nhập thành công hoặc thất bại, đăng xuất, đổi hoặc đặt lại mật khẩu.
  - User & Role: mời, xoá, kích hoạt, vô hiệu hoá thành viên; đổi vai trò; chuyển quyền sở hữu; link mời; tham gia; thêm hoặc xoá khỏi project.
  - Permission & Settings: đổi privacy của project, cài đặt workspace, cài đặt project, quyền của thành viên, thời hạn lưu log.
  - Lifecycle: tạo, archive, xoá, khôi phục project; đổi tên, xoá workspace; xoá team.
- Thống kê: số sự kiện trong kỳ, số lần đăng nhập thất bại, số thay đổi quyền, thời hạn lưu.
- Lọc theo người thực hiện, nhóm sự kiện, ngày. Mỗi dòng hiện giá trị trước và sau khi đổi.
- Export CSV; file lớn được xử lý nền rồi hiện link tải.
- Chỉ ghi thêm, không sửa hay xoá được. Thời hạn lưu do Owner đặt, có gợi ý mức tối thiểu theo PCI DSS.
- Log này tách biệt với Activity Log của từng task.

### 14.4 Utilization Settings

- Ngày và giờ làm việc dùng để tính capacity.
- Cài đặt ngày lễ theo quốc gia và bang.

### 14.5 Billing và gói dịch vụ

- Hiển thị gói hiện tại: Free, Pro, Business, Enterprise, Trial, Credit, Custom hoặc gói AppSumo; hạn sử dụng; số seat đã dùng và còn trống; dung lượng lưu trữ đã dùng.
- Chọn gói:
  - Chu kỳ thanh toán theo tháng hoặc theo năm (tiết kiệm 30%).
  - Mô hình giá Per User, hoặc Base Plan (gồm sẵn N user, cộng phí mỗi user thêm).
  - Chọn quy mô team từ 1 đến 500 user.
- Thao tác với gói:
  - Nâng cấp, đổi gói, tạm dừng, tiếp tục, huỷ, chuyển về Free.
  - Mua thêm seat, mua thêm dung lượng.
- Business trial: kiểm tra đủ điều kiện, bắt đầu, huỷ hoặc chuyển thành gói chính thức.
- Redeem code: nhập code AppSumo; đủ 5 code thì mở khoá gói Business.
- Thanh toán:
  - Cổng Paddle.
  - DirectPay cho thị trường LKR: lưu thẻ, thanh toán bằng thẻ đã lưu, lịch sử thanh toán, tải biên lai.
- Giao dịch, khoản phí (charges), invoice của gói.
- Billing details: tên, email, số điện thoại, công ty, địa chỉ, quốc gia, thành phố, bang, mã bưu chính.
- Gợi ý gói, so sánh gói, lợi ích so với chi phí; chuyển đổi từ gói cũ (legacy) hoặc AppSumo kèm ưu đãi.

### 14.6 Cơ chế khoá tính năng theo gói

- Backend chặn theo từng tính năng (`requireFeature`).
- Frontend:
  - Hiện bản xem trước làm mờ kèm lời mời nâng cấp.
  - Popover khi chạm giới hạn (seat, guest, custom field, dung lượng, file trên 25MB).
  - Banner đếm ngược ngày còn lại của trial.
- Khi hết hạn gói, trang License expired chặn phần lớn app.

## 15. Khung ứng dụng, phi chức năng và hạ tầng

Các yêu cầu dưới đây áp dụng cho mọi module. Nên viết chúng thành Definition of Done chung hoặc thành các story kỹ thuật riêng.

### 15.1 Thanh điều hướng chung (navbar)

- Menu chính: Home, Projects, Planner, Reports, My Team Reports (cho Team Lead), Finance, Clients.
- Tìm kiếm toàn cục: task, project, client, thành viên.
- Nút New để tạo nhanh: Task, Log Time, Mark Time Off, Project, Client, Add Expense, Add Guest, Invite Member.
- Chuyển team (có ô tìm team), mời thành viên, nút Upgrade Plan.
- Running Timers, ngăn Notifications, Help.
- What's New: modal ghi chú phiên bản mới.
- Menu hồ sơ: Settings, Admin Center, Billing, Mobile App, Delete Account, Log Out, đổi Light/Dark.
- Rail menu bên trái của mỗi khu vực: sắp xếp, ẩn/hiện mục, chọn trang mặc định (nav preferences).

### 15.2 Trải nghiệm người dùng

- Đa ngôn ngữ với i18next: 8 ngôn ngữ, không có chuỗi hard-code, mỗi lời gọi dịch đều có defaultValue.
- Light/Dark theme theo design token của Ant Design.
- Responsive cho desktop, tablet, mobile.
- Accessibility: điều khiển bằng bàn phím, ARIA, kéo thả dùng được bằng phím.
- Mọi màn hình bất đồng bộ có đủ 3 trạng thái loading, empty, error, kèm nút thử lại.
- Cập nhật lạc quan (optimistic update) và rollback khi lỗi.
- Ghi nhớ bộ lọc và tuỳ chọn hiển thị theo từng người dùng.
- Chia nhỏ bundle theo route (lazy load) và xử lý lỗi khi tải chunk.
- Banner gợi ý tải app mobile; khảo sát người dùng; theo dõi sự kiện bằng Mixpanel; báo lỗi frontend qua Sentry.

### 15.3 Bảo mật

- Session phía server lưu trong PostgreSQL; mật khẩu bam bằng bcrypt.
- CSRF token cho mọi request thay đổi dữ liệu (trừ route của Client Portal, nơi dùng client token riêng).
- Rate limit cho API, đăng nhập, đặt lại mật khẩu, OTP và presign upload.
- Helmet, HPP, sanitize HTML cho nội dung người dùng nhập; mọi truy vấn SQL dùng tham số (prepared statement).
- Kiểm tra quyền ở cả hai phía:
  - Frontend: guard theo route.
  - Backend: theo vai trò team; theo quyền truy cập project, task, comment, file; riêng cho Guest.
- Upload file:
  - Chặn một số đuôi file nguy hiểm; giới hạn dung lượng theo gói.
  - Upload qua presigned URL; ảnh đại diện tự chuyển sang WebP.
- Audit log cho workspace và cho Client Portal; chính sách thời hạn lưu.
- Yêu cầu xoá tài khoản: dữ liệu bị xoá sau 30 ngày.

### 15.4 Hạ tầng và vận hành

- PostgreSQL 15, migration bằng node-pg-migrate; toàn bộ khoá chính là UUID.
- Redis làm cache.
- Lưu trữ file: SeaweedFS, AWS S3 hoặc Azure Blob.
- Email: AWS SES hoặc SMTP.
- Docker Compose, Nginx reverse proxy có SSL, script backup.
- Tài liệu API bằng Swagger/OpenAPI; endpoint health check.
- Export dùng ExcelJS, Archiver (ZIP), Puppeteer (PDF invoice).
- API dành cho app mobile iOS/Android (đăng nhập Google/Apple trên mobile).

### 15.5 Khả năng mở rộng (Addons)

- Mỗi addon là một thư mục gồm manifest, router backend (mount tại `/api/v1/addons/<id>`), migration riêng, route frontend, UI slot (mục menu, cột, tab) và Redux store.
- Bật addon bằng biến môi trường `ENABLED_ADDONS`.

## 16. Gợi ý Epic và thứ tự ưu tiên

Đề xuất làm MVP gồm 7 epic: xác thực, team và phân quyền, project, task, List/Board, time tracking và thông báo. Đây là phần lõi mà mọi module khác phụ thuộc vào.

Với app nội bộ, có thể bỏ toàn bộ Billing, gói dịch vụ và AppSumo. Khoá tính năng theo gói cũng nên thay bằng phân quyền theo vai trò. Cột Giai đoạn bên dưới có thể đổi trực tiếp trong bảng.

| Epic | Mục nguồn | Giai đoạn | Story mẫu |
| --- | --- | --- | --- |
| E01 Xác thực và onboarding | 1 | MVP | Là nhân viên mới, tôi muốn nhận link mời qua email để vào workspace mà không cần admin tạo mật khẩu giúp |
| E02 Team, thành viên, phân quyền | 2 | MVP | Là Admin, tôi muốn gán vai trò Team Lead cho một người để họ xem báo cáo của nhóm mình |
| E03 Quản lý project | 4 | MVP | Là PM, tôi muốn đặt status và health cho project để ban giám đốc thấy dự án nào đang gặp rủi ro |
| E04 Quản lý task | 5 | MVP | Là thành viên, tôi muốn chia task thành subtask và giao cho từng người để theo dõi phần việc nhỏ |
| E05 View List và Board | 6.1, 6.2 | MVP | Là thành viên, tôi muốn kéo thẻ task sang cột Done trên Board để cập nhật tiến độ nhanh |
| E06 Time tracking và Time Entries | 7 | MVP | Là nhân viên, tôi muốn bấm timer trên task để ghi giờ làm chính xác |
| E07 Thông báo, email, real-time | 12 | MVP | Là người được giao việc, tôi muốn nhận thông báo khi bị @mention để không bỏ lỡ trao đổi |
| E08 Home cá nhân và Settings | 3, 13 | Phase 2 | Là thành viên, tôi muốn xem mọi task đến hạn hôm nay của mình ở một trang |
| E09 Roadmap, dependency, custom field, recurring, template | 4.7, 5.5–5.8, 6.6 | Phase 2 | Là PM, tôi muốn kéo thanh Gantt để dời lịch task và thấy task phụ thuộc bị ảnh hưởng |
| E10 Reporting và Insights | 6.8, 9 | Phase 2 | Là giám đốc, tôi muốn xem project quá hạn và người có task trễ trên một trang tổng quan |
| E11 Planner, workload, time off, ngày lễ | 6.7, 8, 14.1 | Phase 2 | Là Admin, tôi muốn thấy ai đang quá tải tuần này để chia lại việc |
| E12 Updates, Docs, Files, Inbox | 3.4, 6.9 | Phase 2 | Là thành viên, tôi muốn viết tài liệu đặc tả trong project và nhắc tới task bằng # |
| E13 Finance và rate card | 10 | Phase 3 | Là kế toán, tôi muốn so ngân sách với chi phí thực tế của từng project |
| E14 Client Portal | 11 | Phase 3 | Là khách hàng, tôi muốn duyệt bản thiết kế ngay trên portal thay vì qua email |
| E15 Project Software (backlog, sprint, epic, release) | 4.5, 6.3–6.5 | Phase 3 | Là Scrum Master, tôi muốn kết thúc sprint và chuyển issue chưa xong sang sprint sau |
| E16 Tích hợp, import, Admin Center, audit log | 4.2, 6.10, 13, 14.1–14.4 | Phase 3 | Là Owner, tôi muốn xem nhật ký đổi quyền để kiểm tra khi có sự cố |
| E17 Billing, gói dịch vụ, AppSumo | 14.5, 14.6 | Có thể bỏ | Chỉ cần nếu bán app dưới dạng SaaS |

Khi viết story, nên tách theo vai trò ở mục Tổng quan và bám tiêu chí chấp nhận ở mục 15 (đa ngôn ngữ, theme, phân quyền, đủ trạng thái loading/empty/error). Các trang đang là Coming soon (Workload và Roadmap ở rail Projects, Archived, Export của Team Lead, Google Drive, Google Calendar) chưa có trong bản hiện tại.
