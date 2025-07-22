import React, { useState } from "react";
import { GoogleLogo, Eye, EyeSlash } from "phosphor-react";
import api from "../../api/api";

export default function LoginSignupScreen({ onLogin, onRegister }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [oauthLoading, setOauthLoading] = useState(false);

const inputClass = `w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 
focus:ring-2 focus:ring-purple-500 focus:bg-white/5 transition duration-300 
focus:scale-[1.03] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)] focus:z-10`;

  const handleGoogleLogin = () => {
    setOauthLoading(true);
    window.location.href = "https://fuznex.onrender.com/api/auth/google";
  };

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      if (mode === "signup") {
        if (password !== password2) {
          setError("Passwords must match");
          setLoading(false);
          return;
        }
        const { data } = await api.post("/users/register", {
          name,
          phone_number: phone,
          email,
          password,
        });
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        onRegister(data.user);
      } else {
        const { data } = await api.post("/users/login", { email, password });
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        onLogin(data.user);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.01)_90%,_rgba(128,90,213,0.07)_99%,_transparent_90%)] flex items-center justify-center font-sans px-4 py-8 relative overflow-hidden">
      
      {/* Background decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-purple-600 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_rgba(255,255,255,0.03)_0%,_rgba(128,90,213,0.1)_40%,_transparent_100%)]" />
      
      {/* Main card container */}
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-white/10 backdrop-blur-xl 
rounded-3xl p-6 space-y-3 shadow-2xl border border-violet-500/20 transition-all duration-500 z-10 bottom-10" >
          
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-1 bg-purple-500 rounded-b-md" />

        {/* Header */}
        <div className="text-center space-y-3 mb-6">
          <img src="/logo.svg" alt="FuzNex" className="mx-auto h-12" />
          <h1 className="text-white text-3xl font-bold">FuzNex Assistant</h1>
        </div>

        {/* Toggle Tabs with glassmorphic + animation */}
        <div className="flex items-center justify-center border-b border-gray-700 pb-2 transition-all">
          {["login", "signup"].map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError("");
              }}
              className={`mx-2 px-6 py-2 text-lg font-semibold transition-all duration-300 rounded-md backdrop-blur-md ${
                mode === m
                  ? "bg-purple-900/20 text-purple-200 border-b-2 border-purple-400"
                  : "text-gray-400  hover:text-white"
              }`}
            >
              {m === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="space-y-2">
          {mode === "signup" && (
            <>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                 className={inputClass}
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                     className={inputClass}              />
            </>
          )}
          <input
            type="email"
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}          />
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
               className={inputClass}
            />
            <button
              onClick={() => setShowPass(!showPass)}
              className="absolute top-1/2 right-4 -translate-y-1/4 text-gray-400 bg-transparent border-0 hover:scale-105 hover:text-indigo-200"
              type="button"
            >
              {showPass ? <EyeSlash size={22} /> : <Eye size={22} />}
            </button>
          </div>
          {/*
          {mode === "login" && (
            <div className="mt-1 text-left">
              <button className="text-xs font-medium underline text-gray-400 hover:text-white transition bg-transparent focus:outline-none">
                Forgot password?
              </button>
            </div>
          )} */}
          {mode === "signup" && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
               className={inputClass}
            />
          )}
        </div>

        {/* Error */}
        {error && <div className="text-red-400 text-sm text-center">{error}</div>}

        {/* Submit Button with glassmorphic look */}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full h-12 bg-purple-700/60 backdrop-blur-md hover:bg-purple-900 disabled:opacity-50 text-white font-bold rounded-lg text-lg transition border border-indigo-700/100 "
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
        </button>

        {/* OAuth */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            disabled={oauthLoading}
            className="w-full h-12 bg-white text-gray-800 flex items-center justify-center gap-3 rounded-lg border border-gray-300 hover:bg-gray-200 transition text-base font-medium"
          >
            <GoogleLogo size={22} />
            {oauthLoading ? "Redirecting..." : "Continue with Google"}
          </button>
        </div>
      </div>
    </div>
  );
}