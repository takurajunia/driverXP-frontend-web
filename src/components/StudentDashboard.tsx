import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaCar,
  FaPlus,
  FaList,
  FaUser,
  FaHeadset,
  FaChevronRight,
  FaMapMarkerAlt,
  FaStar,
} from "react-icons/fa";
import { bookingsAPI } from "../services/api";
import type { Booking } from "../types";
import FeedbackModal from "./FeedbackModal";

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedBookingForFeedback, setSelectedBookingForFeedback] =
    useState<Booking | null>(null);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setIsLoading(true);
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.data.data?.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenFeedback = (booking: Booking) => {
    setSelectedBookingForFeedback(booking);
    setIsFeedbackModalOpen(true);
  };

  const handleFeedbackSuccess = () => {
    setIsFeedbackModalOpen(false);
    setSelectedBookingForFeedback(null);
    fetchMyBookings(); // Refresh bookings to show updated feedback
  };

  const upcomingBookings = bookings
    .filter(
      (booking) =>
        (booking.status === "pending" || booking.status === "confirmed") &&
        new Date(booking.lessonDate) > new Date()
    )
    .sort(
      (a, b) =>
        new Date(a.lessonDate).getTime() - new Date(b.lessonDate).getTime()
    )
    .slice(0, 5); // Show max 5 upcoming

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  );

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled"
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (time: string) => {
    // Convert 24hr to 12hr format
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back,{" "}
              <span className="text-blue-600">{user?.firstName}!</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Here's your booking summary and upcoming lessons
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Active
            </span>
            <span>Last login: Today, {currentTime}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Bookings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl">
              <FaCalendarAlt className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-gray-900">
              {bookings.length}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Total Bookings</p>
          </div>
        </div>

        {/* Completed Lessons */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-xl">
              <FaCheckCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm text-gray-500">Done</span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-gray-900">
              {completedBookings.length}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Completed Lessons</p>
          </div>
        </div>

        {/* Upcoming Lessons */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl">
              <FaClock className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm text-gray-500">Next</span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-gray-900">
              {upcomingBookings.length}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Upcoming Lessons</p>
            {upcomingBookings.length > 0 && (
              <p className="text-xs text-orange-600 mt-2">
                Next: {formatDate(upcomingBookings[0].lessonDate)}
              </p>
            )}
          </div>
        </div>

        {/* Cancelled Bookings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-gradient-to-br from-red-400 to-red-600 rounded-xl">
              <FaCar className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm text-gray-500">Status</span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-gray-900">
              {cancelledBookings.length}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Cancelled Lessons</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upcoming Lessons */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <FaCalendarAlt className="mr-3 text-blue-500" />
                Upcoming Lessons
              </h2>
              <button
                onClick={() => (window.location.href = "/bookings")}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                View All
                <FaChevronRight className="ml-1 text-xs" />
              </button>
            </div>

            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-500 rounded-xl">
                        <FaCar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {booking.lessonType.replace("_", " ")} Lesson
                        </h3>
                        {booking.instructor && (
                          <p className="text-sm text-gray-600">
                            with {booking.instructor.firstName}{" "}
                            {booking.instructor.lastName}
                          </p>
                        )}
                        <div className="flex items-center space-x-3 mt-1">
                          <p className="text-xs text-orange-600">
                            📅 {formatDate(booking.lessonDate)} at{" "}
                            {formatTime(booking.startTime)}
                          </p>
                          {booking.pickupLocation && (
                            <p className="text-xs text-gray-500 flex items-center">
                              <FaMapMarkerAlt className="mr-1" />
                              {typeof booking.pickupLocation === "string"
                                ? booking.pickupLocation
                                : booking.pickupLocation.address ||
                                  "Pickup location set"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">
                        {booking.startTime} - {booking.endTime}
                      </span>
                      <button
                        onClick={() =>
                          console.log("Reschedule booking", booking.id)
                        }
                        className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Reschedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">No upcoming lessons scheduled</p>
                <button
                  onClick={() => console.log("Book new lesson")}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Your First Lesson
                </button>
              </div>
            )}
          </div>

          {/* Recent Completed Lessons */}
          {completedBookings.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <FaCheckCircle className="mr-3 text-green-500" />
                  Recent Completed Lessons
                </h2>
                <button
                  onClick={() => (window.location.href = "/bookings")}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  View All
                  <FaChevronRight className="ml-1 text-xs" />
                </button>
              </div>

              <div className="space-y-4">
                {completedBookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <FaCheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {booking.lessonType.replace("_", " ")} Lesson
                        </h3>
                        {booking.instructor && (
                          <p className="text-sm text-gray-600">
                            with {booking.instructor.firstName}{" "}
                            {booking.instructor.lastName}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          ✅ Completed {formatDate(booking.lessonDate)}
                        </p>
                        {booking.rating && (
                          <div className="flex items-center mt-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  className={`text-xs ${
                                    star <= (booking.rating || 0)
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-600 ml-2">
                              Rated
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-gray-500">
                        {booking.startTime} - {booking.endTime}
                      </div>
                      {!booking.rating && (
                        <button
                          onClick={() => handleOpenFeedback(booking)}
                          className="px-3 py-1 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors flex items-center"
                        >
                          <FaStar className="mr-1" />
                          Rate
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">⚡</span>
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => (window.location.href = "/bookings/new")}
                className="w-full p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center justify-between group"
              >
                <div className="flex items-center">
                  <FaPlus className="mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Book New Lesson</div>
                    <div className="text-xs opacity-90">
                      Schedule your next session
                    </div>
                  </div>
                </div>
                <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => (window.location.href = "/bookings")}
                className="w-full p-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center justify-between group"
              >
                <div className="flex items-center">
                  <FaList className="mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">View All Bookings</div>
                    <div className="text-xs opacity-90">
                      Manage your lessons
                    </div>
                  </div>
                </div>
                <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => (window.location.href = "/profile")}
                className="w-full p-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center justify-between group"
              >
                <div className="flex items-center">
                  <FaUser className="mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Update Profile</div>
                    <div className="text-xs opacity-90">
                      Edit your information
                    </div>
                  </div>
                </div>
                <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => console.log("Contact support")}
                className="w-full p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center justify-between group"
              >
                <div className="flex items-center">
                  <FaHeadset className="mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Contact Support</div>
                    <div className="text-xs opacity-90">
                      Get help & assistance
                    </div>
                  </div>
                </div>
                <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Student Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FaUser className="mr-3 text-blue-500" />
              Your Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{user?.phone}</p>
              </div>
              {user?.licenseNumber && (
                <div>
                  <p className="text-xs text-gray-500">License Number</p>
                  <p className="font-medium text-gray-900">
                    {user.licenseNumber}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        booking={selectedBookingForFeedback}
        onSuccess={handleFeedbackSuccess}
      />
    </div>
  );
};

export default StudentDashboard;
