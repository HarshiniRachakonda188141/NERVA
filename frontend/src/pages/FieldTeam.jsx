import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Clock3,
  AlertTriangle,
  CheckCircle2,
  Camera,
  Upload,
  Radio,
  ShieldCheck,
  HardHat,
  Phone,
  MessageSquare,
  Route,
  Wrench,
  Droplets,
  Zap,
  Flame,
  Car,
  ChevronRight,
  Activity,
  Send,
} from "lucide-react";

const tasks = [
  {
    id: "FT-204",
    title: "Clear blocked storm drain",
    location: "Road R17 · Zone B",
    priority: "Critical",
    department: "Drainage",
    eta: "12 min",
    icon: Droplets,
    description:
      "Possible drain obstruction associated with rising road water level.",
    source: "NERVA + verified field signal",
  },
  {
    id: "FT-205",
    title: "Inspect power distribution point",
    location: "Sector C4",
    priority: "High",
    department: "Electricity",
    eta: "18 min",
    icon: Zap,
    description:
      "Power instability detected near a critical service corridor.",
    source: "Grid monitoring",
  },
  {
    id: "FT-206",
    title: "Secure accident perimeter",
    location: "Junction J03",
    priority: "Medium",
    department: "Traffic",
    eta: "9 min",
    icon: Car,
    description:
      "Road accident may reduce junction capacity and delay emergency access.",
    source: "Verified incident",
  },
];

const statusFlow = [
  "Assigned",
  "Accepted",
  "En Route",
  "On Site",
  "Working",
  "Resolved",
];

