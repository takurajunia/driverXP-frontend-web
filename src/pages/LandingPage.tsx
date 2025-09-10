import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Bell,
  Users,
  TrendingUp,
  Award,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle,
  Car,
  MessageCircle,
  X,
} from "lucide-react";
import Footer from "../components/layout/Footer";

export default function LandingPage() {
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);

  const whatsappNumber = "27715095239";
  const enrollMessage =
    "Hello! I'm interested in joining Sydney Driving School. Please tell me more about the enrollment.";
  const questionMessage = "Hello! I have a few questions about DriverXP.";

  const openWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <div className="text-xl font-bold text-gray-900">SYDNEY</div>
                  <div className="text-sm text-gray-600 -mt-1">
                    DRIVING SCHOOL
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                className="text-gray-700 hover:text-blue-600"
              >
                Book Lesson
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  openWhatsApp(enrollMessage);
                }}
                className="text-gray-700 hover:text-blue-600"
              >
                Contact Us
              </a>
              <button
                onClick={() => navigate("/login")}
                className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Book Your Lesson
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                Learn to Drive with
              </h1>
              <h1 className="text-4xl lg:text-5xl font-bold text-cyan-500 mb-6">
                DriverXP
              </h1>
              <p className="text-base md:text-lg text-gray-600 mb-8">
                Book driving lessons with ease using our innovative platform.
                Flexible scheduling, professional instructors, and real-time
                updates - all at your fingertips.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-sm md:text-base text-gray-700">
                    Easy Booking
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <span className="text-sm md:text-base text-gray-700">
                    Flexible Times
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Bell className="h-5 w-5 text-orange-600" />
                  </div>
                  <span className="text-sm md:text-base text-gray-700">
                    Smart Reminders
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 md:px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <Calendar className="h-5 w-5" />
                  Book Your First Lesson
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("about")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="px-6 md:px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  Learn More
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-cyan-200 rounded-3xl opacity-30 blur-3xl"></div>
              <img
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800"
                alt="Driving lesson"
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-blue-600">DriverXP</span>?
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Our innovative platform makes learning to drive easier, more
              convenient, and more effective than traditional methods.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Easy Booking System",
                description:
                  "Browse available lesson slots by date, instructor, or car type. Book your perfect lesson in just a few clicks with our intuitive interface.",
                color: "blue",
              },
              {
                icon: Bell,
                title: "Real-Time Updates",
                description:
                  "Stay informed with instant notifications about your lessons, changes, and important updates directly to your phone or email.",
                color: "orange",
              },
              {
                icon: Clock,
                title: "Flexible Scheduling",
                description:
                  "Reschedule or cancel lessons easily when life gets in the way. Our flexible system adapts to your changing schedule.",
                color: "cyan",
              },
              {
                icon: TrendingUp,
                title: "Progress Tracking",
                description:
                  "Monitor your learning journey with detailed progress reports and feedback from your instructors after each lesson.",
                color: "yellow",
              },
              {
                icon: Bell,
                title: "Smart Reminders",
                description:
                  "Never miss a lesson with automated reminders via email, SMS, and push notifications sent at optimal times.",
                color: "purple",
              },
              {
                icon: Users,
                title: "Instructor Matching",
                description:
                  "Find the perfect instructor based on your learning style, location preferences, and specific needs for optimal learning.",
                color: "green",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition"
              >
                <div
                  className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4`}
                >
                  <feature.icon
                    className={`h-6 w-6 text-${feature.color}-600`}
                  />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-4">
                  {feature.description}
                </p>
                <button
                  onClick={() => openWhatsApp(enrollMessage)}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm md:text-base"
                >
                  Join Now <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How <span className="text-blue-600">DriverXP</span> Works
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Getting started is easy! Follow these simple steps to book your
              first driving lesson and begin your journey to becoming a
              confident driver.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                step: "1",
                title: "Create Account",
                description:
                  "Sign up for your free DriverXP account with just your basic information. It takes less than 2 minutes!",
                icon: Users,
              },
              {
                step: "2",
                title: "Browse & Select",
                description:
                  "Browse available lessons by date, time, instructor, or vehicle type. Find the perfect match for your schedule and preferences.",
                icon: Calendar,
              },
              {
                step: "3",
                title: "Book & Learn",
                description:
                  "Confirm your booking and start learning! Get automated reminders and track your progress as you develop your driving skills.",
                icon: Car,
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div
                    className={`w-32 h-32 mx-auto rounded-full border-4 border-${
                      index === 0 ? "blue" : index === 1 ? "cyan" : "orange"
                    }-500 flex items-center justify-center bg-white`}
                  >
                    <item.icon
                      className={`h-12 w-12 text-${
                        index === 0 ? "blue" : index === 1 ? "cyan" : "orange"
                      }-500`}
                    />
                  </div>
                  <div
                    className={`absolute top-0 right-1/2 transform translate-x-12 -translate-y-2 w-10 h-10 bg-${
                      index === 0 ? "blue" : index === 1 ? "cyan" : "orange"
                    }-500 rounded-full text-white flex items-center justify-center font-bold`}
                  >
                    {item.step}
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate("/login")}
              className="px-6 md:px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2 text-sm md:text-base"
            >
              <ChevronRight className="h-5 w-5" />
              Start Your Journey
            </button>
            <button
              onClick={() => openWhatsApp(questionMessage)}
              className="ml-4 px-6 md:px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm md:text-base"
            >
              Have Questions?
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Start Your{" "}
            <span className="text-yellow-400">Driving Journey?</span>
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8">
            Join thousands of successful drivers who chose DriverXP. Book your
            first lesson today and experience the difference of modern,
            convenient driving education.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate("/login")}
              className="px-6 md:px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Calendar className="h-5 w-5" />
              Book Your First Lesson
            </button>
            <button
              onClick={() => setShowContactModal(true)}
              className="px-6 md:px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Phone className="h-5 w-5" />
              Call Us Now
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-white">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-sm md:text-base">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-yellow-400" />
              <span className="text-sm md:text-base">
                5,000+ Happy Students
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-400" />
              <span className="text-sm md:text-base">
                Fully Licensed & Insured
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Contact Us</h3>
              <button onClick={() => setShowContactModal(false)}>
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">Get in touch with us via:</p>
            <div className="space-y-3">
              <a
                href="tel:+27715095239"
                className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
              >
                <Phone className="h-5 w-5 text-blue-600" />
                <span className="text-gray-900 font-medium">
                  Call: +27 71 509 5239
                </span>
              </a>
              <button
                onClick={() => {
                  openWhatsApp(enrollMessage);
                  setShowContactModal(false);
                }}
                className="w-full flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition"
              >
                <MessageCircle className="h-5 w-5 text-green-600" />
                <span className="text-gray-900 font-medium">
                  WhatsApp: +27 71 509 5239
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
