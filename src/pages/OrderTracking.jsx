import { useState } from "react";

const stages = [
  { key: "submitted", label: "Order submitted", icon: "ti-file-text", time: "09:02 AM" },
  { key: "review", label: "Reviewed by pharmacist", icon: "ti-stethoscope", time: "09:18 AM" },
  { key: "quoted", label: "Quotation sent", icon: "ti-receipt", time: "09:25 AM" },
  { key: "paid", label: "Payment received", icon: "ti-credit-card", time: "09:40 AM" },
  { key: "packed", label: "Order packed", icon: "ti-package", time: "10:05 AM" },
  { key: "dispatched", label: "Dispatched to driver", icon: "ti-truck", time: "10:20 AM" },
  { key: "out_for_delivery", label: "Out for delivery", icon: "ti-map-pin", time: "10:32 AM" },
  { key: "delivered", label: "Delivered", icon: "ti-check", time: null },
];

export default function OrderTracking({ orderNumber = "KP-20413" }) {
  const [currentIndex, setCurrentIndex] = useState(6);

  const handleNext = () => {
    setCurrentIndex((i) => Math.min(i + 1, stages.length - 1));
  };

  // Driver marker position along the route (branch -> customer)
  let driverPos = null;
  let etaText = "Preparing your order";
  if (currentIndex >= 6 && currentIndex < 7) {
    const progress = 0.55;
    driverPos = { x: 40 + (600 - 40) * progress, y: 120 + (60 - 120) * progress };
    etaText = "Driver is about 8 minutes away";
  } else if (currentIndex >= 7) {
    driverPos = { x: 600, y: 60 };
    etaText = "Delivered";
  } else if (currentIndex >= 5) {
    driverPos = { x: 40, y: 120 };
    etaText = "Driver is collecting your order";
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-500">Order #{orderNumber}</p>
          <p className="text-lg font-medium">{stages[currentIndex].label}</p>
        </div>
        <button
          onClick={handleNext}
          disabled={currentIndex >= stages.length - 1}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          {currentIndex >= stages.length - 1 ? "Delivered" : "Simulate next step"}
        </button>
      </div>

      {/* Map placeholder */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <svg viewBox="0 0 640 160" className="w-full h-auto" role="img" aria-label="Map showing driver route from branch to customer">
          <line x1="40" y1="120" x2="600" y2="60" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="6 6" />
          <circle cx="40" cy="120" r="8" fill="#0f6e56" />
          <text x="40" y="145" fontSize="11" textAnchor="middle" fill="#444">Branch</text>
          <circle cx="600" cy="60" r="8" fill="#993c1d" />
          <text x="600" y="40" fontSize="11" textAnchor="middle" fill="#444">You</text>
          {driverPos && (
            <circle cx={driverPos.x} cy={driverPos.y} r="10" fill="#185fa5" />
          )}
        </svg>
        <p className="text-sm text-gray-500 text-center mt-2">{etaText}</p>
      </div>

      {/* Timeline */}
      <div>
        {stages.map((s, i) => {
          const done = i <= currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <div key={s.key} className="flex gap-3 relative pb-6">
              <div className="flex flex-col items-center w-8 flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    done ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <i className={`ti ${s.icon} text-base`} aria-hidden="true"></i>
                </div>
                {i < stages.length - 1 && (
                  <div
                    className={`w-0.5 flex-1 mt-1 ${i < currentIndex ? "bg-blue-300" : "bg-gray-200"}`}
                  />
                )}
              </div>
              <div className="flex-1 pt-1">
                <p className={`text-sm font-medium ${done ? "text-gray-900" : "text-gray-400"}`}>
                  {s.label}
                  {isCurrent && (
                    <span className="font-normal text-blue-600 text-xs ml-2">— in progress</span>
                  )}
                </p>
                {s.time && <p className="text-xs text-gray-400 mt-0.5">{s.time}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
