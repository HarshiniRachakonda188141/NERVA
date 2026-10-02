import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Droplets,
  HeartPulse,
  Radio,
  Route,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";


const infrastructureSystems = [
  {
    id: "mobility",
    name: "Mobility",
    status: "Stable",
    detail: "Road network operating normally",
    icon: Route,
  },
  {
    id: "drainage",
    name: "Drainage",
    status: "Watch",
    detail: "Zone A requires monitoring",
    icon: Droplets,
  },
  {
    id: "power",
    name: "Power",
    status: "Stable",
    detail: "No major disruption detected",
    icon: Zap,
  },
  {
    id: "critical",
    name: "Critical Services",
    status: "Stable",
    detail: "Emergency access available",
    icon: HeartPulse,
  },
];


function MetricCard({
  icon: Icon,
  value,
  label,
  detail,
  tone = "",
}) {
  return (
    <article
      className={`command-overview-metric ${tone}`}
    >
      <div className="command-overview-metric-icon">
        <Icon size={19} />
      </div>

      <div className="command-overview-metric-copy">
        <strong>
          {value}
        </strong>

        <span>
          {label}
        </span>

        <small>
          {detail}
        </small>
      </div>
    </article>
  );
}


export default function CommandOverview({
  tasks = [],
  citizenSignalCount = 0,
  cityPulse = 82,
}) {
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

  const reviewTasks =
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

  const criticalTasks =
    tasks.filter(
      (task) =>
        task.priority ===
          "Critical" &&
        ![
          "Completed",
          "Resolved",
        ].includes(
          task.status
        )
    );


  const cityStatus =
    cityPulse >= 80
      ? "Stable"
      : cityPulse >= 60
        ? "Elevated"
        : "Critical";


  return (
    <section className="command-overview">
      {/* ==========================================
          COMMAND HERO
      ========================================== */}

      <div className="command-overview-hero">
        <div className="command-overview-hero-copy">
          <div className="command-overview-live">
            <Radio size={14} />

            <span>
              LIVE COMMAND OVERVIEW
            </span>
          </div>

          <h1>
            City intelligence,
            <br />
            in one operational view.
          </h1>

          <p>
            Monitor infrastructure health,
            field response and emerging
            urban signals from a unified
            command layer.
          </p>
        </div>


        <div className="command-overview-score">
          <div className="command-score-ring">
            <div className="command-score-inner">
              <span>
                CITY PULSE
              </span>

              <strong>
                {cityPulse}
              </strong>

              <small>
                / 100
              </small>
            </div>
          </div>

          <div className="command-score-status">
            <CheckCircle2
              size={16}
            />

            <div>
              <strong>
                {cityStatus}
              </strong>

              <span>
                Overall city condition
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* ==========================================
          COMMAND METRICS
      ========================================== */}

      <div className="command-overview-metrics">
        <MetricCard
          icon={ClipboardList}
          value={activeTasks.length}
          label="Active Responses"
          detail="Field operations underway"
        />

        <MetricCard
          icon={Clock3}
          value={reviewTasks.length}
          label="Awaiting Review"
          detail="Completion verification queue"
          tone={
            reviewTasks.length
              ? "warning"
              : ""
          }
        />

        <MetricCard
          icon={ShieldCheck}
          value={resolvedTasks.length}
          label="Resolved"
          detail="Verified response actions"
          tone="success"
        />

        <MetricCard
          icon={Users}
          value={citizenSignalCount}
          label="Citizen Signals"
          detail="Reports contributing context"
        />
      </div>


      {/* ==========================================
          CITY SYSTEM INTELLIGENCE
      ========================================== */}

      <div className="command-overview-section">
        <div className="command-overview-heading">
          <div>
            <span>
              INFRASTRUCTURE NETWORK
            </span>

            <h2>
              Live City Intelligence
            </h2>
          </div>

          <div className="command-network-status">
            <span />

            Monitoring
          </div>
        </div>


        <div className="command-system-grid">
          {infrastructureSystems.map(
            ({
              id,
              name,
              status,
              detail,
              icon: Icon,
            }) => {
              const watch =
                status === "Watch";

              return (
                <article
                  key={id}
                  className={
                    watch
                      ? "command-system-card watch"
                      : "command-system-card"
                  }
                >
                  <div className="command-system-icon">
                    <Icon size={20} />
                  </div>

                  <div className="command-system-copy">
                    <div>
                      <strong>
                        {name}
                      </strong>

                      <span
                        className={
                          watch
                            ? "watch"
                            : ""
                        }
                      >
                        {status}
                      </span>
                    </div>

                    <p>
                      {detail}
                    </p>
                  </div>
                </article>
              );
            }
          )}
        </div>
      </div>


      {/* ==========================================
          OPERATIONAL ATTENTION
      ========================================== */}

      <div className="command-attention">
        <div className="command-attention-icon">
          {criticalTasks.length > 0 ? (
            <AlertTriangle
              size={21}
            />
          ) : (
            <Activity
              size={21}
            />
          )}
        </div>

        <div className="command-attention-copy">
          <span>
            OPERATIONAL ATTENTION
          </span>

          <strong>
            {criticalTasks.length > 0
              ? `${criticalTasks.length} critical response ${
                  criticalTasks.length === 1
                    ? "task requires"
                    : "tasks require"
                } attention.`
              : "No unresolved critical field task detected."}
          </strong>

          <p>
            NERVA combines modelled
            infrastructure conditions,
            response activity and citizen
            signals to support command
            decisions.
          </p>
        </div>

        <div className="command-attention-badge">
          <span />

          COMMAND ACTIVE
        </div>
      </div>


      {/* ==========================================
          PROTOTYPE TRANSPARENCY
      ========================================== */}

      <div className="command-model-note">
        <ShieldCheck
          size={15}
        />

        <p>
          <strong>
            Decision-support prototype.
          </strong>

          {" "}
          Infrastructure risk and cascade
          outputs are modelled scenarios.
          They are not guaranteed
          real-world forecasts.
        </p>
      </div>
    </section>
  );
}