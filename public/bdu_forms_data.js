/**
 * ===================================================================
 * BDU FORMS DATA, AI EXAM STUDIO & SSO AUTH MODULE (bdu_forms_data.js)
 * Cổng thông tin Khoa Ngoại Ngữ - Đại học Bình Dương
 * ===================================================================
 */

// Global Forms & AI Exam State
window.BDU_FORMS_STATE = {
  activeFormId: 'form-01',
  activeCategory: 'all',
  formData: {},
  savedExams: [],
  currentUser: {
    isLoggedIn: true,
    name: 'ThS. Phạm Hoàng Phúc',
    email: 'phphuc@bdu.edu.vn',
    role: 'Ban Chủ Nhiệm & Khảo Thí',
    title: 'Ban Chủ Nhiệm Khoa Ngoại Ngữ',
    code: 'CB-BDU-001'
  }
};

// 15 Standard BDU Administrative Forms
window.BDU_FORM_TEMPLATES = [
  {
    id: 'form-01',
    code: 'BM-SV-01',
    category: 'thu-tuc-sv',
    categoryName: 'Thủ Tục & Xác Nhận SV',
    title: 'Đơn Xin Cấp Giấy Xác Nhận Sinh Viên',
    desc: 'Dùng cho sinh viên xin xác nhận đang theo học để tạm hoãn nghĩa vụ quân sự, vay vốn ngân hàng chính sách, làm vé xe buýt...',
    target: 'Phòng CTSV & Khoa Ngoại Ngữ',
    fields: [
      { key: 'studentName', label: 'Họ và tên sinh viên', type: 'text', default: 'Nguyễn Văn An' },
      { key: 'studentCode', label: 'Mã số sinh viên (MSSV)', type: 'text', default: '28NN0101' },
      { key: 'dob', label: 'Ngày tháng năm sinh', type: 'date', default: '2005-09-15' },
      { key: 'gender', label: 'Giới tính', type: 'select', options: ['Nam', 'Nữ'], default: 'Nam' },
      { key: 'cohortClass', label: 'Lớp sinh hoạt / Khóa', type: 'text', default: '28NNA01 (Khóa K28)' },
      { key: 'major', label: 'Ngành học', type: 'text', default: 'Ngôn ngữ Anh' },
      { key: 'phone', label: 'Số điện thoại', type: 'tel', default: '0912 345 678' },
      { key: 'purpose', label: 'Mục đích xin xác nhận', type: 'select', options: ['Tạm hoãn nghĩa vụ quân sự', 'Làm hồ sơ vay vốn ngân hàng chính sách', 'Làm thủ tục xin cấp visa du học / thực tập', 'Làm vé xe buýt / Ưu đãi giao thông', 'Khác'], default: 'Tạm hoãn nghĩa vụ quân sự' },
      { key: 'copies', label: 'Số lượng bản in', type: 'number', default: '02' }
    ]
  },
  {
    id: 'form-02',
    code: 'BM-SV-02',
    category: 'thu-tuc-sv',
    categoryName: 'Thủ Tục & Xác Nhận SV',
    title: 'Đơn Xin Cấp Bảng Điểm Tạm Thời / Chính Thức',
    desc: 'Dùng cho sinh viên xin trích lục bảng điểm các học kỳ để nộp học bổng, xin việc làm hoặc chuyển trường.',
    target: 'Phòng Đào tạo & Khảo thí',
    fields: [
      { key: 'studentName', label: 'Họ và tên sinh viên', type: 'text', default: 'Trần Thị Bích' },
      { key: 'studentCode', label: 'MSSV', type: 'text', default: '28NN0102' },
      { key: 'cohortClass', label: 'Lớp / Khóa', type: 'text', default: '28NNA02 (Khóa K28)' },
      { key: 'major', label: 'Ngành học', type: 'text', default: 'Ngôn ngữ Anh (Tiếng Anh Thương Mại)' },
      { key: 'type', label: 'Loại bảng điểm', type: 'select', options: ['Bảng điểm tạm thời (Tiếng Việt)', 'Bảng điểm song ngữ (Anh - Việt)', 'Bảng điểm tốt nghiệp chính thức'], default: 'Bảng điểm song ngữ (Anh - Việt)' },
      { key: 'copies', label: 'Số lượng bản', type: 'number', default: '03' },
      { key: 'reason', label: 'Lý do xin cấp', type: 'text', default: 'Nộp hồ sơ ứng tuyển thực tập sinh tại doanh nghiệp FDI VSIP' }
    ]
  },
  {
    id: 'form-03',
    code: 'BM-SV-03',
    category: 'thu-tuc-sv',
    categoryName: 'Thủ Tục & Xác Nhận SV',
    title: 'Đơn Xin Cấp Lại Thẻ Sinh Viên / Kích Hoạt E-Learning',
    desc: 'Dùng cho sinh viên bị mất, hỏng thẻ sinh viên hoặc cần mở khóa tài khoản thư viện và cổng Portal học tập.',
    target: 'Trung tâm CNTT & Thư viện BDU',
    fields: [
      { key: 'studentName', label: 'Họ và tên sinh viên', type: 'text', default: 'Lê Hoàng Cường' },
      { key: 'studentCode', label: 'MSSV', type: 'text', default: '27NN0201' },
      { key: 'cohortClass', label: 'Lớp / Khóa', type: 'text', default: '27NNA01 (Khóa K27)' },
      { key: 'phone', label: 'Số điện thoại', type: 'tel', default: '0914 567 890' },
      { key: 'reason', label: 'Lý do xin cấp lại', type: 'select', options: ['Bị rơi / Mất thẻ trên đường đi học', 'Thẻ bị gãy / Hỏng chip từ', 'Quên mật khẩu / Bị khóa tài khoản E-Learning'], default: 'Bị rơi / Mất thẻ trên đường đi học' }
    ]
  },
  {
    id: 'form-04',
    code: 'BM-SV-04',
    category: 'thu-tuc-sv',
    categoryName: 'Thủ Tục & Xác Nhận SV',
    title: 'Đơn Xin Xét Miễn Giảm Học Phí & Trợ Cấp Xã Hội',
    desc: 'Dành cho sinh viên diện chính sách, con thương binh liệt sĩ, hộ nghèo/cận nghèo theo quy định hiện hành.',
    target: 'Phòng Công tác Sinh viên (CTSV)',
    fields: [
      { key: 'studentName', label: 'Họ và tên sinh viên', type: 'text', default: 'Phạm Minh Đức' },
      { key: 'studentCode', label: 'MSSV', type: 'text', default: '27NN0202' },
      { key: 'cohortClass', label: 'Lớp / Khóa', type: 'text', default: '27NNA02 (Khóa K27)' },
      { key: 'categoryPolicy', label: 'Thuộc đối tượng chính sách', type: 'select', options: ['Con thương binh / Bệnh binh', 'Hộ nghèo theo chuẩn quốc gia', 'Hộ cận nghèo', 'Mồ côi cả cha lẫn mẹ', 'Dân tộc thiểu số vùng đặc biệt khó khăn'], default: 'Hộ nghèo theo chuẩn quốc gia' },
      { key: 'semester', label: 'Áp dụng cho học kỳ', type: 'text', default: 'Học kỳ 1 năm học 2026 - 2027' }
    ]
  },
  {
    id: 'form-05',
    code: 'BM-HV-01',
    category: 'hoc-vu',
    categoryName: 'Học Vụ & Đào Tạo',
    title: 'Đơn Xin Đăng Ký Học Phần Bổ Sung / Học Vượt',
    desc: 'Đăng ký học thêm học phần ngoài thời khóa biểu chuẩn, học vượt hoặc đăng ký học lại để cải thiện điểm.',
    target: 'Phòng Đào tạo BDU',
    fields: [
      { key: 'studentName', label: 'Họ và tên sinh viên', type: 'text', default: 'Hoàng Thị Dung' },
      { key: 'studentCode', label: 'MSSV', type: 'text', default: '26NN0301' },
      { key: 'cohortClass', label: 'Lớp / Khóa', type: 'text', default: '26NNA01 (Khóa K26)' },
      { key: 'gpa', label: 'Điểm GPA hiện tại', type: 'text', default: '3.88' },
      { key: 'courseCode', label: 'Mã học phần xin học', type: 'text', default: 'ENG301' },
      { key: 'courseName', label: 'Tên học phần xin học', type: 'text', default: 'Tiếng Anh Thương Mại & Đàm Phán Doanh Nghiệp' },
      { key: 'credits', label: 'Số tín chỉ', type: 'number', default: '3' },
      { key: 'reason', label: 'Lý do đăng ký bổ sung', type: 'select', options: ['Học vượt theo lộ trình cá nhân', 'Đăng ký học lại để nâng điểm GPA', 'Học phần bị trùng lịch đợt 1'], default: 'Học vượt theo lộ trình cá nhân' }
    ]
  },
  {
    id: 'form-06',
    code: 'BM-HV-02',
    category: 'hoc-vu',
    categoryName: 'Học Vụ & Đào Tạo',
    title: 'Đơn Xin Chuyển Lớp Học Phần / Thay Đổi Thời Khóa Biểu',
    desc: 'Chuyển đổi nhóm học phần sang ca học khác do trùng lịch thi chứng chỉ ngoại ngữ hoặc đi làm thêm/thực tập.',
    target: 'Giáo vụ Khoa & Phòng Đào tạo',
    fields: [
      { key: 'studentName', label: 'Họ và tên sinh viên', type: 'text', default: 'Vũ Đức Em' },
      { key: 'studentCode', label: 'MSSV', type: 'text', default: '26NN0302' },
      { key: 'cohortClass', label: 'Lớp', type: 'text', default: '26NNA02' },
      { key: 'courseName', label: 'Học phần xin chuyển', type: 'text', default: 'ENG201 Biên Dịch Nâng Cao' },
      { key: 'classFrom', label: 'Từ nhóm lớp hiện tại', type: 'text', default: 'ENG201_01 (Thứ 2, ca sáng)' },
      { key: 'classTo', label: 'Sang nhóm lớp đề xuất', type: 'text', default: 'ENG201_02 (Thứ 5, ca chiều)' },
      { key: 'reason', label: 'Lý do xin chuyển', type: 'text', default: 'Bị trùng lịch học thực hành chứng chỉ VSTEP B2' }
    ]
  },
  {
    id: 'form-07',
    code: 'BM-HV-03',
    category: 'hoc-vu',
    categoryName: 'Học Vụ & Đào Tạo',
    title: 'Đơn Xin Bảo Lưu Kết Quả Học Tập (Nghỉ Học Tạm Thời)',
    desc: 'Bảo lưu kết quả học tập có thời hạn vì lý do sức khỏe, hoàn cảnh gia đình hoặc thi hành nghĩa vụ quân sự.',
    target: 'Ban Giám Hiệu & Phòng Đào tạo',
    fields: [
      { key: 'studentName', label: 'Họ và tên sinh viên', type: 'text', default: 'Bùi Văn Hùng' },
      { key: 'studentCode', label: 'MSSV', type: 'text', default: '25NN0402' },
      { key: 'cohortClass', label: 'Lớp', type: 'text', default: '25NNA01' },
      { key: 'duration', label: 'Thời gian xin bảo lưu', type: 'select', options: ['01 Học kỳ (HK1 năm 2026-2027)', '01 Năm học (Năm học 2026-2027)', 'Thời gian tham gia Nghĩa vụ quân sự'], default: '01 Học kỳ (HK1 năm 2026-2027)' },
      { key: 'reason', label: 'Lý do cụ thể', type: 'text', default: 'Điều trị bệnh theo chỉ định của Bệnh viện Đa khoa Tỉnh Bình Dương' }
    ]
  },
  {
    id: 'form-08',
    code: 'BM-HV-04',
    category: 'hoc-vu',
    categoryName: 'Học Vụ & Đào Tạo',
    title: 'Đơn Xin Công Nhận & Miễn Trừ Điểm Học Phần Ngoại Ngữ',
    desc: 'Quy đổi chứng chỉ quốc tế (IELTS, TOEFL, TOEIC, HSK, VSTEP) sang điểm học phần tiếng Anh theo quy chế.',
    target: 'Phòng Khảo thí & Khoa Ngoại Ngữ',
    fields: [
      { key: 'studentName', label: 'Họ và tên sinh viên', type: 'text', default: 'Nguyễn Văn An' },
      { key: 'studentCode', label: 'MSSV', type: 'text', default: '28NN0101' },
      { key: 'certificateName', label: 'Chứng chỉ ngoại ngữ nộp', type: 'select', options: ['IELTS Academic 7.5', 'IELTS Academic 6.5', 'VSTEP Bậc 4 (B2)', 'VSTEP Bậc 5 (C1)', 'TOEIC 750+', 'HSK 5'], default: 'IELTS Academic 7.5' },
      { key: 'issuedDate', label: 'Ngày cấp chứng chỉ', type: 'date', default: '2026-08-15' },
      { key: 'exemptCourse', label: 'Học phần xin miễn trừ', type: 'text', default: 'ENG101 Tiếng Anh Giao Tiếp 1 (Điểm quy đổi: 10.0 / Điểm A)' }
    ]
  },
  {
    id: 'form-09',
    code: 'BM-KT-01',
    category: 'khao-thi',
    categoryName: 'Khảo Thí & Điểm Thi',
    title: 'Đơn Xin Phúc Khảo Bài Thi Kết Thúc Học Phần',
    desc: 'Dành cho sinh viên có thắc mắc hoặc khiếu nại về điểm thi học phần ngoại ngữ chính thức.',
    target: 'Phòng Khảo thí & Đảm bảo CLGD',
    fields: [
      { key: 'studentName', label: 'Họ và tên sinh viên', type: 'text', default: 'Trần Hoàng Khải' },
      { key: 'studentCode', label: 'MSSV', type: 'text', default: '27NN0105' },
      { key: 'courseCode', label: 'Mã học phần', type: 'text', default: 'ENG201' },
      { key: 'courseName', label: 'Tên học phần', type: 'text', default: 'Biên Dịch Anh - Việt Nâng Cao' },
      { key: 'examDate', label: 'Ngày thi', type: 'date', default: '2026-08-20' },
      { key: 'examRoom', label: 'Phòng thi / Hội đồng', type: 'text', default: 'Phòng A2-302' },
      { key: 'scorePublished', label: 'Điểm số đã công bố', type: 'text', default: '5.5' },
      { key: 'reason', label: 'Nội dung đề nghị phúc khảo', type: 'text', default: 'Bài làm phần dịch đoạn văn thương mại câu 3 đối chiếu barem đạt trên 8 điểm' }
    ]
  },
  {
    id: 'form-10',
    code: 'BM-KT-02',
    category: 'khao-thi',
    categoryName: 'Khảo Thí & Điểm Thi',
    title: 'Đơn Xin Hoãn Thi Kết Thúc Học Phần',
    desc: 'Xin chuyển sang thi đợt bổ sung tiếp theo vì lý do cấp bách có xác nhận bệnh viện hoặc cơ quan.',
    target: 'Phòng Khảo thí & Ban Giám Hiệu',
    fields: [
      { key: 'studentName', label: 'Họ và tên sinh viên', type: 'text', default: 'Lê Thị Thu Thảo' },
      { key: 'studentCode', label: 'MSSV', type: 'text', default: '28NN0208' },
      { key: 'courseName', label: 'Môn thi xin hoãn', type: 'text', default: 'ENG101 Tiếng Anh Giao Tiếp 1' },
      { key: 'scheduledDate', label: 'Lịch thi đã công bố', type: 'date', default: '2026-09-02' },
      { key: 'reason', label: 'Lý do xin hoãn thi', type: 'text', default: 'Tai nạn giao thông đang nằm viện theo dõi y tế có giấy xuất viện kèm theo' }
    ]
  },
  {
    id: 'form-11',
    code: 'BM-TT-01',
    category: 'thuc-tap-nckh',
    categoryName: 'Thực Tập & NCKH',
    title: 'Giấy Giới Thiệu Liên Hệ Thực Tập Doanh Nghiệp',
    desc: 'Khoa Ngoại Ngữ cấp cho sinh viên liên hệ thực tập phiên dịch, tiếng Anh thương mại tại doanh nghiệp FDI.',
    target: 'Khoa Ngoại Ngữ & Doanh Nghiệp Tiếp Nhận',
    fields: [
      { key: 'studentName', label: 'Họ và tên sinh viên', type: 'text', default: 'Đỗ Thị Giang' },
      { key: 'studentCode', label: 'MSSV', type: 'text', default: '25NN0401' },
      { key: 'cohortClass', label: 'Lớp / Khóa', type: 'text', default: '25NNA01 (Khóa K25 - Năm cuối)' },
      { key: 'companyName', label: 'Tên Doanh nghiệp / Đơn vị kính gửi', type: 'text', default: 'Tập đoàn Tetra Pak Bình Dương (KCN VSIP II)' },
      { key: 'internPosition', label: 'Vị trí thực tập đề xuất', type: 'text', default: 'Trợ lý Biên dịch & Giao tiếp Thương mại' },
      { key: 'duration', label: 'Thời gian thực tập', type: 'text', default: 'Từ 01/10/2026 đến 31/12/2026 (03 tháng)' }
    ]
  },
  {
    id: 'form-12',
    code: 'BM-TT-02',
    category: 'thuc-tap-nckh',
    categoryName: 'Thực Tập & NCKH',
    title: 'Thuyết Minh Đề Tài Nghiên Cứu Khoa Học Sinh Viên',
    desc: 'Bản đề xuất đề tài NCKH sinh viên cấp Khoa / cấp Trường, mục tiêu, sản phẩm và kinh phí dự kiến.',
    target: 'Hội đồng Khoa học Khoa Ngoại Ngữ',
    fields: [
      { key: 'topicName', label: 'Tên đề tài NCKH', type: 'text', default: 'Ứng dụng Generative AI trong Nâng cao Kỹ năng Viết Học thuật Tiếng Anh cho Sinh viên BDU' },
      { key: 'leadStudent', label: 'Sinh viên chủ nhiệm đề tài', type: 'text', default: 'Nguyễn Văn An (MSSV: 28NN0101)' },
      { key: 'memberStudents', label: 'Sinh viên phối hợp', type: 'text', default: 'Vũ Đức Em (MSSV: 26NN0302)' },
      { key: 'mentor', label: 'Giảng viên hướng dẫn', type: 'text', default: 'TS. Nguyễn Văn A (Trưởng Khoa)' },
      { key: 'level', label: 'Cấp đề tài', type: 'select', options: ['Cấp Khoa', 'Cấp Trường', 'Cấp Tỉnh'], default: 'Cấp Trường' },
      { key: 'budget', label: 'Kinh phí dự kiến (VNĐ)', type: 'text', default: '5.000.000 VNĐ' }
    ]
  },
  {
    id: 'form-13',
    code: 'BM-TH-01',
    category: 'thoi-hoc',
    categoryName: 'Thôi Học & Rút Hồ Sơ',
    title: 'Đơn Xin Thôi Học & Rút Hồ Sơ Tự Nguyện',
    desc: 'Dùng cho sinh viên xin chấm dứt việc học tập tại trường vì lý do cá nhân hoặc đi du học nước ngoài.',
    target: 'Ban Giám Hiệu Trường ĐH Bình Dương',
    fields: [
      { key: 'studentName', label: 'Họ và tên sinh viên', type: 'text', default: 'Võ Thanh Nam' },
      { key: 'studentCode', label: 'MSSV', type: 'text', default: '27NN0311' },
      { key: 'cohortClass', label: 'Lớp / Khóa', type: 'text', default: '27NNA02' },
      { key: 'parentName', label: 'Họ tên cha/mẹ hoặc người giám hộ', type: 'text', default: 'Võ Văn Hùng' },
      { key: 'parentPhone', label: 'SĐT phụ huynh', type: 'tel', default: '0903 888 999' },
      { key: 'reason', label: 'Lý do thôi học', type: 'select', options: ['Đã trúng tuyển học bổng du học nước ngoài', 'Chuyển nơi cư trú cùng gia đình', 'Định hướng công việc gia đình'], default: 'Đã trúng tuyển học bổng du học nước ngoài' }
    ]
  },
  {
    id: 'form-14',
    code: 'BM-NB-01',
    category: 'noi-bo-khoa',
    categoryName: 'Biên Bản & Tờ Trình BGH',
    title: 'Tờ Trình Ban Giám Hiệu Về Phê Duyệt Kế Hoạch Chuyên Môn',
    desc: 'Văn bản của Lãnh đạo Khoa trình Ban Giám Hiệu phê duyệt tổ chức hội thảo, mời chuyên gia hoặc mua sắm giáo trình.',
    target: 'Ban Giám Hiệu BDU',
    fields: [
      { key: 'reportTitle', label: 'Về việc', type: 'text', default: 'Tổ chức Cuộc thi Rung Chuông Vàng Tiếng Anh & BDU English Debate 2026' },
      { key: 'signer', label: 'Người ký tờ trình', type: 'text', default: 'TS. Nguyễn Văn A' },
      { key: 'signerTitle', label: 'Chức vụ', type: 'text', default: 'TRƯỞNG KHOA NGOẠI NGỮ' },
      { key: 'budgetProposal', label: 'Kinh phí đề xuất', type: 'text', default: '20.000.000 VNĐ (Hai mươi triệu đồng)' },
      { key: 'mainContent', label: 'Nội dung tóm tắt', type: 'text', default: 'Phát triển môi trường giao tiếp thực tế cho sinh viên ngôn ngữ, tạo phong trào học tập thi đua sôi nổi toàn trường.' }
    ]
  },
  {
    id: 'form-15',
    code: 'BM-NB-02',
    category: 'noi-bo-khoa',
    categoryName: 'Biên Bản & Tờ Trình BGH',
    title: 'Biên Bản Cuộc Họp Ban Chủ Nhiệm Khoa Định Kỳ',
    desc: 'Ghi nhận nghị quyết cuộc họp giao ban công tác học thuật, rà soát tiến độ giảng dạy và phân công nhiệm vụ.',
    target: 'Lưu Trữ Văn Thư Khoa',
    fields: [
      { key: 'meetingName', label: 'Cuộc họp về', type: 'text', default: 'Giao ban chuyên môn đào tạo & Rà soát chuẩn đầu ra VSTEP B2' },
      { key: 'chairPerson', label: 'Chủ trì cuộc họp', type: 'text', default: 'TS. Nguyễn Văn A - Trưởng Khoa' },
      { key: 'secretary', label: 'Thư ký cuộc họp', type: 'text', default: 'Trần Bảo Ngọc - Chuyên viên Văn thư' },
      { key: 'attendees', label: 'Thành phần tham dự', type: 'text', default: 'Ban Chủ nhiệm Khoa, Trưởng các Bộ môn, Giảng viên cơ hữu & Chuyên viên Giáo vụ' },
      { key: 'resolutions', label: 'Kết luận cuộc họp', type: 'text', default: '100% nhất trí kế hoạch tăng cường giờ thực hành Speaking và chuẩn bị đón đoàn kiểm định AUN-QA.' }
    ]
  }
];

