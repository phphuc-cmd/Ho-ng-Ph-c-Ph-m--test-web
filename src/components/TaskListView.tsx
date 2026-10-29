/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  PlusCircle, 
  Calendar, 
  Building2, 
  User, 
  AlertTriangle, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { TaskItem, FilterState, TaskStatus, TaskPriority, Department } from '../types';
import { isTaskOverdue, getStatusBadgeInfo, getPriorityBadgeInfo } from '../utils/storage';
import { DEPARTMENTS } from '../data/initialData';

interface TaskListViewProps {
  tasks: TaskItem[];
  onSelectTask: (task: TaskItem) => void;
  onEditTask: (task: TaskItem) => void;
  onDeleteTask: (task: TaskItem) => void;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onOpenCreateModal: () => void;
  initialFilterStatus?: string;
}

export const TaskListView: React.FC<TaskListViewProps> = ({
  tasks,
  onSelectTask,
  onEditTask,
  onDeleteTask,
  onUpdateStatus,
  onOpenCreateModal,
  initialFilterStatus,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    status: (initialFilterStatus as any) || 'all',
    priority: 'all',
    department: 'all',
    category: 'all',
    sortBy: 'createdAt_desc',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter and sort logic
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchCode = task.code.toLowerCase().includes(q);
        const matchReqName = task.requesterName.toLowerCase().includes(q);
        const matchReqCode = (task.requesterCode || '').toLowerCase().includes(q);
        const matchPhone = task.requesterPhone.includes(q);
        const matchAssignee = task.assigneeName.toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchReqName && !matchReqCode && !matchPhone && !matchAssignee) {
          return false;
        }
      }

      // Status
      if (filters.status === 'overdue') {
        if (!isTaskOverdue(task)) return false;
      } else if (filters.status !== 'all') {
        if (task.status !== filters.status) return false;
      }

      // Priority
      if (filters.priority !== 'all') {
        if (task.priority !== filters.priority) return false;
      }

      // Department
      if (filters.department !== 'all') {
        if (task.department !== filters.department) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'createdAt_desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (filters.sortBy === 'createdAt_asc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (filters.sortBy === 'dueDate_asc') {
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (filters.sortBy === 'dueDate_desc') {
        return b.dueDate.localeCompare(a.dueDate);
      }
      if (filters.sortBy === 'priority_desc') {
        const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      if (filters.sortBy === 'title_asc') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [tasks, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage) || 1;
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTasks.slice(start, start + itemsPerPage);
  }, [filteredTasks, currentPage, itemsPerPage]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      status: 'all',
      priority: 'all',
      department: 'all',
      category: 'all',
      sortBy: 'createdAt_desc',
    });
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Top search input & Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => {
                setFilters({ ...filters, searchQuery: e.target.value });
                setCurrentPage(1);
              }}
              placeholder="Tìm theo Mã đơn (BDU-...), Tên yêu cầu, Người gửi, MSSV, SĐT..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters({ ...filters, searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCreateModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tiếp nhận mới</span>
            </button>
          </div>
        </div>

        {/* Filter dropdowns row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 border-t border-slate-100">
          {/* Status filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Trạng thái
            </label>
            <select
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value as any });
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:border-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chưa thực hiện</option>
              <option value="in_progress">Đang thực hiện</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
              <option value="overdue">⚠️ Quá hạn xử lý</option>
            </select>
          </div>

          {/* Priority filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Độ ưu tiên
            </label>
            <select
              value={filters.priority}
              onChange={(e) => {
                setFilters({ ...filters, priority: e.target.value as any });
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:border-blue-500"
            >
              <option value="all">Tất cả mức ưu tiên</option>
              <option value="urgent">Khẩn cấp</option>
              <option value="high">Cao</option>
              <option value="medium">Trung bình</option>
              <option value="low">Thấp</option>
            </select>
          </div>

          {/* Department filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Phòng ban / Khoa
            </label>
            <select
              value={filters.department}
              onChange={(e) => {
                setFilters({ ...filters, department: e.target.value as any });
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:border-blue-500 truncate"
            >
              <option value="all">Tất cả đơn vị</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Sắp xếp theo
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:border-blue-500"
            >
              <option value="createdAt_desc">Mới nhất trước</option>
              <option value="createdAt_asc">Cũ nhất trước</option>
              <option value="dueDate_asc">Hạn chót gần nhất</option>
              <option value="dueDate_desc">Hạn chót xa nhất</option>
              <option value="priority_desc">Độ ưu tiên cao nhất</option>
              <option value="title_asc">Tiêu đề (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Filter results status indicator & Clear filter */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Tìm thấy <strong className="text-slate-900 font-bold">{filteredTasks.length}</strong> công việc
            {filteredTasks.length !== tasks.length && ` (lọc từ ${tasks.length} tổng số)`}
          </span>
          {(filters.searchQuery || filters.status !== 'all' || filters.priority !== 'all' || filters.department !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Đặt lại bộ lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Tasks List / Table */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Không tìm thấy công việc nào</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Không có hồ sơ nào khớp với từ khóa tìm kiếm hoặc bộ lọc hiện tại. Thử xóa bớt bộ lọc hoặc tạo hồ sơ mới.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
          >
            Xem toàn bộ danh sách
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Mã hồ sơ</th>
                  <th className="py-3 px-4">Tên công việc / Yêu cầu</th>
                  <th className="py-3 px-4">Người yêu cầu</th>
                  <th className="py-3 px-4">Đơn vị & Cán bộ</th>
                  <th className="py-3 px-4">Hạn xử lý</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedTasks.map((task) => {
                  const overdue = isTaskOverdue(task);
                  const statusInfo = getStatusBadgeInfo(task.status);
                  const priorityInfo = getPriorityBadgeInfo(task.priority);

                  return (
                    <tr 
                      key={task.id} 
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Code & Priority */}
                      <td className="py-3 px-4 align-top">
                        <div className="font-mono font-bold text-blue-700 bg-blue-50/80 border border-blue-200 px-2 py-0.5 rounded w-fit">
                          {task.code}
                        </div>
                        <div className="mt-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${priorityInfo.badgeClass}`}>
                            {priorityInfo.label}
                          </span>
                        </div>
                      </td>

                      {/* Title & Category */}
                      <td className="py-3 px-4 align-top max-w-xs">
                        <div 
                          onClick={() => onSelectTask(task)}
                          className="font-bold text-slate-900 group-hover:text-blue-700 cursor-pointer line-clamp-2 leading-snug"
                        >
                          {task.title}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                          {task.category}
                        </div>
                      </td>

                      {/* Requester */}
                      <td className="py-3 px-4 align-top">
                        <div className="font-semibold text-slate-900">{task.requesterName}</div>
                        {task.requesterCode && (
                          <div className="font-mono text-[11px] text-slate-500">MSSV: {task.requesterCode}</div>
                        )}
                        {task.requesterPhone && (
                          <div className="text-[11px] text-slate-500">{task.requesterPhone}</div>
                        )}
                      </td>

                      {/* Department & Assignee */}
                      <td className="py-3 px-4 align-top">
                        <div className="font-medium text-slate-800">{task.department}</div>
                        <div className="text-[11px] text-blue-600 mt-0.5 font-medium">
                          {task.assigneeName}
                        </div>
                      </td>

                      {/* Due date */}
                      <td className="py-3 px-4 align-top whitespace-nowrap">
                        <div className={`font-medium ${overdue ? 'text-red-600 font-bold' : 'text-slate-700'}`}>
                          {task.dueDate}
                        </div>
                        {overdue && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 bg-red-100 text-red-700 border border-red-200 rounded mt-0.5">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            <span>Quá hạn</span>
                          </span>
                        )}
                      </td>

                      {/* Status badge & Quick dropdown */}
                      <td className="py-3 px-4 align-top">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusInfo.badgeClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
                          <span>{statusInfo.label}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onSelectTask(task)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Xem chi tiết & Timeline"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditTask(task)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="Chỉnh sửa thông tin"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(task)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Xóa công việc"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {paginatedTasks.map((task) => {
              const overdue = isTaskOverdue(task);
              const statusInfo = getStatusBadgeInfo(task.status);
              const priorityInfo = getPriorityBadgeInfo(task.priority);

              return (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {task.code}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${priorityInfo.badgeClass}`}>
                        {priorityInfo.label}
                      </span>
                    </div>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border font-semibold ${statusInfo.badgeClass}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectTask(task)}
                    className="text-sm font-bold text-slate-900 leading-snug cursor-pointer"
                  >
                    {task.title}
                  </h3>

                  <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400">Người gửi: </span>
                      <span className="font-semibold text-slate-800">{task.requesterName}</span>
                      {task.requesterCode && <span className="text-slate-500"> ({task.requesterCode})</span>}
                    </div>
                    <div>
                      <span className="text-slate-400">Đơn vị: </span>
                      <span>{task.department}</span>
                    </div>
                    <div className="flex justify-between items-center pt-0.5">
                      <div>
                        <span className="text-slate-400">Hạn chót: </span>
                        <span className={`font-semibold ${overdue ? 'text-red-600' : 'text-slate-800'}`}>
                          {task.dueDate}
                        </span>
                      </div>
                      {overdue && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded border border-red-200">
                          QUÁ HẠN
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <button
                      onClick={() => onSelectTask(task)}
                      className="text-xs font-semibold text-blue-600 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Chi tiết & Tiến độ</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditTask(task)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-xs text-xs">
              <span className="text-slate-500">
                Trang <strong className="text-slate-900">{currentPage}</strong> / {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`w-7 h-7 rounded-lg font-semibold transition-colors cursor-pointer ${
                      currentPage === pg
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pg}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
