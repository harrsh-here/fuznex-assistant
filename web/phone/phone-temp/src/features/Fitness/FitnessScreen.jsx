import React, { useEffect, useState } from "react";

export default function FitnessScreen() {
  const circleRadius = 40;
  const circleCircumference = 2 * Math.PI * circleRadius;

  const targetSteps = Math.floor(Math.random() * (10000 - 4000 + 1)) + 4000;
  const targetCalories = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
  const targetWater = parseFloat((Math.random() * (3 - 1) + 1).toFixed(1));
  const targetSleep = parseFloat((Math.random() * (9 - 5) + 5).toFixed(1));

  const [steps, setSteps] = useState(0);
  const [calories, setCalories] = useState(0);
  const [water, setWater] = useState(0);
  const [sleep, setSleep] = useState(0);
  const [ringOffset, setRingOffset] = useState(circleCircumference);

  const [status, setStatus] = useState({
    steps: "loading",
    ring: "pending",
    calories: "pending",
    water: "pending",
    sleep: "pending",
  });

  useEffect(() => {
    const animateValue = (setter, target, step = 1, speed = 10, onComplete) => {
      let current = 0;
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          setter(target);
          clearInterval(interval);
          if (onComplete) onComplete();
        } else {
          setter(Number(current.toFixed(1)));
        }
      }, speed);
    };

    setStatus((prev) => ({ ...prev, steps: "loading" }));

    animateValue(setSteps, targetSteps, 50, 15, () => {
      setStatus((prev) => ({ ...prev, steps: "done", ring: "loading" }));
      const finalOffset = circleCircumference * (1 - targetSteps / 10000);
      setTimeout(() => {
        setRingOffset(finalOffset);
        setTimeout(() => {
          setStatus((prev) => ({ ...prev, ring: "done", calories: "loading" }));
          animateValue(setCalories, targetCalories, 5, 20, () => {
            setStatus((prev) => ({ ...prev, calories: "done", water: "loading" }));
            animateValue(setWater, targetWater, 0.05, 30, () => {
              setStatus((prev) => ({ ...prev, water: "done", sleep: "loading" }));
              animateValue(setSleep, targetSleep, 0.1, 30, () => {
                setStatus((prev) => ({ ...prev, sleep: "done" }));
              });
            });
          });
        }, 500);
      }, 500);
    });
  }, []);

  const shimmer = (
    <span className="inline-block w-16 h-4 bg-gray-700 rounded animate-pulse mt-1"></span>
  );

  return (
    <div className="flex flex-col h-full px-5 py-6 pt-12 text-white overflow-hidden">
      <h2 className="text-2xl font-semibold mb-6">Your Fitness Summary</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Steps */}
        <div className="flex flex-col items-center justify-between bg-[#1e1e1e] rounded-2xl p-4 border border-[#2a2a2a] shadow w-40 h-40 transition-all duration-500">
          <div className="relative w-24 h-24">
            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={circleRadius}
                stroke="#2a2a2a"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r={circleRadius}
                stroke="#a855f7"
                strokeWidth="8"
                fill="none"
                strokeDasharray={circleCircumference}
                strokeDashoffset={ringOffset}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{
                  transition: "stroke-dashoffset 3.5s cubic-bezier(0.25, 1, 0.5, 1)",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-gray-300 opacity-100">👣</p>
            </div>
          </div>
          <p className="text-sm font-bold text-white text-center mt-1">
            {status.steps === "done" || status.steps === "loading"
              ? `${Math.floor(steps).toLocaleString()} / 10,000`
              : shimmer}
          </p>
        </div>

        {/* Calories */}
        <div className="flex flex-col items-center justify-center bg-[#1e1e1e] rounded-2xl p-4 border border-[#2a2a2a] shadow w-40 h-40 transition-all duration-500">
          <p className="text-4xl opacity-100">🔥</p>
          <p className="text-xs text-gray-400 mt-1">Calories Burned</p>
          <p className="text-sm font-bold text-white mt-1">
            {status.calories === "loading" || status.calories === "done"
              ? `${Math.floor(calories)} kcal`
              : shimmer}
          </p>
        </div>

        {/* Water */}
        <div className="flex flex-col items-center justify-center bg-[#1e1e1e] rounded-2xl p-4 border border-[#2a2a2a] shadow w-40 h-40 transition-all duration-500">
          <p className="text-4xl opacity-100">💧</p>
          <p className="text-xs text-gray-400 mt-1">Water Intake</p>
          <p className="text-sm font-bold text-white mt-1">
            {status.water === "loading" || status.water === "done"
              ? `${water.toFixed(1)} L`
              : shimmer}
          </p>
        </div>

        {/* Sleep */}
        <div className="flex flex-col items-center justify-center bg-[#1e1e1e] rounded-2xl p-4 border border-[#2a2a2a] shadow w-40 h-40 transition-all duration-500">
          <p className="text-4xl opacity-100">🛌</p>
          <p className="text-xs text-gray-400 mt-1">Sleep</p>
          <p className="text-sm font-bold text-white mt-1">
            {status.sleep === "loading" || status.sleep === "done"
              ? `${sleep.toFixed(1)} hrs`
              : shimmer}
          </p>
        </div>
      </div>

      <p className="text-xs text-center text-gray-400 mt-6">
        ⚙️ This feature is yet to be implemented and connected soon. These numbers are just for simulation purposes as of now. Thanks for your patience — keep testing!
      </p>
    </div>
  );
}