// 1. Render Forms Directory in Tab 8
function renderFormsHub() {
  const container = document.getElementById('formsCardListContainer');
  if (!container) return;

  const cat = window.BDU_FORMS_STATE.activeCategory || 'all';
  const query = (document.getElementById('searchFormsInput')?.value || '').toLowerCase().trim();

  const filtered = window.BDU_FORM_TEMPLATES.filter(f => {
    const mCat = cat === 'all' || f.category === cat;
    const mQ = !query || f.title.toLowerCase().includes(query) || f.code.toLowerCase().includes(query) || f.desc.toLowerCase().includes(query);
    return mCat && mQ;
  });

  container.innerHTML = filtered.map(item => {
    const isActive = item.id === window.BDU_FORMS_STATE.activeFormId;
    return `
      <div class="bdu-form-card ${isActive ? 'active' : ''}" onclick="selectFormTemplate('${item.id}')">
        <div class="form-card-header">
          <span class="form-card-code">${item.code}</span>
          <span class="form-card-cat">${item.categoryName}</span>
        </div>
        <div class="form-card-title">${item.title}</div>
        <div class="form-card-desc">${item.desc}</div>
        <div class="form-card-footer">
          <span class="form-card-target"><i class="fa-solid fa-building-columns"></i> ${item.target}</span>
          <i class="fa-solid fa-chevron-right text-primary"></i>
        </div>
      </div>
    `;
  }).join('') || '<div style="text-align:center; padding:20px; color:var(--text-muted);">Không tìm thấy biểu mẫu phù hợp.</div>';

  renderActiveFormPreview();
}

