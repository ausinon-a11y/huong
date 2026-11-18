import React from 'react';
import {
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Heart,
  Award,
  ExternalLink,
  CreditCard
} from 'lucide-react';
import { trackHotlineClick } from '../utils/analytics';

interface AboutViewProps {
  onOpenDonate: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onOpenDonate }) => {
  return (
    <div className="py-8 px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto space-y-12">

      {/* Hero Intro */}
      <div className="bg-[#EFEEEA] p-8 md:p-12 rounded-[2.5rem] border border-[#E3E2DF] text-center max-w-4xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#974729] bg-[#974729]/10 px-3.5 py-1.5 rounded-full">
          Sứ mệnh & Trách nhiệm
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#24150F] mt-3">
          Trung Tâm Nghiên Cứu Bảo Vệ Động Vật Nuôi (CPAPS)
        </h1>

        <p className="text-sm sm:text-base text-[#4F4541] mt-3 max-w-2xl mx-auto leading-relaxed">
          CPAPS là tổ chức phi lợi nhuận hoạt động vì phúc lợi, sức khỏe và quyền lợi của thú nuôi, kết nối những chú chó mèo đang cần được giúp đỡ với những gia đình yêu thương.
        </p>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-8 rounded-3xl border border-[#E3E2DF] space-y-3 shadow-sm">
          <div className="w-12 h-12 bg-[#974729]/10 text-[#974729] rounded-2xl flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-[#24150F]">
            Tôn Trọng Sự Sống
          </h3>

          <p className="text-sm text-[#4F4541] leading-relaxed">
            Mỗi bé chó mèo đều xứng đáng được chăm sóc, điều trị và có cơ hội
            tìm được một gia đình yêu thương.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#E3E2DF] space-y-3 shadow-sm">
          <div className="w-12 h-12 bg-[#87977A]/15 text-[#23311B] rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-[#24150F]">
            Chăm Sóc & Điều Trị
          </h3>

          <p className="text-sm text-[#4F4541] leading-relaxed">
            Các bé được tiếp nhận, chăm sóc và điều trị tùy theo tình trạng
            sức khỏe trước khi tìm kiếm gia đình phù hợp.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#E3E2DF] space-y-3 shadow-sm">
          <div className="w-12 h-12 bg-[#24150F]/10 text-[#24150F] rounded-2xl flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-[#24150F]">
            Minh Bạch & Cộng Đồng
          </h3>

          <p className="text-sm text-[#4F4541] leading-relaxed">
            Trạm luôn cần sự đồng hành của cộng đồng thông qua hoạt động
            nhận nuôi, chăm sóc, cứu trợ và đóng góp cho các bé.
          </p>
        </div>
      </div>

      {/* Locations */}
      <div className="bg-white rounded-[2.5rem] border border-[#E3E2DF] p-8 md:p-12 shadow-sm">

        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#974729] bg-[#974729]/10 px-3 py-1 rounded-full">
            Địa điểm hỗ trợ
          </span>

          <h2 className="text-3xl font-extrabold text-[#24150F] mt-3">
            Các Điểm Tiếp Nhận & Gửi Đồ
          </h2>

          <p className="text-sm text-[#4F4541] mt-2">
            Vui lòng liên hệ trước để hẹn giờ khi đến trực tiếp hoặc gửi đồ
            qua đơn vị vận chuyển.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Location 1 */}
          <div className="bg-[#FAF9F5] border border-[#E3E2DF] rounded-3xl p-6 space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 bg-[#974729]/10 text-[#974729] rounded-2xl flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>

              <div>
                <h3 className="font-bold text-[#24150F] text-lg">
                  Luna Animal Hospital
                </h3>

                <p className="text-sm text-[#4F4541] mt-1 leading-relaxed">
                  Số 243 Giáp Nhất, Thanh Xuân, Hà Nội
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-[#E3E2DF]">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#974729] shrink-0 mt-0.5" />

                <div className="text-sm">
                  <span className="font-bold text-[#24150F] block">
                    Liên hệ bác sĩ Hoa
                  </span>

                  <a
                    href="tel:0963787234"
                    className="text-[#974729] font-semibold hover:underline"
                  >
                    0963 787 234
                  </a>

                  <p className="text-[#4F4541] mt-1 leading-relaxed">
                    Vui lòng hẹn giờ trước khi qua hoặc gửi ship đồ qua.
                  </p>
                </div>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=243+Giáp+Nhất,+Thanh+Xuân,+Hà+Nội"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#974729] hover:underline"
            >
              <span>Mở vị trí trên Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Location 2 */}
          <div className="bg-[#FAF9F5] border border-[#E3E2DF] rounded-3xl p-6 space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 bg-[#87977A]/15 text-[#23311B] rounded-2xl flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>

              <div>
                <h3 className="font-bold text-[#24150F] text-lg">
                  Phòng 110 - Khu tập thể T4
                </h3>

                <p className="text-sm text-[#4F4541] mt-1 leading-relaxed">
                  74 đường Trường Chinh, phường Phương Mai,
                  quận Đống Đa, Hà Nội
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-[#E3E2DF]">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#974729] shrink-0 mt-0.5" />

                <div className="text-sm">
                  <span className="font-bold text-[#24150F] block">
                    Liên hệ bạn Linh
                  </span>

                  <a
                    href="tel:0329027007"
                    className="text-[#974729] font-semibold hover:underline"
                  >
                    0329 027 007
                  </a>

                  <p className="text-[#4F4541] mt-1 leading-relaxed">
                    Vui lòng hẹn giờ trước khi qua hoặc gửi ship đồ qua.
                  </p>
                </div>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=74+Trường+Chinh,+Phương+Mai,+Đống+Đa,+Hà+Nội"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#974729] hover:underline"
            >
              <span>Mở vị trí trên Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </div>

      {/* Donation Information */}
      <div className="bg-[#24150F] text-white p-8 md:p-12 rounded-[2.5rem] shadow-xl">

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">

          <div className="space-y-3 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Đồng hành cùng các bé
            </h3>

            <p className="text-sm text-[#dec0b6] leading-relaxed">
              Mọi sự hỗ trợ đều góp phần giúp Trạm có thêm nguồn lực để
              chăm sóc, điều trị và cứu giúp những bé chó mèo đang gặp
              khó khăn.
            </p>
          </div>

          {/* Bank Information */}
          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 min-w-full lg:min-w-[400px]">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-[#dec0b6]" />

              <span className="font-bold">
                Thông tin ủng hộ
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-[#dec0b6]">
                  Ngân hàng
                </span>

                <span className="font-semibold text-right">
                  Vietcombank - Chi nhánh Hà Nội
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-[#dec0b6]">
                  Số tài khoản
                </span>

                <span className="font-bold text-right font-mono">
                  0451 0004 24413
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-[#dec0b6]">
                  Chủ tài khoản
                </span>

                <span className="font-semibold text-right">
                  CPAPS
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-[#dec0b6]">
                  Mã số thuế
                </span>

                <span className="font-semibold text-right">
                  0108067634
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-[#dec0b6]">
                  PayPal
                </span>

                <span className="font-semibold text-right">
                  info@cpapsvn.org
                </span>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between gap-4">
                <span className="text-[#dec0b6]">
                  Hotline
                </span>

                <a
                  href="tel:0834524650"
                  onClick={() => trackHotlineClick('about_view_hotline')}
                  className="font-bold hover:underline"
                >
                  08 345 246 50
                </a>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onOpenDonate}
            className="bg-[#974729] hover:bg-[#803a1f] text-white px-8 py-4 rounded-full font-bold text-base shadow-lg transition-all"
          >
            Quyên Góp Ngay
          </button>
        </div>

      </div>
    </div>
  );
};