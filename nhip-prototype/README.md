# Nhịp: prototype workflow theo vai trò

**Nhịp** là tên của app quản lý dự án nội bộ đang được lên phạm vi. Thư mục này là bộ trang HTML tĩnh để trình bày tính năng cho các leader và chốt phạm vi: epic nào vào MVP, epic nào để Phase 2 hoặc Phase 3, epic nào bỏ.

Tính năng được phác theo **Worklenz** (app quản lý dự án mã nguồn mở), dùng làm bản tham khảo. Nội dung lấy từ `worklenz-feature-inventory.md` (Danh mục tính năng Worklenz). Danh sách 17 epic và đề xuất giai đoạn ban đầu lấy từ mục 16 của tài liệu đó.

Không cần backend, không cần cài đặt, không cần internet. Mọi dữ liệu đều là dữ liệu giả.

---

## 1. Mở prototype

1. Mở `index.html` bằng **Chrome** hoặc **Edge** (bấm đúp vào file).
2. Chọn một vai trò, đi lần lượt qua các bước.
3. Cuối buổi, mở **Bảng chốt phạm vi** (`scope-board.html`) để ghi quyết định.

Khi copy sang máy khác hoặc nơi khác, **copy nguyên thư mục `nhip-prototype/`** và giữ cấu trúc thư mục, vì các trang tham chiếu nhau bằng đường dẫn tương đối (`../assets/...`). Có thể đặt thư mục này lên bất kỳ web server tĩnh nào (GitHub Pages, server nội bộ…) mà không cần sửa gì.

### Phím tắt khi trình bày

| Phím | Tác dụng |
| --- | --- |
| `→` / `←` | Sang bước sau / bước trước. Bước cuối của một vai trò dẫn sang vai trò kế tiếp; vai trò cuối dẫn sang Bảng chốt phạm vi |
| `N` | Ẩn hoặc hiện khung **Ghi chú trình bày** (màu vàng, góc phải dưới) |
| `H` | Về trang đầu |
| `Esc` | Đóng modal hoặc ngăn bên phải |
| `Shift` + `→`/`←` | Trên trang Roadmap: dời thanh Gantt đang chọn 1 ngày |
| `/` | Trên trang Task List của PM: nhảy vào ô tìm kiếm |

Thanh đen trên cùng là thanh điều khiển của prototype, không thuộc giao diện app. Thanh này hiển thị vai trò, bước hiện tại, các chấm bước (bấm để nhảy tới bước đó), nút Trước/Tiếp, và link tới Bảng chốt phạm vi.

### Cách đọc màn hình

- **Nhãn epic** (ví dụ `E05 · MVP`): cho biết phần màn hình đó thuộc epic nào và đang ở giai đoạn nào. Màu: xanh dương = MVP, xanh ngọc = Phase 2, tím = Phase 3, xám gạch ngang = Bỏ. Bấm vào nhãn để mở đúng dòng epic đó trên Bảng chốt phạm vi.
- **Khung ghi chú màu vàng**: gợi ý nên bấm gì trên màn hình, và kết thúc bằng một **câu hỏi để chốt** dành cho các leader.
- **Viền nhấp nháy xanh**: chỉ chỗ nên bấm tiếp theo.
- Các mục menu, tab hoặc nút không thuộc câu chuyện đang trình bày sẽ hiện thông báo "Mục này không nằm trong chuỗi trình bày" thay vì không phản hồi.

---

## 2. Câu chuyện mẫu

Cả bốn vai trò cùng làm trên một dự án, nên bạn có thể dẫn dắt liền mạch từ vai trò này sang vai trò khác.

- **Công ty:** Sao Mai Digital (công ty làm dịch vụ, dùng Nhịp nội bộ)
- **Khách hàng:** Hoa Sen Group
- **Dự án chính:** Website Hoa Sen (mã task `WEB-…`), 03/11 – 31/12/2026, 5 phase: Khảo sát → Thiết kế → Lập trình → Kiểm thử → Bàn giao
- **Dự án phụ:** App giao hàng (`APP-…`, khách Bảo Minh), Chiến dịch Tết 2027 (`MKT-…`, nội bộ), CRM nội bộ, Website Bảo Minh (đã xong), Landing Black Friday
- **Ngày "hôm nay" trong demo:** Thứ Ba, 03/11/2026

