/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  Printer, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Send,
  FileText,
  History
} from 'lucide-react';
import { TaskItem, TaskStatus } from '../types';
import { getPriorityBadgeInfo, getStatusBadgeInfo, isTaskOverdue } from '../utils/storage';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskItem | null;
  onEdit: (task: TaskItem) => void;
  onDelete: (task: TaskItem) => void;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus, note?: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
  onUpdateStatus,
}) => {
  const [quickNote, setQuickNote] = useState('');

  if (!isOpen || !task) return null;

  const isOverdue = isTaskOverdue(task);
  const statusInfo = getStatusBadgeInfo(task.status);
  const priorityInfo = getPriorityBadgeInfo(task.priority);

  const handleStatusChange = (newStatus: TaskStatus) => {
    onUpdateStatus(task.id, newStatus, quickNote.trim() || undefined);
    setQuickNote('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono bg-blue-600/30 text-blue-300 border border-blue-500/40 px-2.5 py-1 rounded-md text-xs font-bold">
              {task.code}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${statusInfo.badgeClass}`}>
              {statusInfo.label}
            </span>
            {isOverdue && (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
                <AlertTriangle className="w-3 h-3" />
                <span>QUÁ HẠN</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="In phiếu công việc / In hồ sơ"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Chỉnh sửa thông tin"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(task);
              }}
              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Xóa công việc này"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto print:max-h-none print:overflow-visible">
          {/* Main Title & Category */}
          <div>
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              {task.category}
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              {task.title}
            </h2>
          </div>

          {/* Quick status transition toolbar */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Chuyển trạng thái nhanh:</span>
              <span className="text-[11px] text-slate-500">Mức độ ưu tiên: <span className={`px-2 py-0.5 rounded border text-xs font-semibold ${priorityInfo.badgeClass}`}>{priorityInfo.label}</span></span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleStatusChange('pending')}
                disabled={task.status === 'pending'}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  task.status === 'pending'
                    ? 'bg-amber-500 text-white border-amber-600 cursor-default'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 cursor-pointer'
                }`}
              >
                Chưa thực hiện
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('in_progress')}
                disabled={task.status === 'in_progress'}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  task.status === 'in_progress'
                    ? 'bg-blue-600 text-white border-blue-700 cursor-default'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300 cursor-pointer'
                }`}
              >
                Đang thực hiện
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('completed')}
                disabled={task.status === 'completed'}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  task.status === 'completed'
                    ? 'bg-emerald-600 text-white border-emerald-700 cursor-default'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 cursor-pointer'
                }`}
              >
                ✓ Hoàn thành
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange('cancelled')}
                disabled={task.status === 'cancelled'}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  task.status === 'cancelled'
                    ? 'bg-slate-700 text-white border-slate-800 cursor-default'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-800 cursor-pointer'
                }`}
              >
                Hủy bỏ
              </button>
            </div>
            
            {/* Quick note input */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ghi chú kèm theo khi chuyển trạng thái (nếu có)..."
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Grid Information: 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Requester Box */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-blue-700">
                <User className="w-4 h-4" />
                <span>Người gửi / Yêu cầu</span>
              </h4>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Họ và tên:</span>
                  <span className="font-semibold text-slate-900">{task.requesterName}</span>
                </div>
                {task.requesterCode && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mã SV / CB:</span>
                    <span className="font-mono font-semibold">{task.requesterCode}</span>
                  </div>
                )}
                {task.requesterPhone && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Điện thoại:</span>
                    <a href={`tel:${task.requesterPhone}`} className="text-blue-600 font-medium hover:underline flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{task.requesterPhone}</span>
                    </a>
                  </div>
                )}
                {task.requesterEmail && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Email:</span>
                    <a href={`mailto:${task.requesterEmail}`} className="text-blue-600 font-medium hover:underline flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span className="truncate max-w-[180px]">{task.requesterEmail}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Department & Handling Box */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-indigo-700">
                <Building2 className="w-4 h-4" />
                <span>Đơn vị & Cán bộ thụ lý</span>
              </h4>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Đơn vị:</span>
                  <span className="font-semibold text-slate-900">{task.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cán bộ phụ trách:</span>
                  <span className="font-semibold text-slate-900">{task.assigneeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ngày bắt đầu:</span>
                  <span className="font-medium">{task.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hạn hoàn thành:</span>
                  <span className={`font-semibold ${isOverdue ? 'text-red-600 font-bold' : 'text-slate-900'}`}>
                    {task.dueDate} {isOverdue && '(Đã quá hạn)'}
                  </span>
                </div>
                {task.completedDate && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ngày hoàn thành:</span>
                    <span className="text-emerald-700 font-bold">{task.completedDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description Content */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Nội dung chi tiết yêu cầu</span>
            </h4>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {task.description || 'Không có mô tả chi tiết kèm theo.'}
            </div>
          </div>

          {/* Resolution Notes if available */}
          {task.resolutionNote && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-emerald-800">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Kết quả xử lý / Biên bản giải quyết</span>
              </h4>
              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs sm:text-sm text-emerald-900 whitespace-pre-wrap leading-relaxed">
                {task.resolutionNote}
              </div>
            </div>
          )}

          {/* Timeline History */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-4 h-4 text-blue-600" />
              <span>Lịch sử tiến độ (Timeline) ({task.timeline.length} cập nhật)</span>
            </h4>

            <div className="relative pl-6 border-l-2 border-blue-200 space-y-4 my-2">
              {task.timeline.map((item, idx) => (
                <div key={item.id || idx} className="relative group">
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-white" />
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                      <span className="font-bold text-slate-900">{item.action}</span>
                      <span className="text-[11px] text-slate-500">
                        {new Date(item.timestamp).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <div className="text-[11px] text-blue-700 font-medium mt-0.5">
                      Thực hiện bởi: {item.author}
                    </div>
                    {item.note && (
                      <p className="text-xs text-slate-600 mt-1.5 bg-white p-2 rounded border border-slate-200">
                        {item.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500">
            Tạo lúc: {new Date(task.createdAt).toLocaleString('vi-VN')}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
