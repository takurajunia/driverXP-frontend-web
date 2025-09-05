import React, { useState, useEffect, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import type { View as CalendarView, Event } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAuth } from "../context/AuthContext";
import { bookingsAPI } from "../services/api";
import type { Booking } from "../types";
import {
  FaCalendarAlt,
  FaCar,
  FaUser,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const localizer = momentLocalizer(moment);

interface CalendarEvent extends Event {
  id: string;
  booking: Booking;
  status: string;
  type: string;
}

const BookingCalendar: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [view, setView] = useState<CalendarView>("month");
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
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

  // Convert bookings to calendar events
  const events: CalendarEvent[] = useMemo(() => {
    return bookings.map((booking) => {
      const startDateTime = new Date(
        `${booking.lessonDate}T${booking.startTime}`
      );
      const endDateTime = new Date(`${booking.lessonDate}T${booking.endTime}`);

      let title = "";
      if (user?.role === "student") {
        title = `${booking.lessonType.replace("_", " ")} - ${
          booking.instructor?.firstName || "TBD"
        }`;
      } else if (user?.role === "instructor") {
        title = `${booking.student?.firstName} ${
          booking.student?.lastName
        } - ${booking.lessonType.replace("_", " ")}`;
      } else {
        title = `${booking.student?.firstName} - ${
          booking.instructor?.firstName
        } - ${booking.lessonType.replace("_", " ")}`;
      }

      return {
        id: booking.id,
        title,
        start: startDateTime,
        end: endDateTime,
        booking,
        status: booking.status,
        type: booking.lessonType,
      };
    });
  }, [bookings, user]);

  // Custom event style
  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = "#3b82f6"; // Default blue

    switch (event.status) {
      case "completed":
        backgroundColor = "#10b981"; // Green
        break;
      case "cancelled":
        backgroundColor = "#ef4444"; // Red
        break;
      case "no_show":
        backgroundColor = "#6b7280"; // Gray
        break;
      case "pending":
        backgroundColor = "#f59e0b"; // Yellow
        break;
      case "confirmed":
        backgroundColor = "#3b82f6"; // Blue
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: "6px",
        opacity: 0.9,
        color: "white",
        border: "0px",
        display: "block",
        fontSize: "12px",
        padding: "2px 5px",
      },
    };
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedBooking(event.booking);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <FaCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      case "no_show":
        return <FaTimesCircle className="text-gray-500" />;
      default:
        return <FaExclamationCircle className="text-yellow-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <FaCalendarAlt className="mr-3 text-blue-500" />
          Booking Calendar
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Confirmed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Completed</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Cancelled</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Lesson Missed</span>
          </div>
        </div>
      </div>

      <div className="h-[600px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          view={view}
          onView={(newView: CalendarView) => setView(newView)}
          date={date}
          onNavigate={(newDate: Date) => setDate(newDate)}
          views={["month", "week", "day", "agenda"]}
          popup
          className="rounded-lg"
        />
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSelectedBooking(null)}
          ></div>
          <div className="fixed inset-x-4 top-1/2 transform -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Booking Details
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimesCircle />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="flex items-center space-x-2">
                  {getStatusIcon(selectedBooking.status)}
                  <span className="text-sm font-medium capitalize">
                    {selectedBooking.status === "no_show"
                      ? "Lesson Missed"
                      : selectedBooking.status}
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type:</span>
                <span className="text-sm font-medium capitalize">
                  {selectedBooking.lessonType.replace("_", " ")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Date:</span>
                <span className="text-sm font-medium">
                  {new Date(selectedBooking.lessonDate).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Time:</span>
                <span className="text-sm font-medium">
                  {formatTime(selectedBooking.startTime)} -{" "}
                  {formatTime(selectedBooking.endTime)}
                </span>
              </div>

              {user?.role === "student" && selectedBooking.instructor && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    <FaUser className="inline mr-1" />
                    Instructor:
                  </span>
                  <span className="text-sm font-medium">
                    {selectedBooking.instructor.firstName}{" "}
                    {selectedBooking.instructor.lastName}
                  </span>
                </div>
              )}

              {user?.role === "instructor" && selectedBooking.student && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    <FaUser className="inline mr-1" />
                    Student:
                  </span>
                  <span className="text-sm font-medium">
                    {selectedBooking.student.firstName}{" "}
                    {selectedBooking.student.lastName}
                  </span>
                </div>
              )}

              {selectedBooking.car && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    <FaCar className="inline mr-1" />
                    Vehicle:
                  </span>
                  <span className="text-sm font-medium">
                    {selectedBooking.car.make} {selectedBooking.car.model}
                  </span>
                </div>
              )}

              {selectedBooking.pickupLocation && (
                <div className="border-t pt-3">
                  <span className="text-sm text-gray-600 flex items-start">
                    <FaMapMarkerAlt className="mr-2 mt-1 text-red-500" />
                    <div>
                      <p className="font-medium">Pickup Location:</p>
                      <p className="text-gray-700">
                        {typeof selectedBooking.pickupLocation === "string"
                          ? selectedBooking.pickupLocation
                          : selectedBooking.pickupLocation.address ||
                            "Location set"}
                      </p>
                    </div>
                  </span>
                </div>
              )}

              {selectedBooking.notes && (
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-600 mb-1">Notes:</p>
                  <p className="text-sm text-gray-700">
                    {selectedBooking.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingCalendar;
