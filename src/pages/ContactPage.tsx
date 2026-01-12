import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  CheckCircle,
  ArrowLeft,
  Car,
  Users,
  Award,
  Star,
} from "lucide-react";
import Footer from "../components/layout/Footer";
import logo from "../assets/full logo.jpg";

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitted(true);
    setIsSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 3000);
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

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-semibold transition-colors"
              >
                Home
              </button>
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
                Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-50 via-white to-red-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              Get in
              <span className="block bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Ready to start your driving journey? We're here to help you every step of the way. 
              Contact us today and let's get you road-ready!
            </p>
          </div>

          {/* Quick Contact Options */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <a
              href="tel:+27715095239"
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-4">Call Us</h3>
              <p className="text-gray-600 mb-4 font-medium">
                Speak directly with our team for immediate assistance
              </p>
              <p className="text-blue-600 font-bold text-lg">+27 71 509 5239</p>
            </a>

            <button
              onClick={() => openWhatsApp(enrollMessage)}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 text-left"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-4">WhatsApp</h3>
              <p className="text-gray-600 mb-4 font-medium">
                Quick and convenient messaging for instant responses
              </p>
              <p className="text-green-600 font-bold text-lg">Chat Now</p>
            </button>

            <a
              href="mailto:info@driverxp.com.za"
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-4">Email</h3>
              <p className="text-gray-600 mb-4 font-medium">
                Send us detailed inquiries and we'll respond promptly
              </p>
              <p className="text-red-600 font-bold text-lg">info@driverxp.com.za</p>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <h2 className="text-3xl font-black text-gray-900 mb-6">Send us a Message</h2>
              <p className="text-gray-600 mb-8 font-medium">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Message Sent!</h3>
                  <p className="text-gray-600 font-medium">
                    Thank you for contacting us. We'll respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                        placeholder="+27 12 345 6789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                      >
                        <option value="">Select a subject</option>
                        <option value="enrollment">New Student Enrollment</option>
                        <option value="booking">Lesson Booking</option>
                        <option value="pricing">Pricing Information</option>
                        <option value="support">Technical Support</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-medium"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Office Hours */}
              <div className="bg-gradient-to-br from-blue-50 to-red-50 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">Office Hours</h3>
                </div>
                <div className="space-y-3 font-medium">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday:</span>
                    <span className="text-gray-900 font-bold">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday:</span>
                    <span className="text-gray-900 font-bold">9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday:</span>
                    <span className="text-gray-900 font-bold">10:00 AM - 2:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">Our Location</h3>
                </div>
                <p className="text-gray-600 font-medium mb-4">
                  We're conveniently located in Sydney, South Africa. Our modern facility 
                  features state-of-the-art training rooms and a fleet of well-maintained vehicles.
                </p>
                <p className="text-gray-900 font-bold">
                  Sydney, South Africa
                </p>
              </div>

              {/* Why Choose Us */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-black text-gray-900 mb-6">Why Choose DriverXP?</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <Car className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Modern Fleet</p>
                      <p className="text-sm text-gray-600 font-medium">Latest model vehicles with safety features</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Expert Instructors</p>
                      <p className="text-sm text-gray-600 font-medium">Certified professionals with years of experience</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                      <Star className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">4.9★ Rating</p>
                      <p className="text-sm text-gray-600 font-medium">Trusted by over 5,000 happy students</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">98% Pass Rate</p>
                      <p className="text-sm text-gray-600 font-medium">Industry-leading success rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-blue-700 to-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">
            Ready to Start
            <span className="block text-yellow-300">Your Journey?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 font-medium">
            Don't wait any longer. Book your first lesson today and experience 
            the DriverXP difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 bg-white text-blue-600 rounded-full hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3 text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Car className="w-5 h-5" />
              Login to Book Lessons
            </button>
            <button
              onClick={() => openWhatsApp(enrollMessage)}
              className="px-8 py-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-3 text-lg font-bold"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}