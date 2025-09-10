import React, { useState, useEffect } from "react";
import { bookingsAPI } from "../services/api";
import {
  FaChartLine,
  FaUsers,
  FaDollarSign,
  FaCalendarAlt,
  FaClock,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaCaretUp,
  FaCaretDown,
} from "react-icons/fa";

interface AnalyticsData {
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
}

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching analytics with date range:", dateRange);
      const response = await bookingsAPI.getAnalytics({
        startDate: dateRange.start,
        endDate: dateRange.end,
      });
      console.log("Analytics API response:", response.data);
      if (response.data.data) {
        setAnalytics(response.data.data);
      } else {
        console.log("No data in response");
        setAnalytics(null);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setAnalytics(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-center text-gray-500">No analytics data available</p>
      </div>
    );
  }

  const { summary, instructorPerformance, peakHours, lessonTypes, dailyTrend } =
    analytics;

  // Format peak hours for display
  const peakHoursArray = Object.entries(peakHours || {})
    .map(([hour, count]) => ({
      hour: parseInt(hour),
      count: count as number,
      time: `${hour}:00`,
    }))
    .sort((a, b) => a.hour - b.hour);

  // Format lesson types
  const lessonTypeArray = Object.entries(lessonTypes || {}).map(
    ([type, count]) => ({
      type: type.replace("_", " "),
      count: count as number,
    })
  );

  // Calculate max values for bar charts
  const maxHourCount = Math.max(...peakHoursArray.map((h) => h.count), 1);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Business insights and performance metrics
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Date Range</h3>
            <div className="flex items-center space-x-4">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl">
                <FaCalendarAlt className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-gray-900">
                {summary.totalBookings}
              </h3>
              <p className="text-sm text-gray-600 mt-1">Total Bookings</p>
              <div className="mt-2 text-xs">
                <span className="text-green-600">
                  <FaCheckCircle className="inline mr-1" />
                  {summary.completedBookings} completed
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-xl">
                <FaDollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-gray-900">
                ${summary.revenue}
              </h3>
              <p className="text-sm text-gray-600 mt-1">Revenue</p>
              <div className="mt-2 text-xs text-gray-500">
                Based on completed lessons
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl">
                <FaChartLine className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-gray-900">
                {summary.completionRate}%
              </h3>
              <p className="text-sm text-gray-600 mt-1">Completion Rate</p>
              <div className="mt-2 flex items-center text-xs">
                {summary.completionRate > 70 ? (
                  <span className="text-green-600">
                    <FaCaretUp className="inline mr-1" />
                    Good performance
                  </span>
                ) : (
                  <span className="text-orange-600">
                    <FaCaretDown className="inline mr-1" />
                    Needs improvement
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="p-3 bg-gradient-to-br from-red-400 to-red-600 rounded-xl">
                <FaExclamationCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-gray-900">
                {summary.cancelledBookings + summary.noShowBookings}
              </h3>
              <p className="text-sm text-gray-600 mt-1">Missed Lessons</p>
              <div className="mt-2 text-xs">
                <span className="text-red-600">
                  {summary.cancelledBookings} cancelled,{" "}
                  {summary.noShowBookings} no-shows
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Instructor Performance */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FaUsers className="mr-3 text-blue-500" />
              Instructor Performance
            </h2>
            <div className="space-y-3">
              {instructorPerformance.map((instructor: any) => (
                <div
                  key={instructor.name}
                  className="p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {instructor.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {instructor.total} total lessons
                      </p>
                    </div>
                    {instructor.averageRating && (
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span className="font-semibold">
                          {instructor.averageRating}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-4 text-xs">
                    <span className="text-green-600">
                      <FaCheckCircle className="inline mr-1" />
                      {instructor.completed} completed
                    </span>
                    <span className="text-red-600">
                      <FaTimesCircle className="inline mr-1" />
                      {instructor.cancelled} cancelled
                    </span>
                    <span className="text-gray-600">
                      {instructor.noShow} no-shows
                    </span>
                  </div>
                </div>
              ))}
              {instructorPerformance.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No instructor data available
                </p>
              )}
            </div>
          </div>

          {/* Peak Hours */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FaClock className="mr-3 text-orange-500" />
              Peak Hours
            </h2>
            <div className="space-y-2">
              {peakHoursArray.map((hour) => (
                <div key={hour.hour} className="flex items-center">
                  <span className="text-sm text-gray-600 w-16">
                    {hour.time}
                  </span>
                  <div className="flex-1 mx-3">
                    <div className="bg-gray-200 rounded-full h-6 relative">
                      <div
                        className="bg-gradient-to-r from-orange-400 to-orange-600 h-6 rounded-full flex items-center justify-end pr-2"
                        style={{
                          width: `${(hour.count / maxHourCount) * 100}%`,
                        }}
                      >
                        <span className="text-xs text-white font-medium">
                          {hour.count}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {peakHoursArray.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No booking data available
                </p>
              )}
            </div>
          </div>

          {/* Lesson Types Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Lesson Types
            </h2>
            <div className="space-y-3">
              {lessonTypeArray.map((type) => (
                <div
                  key={type.type}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-700 capitalize">
                    {type.type}
                  </span>
                  <span className="font-bold text-gray-900">{type.count}</span>
                </div>
              ))}
              {lessonTypeArray.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No lesson data available
                </p>
              )}
            </div>
          </div>

          {/* Daily Trend */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Booking Trend
            </h2>
            <div className="text-sm text-gray-600">
              <p>Daily bookings over selected period</p>
              <div className="mt-4 space-y-1 max-h-48 overflow-y-auto">
                {Object.entries(dailyTrend).map(([date, count]) => (
                  <div
                    key={date}
                    className="flex justify-between py-1 border-b border-gray-100"
                  >
                    <span>{new Date(date).toLocaleDateString()}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