function filterFormsCategory(cat) {
  window.BDU_FORMS_STATE.activeCategory = cat;
  document.querySelectorAll('.form-cat-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.cat === cat);
  });
  renderFormsHub();
}

function searchForms(val) {
  renderFormsHub();
}

function toggleFormFillAccordion() {
  const body = document.getElementById('formFillInputsBody');
  const icon = document.getElementById('iconFormFillToggle');
  if (!body) return;
  const isHidden = body.style.display === 'none';
  body.style.display = isHidden ? 'grid' : 'none';
  if (icon) icon.className = isHidden ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down';
}

function selectFormTemplate(id) {
  window.BDU_FORMS_STATE.activeFormId = id;
  const tpl = window.BDU_FORM_TEMPLATES.find(f => f.id === id);
  if (tpl) {
    tpl.fields.forEach(fld => {
      if (window.BDU_FORMS_STATE.formData[`${id}_${fld.key}`] === undefined) {
        window.BDU_FORMS_STATE.formData[`${id}_${fld.key}`] = fld.default;
      }
    });
  }
  renderFormsHub();
}

function updateFormFieldValue(id, key, val) {
  window.BDU_FORMS_STATE.formData[`${id}_${key}`] = val;
  renderActiveFormPreview();
}

function getActiveFieldValue(id, key, defVal) {
  const v = window.BDU_FORMS_STATE.formData[`${id}_${key}`];
  return v !== undefined ? v : defVal;
}

