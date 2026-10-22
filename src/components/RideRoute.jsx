import { motion } from "motion/react";

const ROUTE_PATH = "M24 142 C78 142 72 54 132 54 S188 142 246 142";

export default function RideRoute({ className = "" }) {
  return (
    <svg className={`h-auto w-full ${className}`} viewBox="0 0 270 190" fill="none" aria-hidden="true">
      {/* Background road bed */}
      <path
        d={ROUTE_PATH}
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Road border */}
      <path
        d={ROUTE_PATH}
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Animated glowing route line */}
      <motion.path
        d={ROUTE_PATH}
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="4 8"
        animate={{ strokeDashoffset: [-36, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />

      {/* Pickup Location Point A 🟢 */}
      <g transform="translate(24, 142)">
        <circle r="12" fill="#10b981" fillOpacity="0.2" className="animate-ping" />
        <circle r="7" fill="#10b981" stroke="white" strokeWidth="2.5" />
      </g>

      {/* Midway Waypoint 🟡 */}
      <g transform="translate(132, 54)">
        <circle r="6" fill="#f59e0b" stroke="white" strokeWidth="2" />
      </g>

      {/* Drop-off Location Point B 🏁 */}
      <g transform="translate(246, 142)">
        <circle r="12" fill="#ef4444" fillOpacity="0.2" className="animate-ping" />
        <circle r="7" fill="#0f172a" stroke="white" strokeWidth="2.5" />
      </g>

      {/* Moving Car traversing along the route path */}
      <g>
        <animateMotion
          path={ROUTE_PATH}
          dur="5s"
          repeatCount="indefinite"
          rotate="auto"
        />

        {/* Headlight beam shining forward */}
        <polygon
          points="14,-6 42,-16 42,16 14,6"
          fill="#fef08a"
          fillOpacity="0.3"
        />

        {/* Car chassis */}
        <rect
          x="-15"
          y="-9"
          width="30"
          height="18"
          rx="5"
          fill="#0f172a"
          stroke="#10b981"
          strokeWidth="1.8"
        />

        {/* Windshield / Cab */}
        <rect
          x="-7"
          y="-6.5"
          width="14"
          height="13"
          rx="2.5"
          fill="#38bdf8"
          fillOpacity="0.75"
        />

        {/* Headlights */}
        <circle cx="14" cy="-6" r="2" fill="#fef08a" />
        <circle cx="14" cy="6" r="2" fill="#fef08a" />

        {/* Rear taillights */}
        <circle cx="-14" cy="-6" r="1.5" fill="#ef4444" />
        <circle cx="-14" cy="6" r="1.5" fill="#ef4444" />

        {/* Wheels */}
        <rect x="-11" y="-11" width="6" height="3" rx="1" fill="#334155" />
        <rect x="5" y="-11" width="6" height="3" rx="1" fill="#334155" />
        <rect x="-11" y="8" width="6" height="3" rx="1" fill="#334155" />
        <rect x="5" y="8" width="6" height="3" rx="1" fill="#334155" />
      </g>
    </svg>
  );
}
