/**
 * Google Analytics (GA4) Integration & Event Measurement Utility
 * Measurement ID: G-JFSFWQJGSD
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-JFSFWQJGSD';

/**
 * Send custom event to Google Analytics
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, string | number | boolean | null | undefined>
) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  }
}

/**
 * Track SPA Page View upon navigation tab change
 */
export function trackPageView(pagePath: string, pageTitle: string) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
      page_location: window.location.href,
    });
  }
}

/**
 * Track user clicking "Nhận nuôi" / starting adoption flow
 */
export function trackAdoptionIntent(pet: {
  id: string;
  name: string;
  species: string;
  breed: string;
}) {
  trackEvent('begin_adoption', {
    item_id: pet.id,
    item_name: pet.name,
    item_category: pet.species === 'dog' ? 'Chó' : 'Mèo',
    item_variant: pet.breed,
  });
}

/**
 * Track completed adoption application form
 */
export function trackAdoptionSubmit(data: {
  petId: string;
  petName: string;
  city: string;
  housingType: string;
}) {
  trackEvent('adoption_form_submitted', {
    pet_id: data.petId,
    pet_name: data.petName,
    city: data.city,
    housing_type: data.housingType,
  });
}

/**
 * Track viewing a pet's detailed dossier
 */
export function trackPetDetailView(pet: {
  id: string;
  name: string;
  species: string;
  breed: string;
}) {
  trackEvent('view_item', {
    item_id: pet.id,
    item_name: pet.name,
    item_category: pet.species === 'dog' ? 'Chó' : 'Mèo',
    item_variant: pet.breed,
  });
}

/**
 * Track bookmarking/favoriting a pet
 */
export function trackFavoriteToggle(
  petId: string,
  petName: string,
  action: 'add' | 'remove'
) {
  trackEvent('toggle_favorite', {
    pet_id: petId,
    pet_name: petName,
    action: action,
  });
}

/**
 * Track opening the donation modal
 */
export function trackDonationModalOpen(source: string) {
  trackEvent('open_donation_modal', {
    source: source,
  });
}

/**
 * Track confirmed donation / support for rescued animals
 */
export function trackDonationCompleted(
  amount: number,
  isMonthly: boolean,
  hasDonorName: boolean
) {
  trackEvent('purchase', {
    transaction_id: `CPAPS_DONATE_${Date.now()}`,
    value: amount,
    currency: 'VND',
    donation_type: isMonthly ? 'monthly_sponsor' : 'one_time',
    donor_type: hasDonorName ? 'named' : 'anonymous',
  });
}

/**
 * Track copying bank transfer info (Vietcombank)
 */
export function trackCopyBank(field: string) {
  trackEvent('copy_bank_info', {
    field_copied: field,
    bank_name: 'Vietcombank',
    account_number: '0451000424413',
  });
}

/**
 * Track emergency hotline call click
 */
export function trackHotlineClick(sourceLocation: string) {
  trackEvent('emergency_hotline_click', {
    hotline: '0834524650',
    source_location: sourceLocation,
  });
}

/**
 * Track emergency rescue request submission
 */
export function trackRescueReportSubmit(report: {
  urgency: string;
  animalType: string;
  location: string;
}) {
  trackEvent('rescue_report_submitted', {
    urgency_level: report.urgency,
    animal_type: report.animalType,
    location: report.location,
  });
}

/**
 * Track lost/found pet broadcast submission
 */
export function trackLostFoundSubmit(item: {
  type: 'lost' | 'found';
  species: string;
  breed: string;
  location: string;
}) {
  trackEvent('lost_found_report_submitted', {
    report_type: item.type,
    species: item.species,
    breed: item.breed,
    location: item.location,
  });
}

/**
 * Track volunteer registration form submission
 */
export function trackVolunteerSubmit(roleId: string, availableDays: string) {
  trackEvent('volunteer_registered', {
    role_id: roleId,
    available_schedule: availableDays,
  });
}
