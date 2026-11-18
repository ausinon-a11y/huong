import React, { useState } from 'react';
import { LostFoundPet } from '../types';
import { X, Search, CheckCircle2, MapPin, Tag, Phone } from 'lucide-react';

interface ReportLostPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitLostFound: (data: LostFoundPet) => void;
}

export const ReportLostPetModal: React.FC<ReportLostPetModalProps> = ({
  isOpen,
  onClose,
  onSubmitLostFound,
}) => {
  if (!isOpen) return null;

  const [type, setType] = useState<'lost' | 'found'>('lost');
  const [formData, setFormData] = useState({
    petName: '',
    species: 'dog' as 'dog' | 'cat',
    breed: '',
    color: '',
    collarDescription: '',
    lastSeenLocation: '',
    lastSeenDate: new Date().toISOString().split('T')[0],
    contactName: '',
    contactPhone: '',
    reward: '',
    image: '',
    description: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: LostFoundPet = {
      id: `lf-${Date.now()}`,
      type,
      petName: type === 'lost' ? (formData.petName || 'Bé cưng') : undefined,
      species: formData.species,
      breed: formData.breed || (formData.species === 'dog' ? 'Chó lai' : 'Mèo lai'),
      color: formData.color,
      collarDescription: formData.collarDescription,
      lastSeenLocation: formData.lastSeenLocation,
      lastSeenDate: formData.lastSeenDate,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
      reward: formData.reward,
      image: formData.image || (formData.species === 'dog' ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80'),
      description: formData.description,
      isResolved: false,
    };

    onSubmitLostFound(item);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="bg-[#FAF9F5] w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl border border-[#E3E2DF] my-8 relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E3E2DF] flex items-center justify-between bg-[#EFEEEA]/70">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#974729] bg-[#974729]/10 px-3 py-1 rounded-full">
              Mạng lưới tìm kiếm cộng đồng
            </span>
            <h3 className="font-extrabold text-2xl text-[#24150F] mt-1">
              {type === 'lost' ? 'Đăng Tin Thất Lạc Thú Cưng' : 'Báo Tìm Thấy Bé Đi Lạc'}
            </h3>
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
              Đã Đăng Tin Lên Hệ Thống!
            </h3>
            <p className="text-sm text-[#4F4541] max-w-md mx-auto leading-relaxed">
              Thông tin đã được chia sẻ tới mạng lưới tình nguyện viên và nhóm bảo vệ động vật tại khu vực <strong>{formData.lastSeenLocation}</strong>.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="bg-[#974729] text-white px-8 py-3 rounded-full font-bold hover:bg-[#803a1f] transition-all"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 md:p-8 space-y-5">
            {/* Type selector */}
            <div className="flex bg-[#EFEEEA] p-1 rounded-2xl max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => setType('lost')}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  type === 'lost'
                    ? 'bg-[#974729] text-white shadow-sm'
                    : 'text-[#4F4541] hover:text-[#24150F]'
                }`}
              >
                Tôi bị mất thú cưng
              </button>
              <button
                type="button"
                onClick={() => setType('found')}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  type === 'found'
                    ? 'bg-[#23311B] text-white shadow-sm'
                    : 'text-[#4F4541] hover:text-[#24150F]'
                }`}
              >
                Tôi tìm thấy bé đi lạc
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {type === 'lost' && (
                <div>
                  <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                    Tên của bé *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.petName}
                    onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                    placeholder="Ví dụ: Cún Lu, Mèo Miu..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                  Loài
                </label>
                <select
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                >
                  <option value="dog">Chó 🐶</option>
                  <option value="cat">Mèo 🐱</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                  Giống thú cưng
                </label>
                <input
                  type="text"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  placeholder="Ví dụ: Poodle, Corgi, Mèo mướp ta..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                  Màu lông & Đặc điểm nhận dạng *
                </label>
                <input
                  type="text"
                  required
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="Ví dụ: Lông vàng đốm trắng ở ngực, cụt đuôi..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                  Vòng cổ / Thẻ tên (nếu có)
                </label>
                <input
                  type="text"
                  value={formData.collarDescription}
                  onChange={(e) => setFormData({ ...formData, collarDescription: e.target.value })}
                  placeholder="Ví dụ: Vòng đỏ có chuông, không có vòng..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                  Ngày thất lạc / tìm thấy *
                </label>
                <input
                  type="date"
                  required
                  value={formData.lastSeenDate}
                  onChange={(e) => setFormData({ ...formData, lastSeenDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                Khu vực thất lạc / tìm thấy *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.lastSeenLocation}
                  onChange={(e) => setFormData({ ...formData, lastSeenLocation: e.target.value })}
                  placeholder="Ví dụ: Gần cổng công viên Cầu Giấy, Đường Duy Tân, Hà Nội..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                />
                <MapPin className="w-4 h-4 text-[#974729] absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                  Tên người liên hệ *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="Anh/Chị..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                  Số điện thoại liên hệ *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="09xx xxx xxx"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                />
              </div>
            </div>

            {type === 'lost' && (
              <div>
                <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                  Tiền chuộc / Hậu tạ (tùy chọn)
                </label>
                <input
                  type="text"
                  value={formData.reward}
                  onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                  placeholder="Ví dụ: 3.000.000 VNĐ hoặc Xin hậu tạ và cảm ơn"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#4F4541] mb-1">
                Mô tả chi tiết & Hoàn cảnh xảy ra
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Bé rất nhút nhát hoặc tính cách thế nào, nếu phát hiện nên làm gì..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#817470]/40 bg-white text-sm"
              />
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
                className="bg-[#974729] text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-[#803a1f] shadow-lg shadow-[#974729]/20"
              >
                Đăng Tin Tìm Kiếm
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
