import React, { useState } from 'react';
import { LostFoundPet } from '../types';
import { Search, MapPin, Phone, Calendar, PlusCircle, AlertCircle, CheckCircle2, Tag } from 'lucide-react';

interface LostFoundViewProps {
  items: LostFoundPet[];
  onOpenReportModal: () => void;
}

export const LostFoundView: React.FC<LostFoundViewProps> = ({
  items,
  onOpenReportModal,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<'all' | 'dog' | 'cat'>('all');

  const filteredItems = items.filter((item) => {
    if (activeTab !== 'all' && item.type !== activeTab) return false;
    if (selectedSpecies !== 'all' && item.species !== selectedSpecies) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.petName?.toLowerCase().includes(q) || false;
      const matchBreed = item.breed.toLowerCase().includes(q);
      const matchLoc = item.lastSeenLocation.toLowerCase().includes(q);
      const matchColor = item.color.toLowerCase().includes(q);
      if (!matchName && !matchBreed && !matchLoc && !matchColor) return false;
    }
    return true;
  });

  return (
    <div className="py-8 px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto space-y-10">
      {/* Header Banner */}
      <div className="bg-[#EFEEEA] p-8 md:p-12 rounded-[2.5rem] border border-[#E3E2DF] text-center max-w-4xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#974729] bg-[#974729]/10 px-3.5 py-1.5 rounded-full">
          Mạng lưới tìm kiếm cộng đồng
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#24150F] mt-3">
          Tìm Kiếm Thú Cưng Thất Lạc
        </h1>
        <p className="text-sm sm:text-base text-[#4F4541] mt-3 max-w-2xl mx-auto leading-relaxed">
          Đăng tin tìm kiếm hoặc thông báo khi bạn phát hiện một bé chó mèo đi lạc. Mạng lưới hàng nghìn tình nguyện viên sẽ hỗ trợ lan tỏa ngay lập tức.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button
            onClick={onOpenReportModal}
            className="bg-[#974729] text-white px-8 py-3.5 rounded-full font-bold text-base hover:bg-[#803a1f] shadow-lg shadow-[#974729]/20 flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Đăng Tin Mới (Miễn Phí)</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-[#E3E2DF] shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Main Filter Type */}
          <div className="flex bg-[#EFEEEA] p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-[#24150F] shadow-sm'
                  : 'text-[#4F4541] hover:text-[#24150F]'
              }`}
            >
              Tất cả tin ({items.length})
            </button>
            <button
              onClick={() => setActiveTab('lost')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'lost'
                  ? 'bg-[#974729] text-white shadow-sm'
                  : 'text-[#4F4541] hover:text-[#24150F]'
              }`}
            >
              🚨 Bé đang thất lạc ({items.filter((i) => i.type === 'lost').length})
            </button>
            <button
              onClick={() => setActiveTab('found')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'found'
                  ? 'bg-[#23311B] text-white shadow-sm'
                  : 'text-[#4F4541] hover:text-[#24150F]'
              }`}
            >
              🏠 Tìm thấy đi lạc ({items.filter((i) => i.type === 'found').length})
            </button>
          </div>

          {/* Species */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#817470]">Loài:</span>
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-[#817470]/30 bg-[#FAF9F5] text-xs font-semibold text-[#24150F]"
            >
              <option value="all">Tất cả</option>
              <option value="dog">Chó 🐶</option>
              <option value="cat">Mèo 🐱</option>
            </select>
          </div>

          {/* Search box */}
          <div className="relative flex-1 min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo khu vực (Cầu Giấy, Tây Hồ...), màu lông, giống..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#817470]/30 text-xs sm:text-sm bg-[#FAF9F5] focus:outline-none focus:ring-2 focus:ring-[#974729]"
            />
            <Search className="w-4 h-4 text-[#817470] absolute left-3.5 top-3" />
          </div>
        </div>
      </div>

      {/* Grid of Lost & Found Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isLost = item.type === 'lost';
          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E3E2DF] card-shadow-hover flex flex-col justify-between"
            >
              <div className="relative h-60 w-full overflow-hidden bg-[#EFEEEA]">
                <img
                  src={item.image}
                  alt={item.petName || item.breed}
                  className="w-full h-full object-cover"
                />
                
                {/* Type Badge */}
                <div className="absolute top-4 left-4">
                  {isLost ? (
                    <span className="bg-[#BA1A1A] text-white text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                      <AlertCircle className="w-3.5 h-3.5" /> THẤT LẠC
                    </span>
                  ) : (
                    <span className="bg-[#23311B] text-white text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#87977A]" /> TÌM THẤY BÉ
                    </span>
                  )}
                </div>

                {item.reward && (
                  <div className="absolute bottom-3 right-4 bg-[#FAF9F5]/90 backdrop-blur-md text-[#974729] font-extrabold text-xs px-3 py-1 rounded-lg border border-[#974729]/30">
                    Hậu tạ: {item.reward}
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-xl text-[#24150F]">
                      {item.petName ? item.petName : `Bé ${item.species === 'dog' ? 'chó' : 'mèo'} đi lạc`}
                    </h3>
                    <span className="text-xs font-medium text-[#817470] bg-[#EFEEEA] px-2.5 py-1 rounded-md">
                      {item.breed}
                    </span>
                  </div>

                  <p className="text-xs text-[#4F4541] leading-relaxed">
                    <strong>Đặc điểm:</strong> {item.color}. {item.collarDescription ? `Đeo ${item.collarDescription}.` : ''}
                  </p>

                  <div className="space-y-1.5 text-xs text-[#4F4541] pt-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#974729] shrink-0" />
                      <span className="font-semibold text-[#24150F]">{item.lastSeenLocation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#817470] shrink-0" />
                      <span>Ngày: {item.lastSeenDate}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#4F4541] italic bg-[#EFEEEA]/50 p-3 rounded-xl">
                    "{item.description}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EFEEEA] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#817470] block">Liên hệ:</span>
                    <span className="text-xs font-bold text-[#24150F]">{item.contactName}</span>
                  </div>
                  <a
                    href={`tel:${item.contactPhone}`}
                    className="bg-[#974729] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#803a1f] transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{item.contactPhone}</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
