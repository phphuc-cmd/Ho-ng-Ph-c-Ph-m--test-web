/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Clock, 
  Hourglass, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft,
  User,
  Building2
} from 'lucide-react';
import { TaskItem, TaskStatus } from '../types';
import { isTaskOverdue, getPriorityBadgeInfo } from '../utils/storage';

interface KanbanViewProps {
  tasks: TaskItem[];
  onSelectTask: (task: TaskItem) => void;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onOpenCreateModal: () => void;
}

export const KanbanView: React.FC<KanbanViewProps> = ({
  tasks,
  onSelectTask,
  onUpdateStatus,
  onOpenCreateModal,
}) => {
  const columns: {
    status: TaskStatus;
    title: string;
    icon: React.ElementType;
    headerColor: string;
    badgeColor: string;
  }[] = [
    {
      status: 'pending',
      title: 'Chưa thực hiện / Tiếp nhận',
      icon: Clock,
      headerColor: 'border-t-4 border-amber-500 bg-amber-50/50',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      status: 'in_progress',
      title: 'Đang thực hiện / Xử lý',
      icon: Hourglass,
      headerColor: 'border-t-4 border-blue-600 bg-blue-50/50',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      status: 'completed',
      title: 'Đã hoàn thành / Trả hồ sơ',
      icon: CheckCircle2,
      headerColor: 'border-t-4 border-emerald-600 bg-emerald-50/50',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      status: 'cancelled',
      title: 'Đã hủy / Từ chối',
      icon: XCircle,
      headerColor: 'border-t-4 border-slate-400 bg-slate-50/50',
      badgeColor: 'bg-slate-200 text-slate-700',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Kanban Header note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Bảng tiến độ trực quan (Kanban Board)</h3>
          <p className="text-xs text-slate-500">
            Theo dõi phân luồng hồ sơ theo từng giai đoạn xử lý của BDU Order Desk.
          </p>
        </div>
        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer w-fit"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm công việc</span>
        </button>
      </div>

      {/* 4 Column Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.status);
          const ColIcon = col.icon;

          return (
            <div
              key={col.status}
              className={`bg-slate-100/80 rounded-2xl p-3 border border-slate-200 flex flex-col min-h-[500px] ${col.headerColor}`}
            >
              {/* Column Title */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <ColIcon className="w-4 h-4 text-slate-700" />
                  <span className="font-bold text-xs text-slate-800">{col.title}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${col.badgeColor}`}>
                  {colTasks.length}
                </span>
              </div>

              {/* Column Tasks */}
              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[70vh] pr-0.5">
                {colTasks.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-xl">
                    Không có công việc ở cột này
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const overdue = isTaskOverdue(task);
                    const priorityInfo = getPriorityBadgeInfo(task.priority);

                    return (
                      <div
                        key={task.id}
                        className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all space-y-2.5 group"
                      >
                        {/* Top tag & Priority */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {task.code}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${priorityInfo.badgeClass}`}>
                            {priorityInfo.label}
                          </span>
                        </div>

                        {/* Title */}
                        <h4
                          onClick={() => onSelectTask(task)}
                          className="text-xs font-bold text-slate-900 group-hover:text-blue-700 cursor-pointer line-clamp-2 leading-snug"
                        >
                          {task.title}
                        </h4>

                        {/* Metadata */}
                        <div className="text-[11px] text-slate-500 space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <User className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{task.requesterName}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{task.department}</span>
                          </div>
                          <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                            <span className={overdue ? 'text-red-600 font-bold' : ''}>
                              Hạn: {task.dueDate}
                            </span>
                            {overdue && (
                              <span className="text-[9px] font-bold bg-red-500 text-white px-1 rounded">
                                QUÁ HẠN
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status Shift Buttons */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          {col.status !== 'pending' ? (
                            <button
                              onClick={() => {
                                const prevStatus: Record<TaskStatus, TaskStatus> = {
                                  pending: 'pending',
                                  in_progress: 'pending',
                                  completed: 'in_progress',
                                  cancelled: 'in_progress',
                                };
                                onUpdateStatus(task.id, prevStatus[col.status]);
                              }}
                              className="text-[10px] text-slate-500 hover:text-blue-600 p-1 rounded hover:bg-slate-100 flex items-center gap-0.5 cursor-pointer font-medium"
                              title="Chuyển về trạng thái trước"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                              <span>Lùi</span>
                            </button>
                          ) : (
                            <div />
                          )}

                          <button
                            onClick={() => onSelectTask(task)}
                            className="text-[10px] text-blue-600 font-semibold hover:underline"
                          >
                            Xem chi tiết
                          </button>

                          {col.status !== 'completed' ? (
                            <button
                              onClick={() => {
                                const nextStatus: Record<TaskStatus, TaskStatus> = {
                                  pending: 'in_progress',
                                  in_progress: 'completed',
                                  completed: 'completed',
                                  cancelled: 'pending',
                                };
                                onUpdateStatus(task.id, nextStatus[col.status]);
                              }}
                              className="text-[10px] text-slate-500 hover:text-emerald-600 p-1 rounded hover:bg-slate-100 flex items-center gap-0.5 cursor-pointer font-medium"
                              title="Chuyển sang trạng thái tiếp theo"
                            >
                              <span>Tiến</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <div />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