export default function FieldTeam() {
  const navigate = useNavigate();

  const [selectedId, setSelectedId] =
    useState(tasks[0].id);

  const [status, setStatus] =
    useState("Assigned");

  const [note, setNote] =
    useState("");

  const [evidenceAdded, setEvidenceAdded] =
    useState(false);

  const selectedTask = useMemo(
    () =>
      tasks.find(
        (task) => task.id === selectedId
      ) || tasks[0],
    [selectedId]
  );

  const currentIndex =
    statusFlow.indexOf(status);

  const nextStatus = () => {
    if (
      currentIndex <
      statusFlow.length - 1
    ) {
      setStatus(
        statusFlow[currentIndex + 1]
      );
    }
  };

  const chooseTask = (id) => {
    setSelectedId(id);
    setStatus("Assigned");
    setNote("");
    setEvidenceAdded(false);
  };

  const TaskIcon =
    selectedTask.icon;

  return (
    <main className="field-page">

      {/* HEADER */}

      <header className="field-header">

        <div className="field-header-left">

          <button
            className="field-back"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={19} />
          </button>

          <div className="field-brand-mark">
            <HardHat size={21} />
          </div>

          <div className="field-brand">
            <strong>NERVA</strong>
            <small>
              Field Operations
            </small>
          </div>

        </div>

        <div className="field-connection">
          <span />
          COMMAND LINK ACTIVE
        </div>

      </header>


      {/* TOP SUMMARY */}

      <section className="field-summary">

        <div>
          <span className="field-kicker">
            FIELD RESPONSE NETWORK
          </span>

          <h1>
            Response Team Console
          </h1>

          <p>
            Receive assignments, navigate to
            incidents and send verified ground
            updates to City Command.
          </p>
        </div>

        <div className="field-summary-cards">

          <div>
            <Radio size={18} />
            <span>
              <strong>3</strong>
              Active tasks
            </span>
          </div>

          <div>
            <Clock3 size={18} />
            <span>
              <strong>13 min</strong>
              Avg. response
            </span>
          </div>

          <div>
            <ShieldCheck size={18} />
            <span>
              <strong>Online</strong>
              Team status
            </span>
          </div>

        </div>

      </section>


      {/* MAIN GRID */}

      <section className="field-workspace">

        {/* LEFT TASK LIST */}

        <aside className="field-task-panel">

          <div className="field-panel-title">
            <div>
              <span>ASSIGNMENTS</span>
              <h2>
                Active tasks
              </h2>
            </div>

            <span className="task-count">
              {tasks.length}
            </span>
          </div>

          <div className="field-task-list">

            {tasks.map((task) => {
              const Icon = task.icon;

              return (
                <button
                  key={task.id}
                  className={
                    selectedId === task.id
                      ? "field-task active"
                      : "field-task"
                  }
                  onClick={() =>
                    chooseTask(task.id)
                  }
                >

                  <div
                    className={
                      `field-task-icon ${
                        task.priority.toLowerCase()
                      }`
                    }
                  >
                    <Icon size={19} />
                  </div>

                  <div className="field-task-copy">

                    <div>
                      <strong>
                        {task.title}
                      </strong>

                      <span
                        className={
                          `priority-tag ${
                            task.priority.toLowerCase()
                          }`
                        }
                      >
                        {task.priority}
                      </span>
                    </div>

                    <p>
                      <MapPin size={12} />
                      {task.location}
                    </p>

                    <small>
                      {task.department}
                      {" · "}
                      ETA {task.eta}
                    </small>

                  </div>

                  <ChevronRight
                    size={17}
                    className="field-task-arrow"
                  />

                </button>
              );
            })}

          </div>

        </aside>


        {/* CENTER */}

        <section className="field-main-panel">

          <div className="field-incident-header">

            <div className="field-incident-icon">
              <TaskIcon size={26} />
            </div>

            <div className="field-incident-copy">
              <span>
                ASSIGNMENT {selectedTask.id}
              </span>

              <h2>
                {selectedTask.title}
              </h2>

              <p>
                {selectedTask.description}
              </p>
            </div>

            <span
              className={
                `incident-priority ${
                  selectedTask.priority.toLowerCase()
                }`
              }
            >
              {selectedTask.priority}
            </span>

          </div>


          {/* MAP */}

          <div className="field-map">

            <div className="field-map-grid" />

            <div className="field-route-path" />

            <div className="field-team-marker">
              <Navigation size={16} />
            </div>

            <div className="field-destination">
              <MapPin size={20} />
            </div>

            <div className="field-map-location">
              <MapPin size={14} />

              <div>
                <strong>
                  {selectedTask.location}
                </strong>
                <small>
                  Assigned destination
                </small>
              </div>
            </div>

            <div className="field-map-eta">
              <Route size={15} />
              {selectedTask.eta}
            </div>

          </div>


          {/* DETAILS */}

          <div className="field-detail-grid">

            <div className="field-detail-card">
              <span>DEPARTMENT</span>
              <strong>
                {selectedTask.department}
              </strong>
            </div>

            <div className="field-detail-card">
              <span>SOURCE</span>
              <strong>
                {selectedTask.source}
              </strong>
            </div>

            <div className="field-detail-card">
              <span>CURRENT STATUS</span>
              <strong className="field-current-status">
                {status}
              </strong>
            </div>

          </div>


          {/* STATUS FLOW */}

          <div className="field-status-section">

            <div className="field-section-heading">
              <div>
                <span>LIVE RESPONSE</span>
                <h3>
                  Task progress
                </h3>
              </div>

              <Activity size={19} />
            </div>

            <div className="field-status-flow">

              {statusFlow.map(
                (item, index) => {

                  const complete =
                    index < currentIndex;

                  const current =
                    index === currentIndex;

                  return (
                    <div
                      key={item}
                      className={
                        current
                          ? "field-status-step current"
                          : complete
                          ? "field-status-step complete"
                          : "field-status-step"
                      }
                    >

                      <div className="field-status-circle">

                        {complete ? (
                          <CheckCircle2
                            size={17}
                          />
                        ) : (
                          index + 1
                        )}

                      </div>

                      <span>
                        {item}
                      </span>

                    </div>
                  );
                }
              )}

            </div>


            <div className="field-action-row">

              <button className="field-secondary-action">
                <Navigation size={17} />
                Navigate
              </button>

              <button
                className="field-primary-action"
                onClick={nextStatus}
                disabled={
                  status === "Resolved"
                }
              >
                {status === "Resolved"
                  ? "Task Resolved"
                  : `Mark ${
                      statusFlow[
                        currentIndex + 1
                      ]
                    }`}

                {status !== "Resolved" && (
                  <ChevronRight size={17} />
                )}
              </button>

            </div>

          </div>

        </section>


        {/* RIGHT PANEL */}

        <aside className="field-update-panel">

          <div className="field-panel-title">

            <div>
              <span>GROUND UPDATE</span>
              <h2>
                Send evidence
              </h2>
            </div>

            <Radio size={18} />

          </div>


          <div className="field-verification-note">

            <ShieldCheck size={19} />

            <p>
              Updates submitted here become
              field evidence for City Command
              and NERVA incident analysis.
            </p>

          </div>


          <label className="field-update-label">
            Field note
          </label>

          <textarea
            className="field-note"
            value={note}
            onChange={(event) =>
              setNote(event.target.value)
            }
            placeholder="Describe conditions at the incident location..."
          />


          <button
            className={
              evidenceAdded
                ? "field-upload added"
                : "field-upload"
            }
            onClick={() =>
              setEvidenceAdded(true)
            }
          >

            {evidenceAdded ? (
              <CheckCircle2 size={22} />
            ) : (
              <Camera size={22} />
            )}

            <div>
              <strong>
                {evidenceAdded
                  ? "Evidence attached"
                  : "Add field photo"}
              </strong>

              <small>
                {evidenceAdded
                  ? "Ready to send"
                  : "Photo or visual evidence"}
              </small>
            </div>

            {!evidenceAdded && (
              <Upload size={17} />
            )}

          </button>


          <button className="field-send-update">
            <Send size={17} />
            Send to Command
          </button>


          {/* COMMAND CONTACT */}

          <div className="field-command-contact">

            <span>
              COMMAND SUPPORT
            </span>

            <h3>
              Drainage Control
            </h3>

            <p>
              Incident coordinator available
            </p>

            <div>
              <button>
                <Phone size={16} />
                Call
              </button>

              <button>
                <MessageSquare size={16} />
                Message
              </button>
            </div>

          </div>


          {/* SAFETY */}

          <div className="field-safety-card">

            <AlertTriangle size={19} />

            <div>
              <strong>
                Field safety
              </strong>

              <p>
                Follow department safety
                procedures and do not enter
                unsafe infrastructure zones.
              </p>
            </div>

          </div>

        </aside>

      </section>

    </main>
  );
}