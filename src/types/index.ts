export interface User {
  id: string; // UUID from backend
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "student" | "instructor" | "admin";
  isActive: boolean;
  profilePicture?: string;
  address?: string;
  dateOfBirth?: string;
  licenseNumber?: string;
  emergencyContact?: any;
  createdAt: string;
  updatedAt: string;
}

export interface Car {
  id: string; // UUID from backend
  make: string;
  model: string;
  year: number;
  licensePlate: string; // Add this field
  registration?: string; // Keep for backward compatibility temporarily
  transmission: "manual" | "automatic";
  fuelType: "petrol" | "diesel" | "hybrid" | "electric";
  color: string;
  status: "available" | "in_use" | "maintenance" | "out_of_service"; // Added in_use
  isActive: boolean;
  currentMileage?: number;
  insuranceNumber?: string;
  insuranceExpiry?: string;
  registrationExpiry?: string;
  lastServiceDate?: string;
  nextServiceDate?: string;
  currentLocation?: any;
  features?: any[];
  dailyRate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string; // UUID from backend
  studentId: string;
  instructorId: string;
  carId?: string;
  lessonDate: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  lessonType: "theory" | "practical" | "test_preparation" | "road_test";
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
  pickupLocation?: any; // JSON object {address: string, lat: number, lng: number}
  dropoffLocation?: any;
  notes?: string;
  instructorNotes?: string;
  price?: string;
  paymentStatus: "pending" | "paid" | "refunded";
  cancellationReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  reminderSent: boolean;
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
  student?: User;
  instructor?: User;
  car?: Car;
}

export interface AuthUser {
  id: string; // UUID from backend
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // Added from backend
  role: "student" | "instructor" | "admin";
  isActive: boolean;
  profilePicture?: string;
  address?: string;
  dateOfBirth?: string;
  licenseNumber?: string; // Added from backend
  emergencyContact?: any;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role?: "student" | "instructor" | "admin";
  address?: string;
  dateOfBirth?: string;
  licenseNumber?: string;
  emergencyContact?: any;
}

export interface ApiResponse<T = any> {
  status: "success" | "fail" | "error";
  message?: string;
  data?: T;
  results?: number;
  errors?: any[];
}

export interface BookingFormData {
  instructorId: string;
  carId?: string;
  lessonDate: string;
  startTime: string;
  endTime: string;
  duration?: number;
  lessonType?: "theory" | "practical" | "test_preparation" | "road_test";
  pickupLocation?: any;
  dropoffLocation?: any;
  notes?: string;
  price?: string;
}
