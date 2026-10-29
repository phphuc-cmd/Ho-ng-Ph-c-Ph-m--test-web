/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  Hourglass, 
  AlertTriangle, 
  Printer, 
  FileText, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  Send,
  PlusCircle,
  Sparkles
} from 'lucide-react';
import { TaskItem, ServiceCategory, Department } from '../types';
import { getStatusBadgeInfo, getPriorityBadgeInfo, isTaskOverdue, generateTaskCode } from '../utils/storage';
import { CATEGORIES, DEPARTMENTS } from '../data/initialData';

interface PublicTrackingViewProps {
  tasks: TaskItem[];
  onAddNewRequest: (task: TaskItem) => void;
  onViewTaskDetail: (task: TaskItem) => void;
}

export const PublicTrackingView: React.FC<PublicTrackingViewProps> = ({
  tasks,
  onAddNewRequest,
  onViewTaskDetail,
}) => {
  const [searchKey, setSearchKey] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundTask, setFoundTask] = useState<TaskItem | null>(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  // New Request Form state for Students
  const [reqTitle, setReqTitle] = useState('');
  const [reqCategory, setReqCategory] = useState<ServiceCategory>('Cấp giấy chứng nhận / Bảng điểm');
  const [reqName, setReqName] = useState('');
  const [reqCode, setReqCode] = useState('');
  const [reqPhone, setReqPhone] = useState('');
  const [reqEmail, setReqEmail] = useState('');
  const [reqDept, setReqDept] = useState<Department>('Phòng Đào tạo');
  const [reqDesc, setReqDesc] = useState('');
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const handleSearch = (codeToSearch?: string) => {
    const query = (codeToSearch || searchKey).trim().toLowerCase();
    if (!query) return;

    setSearched(true);
    const result = tasks.find((t) => {
      const matchCode = t.code.toLowerCase() === query;
      const matchPhone = t.requesterPhone && t.requesterPhone.includes(query);
      const matchStudentId = t.requesterCode && t.requesterCode.toLowerCase() === query;
      const matchEmail = t.requesterEmail && t.requesterEmail.toLowerCase() === query;
      return matchCode || matchPhone || matchStudentId || matchEmail;
    });

    setFoundTask(result || null);
  };

  const handleQuickLookup = (code: string) => {
    setSearchKey(code);
    handleSearch(code);
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim() || !reqName.trim()) return;

    const nowIso = new Date().toISOString();
    const todayStr = nowIso.split('T')[0];
    const defaultDue = new Date();
    defaultDue.setDate(defaultDue.getDate() + 5);
    const dueStr = defaultDue.toISOString().split('T')[0];

    const generatedCode = generateTaskCode(tasks);

    const newTask: TaskItem = {
      id: 'bdu-' + Date.now(),
      code: generatedCode,
      title: reqTitle.trim(),
      category: reqCategory,
      requesterName: reqName.trim(),
      requesterCode: reqCode.trim() || undefined,
      requesterPhone: reqPhone.trim(),
      requesterEmail: reqEmail.trim(),
      department: reqDept,
      assigneeName: 'Bộ phận tiếp nhận một cửa',
      priority: 'medium',
      status: 'pending',
      startDate: todayStr,
      dueDate: dueStr,
      description: reqDesc.trim(),
      timeline: [
        {
          id: 'tl-' + Date.now(),
          timestamp: nowIso,
          action: 'Gửi yêu cầu trực tuyến thành công',
          author: reqName.trim(),
          note: 'Hồ sơ đã được gửi qua Cổng tra cứu BDU Order Desk và cấp mã tra cứu ' + generatedCode,
          statusTo: 'pending',
        },
      ],
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    onAddNewRequest(newTask);
    setFormSuccess(generatedCode);
    setSearchKey(generatedCode);
    setFoundTask(newTask);
    setSearched(true);
    setShowSubmitForm(false);

    // Reset form
    setReqTitle('');
    setReqName('');
    setReqCode('');
    setReqPhone('');
    setReqEmail('');
    setReqDesc('');
  };

  // Determine active step index
  const getStepIndex = (status: string) => {
    switch (status) {
      case 'pending':
        return 1; // Step 1 completed, in step 2
      case 'in_progress':
        return 2; // Step 2 completed, in step 3
      case 'completed':
        return 4; // All done
      case 'cancelled':
        return -1;
      default:
        return 1;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero tracking banner */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        {/* Background decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 border border-white/10 text-xs font-semibold backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cổng tra cứu công khai bdu-order-desk.vercel.app/tracking</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Tra cứu tiến độ hồ sơ & Yêu cầu học vụ
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Nhập Mã hồ sơ (VD: <span className="font-mono text-amber-300 font-semibold">BDU-2026-0812</span>), Mã số sinh viên (MSSV) hoặc Số điện thoại để theo dõi chi tiết tình trạng giải quyết tại Trường Đại học Bình Dương.
          </p>

          {/* Search Box Input */}
          <div className="pt-2">
            <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/20 backdrop-blur-md">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Nhập Mã hồ sơ (BDU-...), MSSV hoặc SĐT..."
                  className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <button
                type="button"
                onClick={() => handleSearch()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Tra cứu ngay</span>
              </button>
            </div>
          </div>

          {/* Quick sample chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-300">
            <span className="text-slate-400">Gợi ý mã tra cứu nhanh:</span>
            {tasks.slice(0, 4).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleQuickLookup(t.code)}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg font-mono text-[11px] text-amber-300 border border-white/10 transition-colors cursor-pointer"
              >
                {t.code}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Success banner if new request just created */}
      {formSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-emerald-900">
              Yêu cầu của bạn đã được tiếp nhận thành công vào hệ thống BDU Order Desk!
            </p>
            <p className="text-emerald-700 mt-0.5">
              Mã theo dõi của bạn là: <strong className="font-mono text-sm">{formSuccess}</strong>. Vui lòng lưu lại mã này để kiểm tra tiến độ tiếp theo.
            </p>
          </div>
        </div>
      )}

      {/* Result Section */}
      {searched && (
        <div className="space-y-4">
          {!foundTask ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-xs">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Không tìm thấy thông tin hồ sơ</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Không tìm thấy hồ sơ nào khớp với từ khóa "{searchKey}". Vui lòng kiểm tra lại Mã hồ sơ (định dạng chuẩn: BDU-2026-XXXX) hoặc số điện thoại khi đăng ký.
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <button
                  onClick={() => setShowSubmitForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
                >
                  Nộp yêu cầu mới ngay
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
              {/* Result Top Bar */}
              <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm sm:text-base font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-3 py-1 rounded-lg">
                      {foundTask.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {foundTask.category}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold mt-2 text-white">
                    {foundTask.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>In phiếu hẹn</span>
                  </button>
                  <button
                    onClick={() => onViewTaskDetail(foundTask)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Xem đầy đủ</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Visual 4-Step Stepper */}
              <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">
                  Tiến trình xử lý hồ sơ
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                      ✓
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">1. Đã tiếp nhận</div>
                      <div className="text-[11px] text-slate-500">{foundTask.startDate}</div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-colors ${
                        foundTask.status !== 'pending' && foundTask.status !== 'cancelled'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 text-white ring-4 ring-blue-100'
                      }`}
                    >
                      {foundTask.status !== 'pending' && foundTask.status !== 'cancelled' ? '✓' : '2'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">2. Phân công xử lý</div>
                      <div className="text-[11px] text-slate-500">{foundTask.department}</div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-colors ${
                        foundTask.status === 'completed'
                          ? 'bg-emerald-600 text-white'
                          : foundTask.status === 'in_progress'
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {foundTask.status === 'completed' ? '✓' : '3'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">3. Đang thực hiện</div>
                      <div className="text-[11px] text-slate-500">
                        {foundTask.assigneeName || 'Đang thụ lý'}
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-colors ${
                        foundTask.status === 'completed'
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {foundTask.status === 'completed' ? '✓' : '4'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">4. Hoàn thành & Trả hồ sơ</div>
                      <div className="text-[11px] text-slate-500">
                        {foundTask.completedDate || `Dự kiến: ${foundTask.dueDate}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Summary Cards */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Card: Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-blue-700">
                    <FileText className="w-4 h-4" />
                    <span>Thông tin chi tiết phiếu tiếp nhận</span>
                  </h4>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Người nộp đơn:</span>
                      <span className="font-bold text-slate-900">{foundTask.requesterName}</span>
                    </div>
                    {foundTask.requesterCode && (
                      <div className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-slate-500">Mã sinh viên / CB:</span>
                        <span className="font-mono font-bold text-slate-900">{foundTask.requesterCode}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Đơn vị tiếp nhận:</span>
                      <span className="font-semibold text-slate-800">{foundTask.department}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Chuyên viên phụ trách:</span>
                      <span className="font-semibold text-blue-700">{foundTask.assigneeName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Hạn dự kiến trả kết quả:</span>
                      <span className="font-bold text-slate-900">{foundTask.dueDate}</span>
                    </div>
                    {foundTask.completedDate && (
                      <div className="flex justify-between py-1 text-emerald-800 font-bold">
                        <span>Đã trả kết quả ngày:</span>
                        <span>{foundTask.completedDate}</span>
                      </div>
                    )}
                  </div>

                  {foundTask.resolutionNote && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                      <span className="font-bold text-emerald-900 block mb-1">
                        Kết quả & Hướng dẫn nhận kết quả:
                      </span>
                      <p className="text-emerald-800 leading-relaxed">{foundTask.resolutionNote}</p>
                    </div>
                  )}
                </div>

                {/* Right Card: Timeline Activity */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-indigo-700">
                    <Clock className="w-4 h-4" />
                    <span>Lịch sử các bước xử lý</span>
                  </h4>

                  <div className="space-y-3 relative pl-4 border-l-2 border-indigo-200">
                    {foundTask.timeline.map((item, idx) => (
                      <div key={item.id || idx} className="relative">
                        <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white" />
                        <div className="text-xs">
                          <div className="font-bold text-slate-900">{item.action}</div>
                          <div className="text-[11px] text-slate-400">
                            {new Date(item.timestamp).toLocaleString('vi-VN')} • {item.author}
                          </div>
                          {item.note && (
                            <div className="mt-1 p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-xs">
                              {item.note}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Accordion to Submit New Request Online */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>Chưa có mã hồ sơ? Gửi yêu cầu dịch vụ sinh viên online</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sinh viên và giảng viên có thể gửi yêu cầu xác nhận, bảng điểm hoặc hỗ trợ trực tiếp tại đây.
            </p>
          </div>
          <button
            onClick={() => setShowSubmitForm(!showSubmitForm)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer w-fit"
          >
            {showSubmitForm ? 'Ẩn biểu mẫu' : '+ Điền thông tin gửi yêu cầu'}
          </button>
        </div>

        {showSubmitForm && (
          <form onSubmit={handleStudentSubmit} className="pt-4 border-t border-slate-100 space-y-4 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dịch vụ cần yêu cầu <span className="text-red-500">*</span>
                </label>
                <select
                  value={reqCategory}
                  onChange={(e) => setReqCategory(e.target.value as ServiceCategory)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Đơn vị tiếp nhận giải quyết
                </label>
                <select
                  value={reqDept}
                  onChange={(e) => setReqDept(e.target.value as Department)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tiêu đề yêu cầu cụ thể <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={reqTitle}
                onChange={(e) => setReqTitle(e.target.value)}
                placeholder="VD: Cấp 02 giấy xác nhận sinh viên để làm thủ tục vay vốn ngân hàng"
                required
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">
                  Họ tên của bạn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={reqName}
                  onChange={(e) => setReqName(e.target.value)}
                  placeholder="VD: Lê Thị Hoa"
                  required
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Mã số sinh viên (MSSV)</label>
                <input
                  type="text"
                  value={reqCode}
                  onChange={(e) => setReqCode(e.target.value)}
                  placeholder="VD: 22050123"
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Số điện thoại liên hệ</label>
                <input
                  type="tel"
                  value={reqPhone}
                  onChange={(e) => setReqPhone(e.target.value)}
                  placeholder="VD: 0912345678"
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Email</label>
                <input
                  type="email"
                  value={reqEmail}
                  onChange={(e) => setReqEmail(e.target.value)}
                  placeholder="VD: hoa.lt@student.bdu.edu.vn"
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-600 mb-1">
                Ghi chú hoặc thông tin bổ sung (nếu có)
              </label>
              <textarea
                rows={2}
                value={reqDesc}
                onChange={(e) => setReqDesc(e.target.value)}
                placeholder="Ghi chú thêm về năm học, lớp hoặc lý do cần gấp..."
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitForm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Nộp yêu cầu & Nhận mã tra cứu</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
