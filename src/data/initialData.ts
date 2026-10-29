/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskItem } from '../types';

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'bdu-task-001',
    code: 'BDU-2026-0812',
    title: 'Cấp bảng điểm chính thức & Giấy xác nhận tốt nghiệp tạm thời',
    category: 'Cấp giấy chứng nhận / Bảng điểm',
    requesterName: 'Nguyễn Văn An',
    requesterCode: '21050012',
    requesterPhone: '0912345678',
    requesterEmail: '21050012@student.bdu.edu.vn',
    department: 'Phòng Đào tạo',
    assigneeName: 'ThS. Trần Thị Kim Loan',
    assigneeEmail: 'ttkl@bdu.edu.vn',
    priority: 'high',
    status: 'in_progress',
    startDate: '2026-10-25',
    dueDate: '2026-10-31',
    description: 'Sinh viên năm cuối cần 02 bản sao bảng điểm song ngữ Anh - Việt và 01 giấy chứng nhận hoàn thành chương trình đào tạo để nộp hồ sơ xin việc.',
    resolutionNote: 'Đã đối soát điểm tích lũy học phần với Khoa CNTT. Đang trình Trưởng phòng Đào tạo ký duyệt điện tử.',
    timeline: [
      {
        id: 'tl-101',
        timestamp: '2026-10-25T08:30:00Z',
        action: 'Tiếp nhận yêu cầu',
        author: 'Hệ thống BDU Order Desk',
        note: 'Hồ sơ trực tuyến hợp lệ qua cổng sinh viên.'
      },
      {
        id: 'tl-102',
        timestamp: '2026-10-26T09:15:00Z',
        action: 'Phân công chuyên viên',
        author: 'Ban Giám đốc Đào tạo',
        note: 'Chuyển ThS. Trần Thị Kim Loan xử lý'
      },
      {
        id: 'tl-103',
        timestamp: '2026-10-27T14:00:00Z',
        action: 'Cập nhật trạng thái: Đang xử lý',
        author: 'ThS. Trần Thị Kim Loan',
        note: 'Đã hoàn tất trích lục hồ sơ điểm số, chuyển ký số.'
      }
    ],
    createdAt: '2026-10-25T08:30:00.000Z',
    updatedAt: '2026-10-27T14:00:00.000Z'
  },
  {
    id: 'bdu-task-002',
    code: 'BDU-2026-0815',
    title: 'Mở khóa và cấp lại mật khẩu tài khoản E-Learning BDU Portal',
    category: 'Thẻ sinh viên & Tài khoản E-Learning',
    requesterName: 'Lê Hoàng Phúc',
    requesterCode: '22040188',
    requesterPhone: '0988776655',
    requesterEmail: '22040188@student.bdu.edu.vn',
    department: 'Trung tâm CNTT & Thư viện',
    assigneeName: 'KS. Nguyễn Minh Trí',
    assigneeEmail: 'tri.nm@bdu.edu.vn',
    priority: 'urgent',
    status: 'completed',
    startDate: '2026-10-27',
    dueDate: '2026-10-28',
    completedDate: '2026-10-28',
    description: 'Sinh viên quên mật khẩu và bị khóa tài khoản do nhập sai quá 5 lần trước giờ nộp bài thi giữa kỳ môn Cơ sở dữ liệu.',
    resolutionNote: 'Đã xác thực CMND/CCCD và thẻ sinh viên, thiết lập lại mật khẩu tạm gửi qua SMS & Email sinh viên.',
    timeline: [
      {
        id: 'tl-201',
        timestamp: '2026-10-27T10:00:00Z',
        action: 'Tiếp nhận sự cố',
        author: 'Cổng tiếp nhận BDU',
        note: 'Mức độ khẩn cấp vì sát giờ thi'
      },
      {
        id: 'tl-202',
        timestamp: '2026-10-28T08:20:00Z',
        action: 'Hoàn thành xử lý',
        author: 'KS. Nguyễn Minh Trí',
        note: 'Mật khẩu đã được cấp mới và kích hoạt thành công.'
      }
    ],
    createdAt: '2026-10-27T10:00:00.000Z',
    updatedAt: '2026-10-28T08:20:00.000Z'
  },
  {
    id: 'bdu-task-003',
    code: 'BDU-2026-0790',
    title: 'Xét duyệt hồ sơ miễn giảm học phí theo Nghị định cho SV khó khăn',
    category: 'Miễn giảm học phí & Học bổng',
    requesterName: 'Phạm Thị Thảo',
    requesterCode: '23010345',
    requesterPhone: '0903112233',
    requesterEmail: '23010345@student.bdu.edu.vn',
    department: 'Phòng Công tác Sinh viên (CTSV)',
    assigneeName: 'Cô Võ Thị Cẩm Nhung',
    assigneeEmail: 'nhung.vtc@bdu.edu.vn',
    priority: 'medium',
    status: 'pending',
    startDate: '2026-10-28',
    dueDate: '2026-11-05',
    description: 'Hồ sơ nộp bổ sung giấy chứng nhận hộ nghèo chuẩn năm 2026 có xác nhận của UBND địa phương.',
    resolutionNote: 'Đang chờ hội đồng CTSV họp xét duyệt định kỳ vào thứ Sáu.',
    timeline: [
      {
        id: 'tl-301',
        timestamp: '2026-10-28T11:45:00Z',
        action: 'Tiếp nhận hồ sơ mới',
        author: 'Bộ phận một cửa BDU',
        note: 'Hồ sơ bản mềm đã upload đầy đủ'
      }
    ],
    createdAt: '2026-10-28T11:45:00.000Z',
    updatedAt: '2026-10-28T11:45:00.000Z'
  },
  {
    id: 'bdu-task-004',
    code: 'BDU-2026-0755',
    title: 'Phúc khảo bài thi kết thúc học phần Lập trình Web nâng cao',
    category: 'Phúc khảo & Đề thi',
    requesterName: 'Trần Quang Khải',
    requesterCode: '20050899',
    requesterPhone: '0934567890',
    requesterEmail: '20050899@student.bdu.edu.vn',
    department: 'Phòng Khảo thí & Đảm bảo CLGD',
    assigneeName: 'ThS. Đặng Hữu Tài',
    assigneeEmail: 'tai.dh@bdu.edu.vn',
    priority: 'high',
    status: 'in_progress',
    startDate: '2026-10-20',
    dueDate: '2026-10-26', // Overdue relative to current date (Oct 29, 2026)
    description: 'Sinh viên thắc mắc câu 3 bài tập thực hành giao thức REST API chấm chưa đúng barem.',
    resolutionNote: 'Đã rút túi bài thi từ kho lưu trữ. Đang đợi giảng viên thứ 2 hội đồng chấm chéo biên bản.',
    timeline: [
      {
        id: 'tl-401',
        timestamp: '2026-10-20T09:00:00Z',
        action: 'Tiếp nhận đơn phúc khảo',
        author: 'Hệ thống Khảo thí BDU',
        note: 'Lệ phí phúc khảo đã thanh toán online'
      },
      {
        id: 'tl-402',
        timestamp: '2026-10-22T15:30:00Z',
        action: 'Rút bài thi chấm lại',
        author: 'ThS. Đặng Hữu Tài',
        note: 'Túi thi mã KT-WEB-26'
      }
    ],
    createdAt: '2026-10-20T09:00:00.000Z',
    updatedAt: '2026-10-22T15:30:00.000Z'
  },
  {
    id: 'bdu-task-005',
    code: 'BDU-2026-0830',
    title: 'Bảo trì định kỳ và cài đặt phần mềm phòng thực hành máy tính Lab 3.02',
    category: 'Hỗ trợ kỹ thuật CNTT',
    requesterName: 'Khoa Công nghệ Thông tin',
    requesterCode: 'K-CNTT',
    requesterPhone: '02743822058',
    requesterEmail: 'khoacntt@bdu.edu.vn',
    department: 'Khoa Công nghệ Thông tin',
    assigneeName: 'KTV. Vũ Đình Nam',
    assigneeEmail: 'nam.vd@bdu.edu.vn',
    priority: 'medium',
    status: 'in_progress',
    startDate: '2026-10-28',
    dueDate: '2026-11-02',
    description: 'Cài đặt bộ công cụ Docker, VS Code, NodeJS 22 và cấu hình mạng nội bộ cho 45 máy tính phục vụ đợt thi nghề IT.',
    resolutionNote: 'Đã nhân bản ghost ảnh đĩa xong 30/45 máy, dự kiến hoàn thành trước ngày 30/10.',
    timeline: [
      {
        id: 'tl-501',
        timestamp: '2026-10-28T08:00:00Z',
        action: 'Tạo phiếu công việc nội bộ',
        author: 'Khoa CNTT BDU',
        note: 'Kế hoạch bảo dưỡng quý IV/2026'
      }
    ],
    createdAt: '2026-10-28T08:00:00.000Z',
    updatedAt: '2026-10-28T10:15:00.000Z'
  },
  {
    id: 'bdu-task-006',
    code: 'BDU-2026-0808',
    title: 'Cấp giấy chứng nhận Nghĩa vụ Quân sự & Tạm hoãn nhập ngũ năm 2026',
    category: 'Cấp giấy chứng nhận / Bảng điểm',
    requesterName: 'Bùi Đức Trọng',
    requesterCode: '24050211',
    requesterPhone: '0977112244',
    requesterEmail: '24050211@student.bdu.edu.vn',
    department: 'Phòng Công tác Sinh viên (CTSV)',
    assigneeName: 'Thầy Mai Văn Tuấn',
    assigneeEmail: 'tuan.mv@bdu.edu.vn',
    priority: 'low',
    status: 'completed',
    startDate: '2026-10-24',
    dueDate: '2026-10-26',
    completedDate: '2026-10-26',
    description: 'Sinh viên cần giấy xác nhận đang theo học chính quy để nộp về Ban Chỉ huy Quân sự Phường.',
    resolutionNote: 'Đã in giấy xác nhận có dấu mộc đỏ BDU và sinh viên đã ký nhận tại quầy tiếp nhận.',
    timeline: [
      {
        id: 'tl-601',
        timestamp: '2026-10-24T14:00:00Z',
        action: 'Đăng ký dịch vụ một cửa',
        author: 'Bùi Đức Trọng',
        note: 'Yêu cầu mẫu số 02 - Tạm hoãn NVQS'
      },
      {
        id: 'tl-602',
        timestamp: '2026-10-26T16:00:00Z',
        action: 'Đã trả kết quả cho sinh viên',
        author: 'Thầy Mai Văn Tuấn',
        note: 'Sinh viên đã nhận tại ô cửa số 3'
      }
    ],
    createdAt: '2026-10-24T14:00:00.000Z',
    updatedAt: '2026-10-26T16:00:00.000Z'
  }
];

export const DEPARTMENTS = [
  'Phòng Đào tạo',
  'Phòng Công tác Sinh viên (CTSV)',
  'Phòng Khảo thí & Đảm bảo CLGD',
  'Trung tâm CNTT & Thư viện',
  'Phòng Tài chính - Kế toán',
  'Khoa Công nghệ Thông tin',
  'Khoa Kinh tế - Quản trị',
  'Khoa Ngoại ngữ',
  'Văn phòng Ban Giám hiệu'
] as const;

export const CATEGORIES = [
  'Cấp giấy chứng nhận / Bảng điểm',
  'Đăng ký học phần & Thời khóa biểu',
  'Miễn giảm học phí & Học bổng',
  'Phúc khảo & Đề thi',
  'Thẻ sinh viên & Tài khoản E-Learning',
  'Hồ sơ tốt nghiệp & Bằng cấp',
  'Công tác văn phòng & Hậu cần',
  'Hỗ trợ kỹ thuật CNTT',
  'Yêu cầu khác'
] as const;
