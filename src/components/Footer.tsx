/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, Phone, Mail, Globe, ShieldCheck, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                BDU
              </span>
              <span className="text-white font-bold text-sm tracking-wide">
                TRƯỜNG ĐẠI HỌC BÌNH DƯƠNG
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
              Hệ thống BDU Order Desk & Quản lý công việc tập trung: Tiếp nhận, phân luồng xử lý và tra cứu tiến độ dịch vụ hành chính - học vụ công khai, minh bạch cho giảng viên, cán bộ và sinh viên.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-medium pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Hệ thống đạt chuẩn an toàn dữ liệu nội bộ BDU 2026</span>
            </div>
          </div>

          {/* Contact details */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Liên hệ hỗ trợ</h4>
            <div className="flex items-start gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>504 Đại lộ Bình Dương, P. Hiệp Thành, TP. Thủ Dầu Một, Bình Dương</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>(0274) 3822 058 — (0274) 3872 092</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>orderdesk@bdu.edu.vn / daotao@bdu.edu.vn</span>
            </div>
          </div>

          {/* Working hours & links */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">Thời gian làm việc</h4>
            <div className="flex items-start gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p>Thứ 2 — Thứ 6: 07:30 – 17:00</p>
                <p>Thứ 7: 07:30 – 11:30</p>
                <p className="text-slate-400 text-[11px]">Chủ nhật & Ngày lễ: Nghỉ</p>
              </div>
            </div>
            <div className="pt-2">
              <a 
                href="https://www.bdu.edu.vn" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Cổng thông tin www.bdu.edu.vn</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-slate-400 gap-2">
          <p>© 2026 Trường Đại học Bình Dương. Tất cả các quyền được bảo lưu.</p>
          <p className="text-[11px]">Hệ sinh thái chuyển đổi số giáo dục đại học BDU E-Campus</p>
        </div>
      </div>
    </footer>
  );
};