function renderActiveFormPreview() {
  const tpl = window.BDU_FORM_TEMPLATES.find(f => f.id === window.BDU_FORMS_STATE.activeFormId) || window.BDU_FORM_TEMPLATES[0];
  if (!tpl) return;

  // 1. Populate Input fields accordion
  const inputContainer = document.getElementById('formFillInputsBody');
  if (inputContainer) {
    inputContainer.innerHTML = tpl.fields.map(fld => {
      const curVal = getActiveFieldValue(tpl.id, fld.key, fld.default);
      let inputHtml = '';
      if (fld.type === 'select') {
        inputHtml = `
          <select class="form-input" onchange="updateFormFieldValue('${tpl.id}', '${fld.key}', this.value)">
            ${fld.options.map(opt => `<option value="${opt}" ${opt === curVal ? 'selected' : ''}>${opt}</option>`).join('')}
          </select>
        `;
      } else if (fld.type === 'textarea') {
        inputHtml = `<textarea rows="2" class="form-input" oninput="updateFormFieldValue('${tpl.id}', '${fld.key}', this.value)">${curVal}</textarea>`;
      } else {
        inputHtml = `<input type="${fld.type}" value="${curVal}" class="form-input" oninput="updateFormFieldValue('${tpl.id}', '${fld.key}', this.value)">`;
      }
      return `
        <div class="form-input-block ${fld.type === 'textarea' ? 'full-width' : ''}">
          <label>${fld.label}</label>
          ${inputHtml}
        </div>
      `;
    }).join('');
  }

  // 2. Render Formal A4 Paper
  const paper = document.getElementById('administrativeFormPaperTarget');
  if (!paper) return;

  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  let bodyHtml = '';

  if (tpl.id === 'form-01') {
    const sName = getActiveFieldValue(tpl.id, 'studentName', 'Nguyễn Văn An');
    const sCode = getActiveFieldValue(tpl.id, 'studentCode', '28NN0101');
    const sDob = getActiveFieldValue(tpl.id, 'dob', '2005-09-15');
    const sGender = getActiveFieldValue(tpl.id, 'gender', 'Nam');
    const sClass = getActiveFieldValue(tpl.id, 'cohortClass', '28NNA01 (Khóa K28)');
    const sMajor = getActiveFieldValue(tpl.id, 'major', 'Ngôn ngữ Anh');
    const sPurpose = getActiveFieldValue(tpl.id, 'purpose', 'Tạm hoãn nghĩa vụ quân sự');
    const sCopies = getActiveFieldValue(tpl.id, 'copies', '02');

    bodyHtml = `
      <p>Kính gửi: <strong>BAN GIÁM HIỆU TRƯỜNG ĐẠI HỌC BÌNH DƯƠNG</strong><br>
         Đồng kính gửi: <strong>PHÒNG CÔNG TÁC SINH VIÊN • BAN CHỦ NHIỆM KHOA NGOẠI NGỮ</strong></p>

      <div style="margin-top: 14px;">
        <p>Tôi tên là: <span class="form-field-highlight">${sName}</span> Giới tính: <span class="form-field-highlight">${sGender}</span></p>
        <p>Ngày tháng năm sinh: <span class="form-field-highlight">${sDob}</span> Mã số sinh viên (MSSV): <span class="form-field-highlight">${sCode}</span></p>
        <p>Hiện đang là sinh viên lớp: <span class="form-field-highlight">${sClass}</span></p>
        <p>Ngành đào tạo: <span class="form-field-highlight">${sMajor}</span> Hệ: <strong>Đại học Chính quy</strong></p>
      </div>

      <p style="margin-top: 12px; text-indent: 25px;">
        Nay tôi làm đơn này kính xin Nhà trường và Khoa Ngoại Ngữ cấp cho tôi <span class="form-field-highlight">${sCopies} bản</span> Giấy xác nhận sinh viên.
      </p>
      <p style="text-indent: 25px;">
        Mục đích sử dụng: <span class="form-field-highlight">${sPurpose}</span>.
      </p>
      <p style="text-indent: 25px;">
        Tôi xin cam đoan các thông tin trên là hoàn toàn chính xác và sử dụng giấy xác nhận đúng mục đích theo quy định pháp luật và quy chế Nhà trường.
      </p>
    `;
  } else if (tpl.id === 'form-11') {
    const sName = getActiveFieldValue(tpl.id, 'studentName', 'Đỗ Thị Giang');
    const sCode = getActiveFieldValue(tpl.id, 'studentCode', '25NN0401');
    const sClass = getActiveFieldValue(tpl.id, 'cohortClass', '25NNA01');
    const cName = getActiveFieldValue(tpl.id, 'companyName', 'Tập đoàn Tetra Pak');
    const sPos = getActiveFieldValue(tpl.id, 'internPosition', 'Trợ lý Biên dịch');
    const sDur = getActiveFieldValue(tpl.id, 'duration', '03 tháng');

    bodyHtml = `
      <p>Kính gửi: <strong>BAN GIÁM ĐỐC / PHÒNG NHÂN SỰ ${cName.toUpperCase()}</strong></p>
      <p style="text-indent: 25px; margin-top: 12px;">
        Trường Đại học Bình Dương trân trọng giới thiệu sinh viên của Khoa Ngoại Ngữ đến liên hệ thực tập tốt nghiệp tại Quý cơ quan / Quý doanh nghiệp:
      </p>
      <div style="margin: 12px 0 12px 25px;">
        <p>- Họ và tên sinh viên: <span class="form-field-highlight">${sName}</span></p>
        <p>- Mã số sinh viên: <span class="form-field-highlight">${sCode}</span> Lớp: <span class="form-field-highlight">${sClass}</span></p>
        <p>- Chuyên ngành đào tạo: <strong>Ngôn ngữ Anh (Đại học Chính quy)</strong></p>
        <p>- Vị trí thực tập dự kiến: <span class="form-field-highlight">${sPos}</span></p>
        <p>- Thời gian thực tập: <span class="form-field-highlight">${sDur}</span></p>
      </div>
      <p style="text-indent: 25px;">
        Nhà trường rất mong nhận được sự hỗ trợ, tạo điều kiện thuận lợi của Quý cơ quan để sinh viên hoàn thành tốt chương trình thực tập. Xin trân trọng cảm ơn!
      </p>
    `;
  } else {
    // Generic high fidelity Administrative Form body
    bodyHtml = `
      <p>Kính gửi: <strong>BAN GIÁM HIỆU TRƯỜNG ĐẠI HỌC BÌNH DƯƠNG</strong><br>
         Đồng kính gửi: <strong>BAN CHỦ NHIỆM KHOA NGOẠI NGỮ</strong></p>
      <div style="margin: 16px 0;">
        ${tpl.fields.map(f => {
          const val = getActiveFieldValue(tpl.id, f.key, f.default);
          return `<p>- ${f.label}: <span class="form-field-highlight">${val}</span></p>`;
        }).join('')}
      </div>
      <p style="text-indent: 25px;">
        Tôi xin cam đoan các nội dung kê khai trên là hoàn toàn trung thực và chịu trách nhiệm trước pháp luật cũng như quy chế của Trường Đại học Bình Dương.
      </p>
    `;
  }

  paper.innerHTML = `
    <div class="report-national-header">
      <div class="report-org">
        <strong>BỘ GIÁO DỤC VÀ ĐÀO TẠO</strong><br>
        <strong>TRƯỜNG ĐẠI HỌC BÌNH DƯƠNG</strong><br>
        <strong>KHOA NGOẠI NGỮ</strong><br>
        <span style="font-size: 11px;">Mã hiệu: <strong>${tpl.code}</strong></span>
      </div>
      <div class="report-national">
        <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
        <strong>Độc lập - Tự do - Hạnh phúc</strong><br>
        <div style="width: 140px; height: 1px; background: #000; margin: 4px auto 8px;"></div>
        <em>Bình Dương, ngày ${day} tháng ${month} năm ${year}</em>
      </div>
    </div>

    <div class="form-paper-title-box">
      <h2>${tpl.title}</h2>
      <div class="form-paper-subtitle">Cổng thông tin & Dịch vụ một cửa BDU - Khoa Ngoại Ngữ</div>
    </div>

    <div class="report-body" style="font-size: 13.5pt; line-height: 1.6;">
      ${bodyHtml}
    </div>

    <div class="report-signature-grid" style="margin-top: 40px;">
      <div class="sig-col">
        <strong>XÁC NHẬN CỦA KHOA NGOẠI NGỮ</strong><br>
        <small>(Ký và ghi rõ họ tên)</small><br><br><br><br>
        <strong>TS. Nguyễn Văn A</strong>
      </div>
      <div class="sig-col">
        <strong>NGƯỜI LÀM ĐƠN</strong><br>
        <small>(Ký và ghi rõ họ tên)</small><br><br><br><br>
        <strong>${getActiveFieldValue(tpl.id, 'studentName', 'Sinh viên BDU')}</strong>
      </div>
    </div>
  `;
}

