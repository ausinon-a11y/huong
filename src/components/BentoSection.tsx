import React from 'react';
import { NavTab } from '../types';
import { BENTO_IMAGES } from '../data/mockData';
import { ArrowUpRight } from 'lucide-react';

interface BentoSectionProps {
  onSelectTab: (tab: NavTab) => void;
}

export const BentoSection: React.FC<BentoSectionProps> = ({ onSelectTab }) => {
  return (
    <section id="features-bento" className="bg-[#EFEEEA] py-16 md:py-24 transition-colors">
      <div className="px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#24150F] tracking-tight">
            Bạn đang tìm gì?
          </h2>
          <p className="text-base sm:text-lg text-[#4F4541] mt-4 leading-relaxed">
            Khám phá các cách thức bạn có thể đồng hành cùng chúng tôi trong hành trình mang lại cuộc sống tốt đẹp hơn cho động vật.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Nhận nuôi (1 Column) */}
          <button
            onClick={() => onSelectTab('adopt')}
            className="group relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 text-left w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#974729]"
          >
            <img
              src={BENTO_IMAGES.adopt}
              alt="Người đang vuốt ve chú chó thân thiện"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#24150F]/90 via-[#24150F]/40 to-transparent" />
            
            {/* Top Badge */}
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-5 h-5" />
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                Nhận nuôi
              </h3>
              <p className="text-sm text-white/90 transform translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                Mở rộng vòng tay đón một thành viên mới.
              </p>
            </div>
          </button>

          {/* Card 2: Cứu hộ (2 Columns Span) */}
          <button
            onClick={() => onSelectTab('rescue')}
            className="group relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 lg:col-span-2 text-left w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#974729]"
          >
            <img
              src={BENTO_IMAGES.rescue}
              alt="Nhân viên cứu hộ âu yếm mèo con vừa được giải cứu"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay in Tertiary Greenish Tone */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#23311B]/95 via-[#23311B]/40 to-transparent" />
            
            {/* Top Badge */}
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-5 h-5" />
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                Cứu hộ
              </h3>
              <p className="text-sm sm:text-base text-white/90 transform translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                Hỗ trợ các trường hợp khẩn cấp và điều trị y tế kịp thời.
              </p>
            </div>
          </button>

          {/* Card 3: Thất lạc (1 Column) */}
          <button
            onClick={() => onSelectTab('lost-found')}
            className="group relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 text-left w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#974729]"
          >
            <img
              src={BENTO_IMAGES.lost}
              alt="Tìm kiếm thú cưng thất lạc trên bảng tin"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#3B2922]/90 via-[#3B2922]/40 to-transparent" />
            
            {/* Top Badge */}
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-5 h-5" />
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                Thất lạc
              </h3>
              <p className="text-sm text-white/90 transform translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                Đưa các bé trở về với gia đình thương yêu.
              </p>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
