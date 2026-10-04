import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  HardHat,
  MapPin,
  Navigation,
  Radio,
  Siren,
  Waves,
  AlertTriangle,
  LogOut,
} from "lucide-react";

const initialTasks = [
  {
    id: "NRV-1042",
    title: "Verify drainage overflow risk",
    location: "Central Hyderabad · Zone A",
    priority: "HIGH",
    status: "Assigned",
    description:
      "Inspect the modelled high-risk drainage segment and confirm field conditions.",
    icon: Waves,
  },
  {
    id: "NRV-1035",
    title: "Verify citizen waterlogging signal",
    location: "Low-lying Road · Zone A",
    priority: "MEDIUM",
    status: "Assigned",
    description:
      "Validate the citizen-reported water accumulation and update City Command.",
    icon: Radio,
  },
  {
    id: "NRV-1029",
    title: "Emergency route inspection",
    location: "Critical Service Corridor",
    priority: "HIGH",
    status: "Assigned",
    description:
      "Check whether the emergency response corridor remains accessible.",
    icon: Siren,
  },
];

export default function FieldTeam() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState(initialTasks[0]);

  function updateTaskStatus(id, status) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              status,
            }
          : task
      )
    );

    setSelectedTask((current) =>
      current?.id === id
        ? {
            ...current,
            status,
          }
        : current
    );
  }

  const completedCount = tasks.filter(
    (task) => task.status === "Resolved"
  ).length;

  const activeCount = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const assignedCount = tasks.filter(
    (task) => task.status === "Assigned"
  ).length;

  return (
    <main className="field-page">
      {/* HEADER */}

      <header className="field-header">
        <div className="field-brand">
          <button
            type="button"
            className="field-back"
            onClick={() => navigate("/")}
            aria-label="Back to NERVA"
          >
            <ArrowLeft size={19} />
          </button>

          <div className="field-logo">
            <HardHat size={24} />
          </div>

          <div>
            <strong>NERVA</strong>
            <span>Field Response</span>
          </div>
        </div>

        <div className="field-header-actions">
          <div className="field-online">
            <span />
            RESPONSE NETWORK ONLINE
          </div>

          <button
            type="button"
            className="field-logout"
            onClick={() => navigate("/field/login")}
          >
            <LogOut size={17} />
            Exit
          </button>
        </div>
      </header>

      <div className="field-container">
        {/* HERO */}

        <motion.section
          className="field-hero"
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.55,
          }}
        >
          <div>
            <span className="field-eyebrow">
              FIELD OPERATIONS
            </span>

            <h1>
              Response
              <span> workspace.</span>
            </h1>

            <p>
              Receive assignments, verify incidents on the ground
              and send operational updates back to City Command.
            </p>
          </div>

          <motion.div
            className="field-verification verified"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="verification-icon">
              <CheckCircle2 size={26} />
            </div>

            <div>
              <span>FIELD ACCESS</span>

              <strong>Authorised Session</strong>

              <p>
                Field response workspace access is active for
                this prototype session.
              </p>
            </div>

            <div className="field-status">
              VERIFIED
            </div>
          </motion.div>
        </motion.section>

        {/* STATS */}

        <section className="field-stats">
          <div>
            <strong>{tasks.length}</strong>
            <span>Total Tasks</span>
          </div>

          <div>
            <strong>{assignedCount}</strong>
            <span>Assigned</span>
          </div>

          <div>
            <strong>{activeCount}</strong>
            <span>In Progress</span>
          </div>

          <div>
            <strong>{completedCount}</strong>
            <span>Resolved</span>
          </div>
        </section>

        {/* WORKSPACE */}

        <section className="field-workspace">
          {/* LEFT — TASK QUEUE */}

          <div className="field-task-panel">
            <div className="field-section-heading">
              <div>
                <span>CITY COMMAND ASSIGNMENTS</span>

                <h2>Response Queue</h2>
              </div>

              <AlertTriangle size={20} />
            </div>

            <div className="field-task-list">
              {tasks.map((task, index) => {
                const Icon = task.icon;

                return (
                  <motion.button
                    type="button"
                    key={task.id}
                    className={
                      selectedTask?.id === task.id
                        ? "field-task active"
                        : "field-task"
                    }
                    onClick={() => setSelectedTask(task)}
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.08,
                    }}
                    whileHover={{
                      y: -2,
                    }}
                  >
                    <div className="field-task-icon">
                      <Icon size={20} />
                    </div>

                    <div className="field-task-copy">
                      <small>{task.id}</small>

                      <strong>{task.title}</strong>

                      <span>
                        <MapPin size={12} />
                        {task.location}
                      </span>
                    </div>

                    <div className="field-task-state">
                      <span
                        className={`field-priority ${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>

                      <small>{task.status}</small>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* RIGHT — INCIDENT DETAILS */}

          <div className="field-detail-panel">
            {selectedTask && (
              <motion.div
                key={selectedTask.id}
                initial={{
                  opacity: 0,
                  x: 12,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.25,
                }}
              >
                <span className="field-eyebrow">
                  INCIDENT DETAILS
                </span>

                <h2>{selectedTask.title}</h2>

                <div className="field-detail-location">
                  <MapPin size={16} />
                  {selectedTask.location}
                </div>

                <p>{selectedTask.description}</p>

                <div className="field-detail-data">
                  <div>
                    <span>INCIDENT</span>
                    <strong>{selectedTask.id}</strong>
                  </div>

                  <div>
                    <span>PRIORITY</span>
                    <strong>
                      {selectedTask.priority}
                    </strong>
                  </div>

                  <div>
                    <span>STATUS</span>
                    <strong>
                      {selectedTask.status}
                    </strong>
                  </div>
                </div>

                {/* RESPONSE LOCATION */}

                <div className="field-location-card">
                  <Navigation size={20} />

                  <div>
                    <strong>Response Location</strong>

                    <span>
                      Open incident location in NERVA
                      City Intelligence Map
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/command/map")
                    }
                  >
                    View Map
                  </button>
                </div>

                {/* ACTION BUTTONS */}

                <div className="field-actions">
                  {selectedTask.status === "Assigned" && (
                    <button
                      type="button"
                      className="field-start"
                      onClick={() =>
                        updateTaskStatus(
                          selectedTask.id,
                          "In Progress"
                        )
                      }
                    >
                      <Clock3 size={17} />
                      Start Response
                    </button>
                  )}

                  {selectedTask.status ===
                    "In Progress" && (
                    <button
                      type="button"
                      className="field-resolve"
                      onClick={() =>
                        updateTaskStatus(
                          selectedTask.id,
                          "Resolved"
                        )
                      }
                    >
                      <CheckCircle2 size={17} />
                      Mark Resolved
                    </button>
                  )}

                  {selectedTask.status === "Resolved" && (
                    <motion.div
                      className="field-resolved"
                      initial={{
                        opacity: 0,
                        scale: 0.95,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                    >
                      <CheckCircle2 size={18} />
                      Response completed
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </section>

        <p className="field-disclaimer">
          Incident assignments, field status and identity
          information shown here are simulated for the NERVA
          prototype.
        </p>
      </div>
    </main>
  );
}