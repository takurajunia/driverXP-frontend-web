import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaCar,
  FaMapMarkerAlt,
  FaStickyNote,
  FaChevronRight,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { bookingsAPI, usersAPI, carsAPI } from "../services/api";
import type { User, Car, BookingFormData } from "../types";
import LocationPicker from "./LocationPicker";

interface BookingFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [instructors, setInstructors] = useState<User[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<string>("");
  const [selectedCar, setSelectedCar] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [lessonType, setLessonType] = useState<
    "theory" | "practical" | "test_preparation" | "road_test"
  >("practical");
  const [pickupLocation, setPickupLocation] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>(null);

  // Fetch instructors and cars on mount
  useEffect(() => {
    fetchInstructors();
    fetchCars();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await usersAPI.getInstructors();
      setInstructors(response.data.data?.instructors || []);
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  };

  const fetchCars = async () => {
    try {
      const response = await carsAPI.getAvailableCars();
      setCars(response.data.data?.cars || []);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  // Auto-calculate end time when start time changes (2-hour default)
  useEffect(() => {
    if (startTime) {
      const [hours, minutes] = startTime.split(":").map(Number);
      const endHours = hours + 2; // 2-hour lesson by default
      const formattedEndTime = `${endHours
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
      setEndTime(formattedEndTime);
    }
  }, [startTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validation
    if (
      !selectedDate ||
      !selectedInstructor ||
      !startTime ||
      !endTime ||
      !pickupLocation
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const bookingData: BookingFormData = {
        instructorId: selectedInstructor,
        carId: selectedCar || undefined,
        lessonDate: selectedDate.toISOString().split("T")[0],
        startTime,
        endTime,
        lessonType,
        pickupLocation: selectedLocation || { address: pickupLocation },
        notes: notes || undefined,
      };

      await bookingsAPI.createBooking(bookingData);
      setSuccessMessage("Booking created successfully!");

      // Reset form
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
    } catch (error: any) {
      console.error("Error creating booking:", error);
      setError(
        error.response?.data?.message ||
          "Failed to create booking. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Generate time slots (every 30 minutes from 6 AM to 8 PM)
  const timeSlots = [];
  for (let hour = 6; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      timeSlots.push(time);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <FaCalendarAlt className="mr-3" />
            Book Your Driving Lesson
          </h2>
          <p className="text-blue-100 mt-2">
            Schedule your next lesson with our experienced instructors
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Success/Error Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
              <FaTimes className="mr-2" />
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center">
              <FaCheck className="mr-2" />
              {successMessage}
            </div>
          )}

          {/* Lesson Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Lesson Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: "practical", label: "Practical" },
                { value: "theory", label: "Theory" },
                { value: "test_preparation", label: "Test Prep" },
                { value: "road_test", label: "Road Test" },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setLessonType(type.value as any)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    lessonType === type.value
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendarAlt className="inline mr-2 text-blue-500" />
                Lesson Date *
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                minDate={new Date()}
                dateFormat="EEEE, MMMM d, yyyy"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholderText="Select a date"
                required
              />
            </div>

            {/* Instructor Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUser className="inline mr-2 text-green-500" />
                Select Instructor *
              </label>
              <select
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Choose an instructor</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.firstName} {instructor.lastName}
                    {instructor.licenseNumber &&
                      ` - License: ${instructor.licenseNumber}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaClock className="inline mr-2 text-orange-500" />
                Start Time *
              </label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select start time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaClock className="inline mr-2 text-orange-500" />
                End Time *
              </label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select end time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* Car Selection (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCar className="inline mr-2 text-purple-500" />
                Select Vehicle (Optional)
              </label>
              <select
                value={selectedCar}
                onChange={(e) => setSelectedCar(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any available vehicle</option>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.make} {car.model} ({car.year}) - {car.transmission} -{" "}
                    {car.registration}
                  </option>
                ))}
              </select>
            </div>

            {/* Pickup Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2 text-red-500" />
                Pickup Location *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="Enter pickup address"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {typeof window !== "undefined" &&
                  window.google &&
                  window.google.maps && (
                    <button
                      type="button"
                      onClick={() => setIsLocationPickerOpen(true)}
                      className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center"
                    >
                      <FaMapMarkerAlt className="mr-2" />
                      Map
                    </button>
                  )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaStickyNote className="inline mr-2 text-yellow-500" />
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any special requirements or notes for your instructor..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Booking...
                </>
              ) : (
                <>
                  Confirm Booking
                  <FaChevronRight className="ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Location Picker Modal */}
      <LocationPicker
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onLocationSelect={(location) => {
          setSelectedLocation(location);
          setPickupLocation(location.address);
          setIsLocationPickerOpen(false);
        }}
        initialLocation={selectedLocation || undefined}
      />
    </div>
  );
};

export default BookingForm;
