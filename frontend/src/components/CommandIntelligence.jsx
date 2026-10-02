import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleGauge,
  Clock3,
  CloudRain,
  Droplets,
  Flame,
  HeartPulse,
  Play,
  RotateCcw,
  Route,
  ShieldCheck,
  Siren,
  ThermometerSun,
  TrafficCone,
  Users,
  Wrench,
  Zap,
} from "lucide-react";


const SCENARIOS = [
  {
    id: "rain",
    name: "Heavy Rain",
    icon: CloudRain,
    severity: "High",
    score: 68,
    confidence: 91,
    start: "Heavy rainfall",
    timeline: [
      {
        time: "Now",
        title: "Rain intensity rises",
        detail: "Drain load begins increasing.",
      },
      {
        time: "+10 min",
        title: "Drain capacity stressed",
        detail: "Low-lying road sections become vulnerable.",
      },
      {
        time: "+25 min",
        title: "Road disruption",
        detail: "Traffic begins shifting to nearby corridors.",
      },
      {
        time: "+45 min",
        title: "Critical access affected",
        detail: "Hospital access may experience delays.",
      },
    ],
    chain: [
      "Rain",
      "Drain D12",
      "Road R17",
      "Junction J03",
      "Hospital Access",
    ],
  },

  {
    id: "fire",
    name: "Urban Fire",
    icon: Flame,
    severity: "Critical",
    score: 59,
    confidence: 86,
    start: "Urban fire",
    timeline: [
      {
        time: "Now",
        title: "Fire reported",
        detail: "Incident zone enters emergency monitoring.",
      },
      {
        time: "+10 min",
        title: "Road restriction",
        detail: "Response vehicles require priority access.",
      },
      {
        time: "+25 min",
        title: "Traffic displacement",
        detail: "Nearby junction demand increases.",
      },
      {
        time: "+45 min",
        title: "Service pressure",
        detail: "Emergency resources may require reinforcement.",
      },
    ],
    chain: [
      "Fire Zone",
      "Local Road",
      "Junction",
      "Traffic Corridor",
      "Emergency Services",
    ],
  },

  {
    id: "power",
    name: "Power Failure",
    icon: Zap,
    severity: "High",
    score: 64,
    confidence: 89,
    start: "Power failure",
    timeline: [
      {
        time: "Now",
        title: "Distribution failure",
        detail: "Local supply becomes unavailable.",
      },
      {
        time: "+10 min",
        title: "Signal systems affected",
        detail: "Traffic control reliability decreases.",
      },
      {
        time: "+25 min",
        title: "Junction congestion",
        detail: "Manual traffic control may be required.",
      },
      {
        time: "+45 min",
        title: "Critical facilities exposed",
        detail: "Backup power becomes increasingly important.",
      },
    ],
    chain: [
      "Power Node",
      "Traffic Signals",
      "Junction",
      "Road Network",
      "Critical Facility",
    ],
  },

  {
    id: "accident",
    name: "Road Accident",
    icon: TrafficCone,
    severity: "Medium",
    score: 73,
    confidence: 94,
    start: "Road accident",
    timeline: [
      {
        time: "Now",
        title: "Incident detected",
        detail: "Road capacity decreases.",
      },
      {
        time: "+10 min",
        title: "Queue develops",
        detail: "Traffic begins accumulating.",
      },
      {
        time: "+25 min",
        title: "Diversion pressure",
        detail: "Adjacent routes receive additional traffic.",
      },
      {
        time: "+45 min",
        title: "Network delay",
        detail: "Emergency travel time may increase.",
      },
    ],
    chain: [
      "Accident",
      "Road Segment",
      "Junction",
      "Alternate Road",
      "Emergency Access",
    ],
  },

  {
    id: "pipeline",
    name: "Pipeline Burst",
    icon: Droplets,
    severity: "High",
    score: 62,
    confidence: 83,
    start: "Pipeline failure",
    timeline: [
      {
        time: "Now",
        title: "Pipeline pressure drops",
        detail: "Possible leak zone identified.",
      },
      {
        time: "+10 min",
        title: "Surface water increases",
        detail: "Nearby road condition begins degrading.",
      },
      {
        time: "+25 min",
        title: "Road access affected",
        detail: "Traffic diversion may become necessary.",
      },
      {
        time: "+45 min",
        title: "Service disruption",
        detail: "Nearby consumers may experience supply impact.",
      },
    ],
    chain: [
      "Water Line",
      "Leak Zone",
      "Road",
      "Traffic",
      "Local Services",
    ],
  },

  {
    id: "heat",
    name: "Extreme Heat",
    icon: ThermometerSun,
    severity: "High",
    score: 66,
    confidence: 81,
    start: "Extreme heat",
    timeline: [
      {
        time: "Now",
        title: "Heat threshold exceeded",
        detail: "City heat stress begins rising.",
      },
      {
        time: "+10 min",
        title: "Power demand rises",
        detail: "Cooling demand increases grid load.",
      },
      {
        time: "+25 min",
        title: "Grid stress",
        detail: "Vulnerable distribution points face pressure.",
      },
      {
        time: "+45 min",
        title: "Health demand increases",
        detail: "Emergency services may receive more heat-related calls.",
      },
    ],
    chain: [
      "Heat",
      "Power Demand",
      "Grid",
      "Neighbourhood",
      "Health Services",
    ],
  },
];


