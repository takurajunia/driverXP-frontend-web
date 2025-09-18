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
  Shield,
  BookOpen,
  Target,
  Zap,
  ArrowRight,
  Play,
} from "lucide-react";
import Footer from "../components/layout/Footer";
import logo from "../assets/full logo.jpg";

export default function LandingPage() {
  const navigate = useNavigate();

  const whatsappNumber = "27715095239";
  const enrollMessage =
    "Hello! I'm interested in joining Sydney Driving School. Please tell me more about the enrollment.";

  const openWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <img src={logo} alt="Sydney Driving School" className="h-12" />
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
              >
                How It Works
              </a>
              <a
                href="#contact"
                onClick={() => navigate("/contact")}
                className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
              >
                Contact
              </a>
              <button
                onClick={() => openWhatsApp(enrollMessage)}
                className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex items-center font-semibold"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-bold"
              >
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => openWhatsApp(enrollMessage)}
                className="px-3 py-2 bg-green-500 text-white rounded-full text-sm font-semibold mr-2"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full text-sm font-bold"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-red-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4 mr-2" />
                South Africa's Most Advanced Driving Platform
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
                Master the
                <span className="block bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                  Road with
                </span>
                <span className="block text-blue-600">DriverXP</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl font-medium">
                Experience the future of driving education with our revolutionary platform. 
                Smart scheduling, expert instructors, and personalized learning paths - all designed 
                to get you road-ready faster than ever.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={() => navigate("/login")}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold text-lg flex items-center justify-center"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Start Learning Today
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-black text-blue-600 mb-1">5,000+</div>
                  <div className="text-sm text-gray-600 font-medium">Happy Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-red-600 mb-1">4.9★</div>
                  <div className="text-sm text-gray-600 font-medium">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-blue-600 mb-1">98%</div>
                  <div className="text-sm text-gray-600 font-medium">Pass Rate</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-red-400 rounded-3xl opacity-20 blur-3xl transform rotate-6"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800"
                  alt="Professional driving instruction"
                  className="rounded-2xl w-full"
                />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-red-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Lesson Complete!</div>
                      <div className="text-sm text-gray-600 font-medium">Great progress today</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-6">
              <Target className="w-4 h-4 mr-2" />
              Why Choose DriverXP
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight">
              The Smart Way to
              <span className="block bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                Learn Driving
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Our cutting-edge platform combines traditional driving expertise with modern technology 
              to deliver an unmatched learning experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Smart Booking System",
                description:
                  "AI-powered scheduling that finds the perfect lesson slots based on your availability, learning pace, and instructor preferences.",
                color: "blue",
                gradient: "from-blue-500 to-blue-600",
              },
              {
                icon: Bell,
                title: "Real-Time Updates",
                description:
                  "Stay connected with instant notifications, live tracking, and seamless communication with your instructor.",
                color: "red",
                gradient: "from-red-500 to-red-600",
              },
              {
                icon: Clock,
                title: "Flexible Scheduling",
                description:
                  "Life happens. Easily reschedule or modify your lessons with our flexible booking system that adapts to your needs.",
                color: "blue",
                gradient: "from-blue-500 to-blue-600",
              },
              {
                icon: TrendingUp,
                title: "Progress Analytics",
                description:
                  "Track your improvement with detailed analytics, personalized feedback, and milestone celebrations.",
                color: "red",
                gradient: "from-red-500 to-red-600",
              },
              {
                icon: Shield,
                title: "Safety First",
                description:
                  "All instructors are fully certified, vehicles are regularly maintained, and safety protocols are strictly followed.",
                color: "blue",
                gradient: "from-blue-500 to-blue-600",
              },
              {
                icon: Users,
                title: "Expert Instructors",
                description:
                  "Learn from Sydney's best driving instructors, carefully selected and continuously trained to deliver exceptional results.",
                color: "red",
                gradient: "from-red-500 to-red-600",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6 font-medium">
                    {feature.description}
                  </p>
                  <button
                    onClick={() => openWhatsApp(enrollMessage)}
                    className={`text-${feature.color}-600 hover:text-${feature.color}-700 font-bold flex items-center group-hover:translate-x-2 transition-transform duration-300`}
                  >
                    Learn More <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4 mr-2" />
              Simple Process
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight">
              Get Started in
              <span className="block bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                Three Easy Steps
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              From enrollment to your first lesson, we've streamlined the entire process 
              to get you behind the wheel as quickly as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-16">
            {[
              {
                step: "01",
                title: "Quick Enrollment",
                description:
                  "Join Sydney Driving School and request your DriverXP account via WhatsApp. Our team will set up your profile within 24 hours.",
                icon: Users,
                color: "blue",
              },
              {
                step: "02",
                title: "Smart Matching",
                description:
                  "Our AI matches you with the perfect instructor based on your location, schedule, learning style, and specific requirements.",
                icon: Target,
                color: "red",
              },
              {
                step: "03",
                title: "Start Learning",
                description:
                  "Book your first lesson, receive automated reminders, and begin your journey to becoming a confident, skilled driver.",
                icon: Car,
                color: "blue",
              },
            ].map((item, index) => (
              <div key={index} className="relative text-center group">
                {/* Connection Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-20 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-200 to-red-200 transform translate-x-1/2 z-0"></div>
                )}
                
                <div className="relative z-10">
                  <div className={`w-40 h-40 mx-auto rounded-full border-4 ${
                    item.color === 'blue' ? 'border-blue-500 bg-blue-50' : 'border-red-500 bg-red-50'
                  } flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 relative`}>
                    <item.icon className={`w-16 h-16 ${
                      item.color === 'blue' ? 'text-blue-600' : 'text-red-600'
                    }`} />
                    <div className={`absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r ${
                      item.color === 'blue' ? 'from-blue-500 to-blue-600' : 'from-red-500 to-red-600'
                    } rounded-full text-white flex items-center justify-center font-bold text-lg shadow-lg`}>
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed max-w-sm mx-auto font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold text-lg inline-flex items-center"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Begin Your Journey
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="ml-4 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full hover:border-blue-600 hover:text-blue-600 transition-all duration-300 font-bold text-lg"
            >
              Have Questions?
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-blue-700 to-red-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">
            Ready to Transform Your
            <span className="block text-yellow-300">Driving Future?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-12 leading-relaxed font-medium">
            Join thousands of successful drivers who chose DriverXP for their journey. 
            Experience the perfect blend of traditional expertise and modern innovation.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 bg-white text-blue-600 rounded-full hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3 text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Calendar className="w-5 h-5" />
              Book Your First Lesson
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-3 text-lg font-bold"
            >
              <Phone className="w-5 h-5" />
              Speak to an Expert
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-800" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-black">4.9/5</div>
                <div className="text-blue-100 text-sm font-medium">Student Rating</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-yellow-800" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-black">5,000+</div>
                <div className="text-blue-100 text-sm font-medium">Happy Students</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-800" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-black">Licensed</div>
                <div className="text-blue-100 text-sm font-medium">& Insured</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
