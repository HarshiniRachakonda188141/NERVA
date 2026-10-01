import {
  motion
} from "framer-motion";

import {
  ArrowRight
} from "lucide-react";

import {
  useNavigate
} from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <main className="landing">
      <div className="landing-glow glow-one" />
      <div className="landing-glow glow-two" />

      <motion.div
        className="brand-mark"
        initial={{
          opacity: 0,
          scale: 0.8
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        transition={{
          duration: 0.8
        }}
      >
        <div className="brand-orbit">
          <span />
          <span />
          <span />
          <span />

          <div className="brand-core">
            N
          </div>
        </div>
      </motion.div>

      <motion.div
        className="landing-copy"
        initial={{
          opacity: 0,
          y: 30
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: 0.3,
          duration: 0.8
        }}
      >
        <span className="eyebrow">
          URBAN INTELLIGENCE SYSTEM
        </span>

        <h1>
          NERVA
        </h1>

        <p className="full-form">
          Neural Engine for
          Resilient Virtual Assets
        </p>

        <p className="landing-description">
          A digital nervous system
          for urban infrastructure.
        </p>

        <button
          className="primary-button"
          onClick={() =>
            navigate("/pulse")
          }
        >
          Enter NERVA

          <ArrowRight size={18} />
        </button>

        <span className="prototype-note">
          SIMULATED PROTOTYPE
        </span>
      </motion.div>
    </main>
  );
}