function downloadCurrentFormDoc() {
  const paper = document.getElementById('administrativeFormPaperTarget');
  if (!paper) return;
  const tpl = window.BDU_FORM_TEMPLATES.find(f => f.id === window.BDU_FORMS_STATE.activeFormId) || window.BDU_FORM_TEMPLATES[0];
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset="utf-8"><title>${tpl.title} - BDU</title>
    <style>
      body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.5; color: #000; }
      table { border-collapse: collapse; width: 100%; margin: 12px 0; }
      .report-national-header { display: flex; justify-content: space-between; text-align: center; margin-bottom: 20px; }
      .form-paper-title-box { text-align: center; margin: 20px 0; font-weight: bold; }
      .report-signature-grid { display: flex; justify-content: space-between; margin-top: 40px; text-align: center; }
    </style>
    </head>
    <body>${paper.innerHTML}</body>
    </html>
  `;
  const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BDU_${tpl.code}_${new Date().toISOString().slice(0, 10)}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Đã xuất file Word mẫu ${tpl.code}!`, 'success');
}

function copyCurrentForm() {
  const el = document.getElementById('administrativeFormPaperTarget');
  if (!el) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  try {
    document.execCommand('copy');
    showToast('Đã sao chép biểu mẫu hành chính vào Clipboard!', 'success');
  } catch (err) {
    showToast('Vui lòng bôi đen và nhấn Ctrl+C để sao chép.', 'info');
  }
  sel.removeAllRanges();
}

// 2. Tab 9: AI Exam Generator Studio & Security Gate
function renderAiExamGate() {
  const gate = document.getElementById('aiExamSecurityGate');
  const studio = document.getElementById('aiExamStudio');
  const topActions = document.getElementById('aiExamTopActions');
  const user = window.BDU_FORMS_STATE.currentUser;

  const isBduEmail = user && user.isLoggedIn && (user.email.endsWith('@bdu.edu.vn') || user.email.endsWith('@student.bdu.edu.vn'));

  if (gate && studio) {
    if (isBduEmail) {
      gate.style.display = 'none';
      studio.style.display = 'block';
      if (topActions) topActions.style.display = 'flex';
      renderSampleExamIfEmpty();
    } else {
      gate.style.display = 'block';
      studio.style.display = 'none';
      if (topActions) topActions.style.display = 'none';
    }
  }
}

function renderSampleExamIfEmpty() {
  const paper = document.getElementById('studentExamPaperContent');
  if (paper && !paper.innerHTML.trim()) {
    generateAiExam(false);
  }
}

function switchAiExamSubtab(tabName) {
  document.querySelectorAll('.ai-preview-tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.subtab === tabName);
  });
  document.querySelectorAll('.ai-exam-pane').forEach(p => {
    p.style.display = p.id === `pane${tabName.charAt(0).toUpperCase() + tabName.slice(1).replace(/-([a-z])/g, g => g[1].toUpperCase())}` ? 'block' : 'none';
  });
}

