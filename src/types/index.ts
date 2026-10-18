export type ScreenType =
  | 'login'
  | 'register'
  | 'verify-email'
  | 'artists'
  | 'portfolio'
  | 'schedule'
  | 'booking-details'
  | 'booking-success'
  | 'my-bookings';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  provider?: 'credentials' | 'google';
  emailVerified?: boolean;
}

export interface TattooWork {
  id: string;
  title: string;
  style: string;
  category: 'blackwork' | 'fineline' | 'oriental' | 'realismo' | 'flash';
  imageUrl: string;
  bodyPart: string;
  estimatedHours: string;
  description: string;
}

export interface TattooArtist {
  id: string;
  name: string;
  slug: string;
  role: string;
  specialty: string;
  bio: string;
  avatar: string;
  banner?: string;
  experienceYears: number;
  instagram: string;
  whatsapp: string; // international format for wa.me
  whatsappDisplay: string;
  startingPrice: string;
  availableDays: number[]; // 0 = Dom, 1 = Seg, 2 = Ter, 3 = Qua, 4 = Qui, 5 = Sex, 6 = Sáb
  timeSlots: string[];
  works: TattooWork[];
}

export interface Booking {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  artistId: string;
  artistName: string;
  artistSpecialty: string;
  artistWhatsapp: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  sizeCm: number;
  bodyPart: string;
  referenceImages: string[];
  clientPhone: string;
  notes?: string;
  status: 'confirmado' | 'em_analise' | 'concluido';
  createdAt: string;
}
