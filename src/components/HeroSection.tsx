import React from 'react';
import { ArrowRight, Home as HomeIcon } from 'lucide-react';
import { HERO_IMAGE_URL } from '../data/mockData';

interface HeroSectionProps {
  onFindCompanion: () => void;
  onLearnMore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onFindCompanion,
  onLearnMore,
}) => {
  return (
    <section className="relative px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto pt-4 md:pt-8 pb-16 md:pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[560px] lg:min-h-[660px]">
        {/* Left Column: Headline & Call To Action */}
        <div className="z-10 flex flex-col gap-6 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold text-[#24150F] tracking-tight leading-[1.08]">
            MỘT MÁI NHÀ.<br />
            MỘT CUỘC ĐỜI MỚI.
          </h1>

          <p className="text-base sm:text-lg text-[#4F4541] leading-relaxed max-w-xl">
            Mỗi sinh linh đều xứng đáng được yêu thương. Tại Trạm Nhận Nuôi, chúng tôi không chỉ tìm mái nhà cho các bé, mà còn kết nối những trái tim đồng điệu. Hãy bắt đầu hành trình yêu thương của bạn ngay hôm nay.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={onFindCompanion}
              className="bg-[#974729] text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-[#803a1f] transition-all shadow-lg shadow-[#974729]/25 flex items-center gap-2 transform active:scale-95 cursor-pointer"
            >
              <span>Tìm Bạn Đồng Hành</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onLearnMore}
              className="border border-[#817470]/60 text-[#24150F] px-8 py-4 rounded-full font-semibold text-base hover:bg-[#E9E8E4] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Tìm Hiểu Thêm</span>
            </button>
          </div>
        </div>

        {/* Right Column: Hero Image with Floating Stats Badge */}
        <div className="relative h-[420px] sm:h-[500px] lg:h-[640px] w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-[#24150F]/10">
          <img
            src={HERO_IMAGE_URL}
            alt="Chó và mèo thân thiết bên nhau tại Trạm Nhận Nuôi"
            className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
            loading="eager"
          />

          {/* Floating Stats Badge */}
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-[#FAF9F5]/95 backdrop-blur-md p-5 sm:p-6 rounded-2xl shadow-xl border border-[#E3E2DF] max-w-[280px] sm:max-w-xs flex items-center gap-4 transition-transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-[#FE9975]/30 text-[#974729] rounded-2xl flex items-center justify-center shrink-0">
              <HomeIcon className="w-6 h-6 fill-[#974729]/20" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#24150F]">867</div>
              <div className="text-xs sm:text-sm font-medium text-[#4F4541] leading-tight">
                Thú cưng đã tìm được mái ấm
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
