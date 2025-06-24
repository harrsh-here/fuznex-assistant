// src/features/Profile/EditProfileScreen.jsx
import React, { useState } from "react";
import { ArrowLeft, Eye, EyeSlash } from "phosphor-react";

export default function EditProfileScreen({ user, onBack }) {
  const [overlay, setOverlay] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    password: "",
    confirmPassword: "",
    avatar: user?.avatar_url || "/profile-pictures/default-avatar.png",
  });
  const [verification, setVerification] = useState({ email: false, phone: false });
  const [showPassword, setShowPassword] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    setUnsavedChanges(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => handleChange("avatar", reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    if (unsavedChanges) {
      setConfirmCancel(true);
    } else {
      onBack();
    }
  };

  const renderOverlay = () => {
    switch (overlay) {
      case "name":
        return (
          <div className="absolute inset-0 z-50 bg-black/80 flex flex-col justify-center px-6">
            <div className="bg-[#121212] p-5 rounded-2xl space-y-4">
              <label className="text-white text-sm">New Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-3 py-2 bg-[#1f1f1f] text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setOverlay(null)} className="text-gray-400 text-sm">Cancel</button>
                <button className="text-purple-400 text-sm" onClick={() => setOverlay(null)}>Done</button>
              </div>
            </div>
          </div>
        );
      case "email":
        return (
          <div className="absolute inset-0 z-50 bg-black/80 flex flex-col justify-center px-6">
            <div className="bg-[#121212] p-5 rounded-2xl space-y-4">
              <label className="text-white text-sm">New Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-3 py-2 bg-[#1f1f1f] text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500"
              />
              <button className="w-full py-2 bg-purple-600 text-white rounded-lg text-sm">
                Verify with OTP
              </button>
              <div className="flex justify-end gap-3">
                <button onClick={() => setOverlay(null)} className="text-gray-400 text-sm">Cancel</button>
                <button
                  disabled={!verification.email}
                  className={`text-sm ${verification.email ? "text-purple-400" : "text-gray-500"}`}
                  onClick={() => setOverlay(null)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        );
      case "phone":
        return (
          <div className="absolute inset-0 z-50 bg-black/80 flex flex-col justify-center px-6">
            <div className="bg-[#121212] p-5 rounded-2xl space-y-4">
              <label className="text-white text-sm">New Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-3 py-2 bg-[#1f1f1f] text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500"
              />
              <button className="w-full py-2 bg-purple-600 text-white rounded-lg text-sm">
                Verify with OTP
              </button>
              <div className="flex justify-end gap-3">
                <button onClick={() => setOverlay(null)} className="text-gray-400 text-sm">Cancel</button>
                <button
                  disabled={!verification.phone}
                  className={`text-sm ${verification.phone ? "text-purple-400" : "text-gray-500"}`}
                  onClick={() => setOverlay(null)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        );
      case "password":
        return (
          <div className="absolute inset-0 z-50 bg-black/80 flex flex-col justify-center px-6">
            <div className="bg-[#121212] p-5 rounded-2xl space-y-4">
              <label className="text-white text-sm">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full px-3 py-2 bg-[#1f1f1f] text-white rounded-lg border border-gray-600"
              />
              <label className="text-white text-sm">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                className="w-full px-3 py-2 bg-[#1f1f1f] text-white rounded-lg border border-gray-600"
              />
              <button onClick={() => setShowPassword(!showPassword)} className="text-sm text-purple-400">
                {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />} Show Password
              </button>
              <div className="flex justify-end gap-3">
                <button onClick={() => setOverlay(null)} className="text-gray-400 text-sm">Cancel</button>
                <button className="text-purple-400 text-sm" onClick={() => setOverlay(null)}>Done</button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-full px-5 py-6 pt-12 text-white bg-[#0d0d0d]">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handleCancel}
          className="text-purple-400 hover:text-white transition"
        >
          ← Back
        </button>
        <h2 className="text-xl font-bold">Edit Profile</h2>
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={formData.avatar || "/profile-pictures/default-avatar.png"}
          className="w-20 h-20 rounded-full border border-gray-500 object-cover"
          alt="Avatar"
        />
        <label className="mt-2 text-sm text-purple-400 underline cursor-pointer">
          Change Profile Picture
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      </div>

      {/* Edit Fields */}
      <div className="space-y-4">
        <button
          onClick={() => setOverlay("name")}
          className="w-full py-2 text-left text-purple-400 border-b border-[#2a2a2a]"
        >
          Change Name
        </button>
        <button
          onClick={() => setOverlay("email")}
          className="w-full py-2 text-left text-purple-400 border-b border-[#2a2a2a]"
        >
          Change Email
        </button>
        <button
          onClick={() => setOverlay("phone")}
          className="w-full py-2 text-left text-purple-400 border-b border-[#2a2a2a]"
        >
          Change Phone Number
        </button>
        <button
          onClick={() => setOverlay("password")}
          className="w-full py-2 text-left text-purple-400 border-b border-[#2a2a2a]"
        >
          Change Password
        </button>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 space-y-3">
        <button className="w-full py-3 rounded-xl bg-purple-600 text-white text-sm font-semibold">
          Save & Exit
        </button>
        <button onClick={handleCancel} className="w-full py-3 rounded-xl border border-gray-600 text-white text-sm">
          Cancel
        </button>
      </div>

      {renderOverlay()}

      {confirmCancel && (
        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-[#121212] p-6 rounded-2xl text-center space-y-4">
            <p className="text-white text-sm">You have unsaved changes. Are you sure you want to discard them?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setConfirmCancel(false)} className="text-gray-400 border border-gray-600 px-4 py-2 rounded-lg text-sm">
                No
              </button>
              <button onClick={onBack} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
                Yes, Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
