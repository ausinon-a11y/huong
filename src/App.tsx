/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavTab, Pet, RescueReport, LostFoundPet, Story } from './types';
import { 
  INITIAL_PETS, 
  INITIAL_RESCUE_REPORTS, 
  INITIAL_LOST_FOUND 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { AdoptView } from './views/AdoptView';
import { RescueView } from './views/RescueView';
import { LostFoundView } from './views/LostFoundView';
import { VolunteerView } from './views/VolunteerView';
import { StoriesView } from './views/StoriesView';
import { AboutView } from './views/AboutView';
import { MarketingView } from './views/MarketingView';
import { PetDetailModal } from './components/PetDetailModal';
import { AdoptionFormModal } from './components/AdoptionFormModal';
import { DonationModal } from './components/DonationModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { ReportRescueModal } from './components/ReportRescueModal';
import { ReportLostPetModal } from './components/ReportLostPetModal';
import { GoogleSheetConfigModal } from './components/GoogleSheetConfigModal';
import { Toast } from './components/Toast';
import { User } from 'firebase/auth';
import { initAuth } from './services/auth';
import { getSavedSpreadsheetId } from './services/googleSheets';
import { isUserAdmin } from './services/marketingApi';
import {
  fetchPublishedStories,
  submitCommunityStory,
  SubmitCommunityStoryPayload,
} from './services/storiesApi';
import { 
  trackPageView, 
  trackPetDetailView, 
  trackAdoptionIntent, 
  trackAdoptionSubmit,
  trackFavoriteToggle,
  trackDonationModalOpen,
  trackRescueReportSubmit,
  trackLostFoundSubmit
} from './utils/analytics';

const TAB_TITLES: Record<NavTab, string> = {
  home: 'Trang chủ - Trạm Nhận Nuôi Chó Mèo',
  adopt: 'Tìm kiếm thú cưng nhận nuôi',
  rescue: 'Cứu hộ khẩn cấp 24/7',
  'lost-found': 'Tìm thú cưng thất lạc',
  volunteer: 'Tham gia tình nguyện viên',
  stories: 'Câu chuyện nhận nuôi kỳ diệu',
  about: 'Về Trung Tâm CPAPS',
  marketing: 'AI Marketing Agent - Quản Trị'
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS);
  const [rescueReports, setRescueReports] = useState<RescueReport[]>(INITIAL_RESCUE_REPORTS);
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundPet[]>(INITIAL_LOST_FOUND);
  const [stories, setStories] = useState<Story[]>([]);
  const [storiesLoading, setStoriesLoading] = useState<boolean>(true);
  const [storiesError, setStoriesError] = useState<string | null>(null);

  // Favorites
  const [favoritePetIds, setFavoritePetIds] = useState<string[]>(['pet-11061', 'pet-11099']);

  // Modals & Drawers
  const [selectedPetDetail, setSelectedPetDetail] = useState<Pet | null>(null);
  const [selectedPetForAdoption, setSelectedPetForAdoption] = useState<Pet | null>(null);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isReportRescueOpen, setIsReportRescueOpen] = useState(false);
  const [isReportLostPetOpen, setIsReportLostPetOpen] = useState(false);
  const [isGoogleSheetConfigOpen, setIsGoogleSheetConfigOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSheetConnected, setIsSheetConnected] = useState<boolean>(() => !!getSavedSpreadsheetId());

  // Init Firebase Auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
      },
      () => {
        setCurrentUser(null);
      }
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Load real published stories from Cloud Firestore via backend API
  const loadStories = async () => {
    setStoriesLoading(true);
    setStoriesError(null);
    try {
      const data = await fetchPublishedStories();
      setStories(data);
    } catch (err: any) {
      setStoriesError(err.message || 'Không thể tải danh sách bài viết Góc yêu thương.');
    } finally {
      setStoriesLoading(false);
    }
  };

  useEffect(() => {
    void loadStories();
  }, []);

  // Track virtual page views upon tab navigation
  useEffect(() => {
    trackPageView(`/${currentTab}`, TAB_TITLES[currentTab]);
  }, [currentTab]);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleOpenDonate = (source: string) => {
    trackDonationModalOpen(source);
    setIsDonateOpen(true);
  };

  const handleViewPetDetails = (pet: Pet) => {
    trackPetDetailView(pet);
    setSelectedPetDetail(pet);
  };

  const handleAdoptClick = (pet: Pet) => {
    trackAdoptionIntent(pet);
    setSelectedPetForAdoption(pet);
  };

  const handleToggleFavorite = (petId: string) => {
    setFavoritePetIds((prev) => {
      const exists = prev.includes(petId);
      const targetPet = pets.find((p) => p.id === petId);
      const petName = targetPet ? targetPet.name : 'bé';
      trackFavoriteToggle(petId, petName, exists ? 'remove' : 'add');

      if (exists) {
        triggerToast(`Đã bỏ ${petName} khỏi danh sách yêu thích`);
        return prev.filter((id) => id !== petId);
      } else {
        triggerToast(`Đã thêm ${petName} vào danh sách yêu thích ❤️`);
        return [...prev, petId];
      }
    });
  };

  const handleAdoptSubmitSuccess = (data: any) => {
    if (data.pet) {
      trackAdoptionSubmit({
        petId: data.pet.id,
        petName: data.pet.name,
        city: data.city || 'Hà Nội',
        housingType: data.housingType || 'Nhà riêng',
      });
    }
    triggerToast(`Đã tiếp nhận đơn nhận nuôi bé ${data.pet.name}! Trạm sẽ liên hệ sớm nhất.`);
  };

  const handleDonationSuccess = (amount: number, donor: string) => {
    triggerToast(`Cảm ơn ${donor} đã quyên góp ${amount.toLocaleString('vi-VN')} đ cho các bé! 🙏`);
  };

  const handleRescueReportSubmit = (report: RescueReport) => {
    trackRescueReportSubmit({
      urgency: report.urgency,
      animalType: report.animalType,
      location: report.location,
    });
    setRescueReports((prev) => [report, ...prev]);
    triggerToast('Đã gửi thông tin cứu hộ khẩn cấp! Đội ngũ đang xử lý.');
  };

  const handleLostFoundSubmit = (item: LostFoundPet) => {
    trackLostFoundSubmit({
      type: item.type,
      species: item.species,
      breed: item.breed,
      location: item.lastSeenLocation,
    });
    setLostFoundItems((prev) => [item, ...prev]);
    triggerToast('Tin tìm kiếm thú cưng đã được đăng tải thành công!');
  };

  const handleStoryPublished = (publishedStory: Story) => {
    setStories((prev) => {
      const withoutDup = prev.filter((s) => s.id !== publishedStory.id);
      return [publishedStory, ...withoutDup];
    });
    setStoriesError(null);
    void loadStories();
  };

  const handleSubmitCommunityStory = async (payload: SubmitCommunityStoryPayload) => {
    const result = await submitCommunityStory(payload);
    triggerToast(result.message || 'Đã gửi câu chuyện để xét duyệt');
    return result;
  };

  const favoritePets = pets.filter((p) => favoritePetIds.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#1B1C1A]">
      {/* Shared Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        favoritesCount={favoritePetIds.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenDonate={() => handleOpenDonate('navbar')}
        onOpenGoogleSheetConfig={() => setIsGoogleSheetConfigOpen(true)}
        isSheetConnected={isSheetConnected}
        isAdmin={isUserAdmin(currentUser)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-20 md:pt-24">
        {currentTab === 'home' && (
          <HomeView
            pets={pets}
            stories={stories}
            storiesLoading={storiesLoading}
            storiesError={storiesError}
            onRetryStories={() => void loadStories()}
            recentRescues={rescueReports}
            favorites={favoritePetIds}
            onToggleFavorite={handleToggleFavorite}
            onViewPetDetails={handleViewPetDetails}
            onAdoptClick={handleAdoptClick}
            onSelectTab={setCurrentTab}
            onOpenDonate={() => handleOpenDonate('home_hero')}
            onOpenReportRescue={() => setIsReportRescueOpen(true)}
          />
        )}

        {currentTab === 'adopt' && (
          <AdoptView
            pets={pets}
            favorites={favoritePetIds}
            onToggleFavorite={handleToggleFavorite}
            onViewPetDetails={handleViewPetDetails}
            onAdoptClick={handleAdoptClick}
            onOpenDonate={() => handleOpenDonate('adopt_view')}
          />
        )}

        {currentTab === 'rescue' && (
          <RescueView
            rescueReports={rescueReports}
            onOpenReportModal={() => setIsReportRescueOpen(true)}
            onOpenDonate={() => handleOpenDonate('rescue_view')}
          />
        )}

        {currentTab === 'lost-found' && (
          <LostFoundView
            items={lostFoundItems}
            onOpenReportModal={() => setIsReportLostPetOpen(true)}
          />
        )}

        {currentTab === 'volunteer' && <VolunteerView />}

        {currentTab === 'stories' && (
          <StoriesView
            stories={stories}
            isLoading={storiesLoading}
            error={storiesError}
            onRetry={() => void loadStories()}
            onSubmitCommunityStory={handleSubmitCommunityStory}
          />
        )}

        {currentTab === 'about' && (
          <AboutView onOpenDonate={() => handleOpenDonate('about_view')} />
        )}

        {currentTab === 'marketing' && (
          <MarketingView
            currentUser={currentUser}
            onUserChange={setCurrentUser}
            onToast={triggerToast}
            onStoryPublished={handleStoryPublished}
            onOpenStories={() => setCurrentTab('stories')}
          />
        )}
      </main>

      {/* Shared Footer */}
      <Footer
        onSelectTab={setCurrentTab}
        onOpenDonate={() => handleOpenDonate('footer')}
        onOpenAdminConfig={() => setIsGoogleSheetConfigOpen(true)}
      />

      {/* Modals and Drawers */}
      <PetDetailModal
        pet={selectedPetDetail}
        onClose={() => setSelectedPetDetail(null)}
        onAdoptClick={handleAdoptClick}
        isFavorite={selectedPetDetail ? favoritePetIds.includes(selectedPetDetail.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      <AdoptionFormModal
        pet={selectedPetForAdoption}
        onClose={() => setSelectedPetForAdoption(null)}
        onSubmitSuccess={handleAdoptSubmitSuccess}
      />

      <DonationModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        onDonated={handleDonationSuccess}
      />

      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favoritePets}
        onRemoveFavorite={handleToggleFavorite}
        onSelectPet={handleViewPetDetails}
        onAdoptPet={handleAdoptClick}
      />

      <ReportRescueModal
        isOpen={isReportRescueOpen}
        onClose={() => setIsReportRescueOpen(false)}
        onSubmitReport={handleRescueReportSubmit}
      />

      <ReportLostPetModal
        isOpen={isReportLostPetOpen}
        onClose={() => setIsReportLostPetOpen(false)}
        onSubmitLostFound={handleLostFoundSubmit}
      />

      <GoogleSheetConfigModal
        isOpen={isGoogleSheetConfigOpen}
        onClose={() => {
          setIsGoogleSheetConfigOpen(false);
          setIsSheetConnected(!!getSavedSpreadsheetId());
        }}
        currentUser={currentUser}
        onUserChange={(user) => {
          setCurrentUser(user);
          setIsSheetConnected(!!getSavedSpreadsheetId());
        }}
        onToast={triggerToast}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