| Người | Vai trò trong demo | Chuỗi |
| --- | --- | --- |
| Thảo Vy | Designer (Member) | Thành viên |
| Quốc Bảo | Project Manager, Team Lead | PM / Team Lead |
| Thu Hà | Giám đốc (Owner) | Admin / Giám đốc |
| Gia Huy | Client Admin của Hoa Sen | Khách hàng |
| Minh Anh, Đức Long, Hoàng Nam | Frontend, Backend, QA | Xuất hiện trong các chuỗi |
| Ngọc Trâm | Nhân viên mới được mời | Admin, bước 1 |
| Minh Trí | Tư vấn SEO (Guest) | Admin, bước 1 |

Mạch chính: Vy làm xong bản thiết kế **WEB-12 Trang chủ v2** → PM theo dõi và xếp lịch → Giám đốc cân tải và xem tiền → khách hàng **duyệt bản thiết kế** đó trên Client Portal (thông báo "khách đã duyệt" cũng xuất hiện ở bước 4 của Thành viên).

---

## 3. Nội dung từng chuỗi

### Thành viên (Thảo Vy)

| Bước | File | Thao tác nên làm khi trình bày | Epic |
| --- | --- | --- | --- |
| 1 | `member/1-my-tasks.html` | Đổi tab Hôm nay / Quá hạn, ghim task ☆, thêm task nhanh bằng Enter, bấm WEB-12 để mở chi tiết | E08, E04 |
| 2 | `member/2-board.html` | Kéo WEB-12 sang "Chờ duyệt"; thử kéo WEB-14 sang "Hoàn thành" để thấy bị chặn vì phụ thuộc; lọc "Chỉ việc của tôi". Không kéo được thì bấm nút "→" trên thẻ | E05, E09 |
| 3 | `member/3-task-detail.html` | Bấm ▶ timer (đồng hồ hiện trên thanh trên cùng), dừng để ghi giờ; tab Time Log nhập `1:30`, `90` hoặc `1.5`; tích subtask; gõ `@` trong bình luận để nhắc Quốc Bảo | E04, E06, E07, E09 |
| 4 | `member/4-notifications.html` | Ngăn thông báo tự mở; đánh dấu đã đọc / đọc tất cả; bảng giờ log hôm nay (có cả giờ từ timer ở bước 3); trả lời mention; xem mẫu email nhắc việc | E07, E06, E08 |

### PM / Team Lead (Quốc Bảo)

| Bước | File | Thao tác nên làm khi trình bày | Epic |
| --- | --- | --- | --- |
| 1 | `pm/1-create-project.html` | Modal tạo project đã mở sẵn: thử chọn Software, chọn template, bấm Tạo project → banner "đã sẵn sàng" | E03, E09, E15 |
| 2 | `pm/2-task-list.html` | Bấm "＋ Giao" ở WEB-15 (thấy số việc mỗi người đang ôm); tích nhiều dòng để hiện thanh thao tác hàng loạt; thu gọn nhóm; tìm kiếm | E05, E04 |
| 3 | `pm/3-roadmap.html` | Kéo thanh WEB-12 sang phải: WEB-14, WEB-18 tự dời theo (viền cam); kéo xa hơn thì cả go-live WEB-25 bị đẩy lùi; kéo mép phải để đổi ngày kết thúc; "Đặt lại lịch" | E09 |
| 4 | `pm/4-team-report.html` | Menu của Team Lead chỉ có Home, Projects, My Team Reports; biểu đồ giờ log so với capacity; bấm dòng Đức Long xem log chi tiết; đổi kỳ báo cáo | E10, E06 |

### Admin / Giám đốc (Thu Hà)

| Bước | File | Thao tác nên làm khi trình bày | Epic |
| --- | --- | --- | --- |
| 1 | `admin/1-members.html` | "Mời thành viên" (email đã điền sẵn) → dòng "Đang chờ chấp nhận" kèm bản xem trước email mời và wizard 3 bước; đổi vai trò ngay trên bảng; xem bảng quyền 5 vai trò; thu hồi link mời | E01, E02 |
| 2 | `admin/2-planner.html` | Đức Long đang quá tải (đỏ). Kéo khối WEB-22 sang ô của Hoàng Nam, hoặc bấm vào khối rồi chọn người; % tải tính lại ngay; "Hoàn tác"; ô nghỉ phép của Minh Anh không nhận việc | E11 |
| 3 | `admin/3-reporting.html` | Lọc "Có rủi ro"; bấm dòng App giao hàng để mở chi tiết (cảnh báo đã dùng 98% giờ nhưng mới xong 58%); đổi Delivery confidence trên bảng | E10 |
| 4 | `admin/4-finance.html` | Thanh phân bố ngân sách; bấm dòng Website Hoa Sen để xem chi phí theo vai trò × rate card và chi phí cố định | E13 |

