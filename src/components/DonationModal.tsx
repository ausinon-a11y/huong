import React, { useState } from 'react';
import { DONATION_PACKAGES } from '../data/mockData';
import { X, Heart, QrCode, Copy, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { trackCopyBank, trackDonationCompleted } from '../utils/analytics';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDonated: (amount: number, donorName: string) => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  onDonated,
}) => {
  if (!isOpen) return null;

  const [selectedPackId, setSelectedPackId] = useState<string>('pack-200k');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [isMonthly, setIsMonthly] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedPack = DONATION_PACKAGES.find((p) => p.id === selectedPackId);
  const finalAmount = isCustom
    ? Number(customAmount.replace(/\D/g, '')) || 0
    : selectedPack?.amount || 200000;

  const handleCopy = (text: string, label = 'bank_info') => {
    navigator.clipboard.writeText(text);
    trackCopyBank(label);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmDonation = () => {
    setIsSuccess(true);
    trackDonationCompleted(finalAmount, isMonthly, Boolean(donorName && donorName.trim()));
    onDonated(finalAmount, donorName || 'Nhà Hảo Tâm Ẩn Danh');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="bg-[#FAF9F5] w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl border border-[#E3E2DF] my-8 relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E3E2DF] flex items-center justify-between bg-[#EFEEEA]/80">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#974729] bg-[#974729]/10 px-3 py-1 rounded-full">
              Chung tay vì sự sống
            </span>
            <h3 className="font-extrabold text-2xl text-[#24150F] mt-1.5 flex items-center gap-2">
              Quyên Góp Cho Các Bé <Heart className="w-5 h-5 text-[#974729] fill-[#974729]" />
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-[#24150F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#87977A]/20 text-[#23311B] rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-10 h-10 text-[#87977A]" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#24150F]">
              Trân Trọng Cảm Ơn Tấm Lòng Của Bạn!
            </h3>
            <p className="text-sm text-[#4F4541] max-w-md mx-auto leading-relaxed">
              Món quà <strong>{finalAmount.toLocaleString('vi-VN')} VNĐ</strong> từ bạn sẽ được sử dụng trực tiếp để mua hạt dinh dưỡng, thuốc men và viện phí cứu chữa cho các bé tại Trạm. Mọi khoản thu chi đều được công khai minh bạch hàng tuần.
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="bg-[#974729] text-white px-8 py-3 rounded-full font-bold hover:bg-[#803a1f] transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto p-6 md:p-8 space-y-6">
            {/* Frequency switch */}
            <div className="flex bg-[#EFEEEA] p-1 rounded-2xl max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => setIsMonthly(false)}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  !isMonthly
                    ? 'bg-white text-[#24150F] shadow-sm'
                    : 'text-[#4F4541] hover:text-[#24150F]'
                }`}
              >
                Ủng hộ một lần
              </button>
              <button
                type="button"
                onClick={() => setIsMonthly(true)}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  isMonthly
                    ? 'bg-[#974729] text-white shadow-sm'
                    : 'text-[#4F4541] hover:text-[#24150F]'
                }`}
              >
                Bảo trợ hàng tháng ⭐
              </button>
            </div>

            {/* Donation Packages Grid */}
            <div>
              <label className="block text-xs font-bold uppercase text-[#817470] tracking-wider mb-3">
                Chọn gói đồng hành
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DONATION_PACKAGES.map((pack) => {
                  const isSelected = !isCustom && selectedPackId === pack.id;
                  return (
                    <div
                      key={pack.id}
                      onClick={() => {
                        setIsCustom(false);
                        setSelectedPackId(pack.id);
                      }}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#974729] bg-[#974729]/5 shadow-sm'
                          : 'border-[#E3E2DF] bg-white hover:border-[#817470]'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold text-base text-[#24150F]">{pack.title}</div>
                          <div className="text-xs text-[#817470]">{pack.impact}</div>
                        </div>
                        <span className="font-extrabold text-sm text-[#974729]">
                          {pack.amount.toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                      <p className="text-xs text-[#4F4541] mt-1">{pack.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom amount */}
            <div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCustom(true)}
                  className={`text-xs font-bold px-4 py-2 rounded-xl border transition-colors ${
                    isCustom
                      ? 'bg-[#974729] text-white border-[#974729]'
                      : 'bg-white border-[#E3E2DF] text-[#4F4541] hover:bg-[#EFEEEA]'
                  }`}
                >
                  Nhập số tiền khác
                </button>
                {isCustom && (
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Nhập số tiền (VNĐ)..."
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#817470]/40 bg-white text-sm focus:ring-2 focus:ring-[#974729]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Bank Transfer & QR Details */}
            <div className="bg-[#EFEEEA] p-5 rounded-2xl border border-[#E3E2DF] space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#24150F] flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-[#974729]" />
                  Thông tin chuyển khoản nhanh (VietQR)
                </span>
                <span className="text-xs font-semibold text-[#87977A] bg-[#87977A]/15 px-2 py-0.5 rounded-md">
                  Miễn phí giao dịch
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-[#E3E2DF] space-y-1.5">
                  <div className="text-[#817470]">Ngân hàng:</div>
                  <div className="font-bold text-[#24150F]">Vietcombank - Chi nhánh Hà Nội</div>
                  
                  <div className="text-[#817470] pt-1">Số tài khoản:</div>
                  <div className="flex items-center justify-between font-mono font-bold text-sm text-[#974729]">
                    <span>0451 0004 24413</span>
                    <button
                      onClick={() => handleCopy('0451000424413', 'account_number')}
                      className="text-xs text-[#4F4541] hover:text-[#974729] flex items-center gap-1 font-sans cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Đã sao chép' : 'Sao chép'}
                    </button>
                  </div>

                  <div className="text-[#817470] pt-1">Chủ tài khoản:</div>
                  <div className="font-bold text-[#24150F]">CPAPS (Trung Tâm NC Bảo Vệ Động Vật Nuôi)</div>

                  <div className="text-[#817470] pt-1">Mã số thuế:</div>
                  <div className="font-mono font-bold text-[#24150F]">0108067634</div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#E3E2DF] flex flex-col justify-center items-center text-center">
                  <div className="w-32 h-32 bg-white border border-[#E3E2DF] rounded-xl flex items-center justify-center p-1 mb-1.5 overflow-hidden shadow-xs">
                    <img 
                      src={`https://img.vietqr.io/image/vietcombank-0451000424413-compact2.png?amount=${finalAmount}&addInfo=${encodeURIComponent('QG ' + (donorName ? donorName.replace(/\s+/g, '') : 'CPAPS'))}&accountName=CPAPS`}
                      alt="VietQR Vietcombank CPAPS"
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-[11px] text-[#817470]">Quét mã Vietcombank (VietQR)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                  Nội dung chuyển khoản gợi ý:
                </label>
                <div className="bg-white px-3.5 py-2 rounded-xl border border-[#E3E2DF] text-xs font-mono font-semibold text-[#24150F] flex items-center justify-between">
                  <span>QG {donorName ? donorName.replace(/\s+/g, '') : 'CPAPS'} {finalAmount > 0 ? finalAmount : ''}</span>
                  <button
                    onClick={() => handleCopy(`QG ${donorName ? donorName.replace(/\s+/g, '') : 'CPAPS'} ${finalAmount > 0 ? finalAmount : ''}`, 'transfer_memo')}
                    className="text-[#974729] hover:underline cursor-pointer"
                  >
                    Sao chép
                  </button>
                </div>
              </div>
            </div>

            {/* Optional Donor Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                  Tên của bạn (hoặc để trống để ẩn danh)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bạn Lan Hương"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                  Lời nhắn gửi các bé
                </label>
                <input
                  type="text"
                  placeholder="Chúc các bé sớm có mái ấm yêu thương!"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                />
              </div>
            </div>

            {/* Submit / Confirm */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleConfirmDonation}
                className="w-full bg-[#974729] text-white py-4 rounded-full font-extrabold text-base hover:bg-[#803a1f] shadow-lg shadow-[#974729]/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Xác Nhận Đã Quyên Góp {finalAmount.toLocaleString('vi-VN')} đ</span>
                <Heart className="w-4 h-4 fill-white" />
              </button>
              <p className="text-center text-xs text-[#817470] mt-2 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#87977A]" /> 100% kinh phí được sử dụng vì phúc lợi động vật
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
