import React from 'react';

export default function TruckIllustration() {
  return (
    <div className="w-full h-36 flex items-center justify-center relative overflow-hidden select-none">
      <svg
        viewBox="0 0 340 180"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft ground shadow */}
        <ellipse cx="170" cy="165" rx="150" ry="8" fill="#1e2d07" fillOpacity="0.25" />
        <ellipse cx="160" cy="164" rx="120" ry="5" fill="#1e2d07" fillOpacity="0.35" />

        {/* Cargo Box Container (White with subtle panel lines) */}
        <rect x="95" y="32" width="180" height="108" rx="5" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
        <line x1="155" y1="34" x2="155" y2="138" stroke="#F1F5F9" strokeWidth="2" />
        <line x1="215" y1="34" x2="215" y2="138" stroke="#F1F5F9" strokeWidth="2" />
        <rect x="98" y="132" width="174" height="6" fill="#CBD5E1" />
        {/* Roof aerodynamic fairing */}
        <path d="M 52 52 L 95 32 L 95 65 Z" fill="#E2E8F0" />

        {/* Truck Cabin (Modern European cab-over-engine style) */}
        <path
          d="M 52 52 C 54 48, 60 45, 68 45 L 95 45 L 95 138 L 40 138 C 38 138, 36 135, 36 132 L 36 88 C 36 82, 40 70, 52 52 Z"
          fill="#F8FAFC"
          stroke="#CBD5E1"
          strokeWidth="2"
        />

        {/* Windshield */}
        <path
          d="M 54 55 L 85 55 L 85 86 L 42 86 C 43 78, 46 66, 54 55 Z"
          fill="#1E293B"
        />
        {/* Windshield reflection */}
        <path d="M 56 57 L 70 57 L 54 84 L 44 84 Z" fill="#475569" fillOpacity="0.6" />

        {/* Side window */}
        <rect x="74" y="60" width="18" height="24" rx="2" fill="#0F172A" />

        {/* Side Mirror */}
        <rect x="36" y="66" width="4" height="14" rx="1.5" fill="#334155" />
        <line x1="40" y1="72" x2="45" y2="72" stroke="#334155" strokeWidth="2" />

        {/* Door line & handle */}
        <line x1="68" y1="88" x2="68" y2="136" stroke="#E2E8F0" strokeWidth="1.5" />
        <rect x="70" y="98" width="6" height="2" rx="1" fill="#64748B" />

        {/* Front Grille and Headlights */}
        <rect x="34" y="104" width="6" height="26" rx="2" fill="#334155" />
        <rect x="35" y="108" width="4" height="3" rx="1" fill="#94A3B8" />
        <rect x="35" y="115" width="4" height="3" rx="1" fill="#94A3B8" />
        <rect x="35" y="122" width="4" height="3" rx="1" fill="#94A3B8" />
        {/* Modern LED Headlight */}
        <rect x="34" y="94" width="7" height="6" rx="1" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1" />
        <circle cx="37" cy="97" r="1.5" fill="#38BDF8" />

        {/* Bumper & Side skirting */}
        <path d="M 33 134 L 95 134 L 95 142 L 35 142 Z" fill="#334155" />
        <rect x="135" y="138" width="80" height="6" fill="#475569" />

        {/* Wheel 1 (Front Cab Wheel) */}
        <circle cx="68" cy="144" r="18" fill="#0F172A" />
        <circle cx="68" cy="144" r="12" fill="#64748B" stroke="#94A3B8" strokeWidth="1.5" />
        <circle cx="68" cy="144" r="5" fill="#0F172A" />
        <circle cx="65" cy="141" r="1" fill="#CBD5E1" />
        <circle cx="71" cy="141" r="1" fill="#CBD5E1" />
        <circle cx="68" cy="147" r="1" fill="#CBD5E1" />

        {/* Wheel 2 (Rear Dual Wheels) */}
        <circle cx="235" cy="144" r="18" fill="#0F172A" />
        <circle cx="235" cy="144" r="12" fill="#64748B" stroke="#94A3B8" strokeWidth="1.5" />
        <circle cx="235" cy="144" r="5" fill="#0F172A" />
        <circle cx="232" cy="141" r="1" fill="#CBD5E1" />
        <circle cx="238" cy="141" r="1" fill="#CBD5E1" />
        <circle cx="235" cy="147" r="1" fill="#CBD5E1" />

        {/* Wheel Arches */}
        <path d="M 48 144 A 20 20 0 0 1 88 144" fill="none" stroke="#475569" strokeWidth="2.5" />
        <path d="M 215 144 A 20 20 0 0 1 255 144" fill="none" stroke="#475569" strokeWidth="2.5" />
      </svg>
    </div>
  );
}