### Khách hàng (Gia Huy, Client Portal)

Giao diện mang thương hiệu của khách (Hoa Sen), tách khỏi app nội bộ.

| Bước | File | Thao tác nên làm khi trình bày | Epic |
| --- | --- | --- | --- |
| 1 | `client/1-dashboard.html` | Việc cần khách xử lý, tiến độ, các mốc dự án; nhấn mạnh khách không thấy comment nội bộ, giờ công, chi phí | E14 |
| 2 | `client/2-approval.html` | So sánh Phiên bản 1 / 2; bấm "✓ Duyệt" hoặc "Yêu cầu sửa" (bắt buộc ghi lý do); lịch sử duyệt cập nhật | E14 |
| 3 | `client/3-discussion.html` | Gửi tin nhắn trong thảo luận; "Gửi yêu cầu thay đổi" → yêu cầu mới ở trạng thái Submitted; xem yêu cầu đã duyệt có ước lượng giờ và chi phí | E14, E12 |

Epic **chưa có màn hình** (trình bày bằng mô tả trên Bảng chốt phạm vi): E16 Tích hợp, import, Admin Center, audit log; E17 Billing. E15 Project Software chỉ xuất hiện dưới dạng gợi ý trong modal tạo project.

---

## 4. Bảng chốt phạm vi (`scope-board.html`)

- Phía trên là 4 cột tổng hợp: MVP / Phase 2 / Phase 3 / Bỏ. Mỗi cột liệt kê các epic đang nằm trong giai đoạn đó. Bấm vào một chip để cuộn tới dòng của epic.
- Mỗi dòng epic gồm: mô tả, story mẫu, link tới các màn hình minh hoạ, nút chọn giai đoạn, ô ghi chú, ô **Đã chốt**.
- Nếu một epic bị đổi khỏi đề xuất ban đầu, dòng đó hiện "Đề xuất ban đầu: …".
- **Sao chép kết quả** hoặc **Tải file .md** để xuất biên bản dạng bảng Markdown, nhóm theo giai đoạn. **In** để in bảng.
- **Khôi phục đề xuất**: bấm hai lần liên tiếp để xoá mọi quyết định và quay về đề xuất ban đầu.

### Đề xuất ban đầu (mục 16 của danh mục)

| Epic | Tên | Đề xuất | Mục nguồn |
| --- | --- | --- | --- |
| E01 | Xác thực và onboarding | MVP | 1 |
| E02 | Team, thành viên, phân quyền | MVP | 2 |
| E03 | Quản lý project | MVP | 4 |
| E04 | Quản lý task | MVP | 5 |
| E05 | View List và Board | MVP | 6.1, 6.2 |
| E06 | Time tracking và Time Entries | MVP | 7 |
| E07 | Thông báo, email, real-time | MVP | 12 |
| E08 | Home cá nhân và Settings | Phase 2 | 3, 13 |
| E09 | Roadmap, dependency, custom field, recurring, template | Phase 2 | 4.7, 5.5–5.8, 6.6 |
| E10 | Reporting và Insights | Phase 2 | 6.8, 9 |
| E11 | Planner, workload, time off, ngày lễ | Phase 2 | 6.7, 8, 14.1 |
| E12 | Updates, Docs, Files, Inbox | Phase 2 | 3.4, 6.9 |
| E13 | Finance và rate card | Phase 3 | 10 |
| E14 | Client Portal | Phase 3 | 11 |
| E15 | Project Software (backlog, sprint, epic, release) | Phase 3 | 4.5, 6.3–6.5 |
| E16 | Tích hợp, import, Admin Center, audit log | Phase 3 | 4.2, 6.10, 13, 14.1–14.4 |
| E17 | Billing, gói dịch vụ, AppSumo | Bỏ | 14.5, 14.6 |

### Quyết định được lưu ở đâu

Quyết định được lưu trong **localStorage của trình duyệt đang mở**, nên:

- Chỉ máy và trình duyệt đó thấy được. Muốn chia sẻ thì dùng Sao chép kết quả hoặc Tải file .md.
- Mở bằng `file://` và mở qua web server là hai nơi lưu khác nhau.
- Firefox có thể không chia sẻ dữ liệu giữa các file mở bằng `file://`. Khi đó nhãn trên các màn hình không đổi theo bảng. Hãy dùng Chrome hoặc Edge.

---

## 5. Chuẩn bị trước buổi họp

