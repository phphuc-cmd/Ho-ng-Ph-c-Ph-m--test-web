/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskItem, TaskPriority, TaskStatus } from '../types';
import { INITIAL_TASKS } from '../data/initialData';

const STORAGE_KEY = 'bdu_order_desk_tasks_v1';

export const isTaskOverdue = (task: TaskItem): boolean => {
  if (task.status === 'completed' || task.status === 'cancelled') {
    return false;
  }
  if (!task.dueDate) return false;
  
  // Compare with current local date string (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];
  return task.dueDate < todayStr;
};

export const loadTasksFromStorage = (): TaskItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First time initialization
      saveTasksToStorage(INITIAL_TASKS);
      return INITIAL_TASKS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn('LocalStorage data is not an array, falling back to initial data');
      return INITIAL_TASKS;
    }
    // Validate that items have essential fields
    const validTasks = parsed.filter(
      (item): item is TaskItem =>
        Boolean(item && typeof item === 'object' && item.id && item.title && item.code)
    );
    return validTasks.length > 0 ? validTasks : INITIAL_TASKS;
  } catch (err) {
    console.error('Lỗi khi đọc dữ liệu từ LocalStorage:', err);
    return INITIAL_TASKS;
  }
};

export const saveTasksToStorage = (tasks: TaskItem[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (err) {
    console.error('Lỗi khi lưu dữ liệu vào LocalStorage:', err);
    return false;
  }
};

export const resetTasksToDefault = (): TaskItem[] => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    saveTasksToStorage(INITIAL_TASKS);
    return INITIAL_TASKS;
  } catch (err) {
    console.error('Lỗi reset dữ liệu mẫu:', err);
    return INITIAL_TASKS;
  }
};

export const generateTaskCode = (existingTasks: TaskItem[]): string => {
  const currentYear = new Date().getFullYear();
  const prefix = `BDU-${currentYear}-`;
  
  // Find highest existing numeric suffix for this year
  let maxSeq = 1000;
  existingTasks.forEach((t) => {
    if (t.code && t.code.startsWith(prefix)) {
      const numPart = parseInt(t.code.replace(prefix, ''), 10);
      if (!isNaN(numPart) && numPart > maxSeq) {
        maxSeq = numPart;
      }
    }
  });

  return `${prefix}${String(maxSeq + 1).padStart(4, '0')}`;
};

export const getStatusBadgeInfo = (status: TaskStatus) => {
  switch (status) {
    case 'pending':
      return {
        label: 'Chưa thực hiện',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
        dotClass: 'bg-amber-500',
      };
    case 'in_progress':
      return {
        label: 'Đang thực hiện',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
        dotClass: 'bg-blue-600',
      };
    case 'completed':
      return {
        label: 'Hoàn thành',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        dotClass: 'bg-emerald-600',
      };
    case 'cancelled':
      return {
        label: 'Đã hủy',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
        dotClass: 'bg-slate-500',
      };
  }
};

export const getPriorityBadgeInfo = (priority: TaskPriority) => {
  switch (priority) {
    case 'urgent':
      return {
        label: 'Khẩn cấp',
        badgeClass: 'bg-red-100 text-red-800 border-red-300 font-bold',
      };
    case 'high':
      return {
        label: 'Cao',
        badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
      };
    case 'medium':
      return {
        label: 'Trung bình',
        badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
      };
    case 'low':
      return {
        label: 'Thấp',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      };
  }
};

export const exportTasksToJson = (tasks: TaskItem[]) => {
  const jsonStr = JSON.stringify(tasks, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BDU_OrderDesk_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const parseImportedJson = (fileContent: string): { valid: boolean; data?: TaskItem[]; error?: string } => {
  try {
    const parsed = JSON.parse(fileContent);
    if (!Array.isArray(parsed)) {
      return { valid: false, error: 'Dữ liệu file không đúng định dạng danh sách mảng JSON.' };
    }
    // Check if each item looks like TaskItem
    const validItems: TaskItem[] = [];
    for (const item of parsed) {
      if (item && item.id && item.title && item.code) {
        validItems.push({
          id: String(item.id),
          code: String(item.code),
          title: String(item.title),
          category: item.category || 'Yêu cầu khác',
          requesterName: String(item.requesterName || 'Khách vãng lai'),
          requesterCode: item.requesterCode ? String(item.requesterCode) : undefined,
          requesterPhone: String(item.requesterPhone || ''),
          requesterEmail: String(item.requesterEmail || ''),
          department: item.department || 'Phòng Đào tạo',
          assigneeName: String(item.assigneeName || 'Chưa phân công'),
          assigneeEmail: item.assigneeEmail ? String(item.assigneeEmail) : undefined,
          priority: ['urgent', 'high', 'medium', 'low'].includes(item.priority) ? item.priority : 'medium',
          status: ['pending', 'in_progress', 'completed', 'cancelled'].includes(item.status) ? item.status : 'pending',
          startDate: item.startDate || new Date().toISOString().split('T')[0],
          dueDate: item.dueDate || new Date().toISOString().split('T')[0],
          completedDate: item.completedDate,
          description: String(item.description || ''),
          resolutionNote: item.resolutionNote,
          timeline: Array.isArray(item.timeline) ? item.timeline : [],
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString(),
        });
      }
    }
    if (validItems.length === 0) {
      return { valid: false, error: 'Không tìm thấy bản ghi công việc hợp lệ nào trong file.' };
    }
    return { valid: true, data: validItems };
  } catch (err: unknown) {
    return { valid: false, error: 'File JSON không hợp lệ hoặc bị lỗi cú pháp: ' + (err instanceof Error ? err.message : String(err)) };
  }
};
