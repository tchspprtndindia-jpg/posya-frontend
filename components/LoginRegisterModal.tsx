"use client";
import { useState } from "react";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface LoginRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginRegisterModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: LoginRegisterModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ 
    name: "", 
    phoneOrEmail: "",
    password: "", 
    password_confirmation: "" 
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  if (!isOpen) return null;

  // ✅ Login Handler (No OTP)
  const handleLogin = async () => {
    if (!form.phoneOrEmail || !form.password) {
      return toast.error("Please fill all fields");
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json" 
        },
        body: JSON.stringify({
          email: form.phoneOrEmail,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ Token check karo
      if (!data.token) {
        throw new Error("Token not received from server");
      }

      console.log("🔑 Login Token:", data.token);

      // ✅ Token save karo
      localStorage.setItem("token", data.token);
      
      toast.success("Login successful!");
      
      // ✅ Parent ko notify karo
      onSuccess();
      
      // Modal close karo
      onClose();
      
    } catch (err: any) {
      console.error("Login Error:", err);
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Register Handler (OTP required)
  const handleRegister = async () => {
    if (!form.name || !form.phoneOrEmail || !form.password) {
      return toast.error("Please fill all fields");
    }

    if (form.password !== form.password_confirmation) {
      return toast.error("Passwords don't match");
    }

    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json" 
        },
        body: JSON.stringify({
          name: form.name,
          phoneOrEmail: form.phoneOrEmail,
          password: form.password,
          password_confirmation: form.password_confirmation,
          role: "customer"
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setOtpSent(true);
      toast.success(`OTP sent to ${form.phoneOrEmail}`);
      
    } catch (err: any) {
      console.error("Register Error:", err);
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 4) {
      return toast.error("Please enter valid 4-digit OTP");
    }

    setLoading(true);
    try {
      // Step 1: Verify OTP
      const verifyRes = await fetch(`${BASE_URL}verify-otp`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json" 
        },
        body: JSON.stringify({ 
          identifier: form.phoneOrEmail, 
          otp: otp 
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        throw new Error(verifyData.message || "OTP verification failed");
      }

      toast.success("OTP verified!");

      // Step 2: Auto-login after verification
      const loginRes = await fetch(`${BASE_URL}login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json" 
        },
        body: JSON.stringify({
          email: form.phoneOrEmail,
          password: form.password,
        }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok || !loginData.token) {
        throw new Error("Auto-login failed after verification");
      }

      localStorage.setItem("token", loginData.token);
      
      toast.success("Registration & Login successful!");
      
      onSuccess();
      
      onClose();
      
    } catch (err: any) {
      console.error("OTP Verification Error:", err);
      toast.error(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl w-[450px] relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl font-bold"
        >
          ✕
        </button>

        {!otpSent ? (
          <>
            {/* Login/Register Tabs */}
            <div className="flex mb-6 border-b">
              <button
                className={`flex-1 pb-3 font-semibold transition ${
                  tab === "login" 
                    ? "text-[#0d3b2e] border-b-2 border-[#0d3b2e]" 
                    : "text-gray-500"
                }`}
                onClick={() => setTab("login")}
              >
                Login
              </button>
              <button
                className={`flex-1 pb-3 font-semibold transition ${
                  tab === "register" 
                    ? "text-[#0d3b2e] border-b-2 border-[#0d3b2e]" 
                    : "text-gray-500"
                }`}
                onClick={() => setTab("register")}
              >
                Register
              </button>
            </div>

            {/* Name (Register only) */}
            {tab === "register" && (
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-[#0d3b2e] focus:outline-none"
              />
            )}

            {/* Email or Phone */}
            <input
              type="text"
              placeholder="Email or Phone"
              value={form.phoneOrEmail}
              onChange={(e) => setForm({ ...form, phoneOrEmail: e.target.value })}
              className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-[#0d3b2e] focus:outline-none"
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-[#0d3b2e] focus:outline-none"
            />

            {/* Confirm Password (Register only) */}
            {tab === "register" && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={form.password_confirmation}
                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                className="border border-gray-300 p-3 w-full mb-6 rounded-lg focus:ring-2 focus:ring-[#0d3b2e] focus:outline-none"
              />
            )}

            {/* Submit Button */}
            <button
              onClick={tab === "login" ? handleLogin : handleRegister}
              disabled={loading}
              className="bg-[#0d3b2e] text-white w-full p-3 rounded-lg font-semibold hover:bg-[#145c45] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading 
                ? "Please wait..." 
                : tab === "login" 
                  ? "Login" 
                  : "Register & Send OTP"
              }
            </button>
          </>
        ) : (
          <>
            {/* OTP Verification Screen */}
            <h3 className="text-center font-bold text-xl mb-2 text-gray-800">
              Verify OTP
            </h3>
            <p className="text-center text-gray-500 mb-6 text-sm">
              Enter the 4-digit OTP sent to <strong>{form.phoneOrEmail}</strong>
            </p>
            
            <input
              type="text"
              placeholder="Enter 4-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
              maxLength={4}
              className="border border-gray-300 p-3 w-full mb-6 rounded-lg text-center text-2xl font-bold tracking-widest focus:ring-2 focus:ring-[#0d3b2e] focus:outline-none"
            />
            
            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 4}
              className="bg-green-600 text-white w-full p-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>

            <button
              onClick={() => {
                setOtpSent(false);
                setOtp("");
              }}
              className="text-gray-500 text-sm mt-4 w-full hover:text-gray-700"
            >
              ← Back to Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}