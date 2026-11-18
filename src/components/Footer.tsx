import React from 'react';
import { NavTab } from '../types';
import { Heart, MapPin, Phone, Mail, CreditCard, ShieldCheck } from 'lucide-react';
import { trackHotlineClick } from '../utils/analytics';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenDonate: () => void;
  onOpenAdminConfig?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenDonate, onOpenAdminConfig }) => {
  const handleNav = (tab: NavTab) => {
    onSelectTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full pt-16 pb-8 bg-[#EFEEEA] border-t border-[#E3E2DF] text-[#1B1C1A]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-12 max-w-[1280px] mx-auto mb-12">
        {/* Col 1: Organization & Identity */}
        <div className="space-y-3">
          <div 
            onClick={() => handleNav('home')}
            className="font-bold text-lg text-[#24150F] block cursor-pointer tracking-tight leading-snug"
          >
            TRUNG TÂM NGHIÊN CỨU BẢO VỆ ĐỘNG VẬT NUÔI (CPAPS)
          </div>
          <p className="text-xs text-[#4F4541] leading-relaxed">
            Tổ chức phi lợi nhuận hoạt động vì phúc lợi, sức khỏe và quyền lợi của thú nuôi, cứu trợ và kết nối nhận nuôi những cá thể động vật gặp nạn.
          </p>

          <div className="pt-2 border-t border-[#E3E2DF] space-y-2 text-xs text-[#4F4541]">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#974729] shrink-0" />
              <span>Hotline cứu hộ 24/7: </span>
              <a 
                href="tel:0834524650" 
                onClick={() => trackHotlineClick('footer_hotline')}
                className="font-bold text-[#974729] hover:underline"
              >
                08 345 246 50
              </a>
            </div>

            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#974729] shrink-0" />
              <span>Mã số thuế: </span>
              <span className="font-mono font-bold text-[#24150F]">0108067634</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#974729] shrink-0" />
              <a href="mailto:info@cpapsvn.org" className="hover:text-[#974729] transition-colors">
                info@cpapsvn.org
              </a>
            </div>
          </div>
        </div>

        {/* Col 2: Locations & Receiving Points */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-[#24150F] uppercase tracking-wider">
            Địa Điểm Tiếp Nhận Đồ & Hỗ Trợ
          </h4>

          <div className="space-y-3 text-xs text-[#4F4541]">
            {/* Location 1 */}
            <div className="bg-white/70 p-3 rounded-xl border border-[#E3E2DF] space-y-1">
              <div className="font-bold text-[#24150F] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#974729] shrink-0" />
                <span>Luna Animal Hospital</span>
              </div>
              <p className="text-[11px] leading-snug">
                Số 243 Giáp Nhất, Thanh Xuân, Hà Nội
              </p>
              <p className="text-[11px] text-[#974729] font-medium pt-0.5">
                Liên hệ bác sĩ Hoa:{' '}
                <a href="tel:0963787234" className="underline font-bold">
                  0963 787 234
                </a>
              </p>
              <p className="text-[10px] text-[#817470]">
                (Hẹn giờ trước khi qua hoặc gửi ship đồ qua)
              </p>
            </div>

            {/* Location 2 */}
            <div className="bg-white/70 p-3 rounded-xl border border-[#E3E2DF] space-y-1">
              <div className="font-bold text-[#24150F] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#974729] shrink-0" />
                <span>Văn phòng Trạm</span>
              </div>
              <p className="text-[11px] leading-snug">
                Phòng 110, Khu tập thể T4, 74 đường Trường Chinh, P. Phương Mai, Q. Đống Đa, Hà Nội
              </p>
              <p className="text-[11px] text-[#974729] font-medium pt-0.5">
                Liên hệ bạn Linh:{' '}
                <a href="tel:0329027007" className="underline font-bold">
                  0329 027 007
                </a>
              </p>
              <p className="text-[10px] text-[#817470]">
                (Hẹn giờ trước khi qua hoặc gửi ship đồ qua)
              </p>
            </div>
          </div>
        </div>

        {/* Col 3: Bank Account / Support */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-[#24150F] uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-[#974729]" />
            Ủng Hộ & Quyên Góp
          </h4>

          <div className="bg-white p-3.5 rounded-xl border border-[#E3E2DF] text-xs space-y-2 text-[#4F4541]">
            <div>
              <span className="text-[#817470] block text-[11px]">Ngân hàng:</span>
              <span className="font-bold text-[#24150F]">Vietcombank - Chi nhánh Hà Nội</span>
            </div>

            <div>
              <span className="text-[#817470] block text-[11px]">Số tài khoản:</span>
              <span className="font-mono font-bold text-sm text-[#974729]">0451 0004 24413</span>
            </div>

            <div>
              <span className="text-[#817470] block text-[11px]">Chủ tài khoản:</span>
              <span className="font-semibold text-[#24150F]">CPAPS</span>
            </div>

            <div>
              <span className="text-[#817470] block text-[11px]">Mã số thuế:</span>
              <span className="font-mono font-semibold text-[#24150F]">0108067634</span>
            </div>

            <button
              onClick={onOpenDonate}
              className="w-full mt-2 bg-[#974729] hover:bg-[#803a1f] text-white py-2 rounded-lg font-semibold text-xs transition-colors"
            >
              Mở QR Chuyển Khoản Nhanh
            </button>
          </div>
        </div>

        {/* Col 4: Navigation Links */}
        <div>
          <h4 className="text-sm font-bold text-[#24150F] mb-4 uppercase tracking-wider">
            Điều Hướng Nhanh
          </h4>
          <ul className="space-y-2.5 text-xs text-[#4F4541]">
            <li>
              <button
                onClick={() => handleNav('adopt')}
                className="hover:text-[#974729] transition-colors text-left"
              >
                Danh sách nhận nuôi chó mèo
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('rescue')}
                className="text-[#BA1A1A] font-semibold hover:underline text-left"
              >
                Báo ca cứu hộ khẩn cấp 24/7
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('lost-found')}
                className="hover:text-[#974729] transition-colors text-left"
              >
                Đăng tin thú cưng thất lạc
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('stories')}
                className="hover:text-[#974729] transition-colors text-left"
              >
                Câu chuyện phục hồi kỳ diệu
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('volunteer')}
                className="hover:text-[#974729] transition-colors text-left"
              >
                Đăng ký làm tình nguyện viên
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('about')}
                className="hover:text-[#974729] transition-colors text-left font-medium"
              >
                Về Trung Tâm CPAPS
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#E3E2DF] pt-6 px-6 max-w-[1280px] mx-auto text-center flex flex-col sm:flex-row items-center justify-between text-xs text-[#817470] gap-3">
        <p>
          © 2024 Trung Tâm Nghiên Cứu Bảo Vệ Động Vật Nuôi (CPAPS). Mọi hoạt động phi lợi nhuận vì phúc lợi động vật.
          {onOpenAdminConfig && (
            <>
              <button
                onClick={onOpenAdminConfig}
                className="ml-2 text-[#817470]/60 hover:text-[#974729] transition-colors inline-flex items-center text-[10px]"
                title="Quản trị biểu mẫu Google Sheet"
              >
                🔒
              </button>
              <button
                onClick={() => handleNav('marketing')}
                className="ml-2 text-[#817470]/60 hover:text-[#974729] transition-colors inline-flex items-center text-[10px]"
                title="AI Marketing Agent (Quản trị)"
              >
                🤖 AI Marketing
              </button>
            </>
          )}
        </p>
        <p className="flex items-center gap-1">
          Được xây dựng vì tình yêu thương động vật <Heart className="w-3.5 h-3.5 text-[#974729] fill-[#974729]" />
        </p>
      </div>
    </footer>
  );
};
