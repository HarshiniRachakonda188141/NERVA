import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Activity,
  AlertTriangle,
  Building2,
  Bus,
  ChevronRight,
  CloudRain,
  Droplets,
  FileText,
  Hospital,
  LogOut,
  Map,
  Radio,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

export default function CommandDashboard() {
  const navigate = useNavigate();

  const [refreshing, setRefreshing] = useState(false);

  const refreshData = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 900);
  };

  const systems = [
    {
      name: "Drainage Network",
      status: "WATCH",
      value: "72%",
      icon: Droplets,
    },
    {
      name: "Mobility Network",
      status: "STABLE",
      value: "91%",
      icon: Bus,
    },
    {
      name: "Power Grid",
      status: "STABLE",
      value: "96%",
      icon: Zap,
    },
    {
      name: "Critical Services",
      status: "STABLE",
      value: "94%",
      icon: Hospital,
    },
  ];

  const alerts = [
    {
      title: "Heavy rainfall scenario detected",
      location: "Zone A · Hyderabad",
      level: "HIGH",
      icon: CloudRain,
    },
    {
      title: "Drainage capacity approaching threshold",
      location: "Central drainage corridor",
      level: "WATCH",
      icon: Droplets,
    },
    {
      title: "Traffic dependency may be affected",
      location: "Primary mobility corridor",
      level: "MODELLED",
      icon: Bus,
    },
  ];

  return (
    <main className="command-dashboard">
      {/* HEADER */}

      <header className="command-header">
        <div className="command-brand">
          <div className="command-logo">N</div>

          <div>
            <strong>NERVA</strong>
            <span>City Command Intelligence</span>
          </div>
        </div>

        <div className="command-header-actions">
          <div className="command-live">
            <span />
            LIVE MODEL
          </div>

          <button
            className="command-icon-button"
            onClick={refreshData}
            title="Refresh intelligence"
          >
            <RefreshCw
              size={18}
              className={refreshing ? "spin" : ""}
            />
          </button>

          <button
            className="command-logout"
            onClick={() => navigate("/")}
          >
            <LogOut size={17} />
            Exit
          </button>
        </div>
      </header>

      {/* HERO */}

      <section className="command-hero">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="command-eyebrow">
            <ShieldCheck size={15} />
            GOVERNMENT COMMAND WORKSPACE
          </p>

          <h1>
            Hyderabad is
            <span> operational.</span>
          </h1>

          <p>
            NERVA is monitoring connected urban systems and
            modelling possible cascading infrastructure impacts.
          </p>
        </motion.div>

        <motion.div
          className="resilience-score"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="score-ring">
            <strong>82</strong>
            <span>/100</span>
          </div>

          <div>
            <small>CITY RESILIENCE</small>
            <strong>Stable</strong>
            <span>1 system requires attention</span>
          </div>
        </motion.div>
      </section>

      {/* STATS */}

      <section className="command-stats">
        <Stat
          icon={Radio}
          value="18"
          label="Citizen Signals"
          sub="Last 24 hours"
        />

        <Stat
          icon={AlertTriangle}
          value="03"
          label="Active Alerts"
          sub="1 high priority"
        />

        <Stat
          icon={Users}
          value="07"
          label="Field Teams"
          sub="5 currently active"
        />

        <Stat
          icon={Building2}
          value="06"
          label="Connected Systems"
          sub="City infrastructure"
        />
      </section>

      {/* MAIN GRID */}

      <section className="command-grid">
        {/* SYSTEM HEALTH */}

        <motion.article
          className="command-panel system-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="panel-heading">
            <div>
              <span className="panel-label">
                INFRASTRUCTURE
              </span>

              <h2>System Health</h2>
            </div>

            <Activity size={21} />
          </div>

          <div className="system-list">
            {systems.map((system) => {
              const Icon = system.icon;

              return (
                <div
                  className="system-row"
                  key={system.name}
                >
                  <div className="system-icon">
                    <Icon size={19} />
                  </div>

                  <div className="system-copy">
                    <strong>{system.name}</strong>
                    <span>{system.status}</span>
                  </div>

                  <strong className="system-value">
                    {system.value}
                  </strong>
                </div>
              );
            })}
          </div>
        </motion.article>

        {/* NERVA AI */}

        <motion.article
          className="command-panel nerva-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="panel-heading">
            <div>
              <span className="panel-label">
                PREDICTIVE ENGINE
              </span>

              <h2>Ask NERVA</h2>
            </div>

            <Sparkles size={22} />
          </div>

          <div className="nerva-core">
            <div className="nerva-core-ring">
              <Sparkles size={31} />
            </div>

            <p>
              Explore cascading effects before they become
              operational emergencies.
            </p>

            <button
              onClick={() => navigate("/command/nerva")}
            >
              Run Scenario
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.article>

        {/* ALERTS */}

        <motion.article
          className="command-panel alerts-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="panel-heading">
            <div>
              <span className="panel-label">
                LIVE INTELLIGENCE
              </span>

              <h2>Priority Signals</h2>
            </div>

            <AlertTriangle size={21} />
          </div>

          <div className="alert-list">
            {alerts.map((alert) => {
              const Icon = alert.icon;

              return (
                <div
                  className="alert-row"
                  key={alert.title}
                >
                  <div className="alert-icon">
                    <Icon size={18} />
                  </div>

                  <div>
                    <strong>{alert.title}</strong>
                    <span>{alert.location}</span>
                  </div>

                  <small>{alert.level}</small>
                </div>
              );
            })}
          </div>
        </motion.article>

        {/* MAP PREVIEW */}

        <motion.article
          className="command-panel map-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="panel-heading">
            <div>
              <span className="panel-label">
                DIGITAL TWIN
              </span>

              <h2>City Intelligence Map</h2>
            </div>

            <Map size={21} />
          </div>

          <div className="map-preview">
            <div className="map-grid-lines" />

            <MapPoint
              className="point-one"
              text="Drainage"
            />

            <MapPoint
              className="point-two"
              text="Traffic"
            />

            <MapPoint
              className="point-three"
              text="Critical"
            />

            <div className="map-center">
              <span />
              HYDERABAD
            </div>
          </div>

          <button
            className="map-open-button"
            onClick={() => navigate("/command/city")}
          >
            Open Digital Twin
            <ChevronRight size={17} />
          </button>
        </motion.article>
      </section>

      {/* QUICK ACTIONS */}

      <section className="command-actions">
        <button onClick={() => navigate("/command/city")}>
          <Map size={19} />

          <div>
            <strong>City Map</strong>
            <span>Explore infrastructure</span>
          </div>

          <ChevronRight size={18} />
        </button>

        <button onClick={() => navigate("/command/nerva")}>
          <Sparkles size={19} />

          <div>
            <strong>NERVA Simulation</strong>
            <span>Predict cascading impact</span>
          </div>

          <ChevronRight size={18} />
        </button>

        <button onClick={() => navigate("/command/reports")}>
          <FileText size={19} />

          <div>
            <strong>Operations Report</strong>
            <span>Review response intelligence</span>
          </div>

          <ChevronRight size={18} />
        </button>
      </section>
    </main>
  );
}

function Stat({ icon: Icon, value, label, sub }) {
  return (
    <motion.div
      className="command-stat"
      whileHover={{ y: -4 }}
    >
      <div className="stat-icon">
        <Icon size={20} />
      </div>

      <div>
        <strong>{value}</strong>
        <span>{label}</span>
        <small>{sub}</small>
      </div>
    </motion.div>
  );
}

function MapPoint({ className, text }) {
  return (
    <div className={`map-point ${className}`}>
      <i />
      <span>{text}</span>
    </div>
  );
}