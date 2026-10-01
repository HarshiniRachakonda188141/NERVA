import { motion } from "framer-motion";

const drops = Array.from(
  { length: 45 },
  (_, index) => ({
    id: index,
    left: (index * 23) % 100,
    delay: (index % 10) * 0.13,
    duration: 0.8 + (index % 5) * 0.12
  })
);

export default function RainLayer({
  active = false
}) {
  if (!active) {
    return null;
  }

  return (
    <div className="rain-layer">
      <div className="storm-glow" />

      {drops.map((drop) => (
        <motion.span
          key={drop.id}
          className="rain-drop"
          style={{
            left: `${drop.left}%`
          }}
          initial={{
            y: -100,
            opacity: 0
          }}
          animate={{
            y: "110vh",
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: drop.duration,
            delay: drop.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      <motion.div
        className="rain-alert"
        initial={{
          opacity: 0,
          y: -10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
      >
        HEAVY RAINFALL EVENT
      </motion.div>
    </div>
  );
}