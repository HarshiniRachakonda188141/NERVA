import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Droplets,
  HeartPulse,
  Loader2,
  MapPin,
  Plus,
  RefreshCw,
  Route,
  Send,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";

import BottomNav
  from "../components/BottomNav";

import CityPulse
  from "../components/CityPulse";

import AskNerva
  from "../components/AskNerva";

import {
  createTask,
  getTasks,
  verifyTask,
} from "../services/api";


const systems = [
  {
    name: "Mobility",
    status: "Stable",
    icon: Route,
  },
  {
    name: "Drainage",
    status: "Watch",
    icon: Droplets,
  },
  {
    name: "Power",
    status: "Stable",
    icon: Zap,
  },
  {
    name: "Critical",
    status: "Stable",
    icon: HeartPulse,
  },
];


const initialTaskForm = {
  title: "",
  description: "",
  department: "Drainage",
  zone: "Zone A",
  team: "Drainage Alpha",
  priority: "High",
  asset_id: "",
  incident_id: "",
  location_name: "",
  latitude: null,
  longitude: null,
  due_date: "",
};


export default function Pulse() {
  const [tasks, setTasks] =
    useState([]);

  const [form, setForm] =
    useState(
      initialTaskForm
    );

  const [loadingTasks, setLoadingTasks] =
    useState(true);

  const [assigning, setAssigning] =
    useState(false);

  const [
    verifyingTaskId,
    setVerifyingTaskId,
  ] = useState(null);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");


  // --------------------------------------------------
  // LOAD ALL FIELD TASKS
  // --------------------------------------------------

  const loadTasks =
    useCallback(
      async () => {
        try {
          setLoadingTasks(true);
          setError("");

          const data =
            await getTasks();

          setTasks(
            Array.isArray(
              data?.tasks
            )
              ? data.tasks
              : []
          );

        } catch (err) {
          console.error(
            "Unable to load tasks:",
            err
          );

          setError(
            err.response?.data?.detail ||
            "Unable to load field tasks."
          );

        } finally {
          setLoadingTasks(false);
        }
      },
      []
    );


  useEffect(() => {
    loadTasks();
  }, [loadTasks]);


  // --------------------------------------------------
  // FORM UPDATE
  // --------------------------------------------------

  function updateForm(
    event
  ) {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (current) => ({
        ...current,
        [name]: value,
      })
    );
  }


  // --------------------------------------------------
  // DEPARTMENT → DEFAULT TEAM
  // --------------------------------------------------

  function changeDepartment(
    event
  ) {
    const department =
      event.target.value;

    const defaultTeams = {
      Drainage:
        "Drainage Alpha",

      Traffic:
        "Traffic Alpha",

      Roads:
        "Road Response Alpha",

      Power:
        "Power Response Alpha",

      Emergency:
        "Emergency Alpha",

      Health:
        "Health Response Alpha",
    };

    setForm(
      (current) => ({
        ...current,
        department,

        team:
          defaultTeams[
            department
          ] || "",
      })
    );
  }


  // --------------------------------------------------
  // CREATE FIELD TASK
  // --------------------------------------------------

  async function handleAssignTask(
    event
  ) {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.department ||
      !form.zone ||
      !form.team.trim()
    ) {
      setError(
        "Task title, department, zone and team are required."
      );

      return;
    }

    try {
      setAssigning(true);
      setError("");
      setMessage("");

      const payload = {
        title:
          form.title.trim(),

        description:
          form.description.trim() ||
          null,

        department:
          form.department,

        zone:
          form.zone,

        team:
          form.team.trim(),

        priority:
          form.priority,

        asset_id:
          form.asset_id.trim() ||
          null,

        incident_id:
          form.incident_id.trim() ||
          null,

        location_name:
          form.location_name.trim() ||
          null,

        latitude:
          form.latitude === "" ||
          form.latitude == null
            ? null
            : Number(
                form.latitude
              ),

        longitude:
          form.longitude === "" ||
          form.longitude == null
            ? null
            : Number(
                form.longitude
              ),

        due_date:
          form.due_date ||
          null,
      };

      const data =
        await createTask(
          payload
        );

      if (!data?.task) {
        throw new Error(
          "Task creation returned no task."
        );
      }

      setTasks(
        (current) => [
          data.task,
          ...current,
        ]
      );

      setForm(
        initialTaskForm
      );

      setMessage(
        `${data.task.id} assigned successfully to ${data.task.team}.`
      );

    } catch (err) {
      console.error(
        "Unable to assign task:",
        err
      );

      setError(
        err.response?.data?.detail ||
        err.message ||
        "Unable to assign task."
      );

    } finally {
      setAssigning(false);
    }
  }


  // --------------------------------------------------
  // VERIFY COMPLETED TASK
  // --------------------------------------------------

  async function handleVerifyTask(
    taskId
  ) {
    try {
      setVerifyingTaskId(
        taskId
      );

      setError("");
      setMessage("");

      const data =
        await verifyTask(
          taskId,
          {
            verified: true,

            verification_note:
              "Completion verified by City Command.",
          }
        );

      if (!data?.task) {
        throw new Error(
          "Task verification returned no task."
        );
      }

      setTasks(
        (current) =>
          current.map(
            (task) =>
              task.id === taskId
                ? data.task
                : task
          )
      );

      setMessage(
        `${taskId} verified and resolved.`
      );

    } catch (err) {
      console.error(
        "Unable to verify task:",
        err
      );

      setError(
        err.response?.data?.detail ||
        err.message ||
        "Unable to verify task."
      );

    } finally {
      setVerifyingTaskId(
        null
      );
    }
  }


  // --------------------------------------------------
  // TASK COUNTS
  // --------------------------------------------------

  const activeTasks =
    tasks.filter(
      (task) =>
        ![
          "Completed",
          "Resolved",
        ].includes(
          task.status
        )
    );


  const verificationQueue =
    tasks.filter(
      (task) =>
        task.status ===
        "Completed"
    );


  const resolvedTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "Resolved"
    );


  // --------------------------------------------------
  // FORMAT DEADLINE
  // --------------------------------------------------

  function formatDeadline(
    dueDate
  ) {
    if (!dueDate) {
      return "No deadline";
    }

    const date =
      new Date(
        dueDate
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return dueDate;
    }

    return date.toLocaleString();
  }


  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <main className="app-shell">

      {/* ==================================================
          HEADER
          ================================================== */}

      <header className="app-header">

        <div>
          <span className="brand-mini">
            NERVA
          </span>

          <p>
            Neural city intelligence
          </p>
        </div>


        <div className="system-online">
          <span />

          ONLINE
        </div>

      </header>


      <section className="pulse-page">

        {/* ==================================================
            EXISTING CITY STATUS
            ================================================== */}

        <div className="welcome">

          <span className="eyebrow">
            CITY STATUS
          </span>

          <h1>
            Your city is stable.
          </h1>

          <p>
            One infrastructure system
            requires attention.
          </p>

        </div>


        <CityPulse
          value={82}
        />


        <div className="system-strip">

          {systems.map(
            ({
              name,
              status,
              icon: Icon,
            }) => (

              <div
                className="system-item"
                key={name}
              >

                <Icon
                  size={18}
                />

                <div>

                  <strong>
                    {name}
                  </strong>

                  <span
                    className={
                      status ===
                      "Watch"
                        ? "watch"
                        : ""
                    }
                  >
                    {status}
                  </span>

                </div>

              </div>
            )
          )}

        </div>


        {/* ==================================================
            CITY COMMAND
            ================================================== */}

        <section className="command-center">

          <div className="command-heading">

            <div>

              <span className="eyebrow">
                CITY COMMAND
              </span>

              <h2>
                Response Coordination
              </h2>

              <p>
                Assign operational work
                to field teams and follow
                response progress.
              </p>

            </div>


            <button
              type="button"
              className="command-refresh"
              onClick={
                loadTasks
              }
              disabled={
                loadingTasks
              }
            >
              <RefreshCw
                size={16}
              />

              Refresh
            </button>

          </div>


          {/* ------------------------------------------------
              COMMAND METRICS
              ------------------------------------------------ */}

          <div className="command-metrics">

            <article>
              <ClipboardList
                size={19}
              />

              <div>
                <strong>
                  {tasks.length}
                </strong>

                <span>
                  Total Tasks
                </span>
              </div>
            </article>


            <article>
              <Users
                size={19}
              />

              <div>
                <strong>
                  {activeTasks.length}
                </strong>

                <span>
                  Active
                </span>
              </div>
            </article>


            <article>
              <Clock3
                size={19}
              />

              <div>
                <strong>
                  {
                    verificationQueue.length
                  }
                </strong>

                <span>
                  Awaiting Review
                </span>
              </div>
            </article>


            <article>
              <ShieldCheck
                size={19}
              />

              <div>
                <strong>
                  {
                    resolvedTasks.length
                  }
                </strong>

                <span>
                  Resolved
                </span>
              </div>
            </article>

          </div>


          {/* ------------------------------------------------
              MESSAGES
              ------------------------------------------------ */}

          {error && (
            <div className="command-message error">

              <AlertTriangle
                size={17}
              />

              {error}

            </div>
          )}


          {message && (
            <div className="command-message success">

              <CheckCircle2
                size={17}
              />

              {message}

            </div>
          )}


          <div className="command-grid">

            {/* ===============================================
                ASSIGN TASK
                =============================================== */}

            <section className="command-panel">

              <div className="command-panel-title">

                <Plus
                  size={18}
                />

                <div>
                  <span>
                    NEW RESPONSE ACTION
                  </span>

                  <h3>
                    Assign Field Task
                  </h3>
                </div>

              </div>


              <form
                className="command-form"
                onSubmit={
                  handleAssignTask
                }
              >

                <label>
                  Task title

                  <input
                    name="title"
                    value={
                      form.title
                    }
                    onChange={
                      updateForm
                    }
                    placeholder="Clear blocked drainage line"
                    required
                  />
                </label>


                <label>
                  Description

                  <textarea
                    name="description"
                    value={
                      form.description
                    }
                    onChange={
                      updateForm
                    }
                    placeholder="Describe the response action..."
                    rows="3"
                  />
                </label>


                <div className="command-form-row">

                  <label>
                    Department

                    <select
                      name="department"
                      value={
                        form.department
                      }
                      onChange={
                        changeDepartment
                      }
                    >
                      <option>
                        Drainage
                      </option>

                      <option>
                        Traffic
                      </option>

                      <option>
                        Roads
                      </option>

                      <option>
                        Power
                      </option>

                      <option>
                        Emergency
                      </option>

                      <option>
                        Health
                      </option>
                    </select>
                  </label>


                  <label>
                    Priority

                    <select
                      name="priority"
                      value={
                        form.priority
                      }
                      onChange={
                        updateForm
                      }
                    >
                      <option>
                        Critical
                      </option>

                      <option>
                        High
                      </option>

                      <option>
                        Medium
                      </option>

                      <option>
                        Low
                      </option>
                    </select>
                  </label>

                </div>


                <div className="command-form-row">

                  <label>
                    Zone

                    <select
                      name="zone"
                      value={
                        form.zone
                      }
                      onChange={
                        updateForm
                      }
                    >
                      <option>
                        Zone A
                      </option>

                      <option>
                        Zone B
                      </option>

                      <option>
                        Zone C
                      </option>

                      <option>
                        Zone D
                      </option>
                    </select>
                  </label>


                  <label>
                    Field Team

                    <input
                      name="team"
                      value={
                        form.team
                      }
                      onChange={
                        updateForm
                      }
                      placeholder="Drainage Alpha"
                      required
                    />
                  </label>

                </div>


                <label>
                  Location

                  <div className="command-input-icon">

                    <MapPin
                      size={15}
                    />

                    <input
                      name="location_name"
                      value={
                        form.location_name
                      }
                      onChange={
                        updateForm
                      }
                      placeholder="Zone A • Drain D04"
                    />

                  </div>
                </label>


                <div className="command-form-row">

                  <label>
                    Asset ID

                    <input
                      name="asset_id"
                      value={
                        form.asset_id
                      }
                      onChange={
                        updateForm
                      }
                      placeholder="D04"
                    />
                  </label>


                  <label>
                    Incident ID

                    <input
                      name="incident_id"
                      value={
                        form.incident_id
                      }
                      onChange={
                        updateForm
                      }
                      placeholder="RAIN_01"
                    />
                  </label>

                </div>


                <div className="command-form-row">

                  <label>
                    Latitude

                    <input
                      name="latitude"
                      type="number"
                      step="any"
                      value={
                        form.latitude ??
                        ""
                      }
                      onChange={
                        updateForm
                      }
                      placeholder="Optional"
                    />
                  </label>


                  <label>
                    Longitude

                    <input
                      name="longitude"
                      type="number"
                      step="any"
                      value={
                        form.longitude ??
                        ""
                      }
                      onChange={
                        updateForm
                      }
                      placeholder="Optional"
                    />
                  </label>

                </div>


                <label>
                  Deadline

                  <input
                    name="due_date"
                    type="datetime-local"
                    value={
                      form.due_date
                    }
                    onChange={
                      updateForm
                    }
                  />
                </label>


                <button
                  type="submit"
                  className="command-assign-button"
                  disabled={
                    assigning
                  }
                >

                  {assigning ? (
                    <Loader2
                      size={17}
                      className="spin"
                    />
                  ) : (
                    <Send
                      size={17}
                    />
                  )}

                  {assigning
                    ? "Assigning..."
                    : "Assign Task"}

                </button>

              </form>

            </section>


            {/* ===============================================
                LIVE TASKS
                =============================================== */}

            <section className="command-panel">

              <div className="command-panel-title">

                <ClipboardList
                  size={18}
                />

                <div>
                  <span>
                    FIELD OPERATIONS
                  </span>

                  <h3>
                    Live Task Monitor
                  </h3>
                </div>

              </div>


              {loadingTasks && (
                <div className="command-empty">

                  <Loader2
                    size={18}
                    className="spin"
                  />

                  Loading field tasks...

                </div>
              )}


              {!loadingTasks &&
                tasks.length === 0 && (

                <div className="command-empty">

                  <ClipboardList
                    size={20}
                  />

                  <strong>
                    No tasks assigned yet.
                  </strong>

                  <span>
                    Create the first field
                    response action.
                  </span>

                </div>
              )}


              <div className="command-task-list">

                {tasks.map(
                  (task) => (

                    <article
                      key={task.id}
                      className="command-task"
                    >

                      <div className="command-task-top">

                        <div>

                          <span>
                            {task.id}
                          </span>

                          <h4>
                            {task.title}
                          </h4>

                        </div>


                        <strong
                          className={
                            `command-status ${
                              task.status
                                ?.toLowerCase()
                                .replaceAll(
                                  " ",
                                  "-"
                                ) || ""
                            }`
                          }
                        >
                          {task.status}
                        </strong>

                      </div>


                      <div className="command-task-info">

                        <span>
                          <Users
                            size={14}
                          />

                          {task.team ||
                            "Unassigned"}
                        </span>


                        <span>
                          <MapPin
                            size={14}
                          />

                          {task.location_name ||
                            task.zone ||
                            "No location"}
                        </span>


                        <span>
                          <Clock3
                            size={14}
                          />

                          {formatDeadline(
                            task.due_date
                          )}
                        </span>

                      </div>


                      <div className="command-task-progress">

                        <div>

                          <span>
                            Progress
                          </span>

                          <strong>
                            {task.progress ??
                              0}
                            %
                          </strong>

                        </div>


                        <div className="command-progress-track">

                          <span
                            style={{
                              width:
                                `${Math.min(
                                  100,
                                  Math.max(
                                    0,
                                    task.progress ??
                                      0
                                  )
                                )}%`,
                            }}
                          />

                        </div>

                      </div>


                      {task.status ===
                        "Completed" && (

                        <button
                          type="button"
                          className="command-verify-button"
                          disabled={
                            verifyingTaskId ===
                            task.id
                          }
                          onClick={() =>
                            handleVerifyTask(
                              task.id
                            )
                          }
                        >

                          {verifyingTaskId ===
                          task.id ? (
                            <Loader2
                              size={16}
                              className="spin"
                            />
                          ) : (
                            <ShieldCheck
                              size={16}
                            />
                          )}

                          Verify Completion

                        </button>
                      )}


                      {task.status ===
                        "Resolved" && (

                        <div className="command-resolved">

                          <CheckCircle2
                            size={15}
                          />

                          Completion verified

                        </div>
                      )}

                    </article>
                  )
                )}

              </div>

            </section>

          </div>

        </section>


        {/* ==================================================
            EXISTING ASK NERVA
            ================================================== */}

        <AskNerva />

      </section>


      <BottomNav />

    </main>
  );
}