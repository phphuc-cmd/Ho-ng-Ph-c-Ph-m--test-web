/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { TaskItem, TaskStatus, ToastMessage } from './types';
import { 
  loadTasksFromStorage, 
  saveTasksToStorage, 
  resetTasksToDefault, 
  exportTasksToJson, 
  parseImportedJson, 
  isTaskOverdue 
} from './utils/storage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TaskListView } from './components/TaskListView';
import { KanbanView } from './components/KanbanView';
import { PublicTrackingView } from './components/PublicTrackingView';
import { DashboardView } from './components/DashboardView';
import { TaskModal } from './components/TaskModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ToastContainer } from './components/Toast';

export default function App() {
  const [tasks, setTasks] = useState<TaskItem[]>(() => loadTasksFromStorage());
  const [currentTab, setCurrentTab] = useState<'tasks' | 'kanban' | 'tracking' | 'dashboard'>('tasks');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskItem | null>(null);

  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<TaskItem | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<TaskItem | null>(null);

  // Filter state pass-through (e.g. from Dashboard click)
  const [initialFilterStatus, setInitialFilterStatus] = useState<string>('all');

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    const newToast: ToastMessage = {
      id: 'toast-' + Date.now() + Math.random(),
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync state to LocalStorage
  const updateTasks = (newTasks: TaskItem[]) => {
    setTasks(newTasks);
    const ok = saveTasksToStorage(newTasks);
    if (!ok) {
      addToast('error', 'Lỗi lưu trữ', 'Không thể ghi dữ liệu vào LocalStorage của trình duyệt.');
    }
  };

  // Create or Update task
  const handleSaveTask = (taskData: TaskItem) => {
    const exists = tasks.some((t) => t.id === taskData.id);
    let updated: TaskItem[];

    if (exists) {
      updated = tasks.map((t) => (t.id === taskData.id ? taskData : t));
      addToast('success', 'Cập nhật thành công', `Đã lưu thay đổi cho hồ sơ [${taskData.code}].`);
    } else {
      updated = [taskData, ...tasks];
      addToast('success', 'Tiếp nhận thành công', `Đã tạo mới hồ sơ [${taskData.code}] vào hệ thống.`);
    }

    updateTasks(updated);
    setIsTaskModalOpen(false);
    setTaskToEdit(null);

    // If modal detail was open, update it
    if (selectedTaskForDetail && selectedTaskForDetail.id === taskData.id) {
      setSelectedTaskForDetail(taskData);
    }
  };

  // Delete task
  const handleConfirmDelete = () => {
    if (!taskToDelete) return;
    const deletedCode = taskToDelete.code;
    const updated = tasks.filter((t) => t.id !== taskToDelete.id);
    updateTasks(updated);
    setTaskToDelete(null);
    if (selectedTaskForDetail && selectedTaskForDetail.id === taskToDelete.id) {
      setSelectedTaskForDetail(null);
    }
    addToast('info', 'Đã xóa công việc', `Hồ sơ [${deletedCode}] đã được xóa khỏi hệ thống.`);
  };

  // Quick Status Update
  const handleUpdateStatus = (taskId: string, newStatus: TaskStatus, note?: string) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    const nowIso = new Date().toISOString();
    const isCompleted = newStatus === 'completed';

    const updatedTimeline = [
      ...targetTask.timeline,
      {
        id: 'tl-' + Date.now(),
        timestamp: nowIso,
        action: `Chuyển trạng thái sang: ${newStatus}`,
        author: targetTask.assigneeName || 'Cán bộ BDU Order Desk',
        note: note || `Thay đổi từ ${targetTask.status} sang ${newStatus}`,
        statusFrom: targetTask.status,
        statusTo: newStatus,
      },
    ];

    const updatedTask: TaskItem = {
      ...targetTask,
      status: newStatus,
      completedDate: isCompleted ? (targetTask.completedDate || nowIso.split('T')[0]) : undefined,
      resolutionNote: note || targetTask.resolutionNote,
      timeline: updatedTimeline,
      updatedAt: nowIso,
    };

    const updatedList = tasks.map((t) => (t.id === taskId ? updatedTask : t));
    updateTasks(updatedList);

    if (selectedTaskForDetail && selectedTaskForDetail.id === taskId) {
      setSelectedTaskForDetail(updatedTask);
    }

    addToast('success', 'Cập nhật tiến độ', `Hồ sơ [${targetTask.code}] đã chuyển sang trạng thái mới.`);
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (task: TaskItem) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  // Export JSON
  const handleExportData = () => {
    exportTasksToJson(tasks);
    addToast('success', 'Xuất dữ liệu thành công', `Đã tải về tệp sao lưu JSON chứa ${tasks.length} bản ghi.`);
  };

  // Trigger file select for import
  const handleTriggerImport = () => {
    fileInputRef.current?.click();
  };

  // File import handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = parseImportedJson(content);
      if (res.valid && res.data) {
        updateTasks(res.data);
        addToast('success', 'Nhập dữ liệu thành công', `Đã phục hồi ${res.data.length} bản ghi vào hệ thống.`);
      } else {
        addToast('error', 'Lỗi nhập dữ liệu', res.error || 'Tệp tin không đúng cấu trúc yêu cầu.');
      }
    };
    reader.onerror = () => {
      addToast('error', 'Lỗi đọc tệp', 'Không thể đọc tệp dữ liệu đã chọn.');
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  // Reset to default demo data
  const handleResetData = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục lại dữ liệu mẫu ban đầu của trường Đại học Bình Dương không? Toàn bộ dữ liệu hiện tại sẽ được thay thế bằng danh sách mẫu chuẩn.')) {
      const defaultTasks = resetTasksToDefault();
      setTasks(defaultTasks);
      addToast('info', 'Đã khôi phục dữ liệu mẫu', `Hệ thống đã nạp lại ${defaultTasks.length} bản ghi mẫu chuẩn BDU.`);
    }
  };

  // Navigation helper from dashboard
  const handleFilterFromDashboard = (status: string) => {
    setInitialFilterStatus(status);
    setCurrentTab('tasks');
  };

  const overdueCount = tasks.filter(isTaskOverdue).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Hidden File Input for JSON restore */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenCreateModal={handleOpenCreateModal}
        onExportData={handleExportData}
        onImportData={handleTriggerImport}
        onResetData={handleResetData}
        totalTasks={tasks.length}
        overdueCount={overdueCount}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'tasks' && (
          <TaskListView
            tasks={tasks}
            onSelectTask={(task) => setSelectedTaskForDetail(task)}
            onEditTask={handleOpenEditModal}
            onDeleteTask={(task) => setTaskToDelete(task)}
            onUpdateStatus={handleUpdateStatus}
            onOpenCreateModal={handleOpenCreateModal}
            initialFilterStatus={initialFilterStatus}
          />
        )}

        {currentTab === 'kanban' && (
          <KanbanView
            tasks={tasks}
            onSelectTask={(task) => setSelectedTaskForDetail(task)}
            onUpdateStatus={handleUpdateStatus}
            onOpenCreateModal={handleOpenCreateModal}
          />
        )}

        {currentTab === 'tracking' && (
          <PublicTrackingView
            tasks={tasks}
            onAddNewRequest={(newTask) => {
              updateTasks([newTask, ...tasks]);
              addToast('success', 'Tiếp nhận đơn mới', `Yêu cầu [${newTask.code}] đã được gửi thành công.`);
            }}
            onViewTaskDetail={(task) => setSelectedTaskForDetail(task)}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            tasks={tasks}
            onSelectTask={(task) => setSelectedTaskForDetail(task)}
            onFilterByStatus={handleFilterFromDashboard}
          />
        )}
      </main>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        existingTasks={tasks}
      />

      <TaskDetailModal
        isOpen={Boolean(selectedTaskForDetail)}
        onClose={() => setSelectedTaskForDetail(null)}
        task={selectedTaskForDetail}
        onEdit={handleOpenEditModal}
        onDelete={(task) => setTaskToDelete(task)}
        onUpdateStatus={handleUpdateStatus}
      />

      <DeleteConfirmModal
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
        task={taskToDelete}
      />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Institutional Footer */}
      <Footer />
    </div>
  );
}