const ACTIONS = [
  {
    id: "drain",
    name: "Clear Drain",
    description: "Reduce drainage bottleneck.",
    benefit: 11,
    icon: Wrench,
  },
  {
    id: "road",
    name: "Close Road",
    description: "Prevent entry into risk zone.",
    benefit: 7,
    icon: TrafficCone,
  },
  {
    id: "traffic",
    name: "Divert Traffic",
    description: "Reduce pressure on affected corridor.",
    benefit: 8,
    icon: Route,
  },
  {
    id: "team",
    name: "Dispatch Team",
    description: "Send field response team.",
    benefit: 10,
    icon: Siren,
  },
];


const DEPARTMENTS = [
  {
    name: "Drainage",
    status: "Responding",
    task: "Inspect D12",
    icon: Droplets,
  },
  {
    name: "Traffic",
    status: "Assigned",
    task: "Prepare R17 diversion",
    icon: TrafficCone,
  },
  {
    name: "Electricity",
    status: "Monitoring",
    task: "Watch grid dependencies",
    icon: Zap,
  },
  {
    name: "Emergency",
    status: "Ready",
    task: "Protect critical access",
    icon: HeartPulse,
  },
];


export default function CommandIntelligence({
  citizenSignals = 0,
  activeTasks = 0,
  weather = null,
}) {
  const [scenarioId, setScenarioId] =
    useState("rain");

  const [selectedActions, setSelectedActions] =
    useState([]);

  const [scoreOpen, setScoreOpen] =
    useState(false);

  const [replaying, setReplaying] =
    useState(false);

  const [replayStep, setReplayStep] =
    useState(0);


  const scenario = useMemo(
    () =>
      SCENARIOS.find(
        (item) => item.id === scenarioId
      ) || SCENARIOS[0],
    [scenarioId]
  );


  const improvement = useMemo(
    () =>
      selectedActions.reduce(
        (total, actionId) => {
          const action = ACTIONS.find(
            (item) => item.id === actionId
          );

          return total + (action?.benefit || 0);
        },
        0
      ),
    [selectedActions]
  );


  const improvedScore = Math.min(
    96,
    scenario.score + improvement
  );


  function toggleAction(actionId) {
    setSelectedActions((current) => {
      if (current.includes(actionId)) {
        return current.filter(
          (item) => item !== actionId
        );
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, actionId];
    });
  }


  function changeScenario(id) {
    setScenarioId(id);
    setSelectedActions([]);
    setReplayStep(0);
    setReplaying(false);
  }


  function replayIncident() {
    setReplaying(true);
    setReplayStep(0);

    let step = 0;

    const timer = setInterval(() => {
      step += 1;

      if (step >= scenario.timeline.length) {
        clearInterval(timer);
        setReplaying(false);
        return;
      }

      setReplayStep(step);
    }, 900);
  }


  const ScenarioIcon = scenario.icon;


  return (
    <section className="command-intelligence">

      {/* =====================================================
          CITY STATUS
      ===================================================== */}

      <div className="command-top-row">

        <div className="command-status-card">

          <div className="command-card-heading">
            <div>
              <span>CITY STATUS</span>
              <h2>Operational picture</h2>
            </div>

            <Activity size={19} />
          </div>

          <div className="command-status-grid">

            <div>
              <span className="status-indicator warning" />

              <section>
                <strong>
                  Elevated Risk
                </strong>

                <small>
                  Current model state
                </small>
              </section>
            </div>

            <div>
              <Users size={17} />

              <section>
                <strong>
                  {citizenSignals}
                </strong>

                <small>
                  Citizen signals
                </small>
              </section>
            </div>

            <div>
              <Siren size={17} />

              <section>
                <strong>
                  {activeTasks}
                </strong>

                <small>
                  Active field tasks
                </small>
              </section>
            </div>

            <div>
              <CloudRain size={17} />

              <section>
                <strong>
                  {weather?.precipitation ?? 0}
                  {" mm"}
                </strong>

                <small>
                  Current precipitation
                </small>
              </section>
            </div>

          </div>

        </div>


        {/* RESILIENCE SCORE */}

        <button
          type="button"
          className="resilience-card"
          onClick={() =>
            setScoreOpen(
              (current) => !current
            )
          }
        >

          <div className="resilience-ring">

            <CircleGauge size={31} />

            <strong>
              {scenario.score}
            </strong>

          </div>

          <div>
            <span>
              CITY RESILIENCE
            </span>

            <h3>
              {scenario.score >= 75
                ? "Stable"
                : scenario.score >= 65
                ? "Watch"
                : "Stressed"}
            </h3>

            <small>
              Click to understand score
            </small>
          </div>

          <ChevronRight size={17} />

        </button>

      </div>


      {scoreOpen && (
        <div className="score-explanation">

          <div>
            <strong>
              Why this score?
            </strong>

            <p>
              The prototype score combines
              infrastructure condition,
              dependency exposure, critical
              facilities and the selected
              simulated event.
            </p>
          </div>

          <div className="score-factor-grid">

            <article>
              <span>
                Infrastructure
              </span>
              <strong>76 / 100</strong>
            </article>

            <article>
              <span>
                Dependencies
              </span>
              <strong>61 / 100</strong>
            </article>

            <article>
              <span>
                Critical access
              </span>
              <strong>72 / 100</strong>
            </article>

            <article>
              <span>
                Event pressure
              </span>
              <strong>
                {scenario.score} / 100
              </strong>
            </article>

          </div>

          <small>
            Prototype decision-support metric —
            not an official city resilience
            rating.
          </small>

        </div>
      )}


      {/* =====================================================
          SCENARIO SIMULATOR
      ===================================================== */}

      <div className="command-section">

        <div className="command-section-title">

          <div>
            <span>
              SCENARIO SIMULATOR
            </span>

            <h2>
              What happens if?
            </h2>
          </div>

          <div className="simulation-badge">
            MODELLED
          </div>

        </div>


        <div className="scenario-selector">

          {SCENARIOS.map(
            ({
              id,
              name,
              icon: Icon,
            }) => (

              <button
                type="button"
                key={id}
                className={
                  scenarioId === id
                    ? "scenario-option active"
                    : "scenario-option"
                }
                onClick={() =>
                  changeScenario(id)
                }
              >
                <Icon size={19} />
                <span>{name}</span>
              </button>

            )
          )}

        </div>


        <div className="scenario-summary">

          <div className="scenario-main-icon">
            <ScenarioIcon size={28} />
          </div>

          <div>
            <span>
              SELECTED EVENT
            </span>

            <h3>
              {scenario.name}
            </h3>

            <p>
              Severity:
              {" "}
              <strong>
                {scenario.severity}
              </strong>
            </p>
          </div>

          <div className="scenario-confidence">

            <span>
              MODEL CONFIDENCE
            </span>

            <strong>
              {scenario.confidence}%
            </strong>

          </div>

        </div>

      </div>


      {/* =====================================================
          IMPACT TIMELINE
      ===================================================== */}

      <div className="command-section">

        <div className="command-section-title">

          <div>
            <span>
              TIME TO IMPACT
            </span>

            <h2>
              How the disruption may spread
            </h2>
          </div>

          <button
            type="button"
            className={
              replaying
                ? "replay-button active"
                : "replay-button"
            }
            onClick={replayIncident}
            disabled={replaying}
          >
            {replaying ? (
              <RotateCcw size={16} />
            ) : (
              <Play size={16} />
            )}

            {replaying
              ? "Replaying"
              : "Replay Incident"}
          </button>

        </div>


        <div className="impact-timeline">

          {scenario.timeline.map(
            (item, index) => (

              <article
                key={item.time}
                className={
                  index <= replayStep
                    ? "impact-step active"
                    : "impact-step"
                }
              >

                <div className="impact-time">
                  <Clock3 size={14} />
                  {item.time}
                </div>

                <div className="impact-dot" />

                <strong>
                  {item.title}
                </strong>

                <p>
                  {item.detail}
                </p>

              </article>

            )
          )}

        </div>

      </div>


      {/* =====================================================
          IMPACT CHAIN
      ===================================================== */}

      <div className="command-section">

        <div className="command-section-title">

          <div>
            <span>
              IMPACT CHAIN
            </span>

            <h2>
              Infrastructure dependency path
            </h2>
          </div>

        </div>


        <div className="impact-chain">

          {scenario.chain.map(
            (item, index) => (
              <div
                key={item}
                className="impact-chain-part"
              >

                <div
                  className={
                    index === 0
                      ? "chain-node source"
                      : index ===
                        scenario.chain.length - 1
                      ? "chain-node critical"
                      : "chain-node"
                  }
                >
                  {index === 0 && (
                    <AlertTriangle
                      size={15}
                    />
                  )}

                  <span>
                    {item}
                  </span>
                </div>

                {index <
                  scenario.chain.length -
                    1 && (
                  <ChevronRight
                    size={18}
                    className="chain-arrow"
                  />
                )}

              </div>
            )
          )}

        </div>

      </div>


      {/* =====================================================
          INTERVENTION LAB
      ===================================================== */}

      <div className="command-section">

        <div className="command-section-title">

          <div>
            <span>
              TRY ACTIONS
            </span>

            <h2>
              Test interventions before acting
            </h2>

            <p>
              Select up to three actions.
            </p>
          </div>

        </div>


        <div className="intervention-layout">

          <div className="action-selector">

            {ACTIONS.map(
              ({
                id,
                name,
                description,
                icon: Icon,
              }) => {

                const selected =
                  selectedActions.includes(id);

                return (
                  <button
                    type="button"
                    key={id}
                    className={
                      selected
                        ? "intervention-action selected"
                        : "intervention-action"
                    }
                    onClick={() =>
                      toggleAction(id)
                    }
                  >

                    <div>
                      <Icon size={19} />
                    </div>

                    <section>
                      <strong>
                        {name}
                      </strong>

                      <small>
                        {description}
                      </small>
                    </section>

                    {selected && (
                      <CheckCircle2
                        size={18}
                      />
                    )}

                  </button>
                );
              }
            )}

          </div>


          {/* BEFORE AFTER */}

          <div className="impact-comparison">

            <span>
              MODELLED IMPACT
            </span>

            <h3>
              Before vs after
            </h3>

            <div className="comparison-values">

              <article>
                <small>
                  WITHOUT ACTION
                </small>

                <strong>
                  {scenario.score}
                </strong>

                <span>
                  resilience
                </span>
              </article>

              <ChevronRight size={22} />

              <article
                className={
                  selectedActions.length
                    ? "improved"
                    : ""
                }
              >
                <small>
                  WITH ACTIONS
                </small>

                <strong>
                  {improvedScore}
                </strong>

                <span>
                  resilience
                </span>
              </article>

            </div>


            {selectedActions.length > 0 ? (
              <div className="comparison-result">

                <ShieldCheck size={17} />

                <span>
                  Modelled improvement:
                  {" +"}
                  {improvement}
                  {" points"}
                </span>

              </div>
            ) : (
              <p>
                Select interventions to
                compare their modelled impact.
              </p>
            )}

          </div>

        </div>

      </div>


      {/* =====================================================
          DEPARTMENTS
      ===================================================== */}

      <div className="command-section">

        <div className="command-section-title">

          <div>
            <span>
              DEPARTMENTS
            </span>

            <h2>
              Coordinated response
            </h2>
          </div>

          <Building2 size={20} />

        </div>


        <div className="department-grid">

          {DEPARTMENTS.map(
            ({
              name,
              status,
              task,
              icon: Icon,
            }) => (

              <article
                key={name}
                className="department-card"
              >

                <div className="department-icon">
                  <Icon size={19} />
                </div>

                <div>
                  <span>
                    {name}
                  </span>

                  <strong>
                    {task}
                  </strong>

                  <small>
                    {status}
                  </small>
                </div>

                <span
                  className={
                    `department-status ${status
                      .toLowerCase()
                      .replace(" ", "-")}`
                  }
                />

              </article>

            )
          )}

        </div>

      </div>


      {/* =====================================================
          EVIDENCE
      ===================================================== */}

      <div className="command-section evidence-panel">

        <div className="command-section-title">

          <div>
            <span>
              EVIDENCE
            </span>

            <h2>
              Why NERVA predicts this
            </h2>
          </div>

          <ShieldCheck size={20} />

        </div>


        <div className="evidence-grid">

          <article>
            <span>INPUTS USED</span>

            <strong>
              Weather + infrastructure +
              dependencies + incident signals
            </strong>
          </article>

          <article>
            <span>
              DEPENDENCY PATH
            </span>

            <strong>
              {scenario.chain.join(" → ")}
            </strong>
          </article>

          <article>
            <span>
              CONFIDENCE
            </span>

            <strong>
              {scenario.confidence}%
            </strong>
          </article>

          <article>
            <span>
              MISSING DATA
            </span>

            <strong>
              Live municipal sensor feeds
            </strong>
          </article>

        </div>


        <div className="evidence-warning">

          <AlertTriangle size={16} />

          <p>
            Predictions and intervention
            comparisons are prototype
            decision-support outputs. They
            should not be presented as
            verified real-world city outcomes.
          </p>

        </div>

      </div>

    </section>
  );
}