import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  ArrowLeft,
  BrainCircuit,
  CloudRain,
  Droplets,
  Waves,
  Car,
  Ambulance,
  AlertTriangle,
  Play,
  RotateCcw,
  ShieldAlert,
  Building2,
  ChevronRight,
} from "lucide-react";

const cascadeSteps = [
  {
    id: 1,
    title: "Heavy Rainfall",
    subtitle: "Weather Trigger",
    detail: "Simulated rainfall intensity rises above the scenario threshold.",
    icon: CloudRain,
    severity: "HIGH",
    department: "Weather Monitoring",
  },
  {
    id: 2,
    title: "Drainage Stress",
    subtitle: "Infrastructure Impact",
    detail: "Drainage capacity is predicted to approach critical operating levels.",
    icon: Droplets,
    severity: "HIGH",
    department: "Municipal Administration",
  },
  {
    id: 3,
    title: "Waterlogging Risk",
    subtitle: "Local Consequence",
    detail: "Low-lying road segments become vulnerable to water accumulation.",
    icon: Waves,
    severity: "CRITICAL",
    department: "Disaster Response",
  },
  {
    id: 4,
    title: "Traffic Disruption",
    subtitle: "Mobility Cascade",
    detail: "Affected roads increase congestion pressure on nearby corridors.",
    icon: Car,
    severity: "HIGH",
    department: "Traffic Police",
  },
  {
    id: 5,
    title: "Emergency Delay",
    subtitle: "Critical Service Impact",
    detail: "Emergency vehicle travel time may increase along affected routes.",
    icon: Ambulance,
    severity: "CRITICAL",
    department: "Emergency Services",
  },
];

export default function NervaSimulation() {
  const navigate = useNavigate();

  const [running, setRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [complete, setComplete] = useState(false);

  function runSimulation() {
    if (running) return;

    setRunning(true);
    setComplete(false);
    setCompletedSteps(0);

    cascadeSteps.forEach((_, index) => {
      setTimeout(() => {
        setCompletedSteps(index + 1);

        if (index === cascadeSteps.length - 1) {
          setRunning(false);
          setComplete(true);
        }
      }, 900 * (index + 1));
    });
  }

  function resetSimulation() {
    setRunning(false);
    setCompletedSteps(0);
    setComplete(false);
  }

  return (
    <main className="simulation-page">
      <header className="simulation-header">
        <div className="simulation-brand">
          <button
            type="button"
            onClick={() => navigate("/command")}
            className="simulation-back"
          >
            <ArrowLeft size={19} />
          </button>

          <div className="simulation-logo">
            <BrainCircuit size={24} />
          </div>

          <div>
            <strong>NERVA</strong>
            <span>Predictive Cascade Engine</span>
          </div>
        </div>

        <div className="simulation-engine-status">
          <span />
          PREDICTIVE ENGINE ONLINE
        </div>
      </header>

      <section className="simulation-container">
        <motion.div
          className="simulation-intro"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <span className="simulation-eyebrow">
              CASCADING IMPACT INTELLIGENCE
            </span>

            <h1>
              See the impact
              <br />
              <span>before it spreads.</span>
            </h1>

            <p>
              NERVA models how disruption in one urban system
              can propagate across dependent infrastructure,
              helping departments coordinate earlier.
            </p>
          </div>

          <div className="scenario-card">
            <span>ACTIVE SCENARIO</span>

            <div>
              <CloudRain size={25} />

              <div>
                <strong>Heavy Rainfall</strong>
                <small>Hyderabad urban resilience model</small>
              </div>
            </div>

            <div className="scenario-values">
              <span>
                INTENSITY
                <strong>High</strong>
              </span>

              <span>
                MODEL
                <strong>Prototype</strong>
              </span>
            </div>
          </div>
        </motion.div>

        <section className="simulation-control">
          <div>
            <BrainCircuit size={20} />

            <div>
              <strong>NERVA Cascade Analysis</strong>
              <span>
                Trace cross-system dependencies from trigger to
                critical-service impact.
              </span>
            </div>
          </div>

          <div className="simulation-buttons">
            <button
              type="button"
              className="simulation-reset"
              onClick={resetSimulation}
            >
              <RotateCcw size={17} />
              Reset
            </button>

            <button
              type="button"
              className="simulation-run"
              onClick={runSimulation}
              disabled={running}
            >
              <Play size={17} />

              {running
                ? "Analysing Cascade..."
                : complete
                ? "Run Again"
                : "Run Simulation"}
            </button>
          </div>
        </section>

        <section className="cascade-workspace">
          <div className="cascade-title">
            <div>
              <span>DEPENDENCY CHAIN</span>
              <h2>Predicted Cascade</h2>
            </div>

            <div className="cascade-progress">
              {completedSteps}/{cascadeSteps.length} systems analysed
            </div>
          </div>

          <div className="cascade-chain">
            {cascadeSteps.map((step, index) => {
              const Icon = step.icon;
              const active = completedSteps > index;

              return (
                <div
                  className="cascade-node-wrapper"
                  key={step.id}
                >
                  <motion.article
                    className={`cascade-node ${
                      active ? "cascade-node-active" : ""
                    }`}
                    animate={
                      active
                        ? {
                            opacity: 1,
                            scale: 1,
                          }
                        : {
                            opacity: 0.42,
                            scale: 0.98,
                          }
                    }
                    transition={{ duration: 0.35 }}
                  >
                    <div className="cascade-node-icon">
                      <Icon size={24} />
                    </div>

                    <div className="cascade-node-copy">
                      <small>{step.subtitle}</small>
                      <strong>{step.title}</strong>
                      <p>{step.detail}</p>
                    </div>

                    <div className="cascade-node-meta">
                      <span>{step.severity}</span>

                      <small>
                        <Building2 size={12} />
                        {step.department}
                      </small>
                    </div>
                  </motion.article>

                  {index < cascadeSteps.length - 1 && (
                    <motion.div
                      className={`cascade-connector ${
                        active &&
                        completedSteps > index + 1
                          ? "cascade-connector-active"
                          : ""
                      }`}
                    >
                      <ChevronRight size={20} />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <AnimatePresence>
          {complete && (
            <motion.section
              className="simulation-result"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
              }}
            >
              <div className="result-warning">
                <ShieldAlert size={29} />

                <div>
                  <span>NERVA PREDICTION</span>

                  <h2>
                    Cross-department intervention recommended.
                  </h2>

                  <p>
                    The model predicts that drainage stress can
                    propagate into mobility disruption and
                    potentially delay critical emergency services.
                  </p>
                </div>
              </div>

              <div className="result-metrics">
                <div>
                  <span>CASCADE DEPTH</span>
                  <strong>5 Systems</strong>
                </div>

                <div>
                  <span>MAX SEVERITY</span>
                  <strong>Critical</strong>
                </div>

                <div>
                  <span>DEPARTMENTS</span>
                  <strong>5</strong>
                </div>
              </div>

              <div className="coordination-plan">
                <div className="coordination-heading">
                  <AlertTriangle size={19} />

                  <div>
                    <strong>Recommended Coordination</strong>
                    <span>
                      Prototype decision-support actions
                    </span>
                  </div>
                </div>

                <div className="coordination-actions">
                  <span>
                    01
                    <strong>
                      Inspect high-risk drainage zones
                    </strong>
                  </span>

                  <span>
                    02
                    <strong>
                      Prepare traffic diversions
                    </strong>
                  </span>

                  <span>
                    03
                    <strong>
                      Alert emergency response teams
                    </strong>
                  </span>

                  <span>
                    04
                    <strong>
                      Monitor citizen reports
                    </strong>
                  </span>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}