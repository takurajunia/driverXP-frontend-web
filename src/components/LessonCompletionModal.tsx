import React, { useState } from "react";
import { bookingsAPI } from "../services/api";
import { FaTimes, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import type { Booking } from "../types";

interface LessonCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  action: "complete" | "no_show";
  onSuccess: () => void;
}

const LessonCompletionModal: React.FC<LessonCompletionModalProps> = ({
  isOpen,
  onClose,
  booking,
  action,
  onSuccess,
}) => {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!booking) return;

    setIsSubmitting(true);

    try {
      await bookingsAPI.updateBookingStatus(booking.id, {
        status: action === "complete" ? "completed" : "no_show",
        instructorNotes: notes.trim() || undefined,
      });

      onSuccess();
      onClose();
      setNotes("");
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update lesson status");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !booking) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {action === "complete" ? "Mark Lesson Complete" : "Mark as No-Show"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Lesson Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Student:</span>{" "}
              {booking.student?.firstName} {booking.student?.lastName}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Date:</span>{" "}
              {formatDate(booking.lessonDate)}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Time:</span>{" "}
              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Type:</span>{" "}
              {booking.lessonType.replace("_", " ")}
            </p>
          </div>

          {/* Status Message */}
          <div
            className={`mb-6 p-4 rounded-lg flex items-start ${
              action === "complete"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {action === "complete" ? (
              <>
                <FaCheckCircle className="text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-green-900 font-medium">
                    Marking as Completed
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    This lesson will be marked as successfully completed. The
                    student will be able to provide feedback.
                  </p>
                </div>
              </>
            ) : (
              <>
                <FaExclamationCircle className="text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-red-900 font-medium">Marking as No-Show</p>
                  <p className="text-red-700 text-sm mt-1">
                    This indicates the student did not attend the scheduled
                    lesson.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Instructor Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructor Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder={
                action === "complete"
                  ? "Add any notes about the lesson, student progress, areas to work on..."
                  : "Add any notes about the no-show..."
              }
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50 ${
                action === "complete"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isSubmitting
                ? "Updating..."
                : action === "complete"
                ? "Mark Complete"
                : "Mark No-Show"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LessonCompletionModal;
