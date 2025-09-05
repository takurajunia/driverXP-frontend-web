export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://driverxp-backend-production.up.railway.app/api"
    : "http://localhost:5000/api";

export const APP_NAME = "DriverXP";
export const COMPANY_NAME = "Sydney Driving School";

export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  BOOKINGS: "/bookings",
  CARS: "/cars",
  USERS: "/users",
  INSTRUCTORS: "/instructors",
} as const;

export const USER_ROLES = {
  STUDENT: "student",
  INSTRUCTOR: "instructor",
  ADMIN: "admin",
} as const;

export const BOOKING_STATUS = {
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const CAR_STATUS = {
  AVAILABLE: "available",
  MAINTENANCE: "maintenance",
  OUT_OF_SERVICE: "out_of_service",
} as const;
