import { motion } from "framer-motion";

export default function CityPulse({
  value = 82
}) {
  return (
    <div className="pulse-wrap">
      <motion.div
        className="pulse-ring pulse-ring-one"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.35, 0.1, 0.35]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="pulse-ring pulse-ring-two"
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.18, 0.03, 0.18]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="pulse-core"
        animate={{
          boxShadow: [
            "0 0 30px rgba(95,230,255,.16)",
            "0 0 70px rgba(95,230,255,.32)",
            "0 0 30px rgba(95,230,255,.16)"
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity
        }}
      >
        <span className="pulse-number">
          {value}
        </span>

        <span className="pulse-label">
          CITY PULSE
        </span>
      </motion.div>
    </div>
  );
}