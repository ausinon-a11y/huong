import React from 'react';
import { Pet } from '../types';
import { X, Trash2, ArrowRight, Heart, Sparkles } from 'lucide-react';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Pet[];
  onRemoveFavorite: (petId: string) => void;
  onSelectPet: (pet: Pet) => void;
  onAdoptPet: (pet: Pet) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onSelectPet,
  onAdoptPet,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-[#FAF9F5] w-full max-w-md h-full shadow-2xl flex flex-col border-l border-[#E3E2DF] animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E3E2DF] flex items-center justify-between bg-[#EFEEEA]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#974729] fill-[#974729]" />
            <h3 className="font-extrabold text-xl text-[#24150F]">
              Thú Cưng Yêu Thích ({favorites.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-[#24150F]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {favorites.length === 0 ? (
            <div className="text-center py-16 text-[#817470] space-y-3">
              <div className="w-16 h-16 bg-[#EFEEEA] rounded-full flex items-center justify-center mx-auto text-2xl">
                🐾
              </div>
              <p className="font-semibold text-[#24150F]">Chưa có bé nào trong danh sách</p>
              <p className="text-xs text-[#817470] max-w-xs mx-auto">
                Nhấn vào biểu tượng trái tim trên các thẻ thú cưng để lưu lại và dễ dàng so sánh nhé!
              </p>
            </div>
          ) : (
            favorites.map((pet) => (
              <div
                key={pet.id}
                className="bg-white p-4 rounded-2xl border border-[#E3E2DF] hover:border-[#974729]/40 transition-all flex gap-3 items-center group shadow-sm"
              >
                <img
                  src={pet.images[0]}
                  alt={pet.name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 cursor-pointer"
                  onClick={() => {
                    onClose();
                    onSelectPet(pet);
                  }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4
                      onClick={() => {
                        onClose();
                        onSelectPet(pet);
                      }}
                      className="font-bold text-[#24150F] hover:text-[#974729] truncate cursor-pointer text-base"
                    >
                      {pet.name}
                    </h4>
                    <button
                      onClick={() => onRemoveFavorite(pet.id)}
                      className="text-[#817470] hover:text-[#BA1A1A] p-1 transition-colors"
                      title="Xóa khỏi yêu thích"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-[#817470] truncate">{pet.breed}</p>
                  <p className="text-xs text-[#4F4541] font-medium mt-1">
                    {pet.age} • {pet.gender}
                  </p>

                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        onAdoptPet(pet);
                      }}
                      className="text-xs bg-[#974729] text-white px-3 py-1 rounded-lg font-semibold hover:bg-[#803a1f] transition-all"
                    >
                      Đăng ký nhận nuôi
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="p-6 border-t border-[#E3E2DF] bg-[#EFEEEA]/60">
            <p className="text-xs text-[#817470] mb-3 text-center">
              Các bé luôn mong chờ một mái ấm yêu thương từ bạn
            </p>
            <button
              onClick={onClose}
              className="w-full bg-[#24150F] text-white py-3 rounded-full font-bold text-sm hover:bg-[#3b2922] transition-colors"
            >
              Tiếp tục tìm kiếm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
