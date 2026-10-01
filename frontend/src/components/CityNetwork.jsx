import {
  motion
} from "framer-motion";


const nodes = [
  {
    id: "D04",
    label: "Central Drain",
    type: "drainage",
    x: 17,
    y: 66
  },
  {
    id: "W03",
    label: "Water Pipeline",
    type: "water",
    x: 31,
    y: 29
  },
  {
    id: "R17",
    label: "Link Road",
    type: "road",
    x: 43,
    y: 54
  },
  {
    id: "E02",
    label: "Power Node",
    type: "power",
    x: 57,
    y: 73
  },
  {
    id: "J03",
    label: "Junction",
    type: "junction",
    x: 67,
    y: 40
  },
  {
    id: "H02",
    label: "Hospital",
    type: "hospital",
    x: 84,
    y: 23
  }
];


const edges = [
  ["D04", "R17"],
  ["W03", "R17"],
  ["R17", "J03"],
  ["E02", "J03"],
  ["J03", "H02"]
];


function nodeById(id) {
  return nodes.find(
    (node) =>
      node.id === id
  );
}


export default function CityNetwork({
  activeNodes = [],
  mode = "surface",
  onNodeClick
}) {
  return (
    <div
      className={
        `city-network mode-${mode}`
      }
    >
      <div className="city-grid" />

      {mode === "surface" && (
        <div className="surface-city">
          <span className="building b1" />
          <span className="building b2" />
          <span className="building b3" />
          <span className="building b4" />
          <span className="road road-one" />
          <span className="road road-two" />
        </div>
      )}

      {mode === "xray" && (
        <div className="xray-labels">
          <span>
            UNDERGROUND LAYER
          </span>

          <small>
            Drainage · Water · Power
          </small>
        </div>
      )}

      <svg
        className="network-lines"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {edges.map(
          ([sourceId, targetId]) => {
            const source =
              nodeById(sourceId);

            const target =
              nodeById(targetId);

            const active =
              activeNodes.includes(
                sourceId
              ) &&
              activeNodes.includes(
                targetId
              );

            return (
              <motion.line
                key={
                  `${sourceId}-${targetId}`
                }
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                className={
                  active
                    ? "edge active"
                    : "edge"
                }
                initial={{
                  pathLength: 0
                }}
                animate={{
                  pathLength: 1
                }}
                transition={{
                  duration: 1
                }}
              />
            );
          }
        )}
      </svg>

      {nodes.map(
        (node) => {
          const active =
            activeNodes.includes(
              node.id
            );

          const hiddenInSurface =
            mode === "surface" &&
            (
              node.type ===
                "drainage"
              ||
              node.type ===
                "water"
            );

          if (hiddenInSurface) {
            return null;
          }

          return (
            <motion.button
              type="button"
              key={node.id}
              className={
                active
                  ? `network-node ${node.type} active`
                  : `network-node ${node.type}`
              }
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`
              }}
              onClick={() =>
                onNodeClick?.(
                  node.id
                )
              }
              whileHover={{
                scale: 1.08
              }}
              animate={
                active
                  ? {
                      scale: [
                        1,
                        1.14,
                        1
                      ]
                    }
                  : {}
              }
              transition={{
                duration: 1.1,
                repeat: active
                  ? Infinity
                  : 0
              }}
            >
              <span className="node-dot" />

              <div className="node-copy">
                <strong>
                  {node.id}
                </strong>

                <small>
                  {node.label}
                </small>
              </div>
            </motion.button>
          );
        }
      )}

      <div className="prototype-label">
        SIMULATED DIGITAL TWIN
      </div>
    </div>
  );
}