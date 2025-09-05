import axios, { type AxiosResponse } from "axios";
import { API_BASE_URL } from "../utils/constants";
import type {
  ApiResponse,
  LoginCredentials,
  RegisterData,
  User,
  Booking,
  Car,
  BookingFormData,
} from "../types";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("driverxp_token");
    console.log("Making API request to:", config.url);
    console.log("Token from localStorage:", token ? "Present" : "Not found");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization header set with Bearer token");
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors (FIXED VERSION)
api.interceptors.response.use(
  (response) => {
    console.log("API response successful:", response.config.url);
    return response;
  },
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message,
    });

    // Only handle 401 errors for non-auth endpoints
    if (error.response?.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes("/auth/");

      console.log("401 error detected:", {
        url: error.config?.url,
        isAuthEndpoint,
        currentPath: window.location.pathname,
      });

      // Only clear auth data and redirect for non-auth endpoints
      // This prevents the infinite loop
      if (!isAuthEndpoint) {
        console.log("Clearing auth data due to 401 on protected endpoint");
        localStorage.removeItem("driverxp_token");
        localStorage.removeItem("driverxp_user");

        // Dispatch a custom event to notify auth context instead of direct redirect
        window.dispatchEvent(new CustomEvent("auth:logout"));
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (
    credentials: LoginCredentials
  ): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> =>
    api.post("/auth/login", credentials),

  register: (
    userData: RegisterData
  ): Promise<AxiosResponse<ApiResponse<{ user: User; token: string }>>> =>
    api.post("/auth/register", userData),

  getMe: (): Promise<AxiosResponse<ApiResponse<{ user: User }>>> =>
    api.get("/auth/me"),

  updateMe: (
    userData: Partial<User>
  ): Promise<AxiosResponse<ApiResponse<{ user: User }>>> =>
    api.patch("/auth/me", userData),
};

// Users API
export const usersAPI = {
  getAllUsers: (params?: {
    role?: string;
    isActive?: boolean;
    search?: string;
  }): Promise<AxiosResponse<ApiResponse<{ users: User[] }>>> =>
    api.get("/users", { params }),

  getUser: (
    id: string
  ): Promise<AxiosResponse<ApiResponse<{ user: User }>>> => // Changed to string
    api.get(`/users/${id}`),

  createUser: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
  }): Promise<AxiosResponse<ApiResponse<{ user: User }>>> =>
    api.post("/users", userData),

  updateUser: (
    id: string, // Changed to string
    userData: Partial<User>
  ): Promise<AxiosResponse<ApiResponse<{ user: User }>>> =>
    api.patch(`/users/${id}`, userData),

  deactivateUser: (
    id: string
  ): Promise<AxiosResponse<ApiResponse>> => // Changed to string
    api.delete(`/users/${id}`),

  getInstructors: (): Promise<
    AxiosResponse<ApiResponse<{ instructors: User[] }>>
  > => api.get("/users/instructors"),

  getUserStats: (): Promise<AxiosResponse<ApiResponse<{ stats: any }>>> =>
    api.get("/users/stats"),
};

// Bookings API
export const bookingsAPI = {
  getMyBookings: (): Promise<
    AxiosResponse<ApiResponse<{ bookings: Booking[] }>>
  > => api.get("/bookings/my-bookings"),

  getBooking: (
    id: string // Changed from number to string
  ): Promise<AxiosResponse<ApiResponse<{ booking: Booking }>>> =>
    api.get(`/bookings/${id}`),

  createBooking: (
    bookingData: BookingFormData
  ): Promise<AxiosResponse<ApiResponse<{ booking: Booking }>>> =>
    api.post("/bookings", bookingData),

  cancelBooking: (
    id: string // Changed from number to string
  ): Promise<AxiosResponse<ApiResponse<{ booking: Booking }>>> =>
    api.patch(`/bookings/${id}/cancel`),

  updateBookingStatus: (
    id: string,
    data: {
      status?: string;
      instructorNotes?: string;
      rating?: number;
      feedback?: string;
    }
  ): Promise<AxiosResponse<ApiResponse<{ booking: Booking }>>> =>
    api.patch(`/bookings/${id}/status`, data),

  submitFeedback: (
    bookingId: string,
    data: { rating: number; feedback: string }
  ): Promise<AxiosResponse<ApiResponse<{ booking: Booking }>>> =>
    api.patch(`/bookings/${bookingId}/feedback`, data),

  getInstructorFeedback: (
    instructorId: string
  ): Promise<
    AxiosResponse<
      ApiResponse<{
        statistics: {
          totalRatings: number;
          averageRating: number;
          ratingDistribution: Record<string, number>;
        };
        feedback: Array<{
          id: string;
          rating: number;
          feedback: string;
          lessonDate: string;
          lessonType: string;
          studentName: string;
          createdAt: string;
        }>;
      }>
    >
  > => api.get(`/bookings/instructor/${instructorId}/feedback`),

  getAnalytics: (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<
    AxiosResponse<
      ApiResponse<{
        summary: {
          totalBookings: number;
          completedBookings: number;
          cancelledBookings: number;
          noShowBookings: number;
          revenue: number;
          completionRate: number;
          dateRange: { start: string; end: string };
        };
        instructorPerformance: Array<{
          name: string;
          total: number;
          completed: number;
          cancelled: number;
          noShow: number;
          averageRating: number | null;
        }>;
        peakHours: Record<string, number>;
        lessonTypes: Record<string, number>;
        dailyTrend: Record<string, number>;
      }>
    >
  > => api.get("/bookings/analytics", { params }),
};

// Cars API
export const carsAPI = {
  getAllCars: (params?: {
    transmission?: string;
    status?: string;
    search?: string;
  }): Promise<AxiosResponse<ApiResponse<{ cars: Car[] }>>> =>
    api.get("/cars", { params }),

  getCar: (
    id: string
  ): Promise<AxiosResponse<ApiResponse<{ car: Car }>>> => // Changed to string
    api.get(`/cars/${id}`),

  getAvailableCars: (): Promise<AxiosResponse<ApiResponse<{ cars: Car[] }>>> =>
    api.get("/cars/available"),

  createCar: (
    carData: Omit<Car, "id" | "createdAt" | "updatedAt" | "isActive">
  ): Promise<AxiosResponse<ApiResponse<{ car: Car }>>> =>
    api.post("/cars", carData),

  updateCar: (
    id: string, // Changed to string
    carData: Partial<Car>
  ): Promise<AxiosResponse<ApiResponse<{ car: Car }>>> =>
    api.patch(`/cars/${id}`, carData),

  deleteCar: (
    id: string
  ): Promise<AxiosResponse<ApiResponse>> => // Changed to string
    api.delete(`/cars/${id}`),
};

export default api;
