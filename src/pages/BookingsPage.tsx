import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import BookingCalendar from "../components/BookingCalendar";
import {
  FaCalendarAlt,
  FaPlus,
  FaClock,
  FaCar,
  FaUser,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaFilter,
  FaSearch,
  FaList,
} from "react-icons/fa";
import { bookingsAPI } from "../services/api";
import type { Booking } from "../types";

const BookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "upcoming" | "completed" | "cancelled"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, filter, searchTerm]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await bookingsAPI.getMyBookings();
      const bookingsData = response.data.data?.bookings || [];
      // Sort by date, newest first
      bookingsData.sort((a, b) => {
        const dateA = new Date(`${a.lessonDate} ${a.startTime}`);
        const dateB = new Date(`${b.lessonDate} ${b.startTime}`);
        return dateB.getTime() - dateA.getTime();
      });
      setBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Apply status filter
    if (filter === "upcoming") {
      filtered = filtered.filter(
        (booking) =>
          (booking.status === "pending" || booking.status === "confirmed") &&
          new Date(booking.lessonDate) >= new Date()
      );
    } else if (filter === "completed") {
      filtered = filtered.filter((booking) => booking.status === "completed");
    } else if (filter === "cancelled") {
      filtered = filtered.filter((booking) => booking.status === "cancelled");
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((booking) => {
        const searchLower = searchTerm.toLowerCase();
        const instructorName = booking.instructor
          ? `${booking.instructor.firstName} ${booking.instructor.lastName}`.toLowerCase()
          : "";
        const carInfo = booking.car
          ? `${booking.car.make} ${booking.car.model} ${booking.car.registration}`.toLowerCase()
          : "";
        const location =
          typeof booking.pickupLocation === "string"
            ? booking.pickupLocation.toLowerCase()
            : booking.pickupLocation?.address?.toLowerCase() || "";

        return (
          instructorName.includes(searchLower) ||
          carInfo.includes(searchLower) ||
          location.includes(searchLower) ||
          booking.lessonType.toLowerCase().includes(searchLower)
        );
      });
    }

    setFilteredBookings(filtered);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await bookingsAPI.cancelBooking(bookingId);
      await fetchBookings(); // Refresh the list
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: FaExclamationCircle,
        label: "Pending",
      },
      confirmed: {
        color: "bg-blue-100 text-blue-800",
        icon: FaCheckCircle,
        label: "Confirmed",
      },
      completed: {
        color: "bg-green-100 text-green-800",
        icon: FaCheckCircle,
        label: "Completed",
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: FaTimesCircle,
        label: "Cancelled",
      },
      no_show: {
        color: "bg-gray-100 text-gray-800",
        icon: FaTimesCircle,
        label: "Lesson Missed",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="mr-1" />
        {config.label}
      </span>
    );
  };

  const isUpcoming = (booking: Booking) => {
    return (
      new Date(booking.lessonDate) >= new Date() &&
      (booking.status === "pending" || booking.status === "confirmed")
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter((b) => isUpcoming(b)).length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Bookings
              </h1>
              <p className="text-gray-600">
                Manage and track all your driving lessons
              </p>
            </div>
            <button
              onClick={() => navigate("/bookings/new")}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center"
            >
              <FaPlus className="mr-2" />
              Book New Lesson
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaCalendarAlt className="text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.upcoming}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <FaClock className="text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completed}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCheckCircle className="text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.cancelled}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <FaTimesCircle className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters, Search and View Toggle */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaList className="mr-2" />
                List View
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                  viewMode === "calendar"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaCalendarAlt className="mr-2" />
                Calendar View
              </button>
            </div>

            {/* Filter Buttons - Only show in list view */}
            {viewMode === "list" && (
              <div className="flex items-center space-x-2">
                <FaFilter className="text-gray-500" />
                <div className="flex space-x-2">
                  {[
                    { value: "all", label: "All" },
                    { value: "upcoming", label: "Upcoming" },
                    { value: "completed", label: "Completed" },
                    { value: "cancelled", label: "Cancelled" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilter(option.value as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filter === option.value
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search - Only show in list view */}
            {viewMode === "list" && (
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by instructor, car, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>

        {/* Bookings View */}
        {viewMode === "calendar" ? (
          <BookingCalendar />
        ) : (
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
                <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No bookings found</p>
                <p className="text-gray-400 text-sm mt-2">
                  {filter !== "all"
                    ? "Try changing your filter"
                    : "Book your first lesson to get started"}
                </p>
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 capitalize">
                          {booking.lessonType.replace("_", " ")} Lesson
                        </h3>
                        {getStatusBadge(booking.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center text-gray-600">
                          <FaCalendarAlt className="mr-2 text-blue-500" />
                          {formatDate(booking.lessonDate)}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaClock className="mr-2 text-orange-500" />
                          {formatTime(booking.startTime)} -{" "}
                          {formatTime(booking.endTime)}
                        </div>
                        {booking.instructor && (
                          <div className="flex items-center text-gray-600">
                            <FaUser className="mr-2 text-green-500" />
                            {booking.instructor.firstName}{" "}
                            {booking.instructor.lastName}
                          </div>
                        )}
                        {booking.car && (
                          <div className="flex items-center text-gray-600">
                            <FaCar className="mr-2 text-purple-500" />
                            {booking.car.make} {booking.car.model}
                          </div>
                        )}
                      </div>

                      {booking.pickupLocation && (
                        <div className="flex items-center text-gray-600 text-sm mt-3">
                          <FaMapMarkerAlt className="mr-2 text-red-500" />
                          {typeof booking.pickupLocation === "string"
                            ? booking.pickupLocation
                            : booking.pickupLocation.address ||
                              "Pickup location set"}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {isUpcoming(booking) && (
                      <div className="mt-4 md:mt-0 md:ml-6 flex space-x-2">
                        <button
                          onClick={() => console.log("Reschedule", booking.id)}
                          className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          {cancellingId === booking.id
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingsPage;
