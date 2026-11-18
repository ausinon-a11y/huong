export type NavTab = 
  | 'home'
  | 'adopt'
  | 'rescue'
  | 'lost-found'
  | 'volunteer'
  | 'stories'
  | 'about'
  | 'marketing';

export type Species = 'dog' | 'cat';
export type Gender = 'Đực' | 'Cái' | 'Chưa xác định';
export type PetStatus = 'available' | 'pending' | 'adopted' | 'medical_care' | 'foster_needed';

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  age: string;
  gender: Gender;
  weight: string;
  size: 'Nhỏ' | 'Vừa' | 'Lớn';
  location: string;
  vaccinated: boolean;
  spayed: boolean;
  dewormed: boolean;
  isUrgent: boolean;
  urgentReason?: string;
  status: PetStatus;
  rescueDate: string;
  story: string;
  personality: string[];
  goodWithKids: boolean;
  goodWithOtherPets: boolean;
  images: string[];
  shelterRoom: string;
  specialNeeds?: string[];
  adoptionNote?: string;
  supportMessage?: string;
}

export interface RescueReport {
  id: string;
  reporterName: string;
  phone: string;
  location: string;
  animalType: 'Chó' | 'Mèo' | 'Khác';
  condition: string;
  urgency: 'critical' | 'high' | 'medium';
  image: string;
  createdAt: string;
  status: 'Đã tiếp nhận' | 'Đội cứu hộ đang di chuyển' | 'Đang cấp cứu' | 'Đang hồi phục tại Trạm' | 'Đã an toàn';
  statusStep: number; // 1 to 5
  notes?: string;
}

export interface LostFoundPet {
  id: string;
  type: 'lost' | 'found'; // Thất lạc / Tìm thấy
  petName?: string;
  species: Species;
  breed: string;
  color: string;
  collarDescription?: string;
  lastSeenLocation: string;
  lastSeenDate: string;
  contactName: string;
  contactPhone: string;
  reward?: string;
  image: string;
  description: string;
  isResolved: boolean;
}

export interface Story {
  id: string;
  title: string;
  fullStory: string;
  summary?: string;
  petName?: string;
  species?: Species;
  adopterName?: string;
  adoptDate?: string;
  beforeImage?: string;
  afterImage?: string;
  quote?: string;
  status?: 'published' | 'pending';
  source?: 'n8n_ai_marketing' | 'community_submission' | 'admin';
  draftId?: string;
  createdAt?: string;
  publishedAt?: string;
}

export interface VolunteerRole {
  id: string;
  title: string;
  commitment: string;
  location: string;
  description: string;
  tasks: string[];
  requirements: string[];
  spotsAvailable: number;
}

export interface DonationPackage {
  id: string;
  title: string;
  amount: number;
  description: string;
  impact: string;
  iconName: string;
  popular?: boolean;
}
