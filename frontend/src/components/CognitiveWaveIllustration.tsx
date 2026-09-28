import React from 'react';

export default function CognitiveWaveIllustration() {
  return (
    <div className="w-full h-36 flex items-center justify-center relative overflow-hidden select-none">
      <svg
        viewBox="0 0 340 180"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft shadow */}
        <ellipse cx="170" cy="165" rx="140" ry="8" fill="#1e2d07" fillOpacity="0.25" />
        <ellipse cx="170" cy="164" rx="100" ry="5" fill="#1e2d07" fillOpacity="0.35" />

        {/* Floating Cognitive Core Capsule (White with subtle panel lines) */}
        <rect x="70" y="38" width="200" height="96" rx="28" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
        
        {/* Internal Saliency Pulse Waveforms */}
        <path
          d="M 95 86 L 120 86 L 132 55 L 144 115 L 156 70 L 168 98 L 180 86 L 245 86"
          stroke="#1E293B"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 95 86 L 120 86 L 132 55 L 144 115 L 156 70 L 168 98 L 180 86 L 245 86"
          stroke="#38BDF8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.8"
        />

        {/* Neural Nodes with glowing halos */}
        <circle cx="132" cy="55" r="5" fill="#10B981" />
        <circle cx="132" cy="55" r="9" stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.5" />

        <circle cx="144" cy="115" r="6" fill="#EF4444" />
        <circle cx="144" cy="115" r="10" stroke="#EF4444" strokeWidth="1.5" strokeOpacity="0.5" />

        <circle cx="156" cy="70" r="5" fill="#F59E0B" />
        <circle cx="168" cy="98" r="5" fill="#8B5CF6" />

        {/* Center Cognitive Badge */}
        <rect x="140" y="24" width="60" height="20" rx="10" fill="#0F172A" />
        <text x="170" y="37" fill="#FFFFFF" fontSize="9" fontWeight="800" textAnchor="middle" letterSpacing="1">
          AURA AI
        </text>

        {/* Satellite Signal Rings */}
        <circle cx="85" cy="86" r="3" fill="#3B82F6" />
        <circle cx="255" cy="86" r="3" fill="#10B981" />

        {/* Ambient Orbitals */}
        <ellipse cx="170" cy="86" rx="115" ry="46" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />
      </svg>
    </div>
  );
}
