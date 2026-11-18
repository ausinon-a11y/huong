import React, { useState } from 'react';
import { Pet } from '../types';
import { X, CheckCircle2, ShieldAlert, Heart, User, Home, Sparkles, FileSpreadsheet, ExternalLink } from 'lucide-react';
import { 
  getSavedSpreadsheetId, 
  appendAdoptionToSheet, 
  saveLocalAdoption,
  StoredAdoptionSubmission 
} from '../services/googleSheets';
import { getCachedAccessToken } from '../services/auth';

interface AdoptionFormModalProps {
  pet: Pet | null;
  onClose: () => void;
  onSubmitSuccess: (data: any) => void;
}

export const AdoptionFormModal: React.FC<AdoptionFormModalProps> = ({
  pet,
  onClose,
  onSubmitSuccess,
}) => {
  if (!pet) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: 'Hà Nội',
    address: '',
    housingType: 'Nhà riêng có sân',
    hasWindowScreens: 'Có đầy đủ lưới bảo vệ',
    experience: 'Đang nuôi hoặc từng nuôi thú cưng',
    monthlyBudget: '1.000.000đ - 2.000.000đ',
    commitSpayAndCare: true,
    allowHomeVisit: true,
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sheetSyncStatus, setSheetSyncStatus] = useState<{
    synced: boolean;
    sheetId?: string;
    error?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submissionId = `adopt-${Date.now()}`;
    const sheetId = getSavedSpreadsheetId();
    const token = getCachedAccessToken();

    let synced = false;
    let syncError: string | undefined = undefined;

    if (sheetId && token) {
      try {
        await appendAdoptionToSheet(sheetId, pet, formData, token);
        synced = true;
      } catch (err: any) {
        console.warn('Could not auto append to Google Sheet:', err);
        syncError = err.message || 'Lỗi kết nối Sheet';
      }
    }

    // Always store a backup copy locally
    const submissionRecord: StoredAdoptionSubmission = {
      id: submissionId,
      createdAt: new Date().toISOString(),
      petId: pet.id,
      petName: pet.name,
      petBreed: pet.breed,
      formData: { ...formData },
      syncedToGoogleSheet: synced,
    };
    saveLocalAdoption(submissionRecord);

    setSheetSyncStatus({
      synced,
      sheetId: sheetId || undefined,
      error: syncError,
    });

    setIsSubmitting(false);
    setSubmitted(true);
    onSubmitSuccess({ pet, ...formData, syncedToGoogleSheet: synced });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="bg-[#FAF9F5] w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl border border-[#E3E2DF] my-8 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E3E2DF] flex items-center justify-between bg-[#EFEEEA]/60">
          <div className="flex items-center gap-3">
            <img
              src={pet.images[0]}
              alt={pet.name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
            />
            <div>
              <h3 className="font-extrabold text-xl text-[#24150F]">
                Đơn Nhận Nuôi: {pet.name}
              </h3>
              <p className="text-xs text-[#817470]">
                Mã thú cưng: #{pet.id} • {pet.breed}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-[#24150F] transition-colors"
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
              Đăng Ký Thành Công!
            </h3>
            <p className="text-sm text-[#4F4541] max-w-md mx-auto leading-relaxed">
              Cảm ơn bạn đã mở rộng vòng tay đón bé <strong>{pet.name}</strong>. Hệ thống đã tiếp nhận thông tin đơn đăng ký của bạn. Điều phối viên nhận nuôi của Trạm sẽ liên hệ qua số điện thoại <strong>{formData.phone || 'của bạn'}</strong> trong vòng 24 giờ để trao đổi cụ thể và hẹn lịch gặp bé!
            </p>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="bg-[#974729] text-white px-8 py-3 rounded-full font-bold hover:bg-[#803a1f] transition-all cursor-pointer"
              >
                Hoàn Tất
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* Step Indicators */}
            <div className="flex items-center justify-between text-xs font-bold text-[#817470] border-b border-[#E3E2DF] pb-4">
              <span className={step >= 1 ? 'text-[#974729]' : ''}>1. Thông tin cá nhân</span>
              <span>→</span>
              <span className={step >= 2 ? 'text-[#974729]' : ''}>2. Môi trường sống</span>
              <span>→</span>
              <span className={step >= 3 ? 'text-[#974729]' : ''}>3. Cam kết</span>
            </div>

            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h4 className="text-base font-bold text-[#24150F] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#974729]" />
                  Thông tin người nhận nuôi
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Ví dụ: Nguyễn Minh Anh"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#974729]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                      Số điện thoại (Zalo) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0912 345 678"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#974729]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                      Email liên hệ
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#974729]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                      Tỉnh / Thành phố *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#974729]"
                    >
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Hải Phòng">Hải Phòng</option>
                      <option value="Tỉnh khác">Tỉnh / Thành khác</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                    Địa chỉ hiện tại *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#974729]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.fullName || !formData.phone || !formData.address) {
                        alert('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
                        return;
                      }
                      setStep(2);
                    }}
                    className="bg-[#974729] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#803a1f]"
                  >
                    Tiếp tục →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Living Environment */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <h4 className="text-base font-bold text-[#24150F] flex items-center gap-2">
                  <Home className="w-4 h-4 text-[#974729]" />
                  Điều kiện sống & Kinh nghiệm nuôi
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                    Loại hình nhà ở
                  </label>
                  <select
                    value={formData.housingType}
                    onChange={(e) => setFormData({ ...formData, housingType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                  >
                    <option value="Nhà riêng có sân">Nhà riêng có sân rào</option>
                    <option value="Chung cư cao tầng">Chung cư cao tầng (cho phép nuôi pet)</option>
                    <option value="Nhà trọ / Phòng trọ">Nhà trọ / Căn hộ mini thuê</option>
                    <option value="Nhà phố liền kề">Nhà phố liền kề</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                    Lưới an toàn / Cửa rào chắn (Đặc biệt quan trọng với mèo & cún nhỏ)
                  </label>
                  <select
                    value={formData.hasWindowScreens}
                    onChange={(e) => setFormData({ ...formData, hasWindowScreens: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                  >
                    <option value="Có đầy đủ lưới bảo vệ">Đã có lưới an toàn ban công / cửa sổ</option>
                    <option value="Sẽ lắp đặt trước khi đón">Chưa có nhưng cam kết lắp đặt trước khi đón bé</option>
                    <option value="Nhà kín không cần lưới">Nhà kín, không mở cửa sổ/ban công tự do</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                    Kinh nghiệm nuôi thú cưng
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                  >
                    <option value="Đang nuôi hoặc từng nuôi thú cưng">Đã có kinh nghiệm nuôi nhiều năm</option>
                    <option value="Nuôi lần đầu nhưng đã tìm hiểu kỹ">Lần đầu nhận nuôi, đã tìm hiểu kỹ kiến thức</option>
                    <option value="Gia đình cùng chăm sóc">Cả gia đình cùng có kinh nghiệm chăm sóc</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[#4F4541] hover:text-[#24150F] text-sm font-semibold px-4 py-2.5"
                  >
                    ← Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="bg-[#974729] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#803a1f]"
                  >
                    Tiếp tục →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Commitments & Submit */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <h4 className="text-base font-bold text-[#24150F] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#974729]" />
                  Cam kết trách nhiệm trọn đời
                </h4>

                <div className="space-y-3 bg-[#EFEEEA]/60 p-4 rounded-2xl text-xs text-[#4F4541]">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.commitSpayAndCare}
                      onChange={(e) => setFormData({ ...formData, commitSpayAndCare: e.target.checked })}
                      className="mt-0.5 w-4 h-4 text-[#974729] rounded focus:ring-[#974729]"
                    />
                    <span>
                      Tôi cam kết tiêm phòng định kỳ hàng năm, cho bé ăn uống đủ chất, không thả rông không rọ mõm (với chó) và không bao giờ bỏ rơi hay bán lại bé.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allowHomeVisit}
                      onChange={(e) => setFormData({ ...formData, allowHomeVisit: e.target.checked })}
                      className="mt-0.5 w-4 h-4 text-[#974729] rounded focus:ring-[#974729]"
                    />
                    <span>
                      Tôi đồng ý để đại diện Trạm liên hệ thăm hỏi hoặc nhận ảnh cập nhật tình trạng bé định kỳ trong 6 tháng đầu tiên.
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                    Lời nhắn gửi thêm đến Trạm (tùy chọn)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Hãy chia sẻ lý do bạn chọn bé và mong muốn của bạn..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#974729]"
                  />
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-[#4F4541] hover:text-[#24150F] text-sm font-semibold px-4 py-2.5"
                  >
                    ← Quay lại
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.commitSpayAndCare || !formData.allowHomeVisit}
                    className="bg-[#974729] disabled:opacity-50 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-[#803a1f] shadow-lg shadow-[#974729]/25 flex items-center gap-2"
                  >
                    {isSubmitting ? 'Đang gửi...' : 'Nộp Đơn Nhận Nuôi'}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
