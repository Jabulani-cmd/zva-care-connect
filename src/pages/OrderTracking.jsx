"use client";

import React, { useState } from "react";

const stages = [
  { key: "submitted", label: "Order submitted", icon: "📄", time: "09:02 AM" },
  { key: "review", label: "Reviewed by pharmacist", icon: "👨‍⚕️", time: "09:18 AM" },
  { key: "quoted", label: "Quotation sent", icon: "🧾", time: "09:25 AM" },
  { key: "paid", label: "Payment received", icon: "💳", time: "09:40 AM" },
  { key: "packed", label: "Order packed", icon: "📦", time: "10:05 AM" },
  { key: "dispatched", label: "Dispatched to driver", icon: "🚚", time: "10:20 AM" },
  { key: "out_for_delivery", label: "Out for delivery", icon: "📍", time: "10:32 AM" },
  { key: "delivered", label: "Delivered", icon: "✅", time: null },
];

export default function OrderTracking({ orderNumber = "KP-20413" }) {
  const [currentIndex, setCurrentIndex] = useState(6);

  const handleNext = () => {
    setCurrentIndex((i) => Math.min(i + 1, stages.length - 1));
  };

  let driverPos = null;
  let etaText = "Preparing your order";

  if (currentIndex === 6) {
    const progress = 0.55;
    driverPos = { x: 40 + (600 - 40) * progress, y: 120 + (60 - 120) * progress };
    etaText = "Driver is about 8 minutes away";
  } else if (currentIndex === 7) {
    driverPos = { x: 600, y: 60 };
    etaText = "Delivered";
  } else if (currentIndex >= 5) {
    driverPos = { x: 40, y: 120 };
    etaText = "Driver is collecting your order";
  }

  const safeIndex = Math.min(currentIndex, stages.length - 1);
  const currentStage = stages[safeIndex];

  return (
    <div style={{ maxWidth: "42rem", margin: "0 auto", padding: "1.5rem 1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Order #{orderNumber}</p>
          <p style={{ fontSize: "1.125rem", fontWeight: "500" }}>{currentStage.label}</p>
        </div>
        <button
          onClick={handleNext}
          disabled={currentIndex >= stages.length - 1}
          style={{
            border: "1px solid #d1d5db",
            borderRadius: "0.375rem",
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
            background: "white",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
        >
          {currentIndex >= stages.length - 1 ? "Delivered" : "Simulate next step"}
        </button>
      </div>

      <div style={{ backgroundColor: "#f9fafb", borderRadius: "0.5rem", padding: "1rem", marginBottom: "1.5rem" }}>
        <svg viewBox="0 0 640 160" style={{ width: "100%", height: "auto" }} role="img" aria-label="Map showing driver route from branch to customer">
          <line x1="40" y1="120" x2="600" y2="60" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="6 6" />
          <circle cx="40" cy="120" r="8" fill="#0f6e56" />
          <text x="40" y="145" fontSize="11" textAnchor="middle" fill="#444">Branch</text>
          <circle cx="600" cy="60" r="8" fill="#993c1d" />
          <text x="600" y="40" fontSize="11" textAnchor="middle" fill="#444">You</text>
          {driverPos && <circle cx={driverPos.x} cy={driverPos.y} r="10" fill="#185fa5" />}
        </svg>
        <p style={{ fontSize: "0.875rem", color: "#6b7280", textAlign: "center", marginTop: "0.5rem" }}>{etaText}</p>
      </div>

      <div>
        {stages.map((s, i) => {
          const done = i <= safeIndex;
          const isCurrent = i === safeIndex;
          return (
            <div key={s.key} style={{ display: "flex", gap: "0.75rem", position: "relative", paddingBottom: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "2rem", flexShrink: 0 }}>
                <div
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "9999px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    backgroundColor: done ? "#dbeafe" : "#f3f4f6",
                    color: done ? "#1d4ed8" : "#9ca3af",
                  }}
                >
                  <span role="img" aria-label={s.label} style={{ fontSize: "1rem" }}>{s.icon}</span>
                </div>
                {i < stages.length - 1 && (
                  <div
                    style={{
                      width: "2px",
                      flex: 1,
                      marginTop: "0.25rem",
                      backgroundColor: i < safeIndex ? "#93c5fd" : "#e5e7eb",
                    }}
                  />
                )}
              </div>
              <div style={{ flex: 1, paddingTop: "0.25rem" }}>
                <p style={{ fontSize: "0.875rem", fontWeight: "500", color: done ? "#111827" : "#9ca3af" }}>
                  {s.label}
                  {isCurrent && (
                    <span style={{ fontWeight: "normal", fontSize: "0.75rem", marginLeft: "0.5rem", color: "#2563eb" }}>
                      — in progress
                    </span>
                  )}
                </p>
                {s.time && <p style={{ fontSize: "0.75rem", marginTop: "0.125rem", color: "#9ca3af" }}>{s.time}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
