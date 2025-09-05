import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaCar,
  FaMapMarkerAlt,
  FaChevronRight,
  FaStar,
  FaExclamationCircle,
  FaClipboardCheck,
} from "react-icons/fa";
import { bookingsAPI } from "../services/api";
import type { Booking } from "../types";
import LessonCompletionModal from "./LessonCompletionModal";

const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(
    null
  );
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [completionAction, setCompletionAction] = useState<
    "complete" | "no_show"
  >("complete");

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

  const handleMarkComplete = (booking: Booking) => {
    setSelectedBooking(booking);
    setCompletionAction("complete");
    setIsCompletionModalOpen(true);
  };

  const handleMarkNoShow = (booking: Booking) => {
    setSelectedBooking(booking);
    setCompletionAction("no_show");
    setIsCompletionModalOpen(true);
  };

  const handleCompletionSuccess = () => {
    setIsCompletionModalOpen(false);
    setSelectedBooking(null);
    fetchMyBookings();
  };

  // Filter bookings
  const todayBookings = bookings.filter((booking) => {
    const today = new Date().toISOString().split("T")[0];
    return (
      booking.lessonDate === today &&
      (booking.status === "pending" || booking.status === "confirmed")
    );
  });

  const upcomingBookings = bookings.filter((booking) => {
    const today = new Date().toISOString().split("T")[0];
    return (
      booking.lessonDate > today &&
      (booking.status === "pending" || booking.status === "confirmed")
    );
  });

  const recentCompleted = bookings
    .filter((booking) => booking.status === "completed")
    .slice(0, 5);

  const needsAttention = bookings.filter((booking) => {
    const lessonDateTime = new Date(`${booking.lessonDate} ${booking.endTime}`);
    return (
      lessonDateTime < new Date() &&
      (booking.status === "pending" || booking.status === "confirmed")
    );
  });

  const stats = {
    today: todayBookings.length,
    upcoming: upcomingBookings.length,
    completed: bookings.filter((b) => b.status === "completed").length,
    needsAttention: needsAttention.length,
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back,{" "}
          <span className="text-blue-600">{user?.firstName}!</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Manage your lessons and track student progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl">
              <FaCalendarAlt className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm text-gray-500">Today</span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-gray-900">{stats.today}</h3>
            <p className="text-sm text-gray-600 mt-1">Lessons Today</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl">
              <FaClock className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm text-gray-500">Scheduled</span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-gray-900">
              {stats.upcoming}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Upcoming Lessons</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-xl">
              <FaCheckCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm text-gray-500">Done</span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-gray-900">
              {stats.completed}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Completed Lessons</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-gradient-to-br from-red-400 to-red-600 rounded-xl">
              <FaExclamationCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm text-gray-500">Action</span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-gray-900">
              {stats.needsAttention}
            </h3>
            <p className="text-sm text-gray-600 mt-1">Needs Attention</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Today's Schedule & Needs Attention */}
        <div className="lg:col-span-2 space-y-8">
          {/* Needs Attention Section */}
          {needsAttention.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center">
                <FaExclamationCircle className="mr-3 text-red-600" />
                Needs Immediate Attention
              </h2>
              <p className="text-red-700 text-sm mb-4">
                These past lessons need to be marked as completed or no-show:
              </p>
              <div className="space-y-3">
                {needsAttention.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-xl p-4 border border-red-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {booking.student?.firstName}{" "}
                          {booking.student?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(booking.lessonDate)} at{" "}
                          {formatTime(booking.startTime)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleMarkComplete(booking)}
                          disabled={updatingBookingId === booking.id}
                          className="px-3 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleMarkNoShow(booking)}
                          disabled={updatingBookingId === booking.id}
                          className="px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          No Show
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <FaCalendarAlt className="mr-3 text-blue-500" />
                Today's Schedule
              </h2>
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {todayBookings.length > 0 ? (
              <div className="space-y-4">
                {todayBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-500 rounded-xl">
                        <FaUser className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {booking.student?.firstName}{" "}
                          {booking.student?.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatTime(booking.startTime)} -{" "}
                          {formatTime(booking.endTime)}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {booking.lessonType.replace("_", " ")} Lesson
                        </p>
                        {booking.pickupLocation && (
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <FaMapMarkerAlt className="mr-1" />
                            {typeof booking.pickupLocation === "string"
                              ? booking.pickupLocation
                              : booking.pickupLocation.address ||
                                "Pickup location set"}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {booking.car && (
                        <span className="text-xs text-gray-500 flex items-center">
                          <FaCar className="mr-1" />
                          {booking.car.make} {booking.car.model}
                        </span>
                      )}
                      <button
                        onClick={() => handleMarkComplete(booking)}
                        disabled={updatingBookingId === booking.id}
                        className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        <FaCheckCircle className="inline mr-1" />
                        Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">No lessons scheduled for today</p>
              </div>
            )}
          </div>

          {/* Upcoming Lessons */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <FaClock className="mr-3 text-orange-500" />
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
              <div className="space-y-3">
                {upcomingBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.student?.firstName}{" "}
                          {booking.student?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(booking.lessonDate)} at{" "}
                          {formatTime(booking.startTime)}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {booking.lessonType.replace("_", " ")}
                        </p>
                      </div>
                      {booking.car && (
                        <span className="text-xs text-gray-500">
                          {booking.car.make} {booking.car.model}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No upcoming lessons scheduled
              </p>
            )}
          </div>
        </div>

        {/* Right Column - Recent Activity */}
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FaClipboardCheck className="mr-3 text-green-500" />
              This Week's Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Total Lessons</span>
                <span className="font-bold text-gray-900">
                  {todayBookings.length +
                    upcomingBookings.filter((b) => {
                      const bookingDate = new Date(b.lessonDate);
                      const today = new Date();
                      const weekFromNow = new Date(
                        today.getTime() + 7 * 24 * 60 * 60 * 1000
                      );
                      return bookingDate <= weekFromNow;
                    }).length}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-bold text-green-600">
                  {stats.completed}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="font-bold text-blue-600">
                  {stats.completed > 0
                    ? Math.round(
                        (stats.completed /
                          (stats.completed +
                            bookings.filter(
                              (b) =>
                                b.status === "cancelled" ||
                                b.status === "no_show"
                            ).length)) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Recent Completed */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FaStar className="mr-3 text-yellow-500" />
              Recently Completed
            </h2>
            {recentCompleted.length > 0 ? (
              <div className="space-y-3">
                {recentCompleted.map((booking) => (
                  <div key={booking.id} className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-gray-900 text-sm">
                      {booking.student?.firstName} {booking.student?.lastName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatDate(booking.lessonDate)} -{" "}
                      {booking.lessonType.replace("_", " ")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No completed lessons yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Lesson Completion Modal */}
      <LessonCompletionModal
        isOpen={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
        booking={selectedBooking}
        action={completionAction}
        onSuccess={handleCompletionSuccess}
      />
    </div>
  );
};

export default InstructorDashboard;
