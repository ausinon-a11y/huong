import React, { useState } from 'react';
import { NavTab } from '../types';
import { PawPrint, Heart, Menu, X, PhoneCall, Gift, FileSpreadsheet } from 'lucide-react';
import { trackHotlineClick } from '../utils/analytics';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenDonate: () => void;
  onOpenGoogleSheetConfig: () => void;
  isSheetConnected?: boolean;
  isAdmin?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  favoritesCount,
  onOpenFavorites,
  onOpenDonate,
  onOpenGoogleSheetConfig,
  isSheetConnected = false,
  isAdmin = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { key: NavTab; label: string; badge?: string }[] = [
    { key: 'home', label: 'Trang chủ' },
    { key: 'adopt', label: 'Nhận nuôi' },
    { key: 'rescue', label: 'Cứu hộ' },
    { key: 'lost-found', label: 'Thú cưng thất lạc' },
    { key: 'volunteer', label: 'Tình nguyện' },
    { key: 'stories', label: 'Góc yêu thương' },
    { key: 'about', label: 'Về Trạm' },
    ...(isAdmin ? [{ key: 'marketing' as NavTab, label: 'AI Marketing', badge: 'Admin' }] : []),
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E3E2DF]/60 transition-all duration-300">
      <div className="flex justify-between items-center px-4 md:px-8 py-3.5 max-w-[1280px] mx-auto">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left font-bold text-lg md:text-xl text-[#24150F] tracking-tight flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="w-8 h-8 rounded-full bg-[#974729]/10 text-[#974729] flex items-center justify-center font-bold text-sm">
            🐾
          </span>
          <span className="font-extrabold text-[#24150F]">TRẠM NHẬN NUÔI CHÓ MÈO</span>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex gap-6 xl:gap-8 items-center">
          {navItems.map((item) => {
            const isActive = currentTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`text-[15px] font-medium transition-all duration-200 relative py-1 inline-flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#974729] font-semibold'
                    : 'text-[#4F4541] hover:text-[#974729]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[#974729]/15 text-[#974729]">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#974729] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="flex items-center gap-3">
          {/* Donate Button */}
          <button
            onClick={onOpenDonate}
            className="flex items-center gap-1.5 bg-[#974729] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#803a1f] shadow-sm hover:shadow-md transition-all transform active:scale-95 cursor-pointer"
          >
            <Gift className="w-4 h-4" />
            <span>Quyên góp</span>
          </button>

          {/* Favorites Button */}
          <button
            onClick={onOpenFavorites}
            className="flex items-center gap-1.5 text-[#4F4541] hover:text-[#24150F] px-3 py-2 rounded-full hover:bg-[#E3E2DF]/50 transition-colors relative cursor-pointer"
            title="Thú cưng yêu thích"
          >
            <PawPrint className="w-4 h-4 text-[#974729]" />
            <span className="text-sm font-medium hidden sm:inline">Yêu thích</span>
            {favoritesCount > 0 && (
              <span className="bg-[#974729] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#24150F] rounded-lg hover:bg-[#E3E2DF]/50 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF9F5] border-b border-[#E3E2DF] px-6 py-4 shadow-xl animate-fade-in">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => {
              const isActive = currentTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.key)}
                  className={`text-left py-2.5 px-3 rounded-lg text-base font-medium transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-[#974729]/10 text-[#974729] font-bold'
                      : 'text-[#4F4541] hover:bg-[#E3E2DF]/40'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#974729]/15 text-[#974729]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
            
            <div className="pt-3 border-t border-[#E3E2DF] flex items-center justify-between text-sm text-[#4F4541]">
              <a 
                href="tel:0834524650"
                onClick={() => trackHotlineClick('navbar_mobile')}
                className="flex items-center gap-1.5 text-xs text-[#974729] font-bold hover:underline py-1"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Hotline 24/7: 08 345 246 50
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
