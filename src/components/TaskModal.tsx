/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, Mail, Building2, Tag, AlertCircle, Save } from 'lucide-react';
import { TaskItem, TaskPriority, TaskStatus, Department, ServiceCategory } from '../types';
import { DEPARTMENTS, CATEGORIES } from '../data/initialData';
import { generateTaskCode } from '../utils/storage';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: TaskItem) => void;
  taskToEdit?: TaskItem | null;
  existingTasks: TaskItem[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
  existingTasks,
}) => {
  const isEditMode = Boolean(taskToEdit);

  // Form State
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Cấp giấy chứng nhận / Bảng điểm');
  const [requesterName, setRequesterName] = useState('');
  const [requesterCode, setRequesterCode] = useState('');
  const [requesterPhone, setRequesterPhone] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [department, setDepartment] = useState<Department>('Phòng Đào tạo');
  const [assigneeName, setAssigneeName] = useState('');
  const [assigneeEmail, setAssigneeEmail] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [progressNote, setProgressNote] = useState('');

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setCode(taskToEdit.code);
        setCategory(taskToEdit.category);
        setRequesterName(taskToEdit.requesterName);
        setRequesterCode(taskToEdit.requesterCode || '');
        setRequesterPhone(taskToEdit.requesterPhone);
        setRequesterEmail(taskToEdit.requesterEmail);
        setDepartment(taskToEdit.department);
        setAssigneeName(taskToEdit.assigneeName);
        setAssigneeEmail(taskToEdit.assigneeEmail || '');
        setPriority(taskToEdit.priority);
        setStatus(taskToEdit.status);
        setStartDate(taskToEdit.startDate);
        setDueDate(taskToEdit.dueDate);
        setDescription(taskToEdit.description);
        setProgressNote('');
      } else {
        const todayStr = new Date().toISOString().split('T')[0];
        // Default due date is 5 days from today
        const defaultDue = new Date();
        defaultDue.setDate(defaultDue.getDate() + 5);
        const dueStr = defaultDue.toISOString().split('T')[0];

        setTitle('');
        setCode(generateTaskCode(existingTasks));
        setCategory('Cấp giấy chứng nhận / Bảng điểm');
        setRequesterName('');
        setRequesterCode('');
        setRequesterPhone('');
        setRequesterEmail('');
        setDepartment('Phòng Đào tạo');
        setAssigneeName('');
        setAssigneeEmail('');
        setPriority('medium');
        setStatus('pending');
        setStartDate(todayStr);
        setDueDate(dueStr);
        setDescription('');
        setProgressNote('');
      }
      setErrors({});
    }
  }, [isOpen, taskToEdit, existingTasks]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Vui lòng nhập tên công việc hoặc dịch vụ.';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Tên công việc cần tối thiểu 5 ký tự.';
    }

    if (!requesterName.trim()) {
      newErrors.requesterName = 'Vui lòng nhập họ tên người gửi yêu cầu / sinh viên.';
    }

    if (requesterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(requesterEmail.trim())) {
      newErrors.requesterEmail = 'Email không hợp lệ.';
    }

    if (!startDate) {
      newErrors.startDate = 'Vui lòng chọn ngày bắt đầu.';
    }

    if (!dueDate) {
      newErrors.dueDate = 'Vui lòng chọn hạn hoàn thành.';
    } else if (startDate && dueDate < startDate) {
      newErrors.dueDate = 'Hạn hoàn thành không được trước ngày bắt đầu.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const nowIso = new Date().toISOString();

    if (isEditMode && taskToEdit) {
      const updatedTimeline = [...taskToEdit.timeline];
      const statusChanged = taskToEdit.status !== status;

      if (progressNote.trim() || statusChanged) {
        updatedTimeline.push({
          id: 'tl-' + Date.now(),
          timestamp: nowIso,
          action: statusChanged ? `Cập nhật trạng thái: ${status}` : 'Cập nhật tiến độ xử lý',
          author: assigneeName.trim() || 'Cán bộ phụ trách BDU',
          note: progressNote.trim() || (statusChanged ? `Chuyển trạng thái từ ${taskToEdit.status} sang ${status}` : undefined),
          statusFrom: taskToEdit.status,
          statusTo: status,
        });
      }

      const updatedTask: TaskItem = {
        ...taskToEdit,
        title: title.trim(),
        code: code.trim() || taskToEdit.code,
        category,
        requesterName: requesterName.trim(),
        requesterCode: requesterCode.trim() || undefined,
        requesterPhone: requesterPhone.trim(),
        requesterEmail: requesterEmail.trim(),
        department,
        assigneeName: assigneeName.trim() || 'Chưa phân công',
        assigneeEmail: assigneeEmail.trim() || undefined,
        priority,
        status,
        startDate,
        dueDate,
        completedDate: status === 'completed' ? (taskToEdit.completedDate || nowIso.split('T')[0]) : undefined,
        description: description.trim(),
        resolutionNote: progressNote.trim() || taskToEdit.resolutionNote,
        timeline: updatedTimeline,
        updatedAt: nowIso,
      };

      onSave(updatedTask);
    } else {
      const newTask: TaskItem = {
        id: 'bdu-' + Date.now(),
        code: code.trim() || generateTaskCode(existingTasks),
        title: title.trim(),
        category,
        requesterName: requesterName.trim(),
        requesterCode: requesterCode.trim() || undefined,
        requesterPhone: requesterPhone.trim(),
        requesterEmail: requesterEmail.trim(),
        department,
        assigneeName: assigneeName.trim() || 'Chưa phân công',
        assigneeEmail: assigneeEmail.trim() || undefined,
        priority,
        status,
        startDate,
        dueDate,
        completedDate: status === 'completed' ? nowIso.split('T')[0] : undefined,
        description: description.trim(),
        resolutionNote: progressNote.trim() || undefined,
        timeline: [
          {
            id: 'tl-' + Date.now(),
            timestamp: nowIso,
            action: 'Khởi tạo công việc / đơn dịch vụ mới',
            author: requesterName.trim() || 'Hệ thống BDU Order Desk',
            note: progressNote.trim() || 'Hồ sơ đã được nhập thành công vào hệ thống.',
            statusTo: status,
          },
        ],
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      onSave(newTask);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-blue-200 uppercase">
              {isEditMode ? 'Chỉnh sửa hồ sơ' : 'Tiếp nhận công việc mới'}
            </span>
            <h3 className="text-base sm:text-lg font-bold">
              {isEditMode ? `Cập nhật: ${taskToEdit?.code}` : 'Tạo mới hồ sơ / Yêu cầu công việc'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Row 1: Code and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <span>Mã công việc / Đơn</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="VD: BDU-2026-0888"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>Loại danh mục dịch vụ</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <span>Tên công việc / Yêu cầu dịch vụ</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Cấp bảng điểm chính thức tốt nghiệp cho sinh viên"
              className={`w-full px-3 py-2 text-sm rounded-lg border ${
                errors.title ? 'border-red-500 bg-red-50/50' : 'border-slate-300'
              } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-medium`}
            />
            {errors.title && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Group: Requester Info */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Thông tin người yêu cầu (Sinh viên / Giảng viên / Đơn vị)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Họ và tên người gửi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  placeholder="VD: Nguyễn Văn An"
                  className={`w-full px-3 py-1.5 text-sm rounded-lg border ${
                    errors.requesterName ? 'border-red-500 bg-red-50/50' : 'border-slate-300'
                  } bg-white`}
                />
                {errors.requesterName && (
                  <p className="text-[11px] text-red-600 mt-0.5">{errors.requesterName}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Mã SV / Mã Cán bộ (Nếu có)</label>
                <input
                  type="text"
                  value={requesterCode}
                  onChange={(e) => setRequesterCode(e.target.value)}
                  placeholder="VD: 21050012"
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Số điện thoại liên hệ</label>
                <input
                  type="tel"
                  value={requesterPhone}
                  onChange={(e) => setRequesterPhone(e.target.value)}
                  placeholder="VD: 0912345678"
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Email</label>
                <input
                  type="email"
                  value={requesterEmail}
                  onChange={(e) => setRequesterEmail(e.target.value)}
                  placeholder="VD: 21050012@student.bdu.edu.vn"
                  className={`w-full px-3 py-1.5 text-sm rounded-lg border ${
                    errors.requesterEmail ? 'border-red-500' : 'border-slate-300'
                  } bg-white`}
                />
                {errors.requesterEmail && (
                  <p className="text-[11px] text-red-600 mt-0.5">{errors.requesterEmail}</p>
                )}
              </div>
            </div>
          </div>

          {/* Group: Assignment & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Phòng ban / Khoa giải quyết</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cán bộ / Chuyên viên phụ trách
              </label>
              <input
                type="text"
                value={assigneeName}
                onChange={(e) => setAssigneeName(e.target.value)}
                placeholder="VD: ThS. Trần Thị Kim Loan"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Group: Status & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mức độ ưu tiên
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="urgent">Khẩn cấp (Hỏa tốc)</option>
                <option value="high">Cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Trạng thái tiến độ
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-semibold"
              >
                <option value="pending">Chưa thực hiện (Chờ tiếp nhận)</option>
                <option value="in_progress">Đang thực hiện (Đang xử lý)</option>
                <option value="completed">Hoàn thành (Đã trả kết quả)</option>
                <option value="cancelled">Đã hủy / Từ chối</option>
              </select>
            </div>
          </div>

          {/* Group: Schedule Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Ngày bắt đầu</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full px-3 py-2 text-sm rounded-lg border ${
                  errors.startDate ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.startDate && (
                <p className="text-xs text-red-600 mt-1">{errors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Hạn hoàn thành (Deadline)</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full px-3 py-2 text-sm rounded-lg border ${
                  errors.dueDate ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.dueDate && (
                <p className="text-xs text-red-600 mt-1">{errors.dueDate}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mô tả chi tiết nội dung công việc / Đơn yêu cầu
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nêu rõ yêu cầu số lượng bản in, mục đích, ghi chú kèm theo..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Progress note for timeline */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ghi chú cập nhật tiến độ (Tự động lưu vào lịch sử Timeline)
            </label>
            <input
              type="text"
              value={progressNote}
              onChange={(e) => setProgressNote(e.target.value)}
              placeholder={isEditMode ? 'VD: Đã hoàn tất bản in và chuyển Ban Giám hiệu ký' : 'Ghi chú ban đầu (tùy chọn)'}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-amber-50/30"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditMode ? 'Lưu thay đổi' : 'Tạo mới hồ sơ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
