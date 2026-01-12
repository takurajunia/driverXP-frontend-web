import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import { Eye, EyeOff, Car, MessageCircle } from "lucide-react";
import logoFull from "/full logo.jpg";

const LoginPage: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [loading, setLoading] = useState(false);

  // WhatsApp signup configuration
  const signupMessage = "Hello! I'm interested in joining Sydney Driving School. Please tell me more about the enrollment.";
  
  const openWhatsApp = (message: string) => {
    const phoneNumber = "27715095239"; // +27 71 509 5239 without spaces and plus
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted!");
    console.log("Email:", email, "Password:", password);
    setError("");

    try {
      console.log("Calling login API...");
      const result = await login({ email, password });
      console.log("Full login response:", result); // Add this line
      console.log("Login successful!");
    } catch (err: any) {
      console.log("Login error:", err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  // Add forgot password handler
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResetMessage(null);
    
    try {
      await authAPI.forgotPassword(resetEmail);
      setResetMessage({
        type: 'success',
        text: 'If an account exists with this email, a password reset link has been sent.'
      });
      setResetEmail('');
    } catch (error) {
      setResetMessage({
        type: 'error',
        text: 'Failed to send reset email. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 test-red">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <img
              src={logoFull}
              alt="Sydney Driving School"
              className="w-64 mx-auto mb-4"
            />
            <p className="text-sm text-gray-500">Powered by</p>
            <p className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-400">
              DriverXP
            </p>

            <p className="text-sm text-gray-500">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="input-field"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="input-field pr-12"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Sign Up via WhatsApp */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">Don't have an account?</p>
            <button
              onClick={() => openWhatsApp(signupMessage)}
              className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center font-semibold"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Sign Up Via WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reset Password</h3>
            
            {resetMessage && (
              <div className={`mb-4 p-3 rounded-lg ${
                resetMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {resetMessage.text}
              </div>
            )}
            
            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                required
              />
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetMessage(null);
                    setResetEmail('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
