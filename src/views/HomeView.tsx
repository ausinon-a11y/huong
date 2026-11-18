import React, { useState } from 'react';
import { HeroSection } from '../components/HeroSection';
import { BentoSection } from '../components/BentoSection';
import { PetCard } from '../components/PetCard';
import { NavTab, Pet, Story, RescueReport } from '../types';
import { trackHotlineClick } from '../utils/analytics';
import { 
  Heart, 
  ArrowRight, 
  CheckCircle2, 
  PhoneCall, 
  ShieldCheck, 
  Users, 
  Home as HomeIcon,
  AlertCircle,
  RefreshCw,
  BookOpen
} from 'lucide-react';

interface HomeViewProps {
  pets: Pet[];
  stories: Story[];
  storiesLoading?: boolean;
  storiesError?: string | null;
  onRetryStories?: () => void;
  recentRescues: RescueReport[];
  favorites: string[];
  onToggleFavorite: (petId: string) => void;
  onViewPetDetails: (pet: Pet) => void;
  onAdoptClick: (pet: Pet) => void;
  onSelectTab: (tab: NavTab) => void;
  onOpenDonate: () => void;
  onOpenReportRescue: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  pets,
  stories,
  storiesLoading = false,
  storiesError = null,
  onRetryStories,
  recentRescues,
  favorites,
  onToggleFavorite,
  onViewPetDetails,
  onAdoptClick,
  onSelectTab,
  onOpenDonate,
  onOpenReportRescue,
}) => {
  const [speciesFilter, setSpeciesFilter] = useState<'all' | 'dog' | 'cat'>('all');

  const filteredPets = pets.filter((p) => {
    if (speciesFilter === 'all') return true;
    return p.species === speciesFilter;
  });

  return (
    <div className="space-y-4">
      {/* 1. Exact Hero Section */}
      <HeroSection
        onFindCompanion={() => onSelectTab('adopt')}
        onLearnMore={() => {
          const el = document.getElementById('features-bento');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. Exact Bento Section */}
      <BentoSection onSelectTab={onSelectTab} />

      {/* 3. Featured Pets Section (Nhận Nuôi Nổi Bật) */}
      <section className="py-16 px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#974729] bg-[#974729]/10 px-3 py-1 rounded-full">
              Những trái tim đang chờ bạn
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#24150F] mt-2">
              Các Bé Đang Tìm Mái Ấm
            </h2>
            <p className="text-[#4F4541] text-sm sm:text-base mt-1">
              Đã được khám sức khỏe toàn diện, tiêm phòng và sẵn sàng về nhà mới.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-[#EFEEEA] p-1 rounded-2xl self-start md:self-auto">
            <button
              onClick={() => setSpeciesFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                speciesFilter === 'all'
                  ? 'bg-white text-[#24150F] shadow-sm'
                  : 'text-[#4F4541] hover:text-[#24150F]'
              }`}
            >
              Tất cả ({pets.length})
            </button>
            <button
              onClick={() => setSpeciesFilter('dog')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                speciesFilter === 'dog'
                  ? 'bg-[#974729] text-white shadow-sm'
                  : 'text-[#4F4541] hover:text-[#24150F]'
              }`}
            >
              🐶 Chó cưng
            </button>
            <button
              onClick={() => setSpeciesFilter('cat')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                speciesFilter === 'cat'
                  ? 'bg-[#974729] text-white shadow-sm'
                  : 'text-[#4F4541] hover:text-[#24150F]'
              }`}
            >
              🐱 Mèo cưng
            </button>
          </div>
        </div>

        {/* Pet Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.slice(0, 6).map((pet) => (
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

        <div className="mt-12 text-center">
          <button
            onClick={() => onSelectTab('adopt')}
            className="inline-flex items-center gap-2 bg-[#24150F] text-white px-8 py-4 rounded-full font-bold text-base hover:bg-[#3b2922] transition-all shadow-md hover:shadow-xl"
          >
            <span>Xem tất cả danh sách nhận nuôi</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* 4. Adoption Journey Steps (Quy trình 4 bước) */}
      <section className="bg-[#EFEEEA] py-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#974729] bg-[#974729]/10 px-3 py-1 rounded-full">
              Minh bạch & Trách nhiệm
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#24150F] mt-2">
              Quy Trình Nhận Nuôi 4 Bước
            </h2>
            <p className="text-[#4F4541] text-sm sm:text-base mt-2">
              Chúng tôi luôn đồng hành để đảm bảo mỗi bé tìm đúng người bạn đời phù hợp nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Tìm Bạn Phù Hợp',
                desc: 'Xem hồ sơ tính cách, độ tuổi và nhu cầu vận động của các bé trên trang web.',
                icon: Heart,
              },
              {
                step: '02',
                title: 'Điền Đơn Đăng Ký',
                desc: 'Chia sẻ ngắn gọn về điều kiện nhà ở, kinh nghiệm và cam kết yêu thương bé.',
                icon: ShieldCheck,
              },
              {
                step: '03',
                title: 'Gặp Mặt Trực Tiếp',
                desc: 'Đến Trạm chơi cùng bé hoặc nhận cuộc gọi phỏng vấn thân thiện từ điều phối viên.',
                icon: Users,
              },
              {
                step: '04',
                title: 'Đón Bé Về Nhà',
                desc: 'Ký cam kết nhận nuôi, nhận sổ tiêm chủng và quà tặng dinh dưỡng khởi đầu.',
                icon: HomeIcon,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-3xl border border-[#E3E2DF] flex flex-col justify-between relative shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#974729]/10 text-[#974729] flex items-center justify-center font-bold">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-[#817470]/30 font-mono">
                      {item.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#24150F] mb-1.5">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-[#4F4541] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Emergency Rescue Live Banner */}
      <section className="py-12 px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto">
        <div className="bg-gradient-to-br from-[#23311B] to-[#121F0B] rounded-[2.5rem] p-8 md:p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-4 max-w-xl z-10">
            <div className="inline-flex items-center gap-2 bg-[#87977A]/20 border border-[#87977A]/40 text-[#D7E8C7] px-3.5 py-1 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              Đội Cứu Hộ Phản Ứng Nhanh 24/7
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Phát hiện thú cưng bị thương hoặc bỏ rơi khẩn cấp?
            </h2>
            <p className="text-sm sm:text-base text-[#D7E8C7]/80 leading-relaxed">
              Mỗi phút đều quý giá. Hãy gửi thông tin địa điểm và hình ảnh ngay cho chúng tôi hoặc gọi hotline trực tiếp.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0 z-10">
            <button
              onClick={onOpenReportRescue}
              className="bg-[#BA1A1A] hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-base transition-all shadow-lg text-center flex items-center justify-center gap-2"
            >
              <span>Báo Ca Cứu Hộ Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="tel:0834524650"
              onClick={() => trackHotlineClick('home_cta_banner')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-full font-bold text-base transition-all text-center flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Hotline: 08 345 246 50</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6. Heartwarming Stories Preview (Góc Yêu Thương) */}
      <section className="py-16 px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#974729] bg-[#974729]/10 px-3 py-1 rounded-full">
              Sự tái sinh kỳ diệu
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#24150F] mt-2">
              Góc Yêu Thương
            </h2>
            <p className="text-[#4F4541] text-sm sm:text-base mt-1">
              Những cuộc hội ngộ tràn ngập hạnh phúc của các bé sau khi về với gia đình mới.
            </p>
          </div>
          <button
            onClick={() => onSelectTab('stories')}
            className="text-sm font-bold text-[#974729] hover:underline flex items-center gap-1 self-start md:self-auto"
          >
            Xem tất cả câu chuyện <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {storiesLoading ? (
          <div className="bg-white rounded-3xl p-10 border border-[#E3E2DF] text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-4 border-[#974729]/20 border-t-[#974729] animate-spin mx-auto" />
            <p className="text-sm font-semibold text-[#4F4541]">
              Đang tải bài viết Góc yêu thương...
            </p>
          </div>
        ) : storiesError ? (
          <div className="bg-red-50 rounded-3xl p-8 border border-red-200 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
            <p className="text-sm font-bold text-red-900">
              Không thể tải bài viết Góc yêu thương
            </p>
            <p className="text-xs text-red-700">{storiesError}</p>
            {onRetryStories && (
              <button
                onClick={onRetryStories}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Thử lại</span>
              </button>
            )}
          </div>
        ) : stories.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-dashed border-[#E3E2DF] text-center space-y-2">
            <BookOpen className="w-8 h-8 text-[#817470]/60 mx-auto" />
            <p className="text-base font-extrabold text-[#24150F]">Chưa có bài viết</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {stories.slice(0, 4).map((story) => {
              const previewImage = story.afterImage || story.beforeImage;
              const metaParts = [
                story.petName,
                story.adoptDate ? `Về nhà ngày ${story.adoptDate}` : undefined,
                story.adopterName ? `Gia đình ${story.adopterName}` : undefined,
              ].filter(Boolean);
              const excerpt = story.summary || story.fullStory;

              return (
                <div
                  key={story.id}
                  onClick={() => onSelectTab('stories')}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3E2DF] card-shadow-hover flex flex-col md:flex-row gap-6 cursor-pointer"
                >
                  {previewImage && (
                    <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden bg-[#EFEEEA] shrink-0 relative">
                      <img
                        src={previewImage}
                        alt={story.petName || story.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-between flex-1 min-w-0 space-y-3">
                    <div>
                      {metaParts.length > 0 && (
                        <span className="text-xs font-bold text-[#974729] block mb-1">
                          {metaParts.join(' • ')}
                        </span>
                      )}
                      <h3 className="text-lg font-bold text-[#24150F] mb-2 leading-snug">
                        {story.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#4F4541] line-clamp-4 leading-relaxed whitespace-pre-line">
                        {excerpt}
                      </p>
                    </div>
                    {story.quote && (
                      <div className="pt-4 border-t border-[#EFEEEA] text-xs font-medium text-[#817470] italic">
                        {story.quote}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 7. Quick Impact Metrics */}
      <section className="bg-[#FAF9F5] border-y border-[#E3E2DF] py-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4">
            <div className="text-3xl sm:text-4xl font-black text-[#974729] mb-1">867+</div>
            <div className="text-xs sm:text-sm font-semibold text-[#4F4541]">Bé đã tìm được mái ấm</div>
          </div>
          <div className="p-4">
            <div className="text-3xl sm:text-4xl font-black text-[#23311B] mb-1">1,420+</div>
            <div className="text-xs sm:text-sm font-semibold text-[#4F4541]">Ca cứu hộ thành công</div>
          </div>
          <div className="p-4">
            <div className="text-3xl sm:text-4xl font-black text-[#24150F] mb-1">100%</div>
            <div className="text-xs sm:text-sm font-semibold text-[#4F4541]">Được tiêm phòng & triệt sản</div>
          </div>
          <div className="p-4">
            <div className="text-3xl sm:text-4xl font-black text-[#974729] mb-1">120+</div>
            <div className="text-xs sm:text-sm font-semibold text-[#4F4541]">Tình nguyện viên tích cực</div>
          </div>
        </div>
      </section>
    </div>
  );
};
