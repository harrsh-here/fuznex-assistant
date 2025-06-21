import React from 'react';

export default function AppShell({ children, activePath, onNavigate }) {
  const tabs = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/tasks', icon: '📅', label: 'Tasks' },
    { path: '/fitness', icon: '💪', label: 'Fitness' },
    { path: '/history', icon: '⏳', label: 'History' },
    { path: '/profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
      <div className="w-[375px] h-[812px] mx-auto mt-8 border-[14px] border-black rounded-[50px] shadow-2xl overflow-hidden relative bg-white">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-10"></div>

        {/* Screen Content */}
        <div className="flex flex-col h-full pt-8 pb-16 px-4">
          {children}
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 w-full bg-white border-t px-4 py-2 flex justify-between">
          {tabs.map(({ path, icon, label }) => {
            const isActive = activePath === path;
            return (
              <button
                key={path}
                onClick={() => onNavigate(path)}
                className={`flex flex-col items-center text-xs ${isActive ? 'text-blue-500' : 'text-gray-600'}`}
              >
                <span className="text-xl">{icon}</span>
                <span className="mt-1">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