function generateAiExam(isFromSubmit = true) {
  const loading = document.getElementById('aiExamLoading');
  const studentPane = document.getElementById('studentExamPaperContent');
  const teacherPane = document.getElementById('teacherKeyContent');
  const matrixPane = document.getElementById('examMatrixContent');

  if (isFromSubmit && loading) {
    loading.classList.add('active');
  }

  setTimeout(() => {
    const subject = document.getElementById('aiSubject')?.value || 'Tiếng Anh (English / VSTEP)';
    const level = document.getElementById('aiLevel')?.value || 'B2 (VSTEP B2 / Upper-Inter)';
    const examType = document.getElementById('aiExamType')?.value || 'Đề Thi Cuối Kỳ (Final Exam)';
    const code = document.getElementById('aiCourseCode')?.value || 'ENG202';
    const name = document.getElementById('aiCourseName')?.value || 'Tiếng Anh Chuyên Ngành & Giao Tiếp Thương Mại';
    const duration = document.getElementById('aiDuration')?.value || '60';

    // 1. Student Paper
    if (studentPane) {
      studentPane.innerHTML = `
        <table class="exam-national-header-table">
          <tr>
            <td style="width: 50%; text-align: center;">
              <strong>BỘ GIÁO DỤC VÀ ĐÀO TẠO</strong><br>
              <strong>TRƯỜNG ĐẠI HỌC BÌNH DƯƠNG</strong><br>
              <strong>KHOA NGOẠI NGỮ</strong><br>
              <div style="width: 100px; height: 1px; background: #000; margin: 4px auto;"></div>
            </td>
            <td style="width: 50%; text-align: center;">
              <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
              <strong>Độc lập - Tự do - Hạnh phúc</strong><br>
              <div style="width: 100px; height: 1px; background: #000; margin: 4px auto;"></div>
            </td>
          </tr>
        </table>

        <div style="text-align: center; margin: 12px 0 16px;">
          <h2 style="font-size: 15pt; font-weight: bold; text-transform: uppercase;">${examType}</h2>
          <div style="font-size: 12pt; font-weight: bold;">HỌC PHẦN: ${name.toUpperCase()} (MÃ HP: ${code})</div>
          <div style="font-size: 11pt; font-style: italic;">Trình độ chuẩn đầu ra: ${level} • Thời gian làm bài: ${duration} phút (Không kể thời gian phát đề)</div>
        </div>

        <div class="exam-student-box">
          <div>Họ và tên thí sinh: ..............................................................</div>
          <div>Mã số sinh viên (MSSV): .......................................</div>
          <div>Ngày sinh: ......./......./............ Lớp: ................................</div>
          <div>Phòng thi: ...................... Số báo danh (SBD): ...............</div>
        </div>

        <div class="exam-instructions-box">
          * Ghi chú quan trọng: Thí sinh không được sử dụng từ điển hoặc tài liệu tham khảo. Cán bộ coi thi không giải thích gì thêm.
        </div>

        <!-- Section 1 -->
        <div class="exam-section-title">PART 1: VOCABULARY & BUSINESS COMMUNICATION GRAMMAR (4.0 POINTS)</div>
        <p style="font-style: italic; margin-bottom: 10px;">Mark the letter A, B, C, or D on your answer sheet to indicate the correct answer to each of the following questions.</p>

        <div class="exam-question-block">
          <div class="exam-question-text">Question 1: The multinational enterprise has agreed to ________ the terms of the bilateral trade agreement with foreign partners.</div>
          <div class="exam-options-grid">
            <div class="exam-option-item">A. facilitate</div>
            <div class="exam-option-item">B. negotiate</div>
            <div class="exam-option-item">C. collaborate</div>
            <div class="exam-option-item">D. determine</div>
          </div>
        </div>

        <div class="exam-question-block">
          <div class="exam-question-text">Question 2: If the marketing team ________ the campaign earlier, the brand awareness in Binh Duong Industrial Park would have increased substantially.</div>
          <div class="exam-options-grid">
            <div class="exam-option-item">A. launched</div>
            <div class="exam-option-item">B. had launched</div>
            <div class="exam-option-item">C. launch</div>
            <div class="exam-option-item">D. would launch</div>
          </div>
        </div>

        <div class="exam-question-block">
          <div class="exam-question-text">Question 3: Professional interpreters must maintain absolute ________ regarding confidential board meeting disclosures.</div>
          <div class="exam-options-grid">
            <div class="exam-option-item">A. neutrality</div>
            <div class="exam-option-item">B. confident</div>
            <div class="exam-option-item">C. confidentiality</div>
            <div class="exam-option-item">D. transparency</div>
          </div>
        </div>

        <!-- Section 2 -->
        <div class="exam-section-title">PART 2: READING COMPREHENSION & FDI INDUSTRIAL INSIGHTS (3.0 POINTS)</div>
        <div class="exam-passage-box">
          <strong>Read the following passage and mark the letter A, B, C, or D to indicate the correct answer:</strong><br><br>
          Binh Duong Province has continuously emerged as one of Vietnam's leading industrial and technological hubs, drawing high levels of Foreign Direct Investment (FDI) from multinational corporations in Japan, South Korea, and Singapore. The strategic transition towards green manufacturing, digital automation, and artificial intelligence integration necessitates a highly skilled workforce proficient in bilingual technical translation and intercultural negotiation. Graduates with strong foundational command in English and communicative agility are poised to assume managerial liaison roles across supply chain logistics and foreign customer relations desks.
        </div>

        <div class="exam-question-block">
          <div class="exam-question-text">Question 4: What is highlighted as a primary driver of Binh Duong's foreign direct investment growth?</div>
          <div class="exam-options-grid">
            <div class="exam-option-item">A. Transition to digital automation and sustainable production</div>
            <div class="exam-option-item">B. Relying entirely on manual labor assembly lines</div>
            <div class="exam-option-item">C. Eliminating foreign language requirements in factories</div>
            <div class="exam-option-item">D. Focusing solely on agricultural trading exports</div>
          </div>
        </div>

        <!-- Section 3 -->
        <div class="exam-section-title">PART 3: ACADEMIC ESSAY & PROFESSIONAL WRITING (3.0 POINTS)</div>
        <p style="font-style: italic; margin-bottom: 8px;">Write a formal email (120 - 150 words) to your department manager explaining the advantages of implementing neural machine translation (NMT) tools to accelerate document processing in your company.</p>
        <div style="border: 1px dashed #cbd5e1; height: 180px; padding: 10px; font-style: italic; color: #94a3b8;">
          [Khu vực viết bài làm của thí sinh / Student's writing space]
        </div>
      `;
    }

    // 2. Teacher Answer Key
    if (teacherPane) {
      teacherPane.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="font-size: 15pt; font-weight: bold; color: #b91c1c;">HƯỚNG DẪN CHẤM & ĐÁP ÁN BIỂU ĐIỂM CHÍNH THỨC</h2>
          <div style="font-size: 12pt; font-weight: bold;">HỌC PHẦN: ${name} (MÃ: ${code})</div>
          <div style="font-size: 11pt; color: #64748b;">Khung chuẩn đầu ra: ${level} • Thang điểm: 10.0</div>
        </div>

        <table class="exam-answer-table">
          <thead>
            <tr>
              <th style="width: 80px;">Câu hỏi</th>
              <th style="width: 100px;">Đáp án</th>
              <th style="width: 80px;">Điểm</th>
              <th>Giải thích ngữ pháp / Căn cứ chấm thi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center; font-weight: bold;">Câu 1</td>
              <td style="text-align: center; font-weight: bold; color: #15803d;">B (negotiate)</td>
              <td style="text-align: center;">1.0 đ</td>
              <td>Cụm từ "negotiate the terms of an agreement" là kết hợp từ (collocation) chuẩn trong tiếng Anh thương mại.</td>
            </tr>
            <tr>
              <td style="text-align: center; font-weight: bold;">Câu 2</td>
              <td style="text-align: center; font-weight: bold; color: #15803d;">B (had launched)</td>
              <td style="text-align: center;">1.0 đ</td>
              <td>Câu điều kiện loại 3 (Third Conditional) diễn tả giả định trái ngược với quá khứ: If + S + had V3/ed, S + would have V3/ed.</td>
            </tr>
            <tr>
              <td style="text-align: center; font-weight: bold;">Câu 3</td>
              <td style="text-align: center; font-weight: bold; color: #15803d;">C (confidentiality)</td>
              <td style="text-align: center;">1.0 đ</td>
              <td>Cần danh từ sau tính từ "absolute": maintain absolute confidentiality (giữ bí mật tuyệt đối).</td>
            </tr>
            <tr>
              <td style="text-align: center; font-weight: bold;">Câu 4</td>
              <td style="text-align: center; font-weight: bold; color: #15803d;">A</td>
              <td style="text-align: center;">1.0 đ</td>
              <td>Căn cứ thông tin đoạn 1: "The strategic transition towards green manufacturing, digital automation...".</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 24px;">
          <h4 style="font-size: 13pt; font-weight: bold;">TIÊU CHÍ CHẤM PHẦN TỰ LUẬN VIẾT (PART 3 - 3.0 ĐIỂM)</h4>
          <ul style="line-height: 1.8; font-size: 12pt; padding-left: 24px;">
            <li><strong>Task Achievement (1.0 đ):</strong> Trả lời đủ các ý, nêu rõ ít nhất 2 ưu điểm của công nghệ dịch máy thần kinh.</li>
            <li><strong>Coherence & Cohesion (0.75 đ):</strong> Bố cục thư mạch lạc, sử dụng từ nối (Furthermore, In addition, Consequently).</li>
            <li><strong>Lexical Resource (0.75 đ):</strong> Dùng từ vựng chuyên ngành ngôn ngữ và kinh tế phù hợp, tự nhiên.</li>
            <li><strong>Grammatical Accuracy (0.5 đ):</strong> Cấu trúc câu chuẩn xác, không mắc lỗi chia động từ cơ bản.</li>
          </ul>
        </div>
      `;
    }

    // 3. Exam Matrix
    if (matrixPane) {
      matrixPane.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="font-size: 15pt; font-weight: bold; color: #005F87;">MA TRẬN ĐỀ THI ĐÁNH GIÁ NĂNG LỰC HỌC PHẦN (EXAM MATRIX)</h2>
          <div style="font-size: 12pt; font-weight: bold;">MÔN: ${name} • HỆ ĐÀO TẠO CHÍNH QUY BDU</div>
        </div>

        <table class="exam-matrix-table">
          <thead>
            <tr>
              <th rowspan="2">Kỹ Năng / Nội Dung Đánh Giá</th>
              <th colspan="4">Mức Độ Nhận Thức Theo Chuẩn BDU</th>
              <th rowspan="2">Tổng Số Câu</th>
              <th rowspan="2">Tỷ Lệ (%)</th>
            </tr>
            <tr>
              <th>Nhận Biết</th>
              <th>Thông Hiểu</th>
              <th>Vận Dụng</th>
              <th>Vận Dụng Cao</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: left; font-weight: bold;">1. Ngữ pháp & Từ vựng Thương mại</td>
              <td>2 câu (1.0đ)</td>
              <td>2 câu (1.0đ)</td>
              <td>1 câu (1.0đ)</td>
              <td>1 câu (1.0đ)</td>
              <td>6 câu</td>
              <td>40%</td>
            </tr>
            <tr>
              <td style="text-align: left; font-weight: bold;">2. Đọc hiểu văn bản FDI & Kinh tế</td>
              <td>1 câu (0.5đ)</td>
              <td>2 câu (1.0đ)</td>
              <td>1 câu (1.0đ)</td>
              <td>0.5đ</td>
              <td>4 câu</td>
              <td>30%</td>
            </tr>
            <tr>
              <td style="text-align: left; font-weight: bold;">3. Kỹ năng Viết thư tín học thuật</td>
              <td>-</td>
              <td>0.5đ</td>
              <td>1.5đ</td>
              <td>1.0đ</td>
              <td>1 bài</td>
              <td>30%</td>
            </tr>
            <tr style="background: #f1f5f9; font-weight: bold;">
              <td>Tổng cộng</td>
              <td>15%</td>
              <td>25%</td>
              <td>35%</td>
              <td>25%</td>
              <td>100%</td>
              <td>10.0 Điểm</td>
            </tr>
          </tbody>
        </table>
      `;
    }

    if (loading) loading.classList.remove('active');
    if (isFromSubmit) showToast(`Đã tạo thành công Đề thi & Ma trận học phần ${code}!`, 'success');
  }, isFromSubmit ? 800 : 50);
}

