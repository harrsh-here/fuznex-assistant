import React, { useState } from "react";
import { GoogleLogo, WindowsLogo, Eye, EyeSlash } from "phosphor-react";
import bgImage from "../../assets/background.png";
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
    <div className="absolute inset-0 bg-[#101010] flex items-center justify-center font-sans px-4 py-8">
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg bg-transparent backdrop-blur-xl border border-purple-500 rounded-3xl p-6 xs:p-5 space-y-3 shadow-0xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-1 bg-purple-500 rounded-b-md" />

        {/* Header */}
        <div className="text-center space-y-3 mb-6">
          <img src="/logo.svg" alt="FuzNex" className="mx-auto h-12" />
          <h1 className="text-white text-3xl font-bold">FuzNex Assistant</h1>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center justify-center border-b border-gray-700 pb-2">
          {["login", "signup"].map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setError("");
              }}
              className={`mx-2 px-6 py-2 text-lg font-semibold transition border-b-2 ${
                mode === m
                  ? "text-purple-400 border-purple-400"
                  : "text-gray-400 border-transparent"
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
                className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:bg-white/5 transition"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:bg-white/5 transition"
              />
            </>
          )}
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:bg-white/5 transition"
          />
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:bg-white/5 transition"
            />
            <button
              onClick={() => setShowPass(!showPass)}
              className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400"
              type="button"
            >
              {showPass ? <EyeSlash size={22} /> : <Eye size={22} />}
            </button>
          </div>
          {mode === "login" && (
            <div className="mt-1 text-left">
              <button className="text-xs font-medium underline text-gray-400 hover:text-white transition bg-transparent focus:outline-none">
                Forgot password?
              </button>
            </div>
          )}
          {mode === "signup" && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:bg-white/1 transition"
            />
          )}
        </div>

        {/* Error */}
        {error && <div className="text-red-400 text-sm text-center">{error}</div>}

        {/* Submit */}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full h-12 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-bold rounded-lg text-lg transition"
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
        </button>

        {/* OAuth */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            disabled={oauthLoading}
            className="w-full h-12 bg-white text-gray-800 flex items-center justify-center gap-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-base font-medium"
          >
            <GoogleLogo size={22} />{" "}
            {oauthLoading ? "Redirecting..." : "Continue with Google"}
          </button>
        </div>

        {/* Footer */}
        {mode === "signup" && (
          <div className="text-center text-sm text-gray-400">
            <p>
              By signing up you agree to our{" "}
              <button className="underline hover:text-white transition">
                Terms & Privacy
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