1. Mở `index.html`, bấm **Đặt lại dữ liệu demo**. Nút này xoá timer, giờ đã log và trạng thái đã đọc thông báo từ lần chạy trước, nhưng không xoá quyết định trên Bảng chốt phạm vi.
2. Nếu muốn bắt đầu lại từ đề xuất ban đầu, mở Bảng chốt phạm vi và bấm **Khôi phục đề xuất** hai lần.
3. Đặt màn hình rộng từ 1280px trở lên. Dưới 1100px thì rail menu bên trái và ô tìm kiếm trên navbar tự ẩn.
4. Mọi thay đổi trên màn hình (task mới, việc đã giao, lịch Gantt…) sẽ mất khi tải lại trang, trừ timer, giờ đã log, trạng thái đọc thông báo và quyết định trên bảng chốt.

---

## 6. Cấu trúc thư mục

```
nhip-prototype/
├── index.html            Trang đầu: chọn vai trò, chú thích nhãn, cách trình bày, đặt lại dữ liệu demo
├── scope-board.html      Bảng chốt phạm vi 17 epic
├── assets/
│   ├── style.css         Toàn bộ giao diện (theo token Ant Design như Worklenz: #1890ff, bo góc 6/8)
│   └── prototype.js      Dữ liệu dùng chung và khung app (xem mục 7)
├── member/               Chuỗi Thành viên, 4 bước
├── pm/                   Chuỗi PM / Team Lead, 4 bước
├── admin/                Chuỗi Admin / Giám đốc, 4 bước
└── client/               Chuỗi Khách hàng (Client Portal), 3 bước
```

---

## 7. Chỉnh sửa và mở rộng

Không có bước build. Sửa file bằng bất kỳ trình soạn thảo nào rồi tải lại trang.

### Dữ liệu dùng chung (`assets/prototype.js`)

| Biến | Nội dung |
| --- | --- |
| `EPICS` | 17 epic: `code`, `short` (tên ngắn trên chip), `name`, `phase` (đề xuất ban đầu: `mvp`, `p2`, `p3`, `drop`), `src` (mục nguồn), `desc`, `story` |
| `FLOWS` | 4 chuỗi vai trò: nhãn, người, màu, mô tả, và danh sách `steps` (`file`, `title`, `epics`) |
| `ROLE_ORDER` | Thứ tự vai trò trên trang đầu và khi bấm "Tiếp" ở bước cuối |
| `PEOPLE` | Người trong demo: tên, chữ viết tắt trên avatar, màu (`c1`…`c9`), chức danh |
| `MENUS` | Menu trên cùng của từng vai trò (thể hiện phân quyền) |
| `RAILS` | Các mục rail bên trái của từng khu vực |
| `NOTIFS` | Thông báo trong ngăn 🔔 của từng vai trò |

Đổi đề xuất giai đoạn ban đầu: sửa trường `phase` trong `EPICS`.
Danh sách "Xem trên màn hình" trên Bảng chốt phạm vi và các nhãn trên trang đầu được tạo tự động từ `FLOWS[...].steps[...].epics`. Khi thêm nhãn epic vào một trang, nhớ thêm mã epic đó vào `epics` của bước tương ứng.

### Thêm một màn hình vào một chuỗi

1. Tạo file trong thư mục của vai trò, ví dụ `pm/5-insights.html`, theo khung sau:

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>PM · 5. Insights</title>
  <link rel="stylesheet" href="../assets/style.css">
</head>
<body data-root="../" data-role="pm" data-step="5" data-area="projects" data-rail="none">
  <main>
    <div data-project-header="Insights"></div>   <!-- tuỳ chọn: header + tab của project Website Hoa Sen -->
    <h1>Insights <span class="epic" data-epic="E10"></span></h1>
    <!-- nội dung màn hình -->
  </main>

  <aside class="notes">
    <b>Tiêu đề ghi chú.</b>
    <ul><li>Bấm gì, thấy gì.</li></ul>
    <b>Câu hỏi để chốt:</b> …
  </aside>

  <script src="../assets/prototype.js"></script>
  <script>
    // logic riêng của trang (dùng WL.toast, WL.avatar, WL.escapeHtml…)
  </script>