// 3. SSO BDU Authentication Header Updates
function initBduAuth() {
  const container = document.getElementById('bduAuthContainer');
  if (!container) return;

  const user = window.BDU_FORMS_STATE.currentUser;

  if (user && user.isLoggedIn) {
    container.innerHTML = `
      <div class="bdu-user-badge-wrap" id="btnUserMenuToggle">
        <div class="sidebar-user-avatar" style="width: 30px; height: 30px; font-size: 13px;">
          <i class="fa-solid fa-user-check"></i>
        </div>
        <div style="display: flex; flex-direction: column; line-height: 1.1;">
          <span style="font-weight: 700; font-size: 12.5px; color: var(--text-main);">${user.name}</span>
          <span style="font-size: 10.5px; color: var(--bdu-primary); font-weight: 600;">${user.role}</span>
        </div>
        <i class="fa-solid fa-chevron-down" style="font-size: 10px; color: var(--text-muted); margin-left: 4px;"></i>

        <!-- Dropdown Menu -->
        <div class="bdu-user-dropdown-menu" id="userDropdownMenu">
          <div class="dropdown-user-header">
            <div class="user-name">${user.name}</div>
            <div class="user-email">${user.email}</div>
          </div>
          <div class="dropdown-menu-list">
            <div class="dropdown-menu-item" onclick="switchToTab('tab-portal-students')">
              <i class="fa-solid fa-id-card text-primary"></i> Hồ Sơ Của Tôi
            </div>
            <div class="dropdown-menu-item" onclick="switchToTab('tab-ai-exam')">
              <i class="fa-solid fa-wand-magic-sparkles text-amber"></i> AI Exam Studio
            </div>
            <div class="dropdown-menu-item logout" onclick="handleBduLogout()">
              <i class="fa-solid fa-arrow-right-from-bracket"></i> Đăng Xuất Hệ Thống
            </div>
          </div>
        </div>
      </div>
    `;

    const trigger = document.getElementById('btnUserMenuToggle');
    const menu = document.getElementById('userDropdownMenu');
    trigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      menu?.classList.toggle('active');
    });

    document.addEventListener('click', () => menu?.classList.remove('active'));
  } else {
    container.innerHTML = `
      <button class="bdu-auth-btn" id="btnHeaderLogin">
        <i class="fa-solid fa-right-to-bracket"></i> Đăng Nhập BDU
      </button>
    `;
    document.getElementById('btnHeaderLogin')?.addEventListener('click', () => {
      document.getElementById('modalBduLogin')?.classList.add('active');
    });
  }

  // Update role badge in Exam Studio if present
  const roleBadge = document.getElementById('aiExamRoleBadge');
  if (roleBadge && user && user.isLoggedIn) {
    roleBadge.textContent = `${user.role} (${user.email})`;
  }
}

function handleBduLogout() {
  window.BDU_FORMS_STATE.currentUser.isLoggedIn = false;
  initBduAuth();
  renderAiExamGate();
  showToast('Đã đăng xuất khỏi hệ thống BDU.', 'info');
}

// 4. Emergency PDF Viewer Handler
function initEmergencyPdfViewer() {
  const trigger = document.getElementById('btnEmergencyPdfTrigger');
  const modal = document.getElementById('modalPdfViewer');
  const content = document.getElementById('pdfPageSheetContent');

  if (trigger && modal && content) {
    trigger.addEventListener('click', () => {
      content.innerHTML = `
        <div class="pdf-national-block">
          <div class="pdf-org-info">
            <strong>BỘ GIÁO DỤC VÀ ĐÀO TẠO</strong><br>
            <strong>TRƯỜNG ĐẠI HỌC BÌNH DƯƠNG</strong><br>
            <div class="pdf-rule-line"></div>
            <span>Số: <strong>88/TB-KNN-ĐHBD</strong></span>
          </div>
          <div class="pdf-national-title">
            <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
            <strong>Độc lập - Tự do - Hạnh phúc</strong><br>
            <div class="pdf-rule-line"></div>
            <em>Bình Dương, ngày 31 tháng 08 năm 2026</em>
          </div>
        </div>

        <div class="pdf-doc-heading">
          <h2>THÔNG BÁO KHẨN CẤP</h2>
          <div class="doc-subheading">V/v: Điều chỉnh lịch thi chuẩn đầu ra VSTEP B1-C1 & Hạn nộp Đề cương NCKH Sinh viên Học kỳ 1 (2026 - 2027)</div>
        </div>

        <div class="pdf-body-paragraphs">
          <p>Kính gửi: Toàn thể Cán bộ, Giảng viên và Sinh viên các khóa K25, K26, K27, K28 thuộc Khoa Ngoại Ngữ.</p>
          <p>Căn cứ Quyết định của Ban Giám Hiệu Trường Đại học Bình Dương về việc triển khai kế hoạch đào tạo năm học 2026 - 2027; Khoa Ngoại Ngữ trân trọng thông báo:</p>
          <p><strong>1. Về kỳ thi Khảo thí Chuẩn đầu ra Ngoại ngữ (VSTEP B1-B2-C1):</strong></p>
          <ul>
            <li>Gia hạn thời gian đăng ký trực tuyến đến hết ngày <strong>15/09/2026</strong>.</li>
            <li>Lịch thi chính thức: Ngày <strong>26/09/2026 và 27/09/2026</strong> tại Trung tâm Khảo thí Ngoại ngữ BDU (Tòa nhà A2).</li>
          </ul>
          <p><strong>2. Về đề cương Nghiên cứu Khoa học (NCKH) Sinh viên năm 2026:</strong></p>
          <ul>
            <li>Hạn nộp bản mềm qua Cổng Quản lý Khoa: <strong>10/09/2026</strong>.</li>
            <li>Hội đồng khoa học Khoa tổ chức xét duyệt đề cương từ ngày 12/09/2026 đến 14/09/2026.</li>
          </ul>
          <p>Khoa Ngoại Ngữ yêu cầu các Cố vấn học tập (GVCN) đôn đốc nhắc nhở sinh viên thực hiện nghiêm túc thông báo này.</p>
        </div>

        <div class="pdf-signature-row">
          <div class="pdf-recipients">
            <strong>Nơi nhận:</strong><br>
            - BGH (để báo cáo);<br>
            - Phòng Đào tạo & Khảo thí;<br>
            - Lớp trưởng các lớp K25 - K28;<br>
            - Lưu: VT, KNN.
          </div>
          <div class="pdf-signer-block">
            <strong>TRƯỞNG KHOA NGOẠI NGỮ</strong><br>
            <small>(Đã ký và đóng dấu)</small>
            
            <!-- Authentic Red Seal Stamp of BDU -->
            <div class="pdf-red-seal">
              <span>BỘ GIÁO DỤC & ĐÀO TẠO</span>
              <span class="seal-star">★</span>
              <span>TRƯỜNG ĐH BÌNH DƯƠNG</span>
              <span style="font-size: 8px;">KHOA NGOẠI NGỮ</span>
            </div>

            <div style="height: 60px;"></div>
            <strong>TS. NGUYỄN VĂN A</strong>
          </div>
        </div>
      `;
      modal.classList.add('active');
    });

    document.getElementById('btnClosePdfViewer')?.addEventListener('click', () => modal.classList.remove('active'));
    document.getElementById('btnPdfPrintDoc')?.addEventListener('click', () => window.print());
    document.getElementById('btnPdfDownloadDoc')?.addEventListener('click', () => {
      showToast('Đang tải tài liệu quyết định PDF về máy...', 'info');
      setTimeout(() => showToast('Đã tải thành công văn bản 88/TB-KNN-ĐHBD.pdf!', 'success'), 800);
    });
  }
}

