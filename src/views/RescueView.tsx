import React, { useState } from 'react';
import { RescueReport } from '../types';
import { trackHotlineClick } from '../utils/analytics';
import { 
  AlertTriangle, 
  PhoneCall, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  ChevronRight,
  Truck,
  HeartPulse,
  Home as HomeIcon,
  Sparkles
} from 'lucide-react';

interface RescueViewProps {
  rescueReports: RescueReport[];
  onOpenReportModal: () => void;
  onOpenDonate: () => void;
}

export const RescueView: React.FC<RescueViewProps> = ({
  rescueReports,
  onOpenReportModal,
  onOpenDonate,
}) => {
  const [activeUrgencyFilter, setActiveUrgencyFilter] = useState<'all' | 'critical' | 'high' | 'medium'>('all');

  const filteredReports = rescueReports.filter((rep) => {
    if (activeUrgencyFilter === 'all') return true;
    return rep.urgency === activeUrgencyFilter;
  });

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return <span className="bg-[#BA1A1A] text-white text-xs font-bold px-2.5 py-1 rounded-full">🚨 Nguy cấp</span>;
      case 'high':
        return <span className="bg-[#FE9975] text-[#772F13] text-xs font-bold px-2.5 py-1 rounded-full">⚠️ Khẩn trương</span>;
      default:
        return <span className="bg-[#87977A]/20 text-[#23311B] text-xs font-bold px-2.5 py-1 rounded-full">🟢 Ổn định</span>;
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto space-y-12">
      {/* Hero Banner: Emergency Call to Action */}
      <div className="bg-[#23311B] text-white p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl space-y-4 z-10 relative">
          <div className="inline-flex items-center gap-2 bg-[#87977A]/30 text-[#D7E8C7] px-3.5 py-1.5 rounded-full text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            Tổng Đài Cứu Hộ Động Vật Khẩn Cấp 24/7
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Cứu Hộ Kịp Thời.<br />Mỗi Giây Đều Là Sự Sống.
          </h1>
          <p className="text-sm sm:text-base text-[#D7E8C7]/90 leading-relaxed">
            Đội ngũ phản ứng nhanh và các bác sĩ thú y tình nguyện của Trạm luôn túc trực để giải cứu các trường hợp tai nạn, bạo hành hoặc mèo cún con bị bỏ rơi giữa thời tiết khắc nghiệt.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={onOpenReportModal}
              className="bg-[#BA1A1A] hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-base transition-all shadow-lg flex items-center gap-2"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Gửi Báo Cáo Cứu Hộ Ngay</span>
            </button>

            <a
              href="tel:0834524650"
              onClick={() => trackHotlineClick('rescue_hero_banner')}
              className="bg-white/15 hover:bg-white/25 border border-white/20 text-white px-8 py-4 rounded-full font-bold text-base transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Hotline: 08 345 246 50</span>
            </a>
          </div>
        </div>

        {/* Floating background shape */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-radial from-white to-transparent pointer-events-none" />
      </div>

      {/* Safety Instructions Before Rescue Arrives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#E3E2DF] space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-[#974729]/10 text-[#974729] flex items-center justify-center font-bold">
            1
          </div>
          <h3 className="font-bold text-base text-[#24150F]">Bảo Vệ Hiện Trường An Toàn</h3>
          <p className="text-xs text-[#4F4541] leading-relaxed">
            Giữ khoảng cách, tránh gây kích động bé. Dùng bìa carton hoặc ô che mưa/nắng cho bé nếu điều kiện an toàn.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E3E2DF] space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-[#974729]/10 text-[#974729] flex items-center justify-center font-bold">
            2
          </div>
          <h3 className="font-bold text-base text-[#24150F]">Chụp Ảnh & Định Vị Chính Xác</h3>
          <p className="text-xs text-[#4F4541] leading-relaxed">
            Chụp rõ vết thương hoặc môi trường xung quanh, ghi nhớ số nhà mốc đường để gửi cho đội cứu hộ tiếp cận nhanh nhất.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E3E2DF] space-y-2 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-[#974729]/10 text-[#974729] flex items-center justify-center font-bold">
            3
          </div>
          <h3 className="font-bold text-base text-[#24150F]">Không Tự Ý Dùng Thuốc</h3>
          <p className="text-xs text-[#4F4541] leading-relaxed">
            Tuyệt đối KHÔNG cho chó mèo uống thuốc giảm đau của người (như Paracetamol, Panadol) vì có thể gây ngộ độc tử vong.
          </p>
        </div>
      </div>

      {/* Live Rescue Cases Tracker */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#974729] bg-[#974729]/10 px-3 py-1 rounded-full">
              Theo dõi trực tiếp
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24150F] mt-1.5">
              Các Ca Cứu Hộ Đang Xử Lý ({rescueReports.length})
            </h2>
          </div>

          {/* Urgency Filter */}
          <div className="flex gap-2 bg-[#EFEEEA] p-1 rounded-2xl">
            <button
              onClick={() => setActiveUrgencyFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeUrgencyFilter === 'all'
                  ? 'bg-white text-[#24150F] shadow-sm'
                  : 'text-[#4F4541]'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setActiveUrgencyFilter('critical')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeUrgencyFilter === 'critical'
                  ? 'bg-[#BA1A1A] text-white shadow-sm'
                  : 'text-[#4F4541]'
              }`}
            >
              Nguy cấp
            </button>
            <button
              onClick={() => setActiveUrgencyFilter('high')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeUrgencyFilter === 'high'
                  ? 'bg-[#FE9975] text-[#772F13] shadow-sm'
                  : 'text-[#4F4541]'
              }`}
            >
              Khẩn trương
            </button>
          </div>
        </div>

        {/* Timeline of Rescue Cases */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-6 rounded-3xl border border-[#E3E2DF] shadow-sm flex flex-col lg:flex-row gap-6 items-start justify-between"
            >
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <img
                  src={report.image}
                  alt={report.animalType}
                  className="w-full sm:w-36 h-36 rounded-2xl object-cover bg-[#EFEEEA] shrink-0"
                />

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {getUrgencyBadge(report.urgency)}
                    <span className="text-xs font-bold bg-[#EFEEEA] text-[#24150F] px-2.5 py-1 rounded-md">
                      {report.animalType}
                    </span>
                    <span className="text-xs text-[#817470] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {report.createdAt}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-[#24150F]">
                    {report.condition}
                  </h3>

                  <p className="text-xs text-[#4F4541] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#974729] shrink-0" />
                    <span>{report.location}</span>
                  </p>

                  <div className="bg-[#EFEEEA]/60 p-3 rounded-xl text-xs text-[#4F4541] border border-[#E3E2DF]">
                    <span className="font-semibold text-[#24150F]">Cập nhật từ điều phối viên: </span>
                    {report.notes}
                  </div>
                </div>
              </div>

              {/* Status Stepper */}
              <div className="w-full lg:w-72 bg-[#FAF9F5] p-4 rounded-2xl border border-[#E3E2DF] flex flex-col justify-between shrink-0 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#817470] font-semibold">Trạng thái ca cứu hộ:</span>
                  <span className="text-xs font-bold text-[#974729] bg-[#974729]/10 px-2 py-0.5 rounded">
                    {report.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#EFEEEA] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#974729] h-full transition-all duration-500"
                    style={{ width: `${(report.statusStep / 5) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-[#817470] font-semibold">
                  <span>Tiếp nhận</span>
                  <span>Di chuyển</span>
                  <span>Cấp cứu</span>
                  <span>An toàn</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support Rescue Medical Fund Banner */}
      <div className="bg-[#EFEEEA] p-8 md:p-12 rounded-[2.5rem] border border-[#E3E2DF] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#974729] bg-[#974729]/10 px-3 py-1 rounded-full">
            Quỹ Cứu Trợ Khẩn Cấp
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#24150F]">
            Đồng hành cùng Trạm chi trả viện phí cứu chữa
          </h3>
          <p className="text-xs sm:text-sm text-[#4F4541] leading-relaxed">
            Hàng tháng Trạm tiếp nhận hơn 40 ca chấn thương nặng cần phẫu thuật xương, hồi sức và truyền dịch. Sự tiếp sức của bạn cứu sống các bé từng ngày.
          </p>
        </div>

        <button
          onClick={onOpenDonate}
          className="bg-[#974729] text-white px-8 py-4 rounded-full font-bold text-base hover:bg-[#803a1f] shadow-lg shadow-[#974729]/25 shrink-0"
        >
          Ủng Hộ Quỹ Y Tế
        </button>
      </div>
    </div>
  );
};
