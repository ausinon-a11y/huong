import React, { useState } from 'react';
import { RescueReport } from '../types';
import { X, AlertTriangle, MapPin, Camera, CheckCircle2, PhoneCall } from 'lucide-react';
import { trackHotlineClick } from '../utils/analytics';

interface ReportRescueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (report: RescueReport) => void;
}

export const ReportRescueModal: React.FC<ReportRescueModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    reporterName: '',
    phone: '',
    location: '',
    animalType: 'Chó' as 'Chó' | 'Mèo' | 'Khác',
    condition: '',
    urgency: 'critical' as 'critical' | 'high' | 'medium',
    image: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: RescueReport = {
      id: `resc-${Date.now()}`,
      reporterName: formData.reporterName,
      phone: formData.phone,
      location: formData.location,
      animalType: formData.animalType,
      condition: formData.condition,
      urgency: formData.urgency,
      image: formData.image || 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
      createdAt: 'Vừa xong',
      status: 'Đã tiếp nhận',
      statusStep: 1,
      notes: formData.notes || 'Đã tiếp nhận thông tin, điều phối viên đang phân công đội phản ứng nhanh.',
    };

    onSubmitReport(newReport);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="bg-[#FAF9F5] w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl border border-[#E3E2DF] my-8 relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E3E2DF] flex items-center justify-between bg-[#BA1A1A]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#BA1A1A] text-white flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-[#24150F]">
                Báo Tin Cứu Hộ Khẩn Cấp
              </h3>
              <p className="text-xs text-[#BA1A1A] font-semibold">
                Đội phản ứng nhanh hỗ trợ 24/7 khu vực Hà Nội & TP.HCM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-[#24150F]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#87977A]/20 text-[#23311B] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-[#87977A]" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#24150F]">
              Đã Tiếp Nhận Yêu Cầu Cứu Hộ!
            </h3>
            <p className="text-sm text-[#4F4541] max-w-md mx-auto leading-relaxed">
              Trạm đã ghi nhận địa điểm <strong>{formData.location}</strong>. Đội tình nguyện viên gần nhất đang được điều phối. Chúng tôi sẽ gọi lại ngay theo số <strong>{formData.phone}</strong> để xác nhận chi tiết.
            </p>
            <div className="bg-[#EFEEEA] p-4 rounded-2xl max-w-md mx-auto text-xs text-[#4F4541] text-left">
              <p className="font-bold text-[#24150F] mb-1">⚠️ Lưu ý trong lúc chờ đợi:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Nếu an toàn, hãy che chắn mưa/nắng cho bé bằng bìa carton hoặc vải khô.</li>
                <li>Không tự ý bẻ khớp hoặc cho bé uống thuốc giảm đau của người.</li>
                <li>Giữ khoảng cách an toàn nếu bé có dấu hiệu hoảng loạn cắn trả.</li>
              </ul>
            </div>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="bg-[#974729] text-white px-8 py-3 rounded-full font-bold hover:bg-[#803a1f] transition-all"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 md:p-8 space-y-5">
            {/* Quick Hotline Banner */}
            <div className="bg-[#EFEEEA] p-3.5 rounded-2xl flex items-center justify-between border border-[#E3E2DF]">
              <span className="text-xs text-[#4F4541]">Nếu ca tai nạn nguy cấp, hãy gọi trực tiếp:</span>
              <a
                href="tel:0834524650"
                onClick={() => trackHotlineClick('report_rescue_modal')}
                className="bg-[#BA1A1A] text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 hover:bg-red-700 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" /> 08 345 246 50
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                  Họ tên người báo tin *
                </label>
                <input
                  type="text"
                  required
                  value={formData.reporterName}
                  onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn Nam"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm focus:ring-2 focus:ring-[#974729]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                  Số điện thoại gọi lại *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0912 345 678"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm focus:ring-2 focus:ring-[#974729]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                Địa điểm chính xác của bé *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Số nhà, ngõ ngách, tên đường hoặc mốc nhận biết gần nhất..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm focus:ring-2 focus:ring-[#974729]"
                />
                <MapPin className="w-4 h-4 text-[#974729] absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                  Loài động vật
                </label>
                <select
                  value={formData.animalType}
                  onChange={(e) => setFormData({ ...formData, animalType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                >
                  <option value="Chó">Chó 🐶</option>
                  <option value="Mèo">Mèo 🐱</option>
                  <option value="Khác">Động vật khác</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                  Mức độ khẩn cấp
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                >
                  <option value="critical">🚨 Nguy kịch (Tai nạn, mất máu, kẹt sâu)</option>
                  <option value="high">⚠️ Nghiêm trọng (Bị thương, mẹ con sơ sinh bỏ rơi)</option>
                  <option value="medium">🟡 Trung bình (Lang thang kiệt sức, viêm da)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                Mô tả tình trạng hiện tại *
              </label>
              <textarea
                required
                rows={3}
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                placeholder="Ví dụ: Bé chó cỏ bị gãy chân sau bên trái, đang nằm thở dốc dưới gốc cây bàng đối diện số 12..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm focus:ring-2 focus:ring-[#974729]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                Link ảnh / Tải ảnh hiện trường (tùy chọn)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Dán link ảnh hoặc để trống để dùng ảnh mặc định..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#817470]/40 bg-white text-sm"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80' })}
                  className="px-3 py-2 bg-[#EFEEEA] hover:bg-[#E3E2DF] text-xs font-semibold rounded-xl text-[#24150F] flex items-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5" /> Thử ảnh mẫu
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-[#4F4541] hover:bg-[#EFEEEA]"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="bg-[#BA1A1A] text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-red-700 shadow-lg shadow-red-600/20 flex items-center gap-2"
              >
                <span>Gửi Yêu Cầu Cứu Hộ Ngay</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
