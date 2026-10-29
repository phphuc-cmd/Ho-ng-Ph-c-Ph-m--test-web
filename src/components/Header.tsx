/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  BarChart3, 
  Kanban, 
  PlusCircle, 
  Download, 
  Upload, 
  RotateCcw, 
  Menu, 
  X, 
  GraduationCap,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'tasks' | 'kanban' | 'tracking' | 'dashboard';
  setCurrentTab: (tab: 'tasks' | 'kanban' | 'tracking' | 'dashboard') => void;
  onOpenCreateModal: () => void;
  onExportData: () => void;
  onImportData: () => void;
  onResetData: () => void;
  totalTasks: number;
  overdueCount: number;
}

interface NavItem {
  id: 'tasks' | 'kanban' | 'tracking' | 'dashboard';
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
  highlight?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  onOpenCreateModal,
  onExportData,
  onImportData,
  onResetData,
  totalTasks,
  overdueCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dataMenuOpen, setDataMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      id: 'tasks',
      label: 'Quản lý công việc & Đơn',
      icon: ClipboardList,
      badge: totalTasks,
    },
    {
      id: 'kanban',
      label: 'Bảng Kanban',
      icon: Kanban,
    },
    {
      id: 'tracking',
      label: 'Tra cứu tiến độ (Tracking)',
      icon: Search,
      highlight: true,
    },
    {
      id: 'dashboard',
      label: 'Báo cáo & Dashboard',
      icon: BarChart3,
      badge: overdueCount > 0 ? `${overdueCount} quá hạn` : undefined,
      badgeColor: 'bg-red-500 text-white',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top institution banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center font-medium">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-amber-400" />
          <span>TRƯỜNG ĐẠI HỌC BÌNH DƯƠNG — HỆ THỐNG MỘT CỬA BDU ORDER DESK & TIẾN ĐỘ HỌC VỤ</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-blue-200">
          <span>Hotline: 0274.3822058</span>
          <span>•</span>
          <a 
            href="https://bdu-order-desk.vercel.app/tracking" 
            target="_blank" 
            rel="noreferrer"
            className="text-amber-300 hover:text-amber-200 flex items-center gap-1 transition-colors"
          >
            <span>Live Portal: /tracking</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('tasks')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-blue-500/20 ring-2 ring-blue-100">
              BDU
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight">BDU Order Desk</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                  V1.2 PROD
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Hệ thống Quản lý công việc & Tra cứu tiến độ</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id as any)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-xs ring-1 ring-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold leading-none ${
                        item.badgeColor || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Data options dropdown */}
            <div className="relative">
              <button
                onClick={() => setDataMenuOpen(!dataMenuOpen)}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200"
                title="Sao lưu & Phục hồi dữ liệu"
              >
                <span>Dữ liệu</span>
                <span className="text-[10px] text-slate-500">▼</span>
              </button>

              {dataMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDataMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-20 text-xs">
                    <button
                      onClick={() => {
                        onExportData();
                        setDataMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-medium"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-600" />
                      <span>Xuất sao lưu JSON</span>
                    </button>
                    <button
                      onClick={() => {
                        onImportData();
                        setDataMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 font-medium"
                    >
                      <Upload className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Nhập dữ liệu từ JSON</span>
                    </button>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      onClick={() => {
                        onResetData();
                        setDataMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 font-medium"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-red-500" />
                      <span>Khôi phục dữ liệu mẫu BDU</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Quick add task button */}
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tạo công việc mới</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenCreateModal}
              className="p-2 text-white bg-blue-600 rounded-lg sm:hidden"
              title="Tạo mới"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold ${
                  isActive ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-blue-600" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
            <button
              onClick={() => {
                onExportData();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Xuất JSON</span>
            </button>
            <button
              onClick={() => {
                onImportData();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-600" />
              <span>Nhập JSON</span>
            </button>
            <button
              onClick={() => {
                onResetData();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 text-xs font-semibold bg-red-50 text-red-600 rounded-lg flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-red-500" />
              <span>Khôi phục dữ liệu mẫu BDU</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
