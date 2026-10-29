/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ClipboardList, 
  Clock, 
  Hourglass, 
  CheckCircle2, 
  AlertTriangle, 
  Percent, 
  Building2, 
  ArrowRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { TaskItem, Department } from '../types';
import { isTaskOverdue, getStatusBadgeInfo, getPriorityBadgeInfo } from '../utils/storage';
import { DEPARTMENTS } from '../data/initialData';

interface DashboardViewProps {
  tasks: TaskItem[];
  onSelectTask: (task: TaskItem) => void;
  onFilterByStatus: (status: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  onSelectTask,
  onFilterByStatus,
}) => {
  // Real calculations
  const total = tasks.length;
  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const cancelledCount = tasks.filter((t) => t.status === 'cancelled').length;
  const overdueCount = tasks.filter(isTaskOverdue).length;

  const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  // Department distribution calculation
  const departmentStats = DEPARTMENTS.map((dept) => {
    const deptTasks = tasks.filter((t) => t.department === dept);
    const deptCompleted = deptTasks.filter((t) => t.status === 'completed').length;
    return {
      department: dept,
      total: deptTasks.length,
      completed: deptCompleted,
      pendingOrProgress: deptTasks.length - deptCompleted,
    };
  }).filter((d) => d.total > 0).sort((a, b) => b.total - a.total);

  // Urgent and Overdue Tasks
  const urgentOrOverdueTasks = tasks.filter(
    (t) => (t.priority === 'urgent' || isTaskOverdue(t)) && t.status !== 'completed' && t.status !== 'cancelled'
  );

  return (
    <div className="space-y-6">
      {/* Page Title & Realtime Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Bảng điều khiển & Chỉ số hiệu suất (Dashboard)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Dữ liệu thực tế</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tổng hợp dữ liệu xử lý hồ sơ sinh viên, tiếp nhận dịch vụ và công việc nội bộ toàn trường Đại học Bình Dương.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span>Hệ thống tự động cập nhật theo thời gian thực</span>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Card */}
        <div 
          onClick={() => onFilterByStatus('all')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600">Tổng công việc</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {total}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Tất cả hồ sơ trong hệ thống</p>
        </div>

        {/* Pending Card */}
        <div 
          onClick={() => onFilterByStatus('pending')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600">Chưa thực hiện</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2">
            {pendingCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Đang chờ tiếp nhận & phân công</p>
        </div>

        {/* In Progress Card */}
        <div 
          onClick={() => onFilterByStatus('in_progress')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600">Đang thực hiện</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-2">
            {inProgressCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Chuyên viên đang thụ lý</p>
        </div>

        {/* Completed Card */}
        <div 
          onClick={() => onFilterByStatus('completed')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold text-slate-600">Đã hoàn thành</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">
            {completedCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Đã có kết quả & trả cho SV</p>
        </div>

        {/* Overdue Card */}
        <div 
          onClick={() => onFilterByStatus('overdue')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
            overdueCount > 0 
              ? 'bg-red-50/50 border-red-200 hover:border-red-400 hover:shadow-md' 
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className={`text-xs font-semibold ${overdueCount > 0 ? 'text-red-700 font-bold' : 'text-slate-600'}`}>
              Quá giới hạn (Quá hạn)
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${
              overdueCount > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold mt-2 ${overdueCount > 0 ? 'text-red-600' : 'text-slate-600'}`}>
            {overdueCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Hết hạn mà chưa hoàn thành</p>
        </div>
      </div>

      {/* Completion Progress Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2">
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-900">Tỷ lệ hoàn thành công việc:</span>
            <span className="text-lg font-black text-blue-700">{completionRate}%</span>
          </div>
          <div className="text-xs text-slate-500">
            Đạt {completedCount} trên tổng số {total} đầu việc đã ghi nhận
          </div>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex">
          <div 
            style={{ width: `${total > 0 ? (completedCount / total) * 100 : 0}%` }} 
            className="bg-emerald-500 transition-all duration-500" 
            title={`Hoàn thành: ${completedCount}`}
          />
          <div 
            style={{ width: `${total > 0 ? (inProgressCount / total) * 100 : 0}%` }} 
            className="bg-blue-500 transition-all duration-500" 
            title={`Đang thực hiện: ${inProgressCount}`}
          />
          <div 
            style={{ width: `${total > 0 ? (pendingCount / total) * 100 : 0}%` }} 
            className="bg-amber-400 transition-all duration-500" 
            title={`Chưa thực hiện: ${pendingCount}`}
          />
          <div 
            style={{ width: `${total > 0 ? (cancelledCount / total) * 100 : 0}%` }} 
            className="bg-slate-400 transition-all duration-500" 
            title={`Đã hủy: ${cancelledCount}`}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs pt-1 text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Hoàn thành ({completedCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Đang thực hiện ({inProgressCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span>Chưa thực hiện ({pendingCount})</span>
          </div>
          {cancelledCount > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-400" />
              <span>Đã hủy ({cancelledCount})</span>
            </div>
          )}
        </div>
      </div>

      {/* Two Column Section: Department breakdown & Urgent tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department workload breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Phân bổ khối lượng theo Phòng ban / Khoa</span>
            </h3>
            <span className="text-xs text-slate-500">{departmentStats.length} đơn vị</span>
          </div>

          <div className="space-y-3">
            {departmentStats.map((item) => {
              const pct = total > 0 ? Math.round((item.total / total) * 100) : 0;
              return (
                <div key={item.department} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800">{item.department}</span>
                    <span className="text-slate-500 font-medium">
                      {item.completed}/{item.total} xong ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${(item.completed / item.total) * 100}%` }}
                      className="bg-emerald-500 h-full"
                    />
                    <div
                      style={{ width: `${(item.pendingOrProgress / item.total) * 100}%` }}
                      className="bg-blue-400 h-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority & Overdue Attention List */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Hồ sơ cần chú ý xử lý ngay ({urgentOrOverdueTasks.length})</span>
            </h3>
            <span className="text-xs text-red-600 font-semibold">Ưu tiên & Quá hạn</span>
          </div>

          {urgentOrOverdueTasks.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <FileCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
              <p>Tuyệt vời! Hiện không có công việc nào bị quá hạn hoặc khẩn cấp cần can thiệp gấp.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {urgentOrOverdueTasks.map((t) => {
                const overdue = isTaskOverdue(t);
                const priorityInfo = getPriorityBadgeInfo(t.priority);
                return (
                  <div
                    key={t.id}
                    onClick={() => onSelectTask(t)}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer flex items-start justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                          {t.code}
                        </span>
                        {overdue && (
                          <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded">
                            QUÁ HẠN
                          </span>
                        )}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${priorityInfo.badgeClass}`}>
                          {priorityInfo.label}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-900 mt-1 line-clamp-1 group-hover:text-blue-700">
                        {t.title}
                      </h4>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Người gửi: {t.requesterName} • Hạn chót: <span className={overdue ? 'text-red-600 font-bold' : ''}>{t.dueDate}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0 mt-1 transition-transform group-hover:translate-x-1" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
