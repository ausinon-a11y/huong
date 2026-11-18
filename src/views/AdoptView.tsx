import React, { useState, useMemo } from 'react';
import { Pet } from '../types';
import { PetCard } from '../components/PetCard';
import { Search, Filter, Sparkles, Check, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface AdoptViewProps {
  pets: Pet[];
  favorites: string[];
  onToggleFavorite: (petId: string) => void;
  onViewPetDetails: (pet: Pet) => void;
  onAdoptClick: (pet: Pet) => void;
  onOpenDonate: () => void;
}

export const AdoptView: React.FC<AdoptViewProps> = ({
  pets,
  favorites,
  onToggleFavorite,
  onViewPetDetails,
  onAdoptClick,
  onOpenDonate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<'all' | 'dog' | 'cat'>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | 'Đực' | 'Cái'>('all');
  const [onlyUrgent, setOnlyUrgent] = useState(false);
  const [onlySpayed, setOnlySpayed] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'urgent'>('newest');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredPets = useMemo(() => {
    return pets
      .filter((pet) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = pet.name.toLowerCase().includes(q);
          const matchBreed = pet.breed.toLowerCase().includes(q);
          const matchStory = pet.story.toLowerCase().includes(q);
          const matchTags = pet.personality.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchBreed && !matchStory && !matchTags) return false;
        }

        // Species
        if (selectedSpecies !== 'all' && pet.species !== selectedSpecies) return false;

        // Gender
        if (selectedGender !== 'all' && pet.gender !== selectedGender) return false;

        // Urgent
        if (onlyUrgent && !pet.isUrgent) return false;

        // Spayed
        if (onlySpayed && !pet.spayed) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'urgent') {
          if (a.isUrgent && !b.isUrgent) return -1;
          if (!a.isUrgent && b.isUrgent) return 1;
        }
        return 0;
      });
  }, [pets, searchQuery, selectedSpecies, selectedGender, onlyUrgent, onlySpayed, sortBy]);

  const faqs = [
    {
      q: 'Chi phí nhận nuôi tại Trạm là bao nhiêu?',
      a: 'Trạm hoạt động phi lợi nhuận. Bạn chỉ cần hỗ trợ một khoản đóng góp nhỏ (tùy tâm hoặc 200k - 500k) để bù đắp một phần chi phí tiêm phòng, tẩy giun và triệt sản cho các bé tiếp theo.',
    },
    {
      q: 'Nếu tôi ở chung cư thì có được nhận nuôi cún/mèo không?',
      a: 'Hoàn toàn được! Miễn là chung cư của bạn cho phép nuôi thú cưng và bạn đã trang bị lưới an toàn tại ban công/cửa sổ (đặc biệt quan trọng với mèo để tránh té ngã).',
    },
    {
      q: 'Trạm có hỗ trợ vận chuyển bé đến các tỉnh thành khác không?',
      a: 'Để đảm bảo an toàn sức khỏe cho bé, Trạm ưu tiên người nhận nuôi đến tận nơi gặp mặt và đón bé trực tiếp tại Hà Nội. Với các tỉnh lân cận, Trạm sẽ xem xét hỗ trợ điều phối xe an toàn.',
    },
    {
      q: 'Nếu sau khi nhận nuôi bé không hòa nhập được thì phải làm sao?',
      a: 'Trạm luôn có đội ngũ tư vấn hành vi hỗ trợ bạn trong suốt quá trình nuôi. Trong trường hợp bất khả kháng, bạn luôn có thể đưa bé quay trở về Trạm mà không bị phán xét.',
    },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto space-y-12">
      {/* Header Banner */}
      <div className="bg-[#EFEEEA] p-8 md:p-12 rounded-[2.5rem] border border-[#E3E2DF] text-center max-w-4xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#974729] bg-[#974729]/10 px-3.5 py-1.5 rounded-full">
          Kết nối những trái tim đồng điệu
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#24150F] mt-3">
          Danh Sách Thú Cưng Tìm Mái Ấm
        </h1>
        <p className="text-sm sm:text-base text-[#4F4541] mt-3 max-w-2xl mx-auto leading-relaxed">
          Tất cả các bé dưới đây đều đã được khám sức khỏe, xét nghiệm giảm bạch cầu/care, tiêm phòng và triệt sản theo đúng lứa tuổi.
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-xl mx-auto relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, giống loài (Poodle, Corgi, Mèo mướp...), tính cách..."
            className="w-full pl-12 pr-4 py-4 rounded-full border border-[#817470]/30 bg-white text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#974729]"
          />
          <Search className="w-5 h-5 text-[#817470] absolute left-4.5 top-4.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-4 text-xs font-bold text-[#817470] hover:text-[#24150F] bg-gray-100 px-2 py-1 rounded-full"
            >
              Xóa
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-6 rounded-3xl border border-[#E3E2DF] shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Species tabs */}
          <div className="flex bg-[#EFEEEA] p-1 rounded-2xl">
            <button
              onClick={() => setSelectedSpecies('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedSpecies === 'all'
                  ? 'bg-white text-[#24150F] shadow-sm'
                  : 'text-[#4F4541] hover:text-[#24150F]'
              }`}
            >
              Tất cả loài
            </button>
            <button
              onClick={() => setSelectedSpecies('dog')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedSpecies === 'dog'
                  ? 'bg-[#974729] text-white shadow-sm'
                  : 'text-[#4F4541] hover:text-[#24150F]'
              }`}
            >
              🐶 Chó ({pets.filter((p) => p.species === 'dog').length})
            </button>
            <button
              onClick={() => setSelectedSpecies('cat')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedSpecies === 'cat'
                  ? 'bg-[#974729] text-white shadow-sm'
                  : 'text-[#4F4541] hover:text-[#24150F]'
              }`}
            >
              🐱 Mèo ({pets.filter((p) => p.species === 'cat').length})
            </button>
          </div>

          {/* Gender Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#817470]">Giới tính:</span>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-[#817470]/30 bg-[#FAF9F5] text-xs font-semibold text-[#24150F]"
            >
              <option value="all">Tất cả</option>
              <option value="Đực">Đực ♂</option>
              <option value="Cái">Cái ♀</option>
            </select>
          </div>

          {/* Quick Checkbox Toggles */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <label className="flex items-center gap-1.5 cursor-pointer text-[#BA1A1A]">
              <input
                type="checkbox"
                checked={onlyUrgent}
                onChange={(e) => setOnlyUrgent(e.target.checked)}
                className="w-4 h-4 rounded text-[#BA1A1A] focus:ring-[#BA1A1A]"
              />
              <span>🚨 Cần nhà gấp</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-[#23311B]">
              <input
                type="checkbox"
                checked={onlySpayed}
                onChange={(e) => setOnlySpayed(e.target.checked)}
                className="w-4 h-4 rounded text-[#87977A] focus:ring-[#87977A]"
              />
              <span>✂️ Đã triệt sản</span>
            </label>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-semibold text-[#817470]">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-[#817470]/30 bg-[#FAF9F5] text-xs font-semibold text-[#24150F]"
            >
              <option value="newest">Mới vào trạm nhất</option>
              <option value="urgent">Trường hợp ưu tiên cứu trợ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#4F4541]">
          Tìm thấy <span className="text-[#974729] font-extrabold">{filteredPets.length}</span> bé phù hợp
        </p>
      </div>

      {/* Pet Catalog Grid */}
      {filteredPets.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-[#E3E2DF] space-y-4">
          <div className="w-16 h-16 bg-[#EFEEEA] rounded-full flex items-center justify-center mx-auto text-3xl">
            🔍
          </div>
          <h3 className="text-xl font-bold text-[#24150F]">Không tìm thấy bé nào phù hợp với bộ lọc</h3>
          <p className="text-sm text-[#817470] max-w-md mx-auto">
            Hãy thử điều chỉnh lại từ khóa hoặc xóa bớt tiêu chí lọc để xem thêm các bé khác nhé!
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSpecies('all');
              setSelectedGender('all');
              setOnlyUrgent(false);
              setOnlySpayed(false);
            }}
            className="bg-[#974729] text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-[#803a1f]"
          >
            Đặt lại tất cả bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              isFavorite={favorites.includes(pet.id)}
              onToggleFavorite={onToggleFavorite}
              onViewDetails={onViewPetDetails}
              onAdoptClick={onAdoptClick}
            />
          ))}
        </div>
      )}

      {/* FAQ Section */}
      <div className="bg-[#EFEEEA] p-8 md:p-12 rounded-[2.5rem] border border-[#E3E2DF] space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#24150F]">
            Những Câu Hỏi Thường Gặp Về Nhận Nuôi
          </h3>
          <p className="text-sm text-[#4F4541] mt-1">
            Giải đáp mọi thắc mắc giúp bạn chuẩn bị tốt nhất để đón bé về nhà
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E3E2DF] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-base text-[#24150F] flex items-center justify-between gap-4"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#974729] shrink-0" />
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#817470]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#817470]" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-[#4F4541] leading-relaxed border-t border-[#EFEEEA] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
