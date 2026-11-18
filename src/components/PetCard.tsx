import React from 'react';
import { Pet } from '../types';
import { Heart, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

interface PetCardProps {
  pet: Pet;
  isFavorite: boolean;
  onToggleFavorite: (petId: string) => void;
  onViewDetails: (pet: Pet) => void;
  onAdoptClick: (pet: Pet) => void;
}

export const PetCard: React.FC<PetCardProps> = ({
  pet,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
  onAdoptClick,
}) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-[#E3E2DF] hover:border-[#974729]/40 card-shadow-hover flex flex-col h-full group">
      {/* Top Image Container */}
      <div className="relative h-64 w-full overflow-hidden bg-[#EFEEEA]">
        <img
          src={pet.images[0]}
          alt={pet.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(pet.id);
          }}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            isFavorite
              ? 'bg-[#974729] text-white shadow-md'
              : 'bg-white/80 text-[#4F4541] hover:bg-white hover:text-[#974729]'
          }`}
          aria-label="Thêm vào yêu thích"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
        </button>

        {/* Urgent Tag */}
        {pet.isUrgent && (
          <div className="absolute top-4 left-4 bg-[#BA1A1A] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Cần Nhà Gấp</span>
          </div>
        )}

        {/* Species & Gender Badge */}
        <div className="absolute bottom-3 left-4 flex gap-2">
          <span className="bg-black/60 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-lg">
            {pet.species === 'dog' ? '🐶 Cún' : '🐱 Mèo'} • {pet.gender}
          </span>
          <span className="bg-white/90 backdrop-blur-md text-[#24150F] text-xs font-semibold px-2.5 py-1 rounded-lg">
            {pet.age}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between bg-white">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 
              onClick={() => onViewDetails(pet)}
              className="text-xl font-bold text-[#24150F] hover:text-[#974729] transition-colors cursor-pointer"
            >
              {pet.name}
            </h3>
            {pet.status === 'medical_care' ? (
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-[#BA1A1A]/15 text-[#BA1A1A]">
                Đang điều trị
              </span>
            ) : pet.status === 'foster_needed' ? (
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-800 font-semibold">
                Cần foster
              </span>
            ) : pet.status === 'pending' ? (
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                Đang xét duyệt
              </span>
            ) : pet.status === 'adopted' ? (
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                Đã có chủ
              </span>
            ) : (
              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-[#87977A]/15 text-[#23311B]">
                Sẵn sàng
              </span>
            )}
          </div>

          <p className="text-xs text-[#817470] mb-3 font-medium">{pet.breed}</p>

          <p className="text-sm text-[#4F4541] line-clamp-2 mb-4 leading-relaxed">
            {pet.story}
          </p>

          {/* Key tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {pet.personality.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-[#EFEEEA] text-[#4F4541] px-2.5 py-1 rounded-md font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-[#817470] border-t border-[#EFEEEA] pt-3 mb-4">
            {pet.vaccinated && (
              <span className="flex items-center gap-1 text-[#23311B] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#87977A]" /> Tiêm phòng
              </span>
            )}
            {pet.spayed && (
              <span className="flex items-center gap-1 text-[#23311B] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#87977A]" /> Triệt sản
              </span>
            )}
            <span className="flex items-center gap-1 ml-auto text-[#817470]">
              <MapPin className="w-3 h-3" /> Hà Nội
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => onViewDetails(pet)}
            className="w-full py-2.5 px-3 rounded-xl border border-[#817470]/30 text-xs sm:text-sm font-semibold text-[#24150F] hover:bg-[#EFEEEA] transition-colors text-center cursor-pointer"
          >
            Chi tiết
          </button>
          <button
            onClick={() => onAdoptClick(pet)}
            className="w-full py-2.5 px-3 rounded-xl bg-[#974729] text-white text-xs sm:text-sm font-semibold hover:bg-[#803a1f] transition-all text-center shadow-sm cursor-pointer"
          >
            Nhận nuôi
          </button>
        </div>
      </div>
    </div>
  );
};
