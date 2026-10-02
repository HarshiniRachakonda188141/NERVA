import {
  AlertTriangle,
  ArrowRight,
  CloudRain,
  MapPin,
  Network,
  Play,
  ShieldAlert,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";


const defaultCascade = [
  {
    id: "D04",
    label: "Central Drain",
  },
  {
    id: "R17",
    label: "Link Road",
  },
  {
    id: "J03",
    label: "Junction",
  },
  {
    id: "H02",
    label: "Hospital",
  },
];


export default function IncidentCard({
  scenario = null,
  cascade = defaultCascade,
}) {
  const navigate =
    useNavigate();


  const incident = {
    id:
      scenario?.id ||
      "RAIN_01",

    name:
      scenario?.name ||
      "Heavy Rainfall",

    eventType:
      scenario?.event_type ||
      "heavy_rainfall",

    zone:
      scenario?.zone ||
      "Zone A",

    severity:
      scenario?.severity ??
      8,

    startingAsset:
      scenario?.starting_asset ||
      "D04",
  };


  function openDigitalTwin() {
    navigate("/city");
  }


  function openSimulation() {
    navigate(
      `/nerva?scenario=${incident.id}`
    );
  }


  return (
    <section className="incident-panel">
      <div className="incident-panel-header">
        <div>
          <span className="incident-eyebrow">
            ACTIVE MODELLED INCIDENT
          </span>

          <h2>
            Infrastructure Event
          </h2>
        </div>

        <div className="incident-live-badge">
          <span />

          ACTIVE
        </div>
      </div>


      <div className="incident-main">
        <div className="incident-summary">
          <div className="incident-icon">
            <CloudRain size={26} />
          </div>

          <div className="incident-copy">
            <span>
              {incident.id}
            </span>

            <h3>
              {incident.name}
            </h3>

            <div className="incident-location">
              <MapPin size={15} />

              {incident.zone}
            </div>
          </div>
        </div>


        <div className="incident-severity">
          <span>
            SEVERITY
          </span>

          <div>
            <strong>
              {incident.severity}
            </strong>

            <small>
              /10
            </small>
          </div>

          <div className="severity-track">
            <span
              style={{
                width:
                  `${Math.min(
                    incident.severity * 10,
                    100
                  )}%`,
              }}
            />
          </div>
        </div>
      </div>


      <div className="incident-alert">
        <ShieldAlert size={18} />

        <div>
          <strong>
            Starting infrastructure asset:
            {" "}
            {incident.startingAsset}
          </strong>

          <p>
            NERVA is modelling how disruption
            at this asset may propagate through
            connected urban infrastructure.
          </p>
        </div>
      </div>


      <div className="incident-cascade-section">
        <div className="incident-cascade-heading">
          <div>
            <Network size={17} />

            <span>
              CASCADE PATH
            </span>
          </div>

          <small>
            MODELLED
          </small>
        </div>


        <div className="incident-cascade">
          {cascade.map(
            (node, index) => (
              <div
                className="cascade-step-wrap"
                key={
                  node.id ||
                  index
                }
              >
                <div className="cascade-step">
                  <span className="cascade-node-id">
                    {node.id}
                  </span>

                  <strong>
                    {node.label ||
                      node.name ||
                      "Infrastructure"}
                  </strong>
                </div>

                {index <
                  cascade.length - 1 && (
                  <ArrowRight
                    className="cascade-arrow"
                    size={18}
                  />
                )}
              </div>
            )
          )}
        </div>
      </div>


      <div className="incident-actions">
        <button
          type="button"
          className="incident-secondary-button"
          onClick={openDigitalTwin}
        >
          <Network size={17} />

          Open Digital Twin
        </button>

        <button
          type="button"
          className="incident-primary-button"
          onClick={openSimulation}
        >
          <Play size={17} />

          Run Simulation
        </button>
      </div>


      <div className="incident-disclaimer">
        <AlertTriangle size={14} />

        <span>
          Prototype scenario — displayed
          impacts are modelled decision-support
          outputs, not confirmed real-world
          incidents.
        </span>
      </div>
    </section>
  );
}