</body>
</html>
```

2. Thêm bước vào `FLOWS.pm.steps` trong `prototype.js`: `{ file: 'pm/5-insights.html', title: 'Insights của project', epics: ['E10'] }`. Giá trị `data-step` phải đúng vị trí của bước trong danh sách (đếm từ 1).

### Thuộc tính `<body>`

| Thuộc tính | Giá trị |
| --- | --- |
| `data-root` | Đường dẫn về thư mục gốc: `""` cho trang ở gốc, `"../"` cho trang trong thư mục vai trò |
| `data-role` | `member`, `pm`, `admin`, `client`. Bỏ trống thì trang không có nút Trước/Tiếp |
| `data-step` | Số thứ tự bước trong chuỗi |
| `data-shell` | `app` (mặc định: navbar + rail của app Nhịp), `client` (navbar Client Portal), `none` (không có khung app) |
| `data-area` | Mục menu đang chọn: `home`, `projects`, `planner`, `reporting`, `finance`, `portal`, `teamreports`, `settings` (với shell `client`: `dashboard`, `projects`, `approvals`, `requests`, `discussions`, `invoices`) |
| `data-rail` | Tên mục rail đang chọn (đúng chữ trong `RAILS`), hoặc `none` để ẩn rail |

### Hành vi có sẵn, chỉ cần gắn thuộc tính

| Đánh dấu | Hành vi |
| --- | --- |
| `<span class="epic" data-epic="E05"></span>` | Nhãn epic, tự hiện giai đoạn hiện tại, bấm để mở Bảng chốt phạm vi |
| `<aside class="notes">…</aside>` | Khung ghi chú trình bày, phím N để ẩn/hiện |
| `<div data-project-header="Board"></div>` | Header project Website Hoa Sen với tab đang chọn |
| `data-inert` | Bấm vào chỉ hiện thông báo "không nằm trong chuỗi trình bày" |
| `data-open="#id"` / `data-dismiss` | Mở / đóng modal `<div class="overlay" id="id">` |
| `<div class="tabs" data-tabs="g">` + nút `data-tab="x"` + khối `data-panel="g:x"` | Tab chuyển nội dung |
| `class="hint-pulse"` | Viền nhấp nháy chỉ chỗ nên bấm |
| `hidden` | Ẩn phần tử (luôn thắng CSS của component) |

Hàm dùng được trong script của trang (đối tượng `WL`): `WL.toast(text, 'success' | 'error' | 'info')`, `WL.avatar(personId, 'lg')`, `WL.escapeHtml(text)` (bắt buộc dùng khi hiển thị chữ người dùng gõ vào), `WL.openNotifications()`, `WL.renderEpics(node)` (khi tạo nhãn epic bằng JS), `WL.timer` (`start`, `stop`, `get`, `logs`, `fmt`), `WL.load` / `WL.save` (localStorage).

Lớp CSS hay dùng: `card`, `stat`, `grid c2|c3|c4|side`, `table` trong `table-wrap`, `btn primary|sm|text|danger|success`, `tag blue|green|orange|red|purple`, `status todo|doing|review|done`, `prio low|medium|high|critical`, `progress` (`green|orange|red`), `alert info|success|warn`, `seg`, `tabs`, `row`, `muted`, `small`.

### Khoá lưu trữ

| Khoá | Nội dung |
| --- | --- |
| `wlProto.scope.v1` (localStorage) | Quyết định trên Bảng chốt phạm vi |
| `wlProto.timer.v1` (localStorage) | Timer đang chạy |
| `wlProto.timelogs.v1` (localStorage) | Giờ đã log trong demo |
| `wlProto.notifRead.v1` (localStorage) | Thông báo đã đọc |
| `wlProto.notesCollapsed` (sessionStorage) | Trạng thái ẩn/hiện khung ghi chú |

---

## 8. Giới hạn

- Chỉ là prototype giao diện: không có backend, dữ liệu giả, phần lớn thay đổi mất khi tải lại trang.
- Chỉ có giao diện sáng và tiếng Việt. App thật phải hỗ trợ sáng/tối và đa ngôn ngữ (i18next).
- Timer chạy nhanh để dễ trình diễn: **1 giây thật = 1 phút**.
- Kéo thả trên Board và Planner dùng drag-and-drop của trình duyệt, cần chuột hoặc touchpad. Thao tác thay thế bằng bàn phím: nút "→" trên thẻ Board; bấm hoặc Enter trên khối việc ở Planner; Shift + mũi tên trên thanh Gantt.
- Gantt chỉ hiển thị 26/10/2026 – 03/01/2027. Thao tác dời lịch khiến task vượt khỏi khoảng này sẽ bị chặn.
- Thiết kế cho màn hình desktop (từ 1280px). Màn hình hẹp vẫn xem được nhưng không tối ưu.
