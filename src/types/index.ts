/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export type Department = 
  | 'Phòng Đào tạo'
  | 'Phòng Công tác Sinh viên (CTSV)'
  | 'Phòng Khảo thí & Đảm bảo CLGD'
  | 'Trung tâm CNTT & Thư viện'
  | 'Phòng Tài chính - Kế toán'
  | 'Khoa Công nghệ Thông tin'
  | 'Khoa Kinh tế - Quản trị'
  | 'Khoa Ngoại ngữ'
  | 'Văn phòng Ban Giám hiệu';

export type ServiceCategory =
  | 'Cấp giấy chứng nhận / Bảng điểm'
  | 'Đăng ký học phần & Thời khóa biểu'
  | 'Miễn giảm học phí & Học bổng'
  | 'Phúc khảo & Đề thi'
  | 'Thẻ sinh viên & Tài khoản E-Learning'
  | 'Hồ sơ tốt nghiệp & Bằng cấp'
  | 'Công tác văn phòng & Hậu cần'
  | 'Hỗ trợ kỹ thuật CNTT'
  | 'Yêu cầu khác';

export interface TimelineLog {
  id: string;
  timestamp: string;
  action: string;
  author: string;
  note?: string;
  statusFrom?: TaskStatus;
  statusTo?: TaskStatus;
}

export interface TaskItem {
  id: string;
  code: string; // e.g., BDU-2026-1042
  title: string;
  category: ServiceCategory;
  requesterName: string;
  requesterCode?: string; // Student ID or Staff ID (MSSV / CBGV)
  requesterPhone: string;
  requesterEmail: string;
  department: Department;
  assigneeName: string;
  assigneeEmail?: string;
  priority: TaskPriority;
  status: TaskStatus;
  startDate: string; // YYYY-MM-DD
  dueDate: string;   // YYYY-MM-DD
  completedDate?: string;
  description: string;
  resolutionNote?: string;
  timeline: TimelineLog[];
  createdAt: string;
  updatedAt: string;
}

export interface FilterState {
  searchQuery: string;
  status: 'all' | TaskStatus | 'overdue';
  priority: 'all' | TaskPriority;
  department: 'all' | Department;
  category: 'all' | ServiceCategory;
  sortBy: 'createdAt_desc' | 'createdAt_asc' | 'dueDate_asc' | 'dueDate_desc' | 'priority_desc' | 'title_asc';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}