// 5. News & Announcements Widget in Tab 1
function initNewsWidget() {
  const container = document.getElementById('widgetNewsListContainer');
  if (!container) return;

  const newsItems = [
    { day: '31', mon: 'TH08', cat: 'Khảo Thí', title: 'Thông báo điều chỉnh lịch Khảo thí Chuẩn đầu ra VSTEP B1-C1 Học kỳ 1 (2026 - 2027)', time: '31/08/2026 • Phòng Khảo thí BDU' },
    { day: '28', mon: 'TH08', cat: 'Tuyển Sinh', title: 'Khoa Ngoại Ngữ chào đón Tân Sinh Viên Ngôn Ngữ Anh Khóa 28 nhập học đợt 1', time: '28/08/2026 • Ban Chủ Nhiệm Khoa' },
    { day: '25', mon: 'TH08', cat: 'NCKH', title: 'Hội nghị Nghiên cứu Khoa học Sinh viên Khoa Ngoại Ngữ: 04 đề tài được nghiệm thu xuất sắc', time: '25/08/2026 • Hội Đồng KH BDU' },
    { day: '20', mon: 'TH08', cat: 'Đoàn Hội', title: 'Phát động Cuộc thi Rung Chuông Vàng Tiếng Anh & BDU English Debate 2026 giải thưởng 20 triệu', time: '20/08/2026 • CLB Tiếng Anh ETC' },
    { day: '15', mon: 'TH08', cat: 'Học Vụ', title: 'Thời khóa biểu và danh sách chia lớp học phần tiếng Anh chuyên ngành Học kỳ 1', time: '15/08/2026 • Giáo Vụ Đại Học' }
  ];

  const searchInput = document.getElementById('inputSearchNews');
  const catSelect = document.getElementById('selectFilterNewsCategory');

  function renderList() {
    const q = (searchInput?.value || '').toLowerCase().trim();
    const cat = catSelect?.value || 'ALL';

    const filtered = newsItems.filter(item => {
      const matchCat = cat === 'ALL' || item.cat === cat;
      const matchQ = !q || item.title.toLowerCase().includes(q) || item.cat.toLowerCase().includes(q);
      return matchCat && matchQ;
    });

    container.innerHTML = filtered.map(item => `
      <div class="news-item">
        <div class="news-date">
          <span>${item.day}</span>
          <small>${item.mon}</small>
        </div>
        <div class="news-text">
          <a href="javascript:void(0)" onclick="openNewsDetail('${escapeHtml(item.title)}')">${item.title}</a>
          <small><span class="badge badge-role" style="font-size:10px; margin-right:4px;">${item.cat}</span> <i class="fa-regular fa-clock"></i> ${item.time}</small>
        </div>
      </div>
    `).join('') || '<div style="padding:15px; text-align:center; color:var(--text-muted); font-size:12px;">Không có tin tức nào phù hợp.</div>';
  }

  searchInput?.addEventListener('input', renderList);
  catSelect?.addEventListener('change', renderList);
  renderList();
}

function openNewsDetail(title) {
  showToast(`Đang mở chi tiết: ${title}`, 'info');
}

// 6. Bind Document Ready Events for Forms & AI Exam
document.addEventListener('DOMContentLoaded', () => {
  initBduAuth();
  initEmergencyPdfViewer();
  initNewsWidget();

  // Tab 8 Buttons
  document.getElementById('btnDownloadCurrentFormWord')?.addEventListener('click', downloadCurrentFormDoc);
  document.getElementById('btnCopyCurrentForm')?.addEventListener('click', copyCurrentForm);
  document.getElementById('btnPrintCurrentForm')?.addEventListener('click', () => window.print());

  // Tab 9 Exam Buttons
  document.querySelectorAll('.ai-preview-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sub = btn.dataset.subtab;
      if (sub) switchAiExamSubtab(sub);
    });
  });

  document.getElementById('formAiExamConfig')?.addEventListener('submit', (e) => {
    e.preventDefault();
    generateAiExam(true);
  });

  document.getElementById('btnDownloadExamWord')?.addEventListener('click', () => {
    const paper = document.getElementById('studentExamPaperContent');
    if (!paper) return;
    const blob = new Blob(['\ufeff', paper.innerHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BDU_Exam_Paper_${new Date().toISOString().slice(0, 10)}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã tải xuống Đề thi định dạng Word (.doc)!', 'success');
  });

  document.getElementById('btnCopyExamToClipboard')?.addEventListener('click', () => {
    const el = document.getElementById('studentExamPaperContent');
    if (!el) return;
    navigator.clipboard.writeText(el.innerText).then(() => {
      showToast('Đã sao chép nội dung đề thi vào Clipboard!', 'success');
    });
  });

  document.getElementById('btnPrintExamPaper')?.addEventListener('click', () => window.print());

  document.getElementById('btnOpenLoginForExam')?.addEventListener('click', () => {
    document.getElementById('modalBduLogin')?.classList.add('active');
  });

  // Login Modal Events
  document.getElementById('closeBduLogin')?.addEventListener('click', () => {
    document.getElementById('modalBduLogin')?.classList.remove('active');
  });
  document.getElementById('btnCancelBduLogin')?.addEventListener('click', () => {
    document.getElementById('modalBduLogin')?.classList.remove('active');
  });

  document.getElementById('formBduLogin')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail')?.value.trim();
    const role = document.getElementById('loginRole')?.value;

    if (!email || (!email.endsWith('@bdu.edu.vn') && !email.endsWith('@student.bdu.edu.vn'))) {
      const err = document.getElementById('authErrorAlert');
      const errMsg = document.getElementById('authErrorMessage');
      if (err && errMsg) {
        errMsg.textContent = 'Vui lòng sử dụng địa chỉ email chính thức do Trường ĐH Bình Dương cấp (@bdu.edu.vn hoặc @student.bdu.edu.vn).';
        err.classList.add('active');
      }
      return;
    }

    window.BDU_FORMS_STATE.currentUser = {
      isLoggedIn: true,
      email,
      name: email.includes('phphuc') ? 'ThS. Phạm Hoàng Phúc' : (email.includes('anv') ? 'TS. Nguyễn Văn A' : 'Sinh Viên BDU'),
      role: role || 'Ban Chủ Nhiệm & Khảo Thí',
      title: 'Khoa Ngoại Ngữ'
    };

    initBduAuth();
    renderAiExamGate();
    document.getElementById('modalBduLogin')?.classList.remove('active');
    showToast(`Đăng nhập thành công với tài khoản ${email}!`, 'success');
  });

  // Initial forms load
  renderFormsHub();
});
