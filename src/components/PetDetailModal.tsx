import React, { useState } from 'react';
import { Pet } from '../types';
import { X, Heart, ShieldCheck, MapPin, Calendar, Activity, Info, Check, AlertCircle } from 'lucide-react';

interface PetDetailModalProps {
  pet: Pet | null;
  onClose: () => void;
  onAdoptClick: (pet: Pet) => void;
  isFavorite: boolean;
  onToggleFavorite: (petId: string) => void;
}

export const PetDetailModal: React.FC<PetDetailModalProps> = ({
  pet,
  onClose,
  onAdoptClick,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!pet) return null;
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div 
        className="bg-[#FAF9F5] w-full max-w-3xl rounded-[2rem] overflow-hidden shadow-2xl border border-[#E3E2DF] my-8 relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#24150F] flex items-center justify-center shadow-md transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Gallery Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div>
              <div className="h-72 sm:h-80 rounded-2xl overflow-hidden bg-[#EFEEEA] relative shadow-inner">
                <img
                  src={pet.images[activeImageIndex] || pet.images[0]}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
                {pet.isUrgent && (
                  <div className="absolute top-3 left-3 bg-[#BA1A1A] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Cần nhà gấp</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {pet.images.length > 1 && (
                <div className="flex gap-3 mt-3">
                  {pet.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx
                          ? 'border-[#974729] scale-105 shadow-sm'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#974729] bg-[#974729]/10 px-3 py-1 rounded-full">
                    {pet.species === 'dog' ? 'Chó' : 'Mèo'} • ID #{pet.id}
                  </span>
                  <button
                    onClick={() => onToggleFavorite(pet.id)}
                    className={`p-2 rounded-full border transition-colors ${
                      isFavorite 
                        ? 'bg-[#974729] text-white border-[#974729]' 
                        : 'border-[#817470]/30 text-[#4F4541] hover:text-[#974729]'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                  </button>
                </div>

                <h2 className="text-3xl font-extrabold text-[#24150F]">{pet.name}</h2>
                <p className="text-sm font-medium text-[#817470]">{pet.breed}</p>

                {/* Quick spec pills */}
                <div className="grid grid-cols-3 gap-2 my-4 text-center">
                  <div className="bg-[#EFEEEA] p-2.5 rounded-xl">
                    <span className="text-xs text-[#817470] block">Tuổi</span>
                    <span className="text-sm font-bold text-[#24150F]">{pet.age}</span>
                  </div>
                  <div className="bg-[#EFEEEA] p-2.5 rounded-xl">
                    <span className="text-xs text-[#817470] block">Giới tính</span>
                    <span className="text-sm font-bold text-[#24150F]">{pet.gender}</span>
                  </div>
                  <div className="bg-[#EFEEEA] p-2.5 rounded-xl">
                    <span className="text-xs text-[#817470] block">Cân nặng</span>
                    <span className="text-sm font-bold text-[#24150F]">{pet.weight}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-[#4F4541]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#974729]" />
                    <span>{pet.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#974729]" />
                    <span>Ngày vào trạm: {pet.rescueDate}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons in Header */}
              <button
                onClick={() => {
                  onClose();
                  onAdoptClick(pet);
                }}
                className="w-full bg-[#974729] text-white py-3.5 rounded-full font-bold text-base hover:bg-[#803a1f] shadow-lg shadow-[#974729]/25 transition-all"
              >
                Đăng Ký Nhận Nuôi {pet.name}
              </button>
            </div>
          </div>

          {/* Detailed Story & Personality */}
          <div className="border-t border-[#E3E2DF] pt-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#24150F] mb-2 flex items-center gap-2">
                <Info className="w-5 h-5 text-[#974729]" />
                Câu chuyện của bé
              </h3>
              <p className="text-base text-[#4F4541] leading-relaxed bg-[#EFEEEA]/60 p-4 rounded-2xl">
                {pet.story}
              </p>
            </div>

            {/* Health & Medical Checklist */}
            <div>
              <h3 className="text-lg font-bold text-[#24150F] mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#23311B]" />
                Tình trạng sức khỏe & Y tế
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${pet.vaccinated ? 'bg-[#87977A]/10 border-[#87977A]/30 text-[#23311B]' : 'bg-[#EFEEEA] border-[#E3E2DF]'}`}>
                  <Check className="w-5 h-5 text-[#87977A]" />
                  <div>
                    <div className="font-semibold text-sm">Đã tiêm phòng</div>
                    <div className="text-xs text-[#4F4541]">Đầy đủ sổ tiêm</div>
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${pet.spayed ? 'bg-[#87977A]/10 border-[#87977A]/30 text-[#23311B]' : 'bg-[#EFEEEA] border-[#E3E2DF]'}`}>
                  <Check className="w-5 h-5 text-[#87977A]" />
                  <div>
                    <div className="font-semibold text-sm">Đã triệt sản</div>
                    <div className="text-xs text-[#4F4541]">Sức khỏe ổn định</div>
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${pet.dewormed ? 'bg-[#87977A]/10 border-[#87977A]/30 text-[#23311B]' : 'bg-[#EFEEEA] border-[#E3E2DF]'}`}>
                  <Check className="w-5 h-5 text-[#87977A]" />
                  <div>
                    <div className="font-semibold text-sm">Đã tẩy giun & ve</div>
                    <div className="text-xs text-[#4F4541]">Định kỳ hàng tháng</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personality & Compatibility */}
            <div>
              <h3 className="text-lg font-bold text-[#24150F] mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#974729]" />
                Tính cách & Độ hòa hợp
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {pet.personality.map((trait, idx) => (
                  <span
                    key={idx}
                    className="bg-[#FAF9F5] border border-[#817470]/30 text-[#24150F] font-semibold text-sm px-3.5 py-1.5 rounded-full"
                  >
                    ✨ {trait}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="bg-[#EFEEEA] p-3 rounded-xl flex items-center justify-between">
                  <span className="text-[#4F4541]">Thân thiện với trẻ em:</span>
                  <span className="font-bold text-[#24150F]">{pet.goodWithKids ? 'Rất thích trẻ em 👶' : 'Cần người lớn giám sát'}</span>
                </div>
                <div className="bg-[#EFEEEA] p-3 rounded-xl flex items-center justify-between">
                  <span className="text-[#4F4541]">Hòa đồng thú cưng khác:</span>
                  <span className="font-bold text-[#24150F]">{pet.goodWithOtherPets ? 'Hòa thuận 🐕🐱' : 'Nên nuôi một mình'}</span>
                </div>
              </div>
            </div>

            {/* Special Needs & Care */}
            {pet.specialNeeds && pet.specialNeeds.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-[#24150F] mb-3 flex items-center gap-2">
                  <span className="text-base">🩺</span>
                  Lưu ý chăm sóc đặc biệt
                </h3>
                <ul className="space-y-1.5 bg-[#FAF9F5] p-4 rounded-2xl border border-[#E3E2DF] text-sm text-[#4F4541]">
                  {pet.specialNeeds.map((need, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#974729] font-bold">•</span>
                      <span>{need}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Adoption Note / Foster message */}
            {(pet.adoptionNote || pet.supportMessage) && (
              <div className="bg-[#974729]/10 border border-[#974729]/20 p-4 rounded-2xl space-y-2">
                <h4 className="font-bold text-sm text-[#974729] flex items-center gap-1.5">
                  <Heart className="w-4 h-4 fill-[#974729]" />
                  Lời nhắn từ Trạm tới người nhận nuôi / foster
                </h4>
                <p className="text-sm text-[#24150F] leading-relaxed">
                  {pet.adoptionNote || pet.supportMessage}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
