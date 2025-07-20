export interface Car {
  id: string;
  name: string;
  year: number;
  engine: string;
  transmission: string;
  fuel: string;
  price: number;
  image: string;
  features: string[];
  available: boolean;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  isAdmin: boolean;
}

export interface Reservation {
  id: string;
  userId?: string | null;
  carId: string | null;
  fullName: string;
  email: string;
  phone: string;
  pickupDate: string;
  pickupTime: string;
  pickupLocation: string;
  dropoffDate: string;
  dropoffTime: string;
  dropoffLocation: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  patentDocument?: string;
}

export interface Review {
  id: string;
  userId: string;
  carId: string;
  reservationId: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
}

export interface AuthContextType {
  user: User | null;
  login: (emailOrUsername: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, fullName: string, phone: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}