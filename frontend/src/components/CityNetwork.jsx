import {
  useEffect,
  useMemo,
} from "react";

import {
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import {
  Activity,
  Building2,
  ClipboardList,
  CloudRain,
  Droplets,
  Hospital,
  MapPin,
  Network,
  Route,
  Users,
  Wind,
  Zap,
} from "lucide-react";

import "leaflet/dist/leaflet.css";


/*
  --------------------------------------------------
  NERVA PROTOTYPE INFRASTRUCTURE
  --------------------------------------------------

  These positions are modelled demonstration
  coordinates.

  They must not be interpreted as verified
  real-world infrastructure locations.
*/

const nodes = [
  {
    id: "D04",
    label: "Central Drain",
    type: "drainage",
    position: [
      17.4374,
      78.4482,
    ],
  },

  {
    id: "W03",
    label: "Water Pipeline",
    type: "water",
    position: [
      17.4448,
      78.4545,
    ],
  },

  {
    id: "R17",
    label: "Link Road",
    type: "road",
    position: [
      17.4395,
      78.4598,
    ],
  },

  {
    id: "E02",
    label: "Power Node",
    type: "power",
    position: [
      17.4328,
      78.4642,
    ],
  },

  {
    id: "J03",
    label: "Junction",
    type: "junction",
    position: [
      17.4418,
      78.4698,
    ],
  },

  {
    id: "H02",
    label: "Hospital",
    type: "hospital",
    position: [
      17.4481,
      78.4761,
    ],
  },
];


const edges = [
  ["D04", "R17"],
  ["W03", "R17"],
  ["R17", "J03"],
  ["E02", "J03"],
  ["J03", "H02"],
];


const MAP_CENTER = [
  17.441,
  78.462,
];


// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function nodeById(id) {
  return nodes.find(
    (node) =>
      node.id === id
  );
}


function hasCoordinates(
  item
) {
  if (!item) {
    return false;
  }

  const latitude =
    Number(
      item.latitude
    );

  const longitude =
    Number(
      item.longitude
    );

  return (
    Number.isFinite(
      latitude
    ) &&
    Number.isFinite(
      longitude
    )
  );
}


function coordinatesOf(
  item
) {
  return [
    Number(
      item.latitude
    ),
    Number(
      item.longitude
    ),
  ];
}


// --------------------------------------------------
// LEAFLET CONTROLLER
// --------------------------------------------------

function MapModeController({
  mode,
}) {
  const map =
    useMap();

  useEffect(() => {
    const timer =
      window.setTimeout(
        () => {
          map.invalidateSize();
        },
        100
      );

    return () =>
      window.clearTimeout(
        timer
      );

  }, [
    map,
    mode,
  ]);

  return null;
}


// --------------------------------------------------
// INFRASTRUCTURE ICON
// --------------------------------------------------

function NodeIcon({
  type,
}) {
  if (
    type === "drainage" ||
    type === "water"
  ) {
    return (
      <Droplets
        size={15}
      />
    );
  }


  if (type === "road") {
    return (
      <Route
        size={15}
      />
    );
  }


  if (type === "power") {
    return (
      <Zap
        size={15}
      />
    );
  }


  if (type === "hospital") {
    return (
      <Hospital
        size={15}
      />
    );
  }


  return (
    <Network
      size={15}
    />
  );
}


// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

export default function CityNetwork({
  activeNodes = [],
  mode = "surface",
  onNodeClick,

  citizenReports = [],
  fieldTasks = [],
  weather = null,
}) {

  // ------------------------------------------------
  // MODE FILTER
  // ------------------------------------------------

  const visibleNodes =
    useMemo(
      () => {

        if (
          mode === "surface"
        ) {
          return nodes.filter(
            (node) =>
              ![
                "drainage",
                "water",
              ].includes(
                node.type
              )
          );
        }


        if (
          mode === "xray"
        ) {
          return nodes.filter(
            (node) =>
              [
                "drainage",
                "water",
                "power",
              ].includes(
                node.type
              )
          );
        }


        return nodes;
      },
      [mode]
    );


  // ------------------------------------------------
  // SAFE MAP REPORTS
  // ------------------------------------------------

  const mapReports =
    useMemo(
      () =>
        citizenReports.filter(
          hasCoordinates
        ),
      [citizenReports]
    );


  // ------------------------------------------------
  // SAFE MAP TASKS
  // ------------------------------------------------

  const mapTasks =
    useMemo(
      () =>
        fieldTasks.filter(
          hasCoordinates
        ),
      [fieldTasks]
    );


  return (
    <div
      className={
        `city-network-map mode-${mode}`
      }
    >

      <MapContainer
        center={
          MAP_CENTER
        }
        zoom={14}
        minZoom={11}
        maxZoom={19}
        scrollWheelZoom
        className="nerva-leaflet-map"
      >

        <MapModeController
          mode={mode}
        />


        {/* -------------------------------------
            OPEN MAP CONTEXT
        ------------------------------------- */}

        <TileLayer
          attribution={
            '&copy; OpenStreetMap contributors'
          }
          url={
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />


        {/* -------------------------------------
            NEURAL DEPENDENCY NETWORK
        ------------------------------------- */}

        {mode === "neural" &&
          edges.map(
            ([
              sourceId,
              targetId,
            ]) => {

              const source =
                nodeById(
                  sourceId
                );

              const target =
                nodeById(
                  targetId
                );


              if (
                !source ||
                !target
              ) {
                return null;
              }


              const active =
                activeNodes.includes(
                  sourceId
                ) &&
                activeNodes.includes(
                  targetId
                );


              return (
                <Polyline
                  key={
                    `${sourceId}-${targetId}`
                  }
                  positions={[
                    source.position,
                    target.position,
                  ]}
                  pathOptions={{
                    weight:
                      active
                        ? 6
                        : 3,

                    opacity:
                      active
                        ? 0.95
                        : 0.55,

                    dashArray:
                      active
                        ? undefined
                        : "8 8",
                  }}
                />
              );
            }
          )}


        {/* -------------------------------------
            NERVA INFRASTRUCTURE
        ------------------------------------- */}

        {visibleNodes.map(
          (node) => {

            const active =
              activeNodes.includes(
                node.id
              );


            return (
              <CircleMarker
                key={
                  `asset-${node.id}`
                }
                center={
                  node.position
                }
                radius={
                  active
                    ? 13
                    : 9
                }
                pathOptions={{
                  weight:
                    active
                      ? 5
                      : 3,

                  fillOpacity:
                    active
                      ? 1
                      : 0.85,
                }}
                eventHandlers={{
                  click: () =>
                    onNodeClick?.(
                      node.id
                    ),
                }}
              >

                <Popup>

                  <div className="nerva-map-popup">

                    <div className="nerva-popup-title">

                      <NodeIcon
                        type={
                          node.type
                        }
                      />

                      <strong>
                        {node.id}
                      </strong>

                    </div>


                    <h3>
                      {node.label}
                    </h3>


                    <p>
                      Infrastructure type:
                      {" "}
                      {node.type}
                    </p>


                    <span>
                      NERVA modelled
                      infrastructure
                    </span>


                    <button
                      type="button"
                      onClick={() =>
                        onNodeClick?.(
                          node.id
                        )
                      }
                    >
                      Inspect Asset
                    </button>

                  </div>

                </Popup>

              </CircleMarker>
            );
          }
        )}


        {/* -------------------------------------
            CITIZEN REPORT SIGNALS
        ------------------------------------- */}

        {mapReports.map(
          (report) => {

            const verified =
              Boolean(
                report.verified
              );


            return (
              <CircleMarker
                key={
                  `citizen-${report.id}`
                }
                center={
                  coordinatesOf(
                    report
                  )
                }
                radius={
                  verified
                    ? 10
                    : 8
                }
                pathOptions={{
                  weight: 3,

                  fillOpacity:
                    verified
                      ? 0.9
                      : 0.65,

                  dashArray:
                    verified
                      ? undefined
                      : "4 4",
                }}
              >

                <Popup>

                  <div className="nerva-map-popup citizen-popup">

                    <div className="nerva-popup-title">

                      <Users
                        size={15}
                      />

                      <strong>
                        Citizen Signal
                      </strong>

                    </div>


                    <h3>
                      {
                        report.category ||
                        "Reported Issue"
                      }
                    </h3>


                    <p>
                      {
                        report.location_name ||
                        "Location reported by citizen"
                      }
                    </p>


                    {report.description && (
                      <p>
                        {
                          report.description
                        }
                      </p>
                    )}


                    <span>
                      {
                        verified
                          ? "Verified by City Command"
                          : "Unverified citizen information"
                      }
                    </span>


                    {!verified && (
                      <small>
                        This signal should
                        not be treated as a
                        confirmed incident
                        until reviewed.
                      </small>
                    )}

                  </div>

                </Popup>

              </CircleMarker>
            );
          }
        )}


        {/* -------------------------------------
            FIELD TASK LOCATIONS
        ------------------------------------- */}

        {mapTasks.map(
          (task) => (

            <CircleMarker
              key={
                `task-${task.id}`
              }
              center={
                coordinatesOf(
                  task
                )
              }
              radius={9}
              pathOptions={{
                weight: 3,
                fillOpacity: 0.85,
              }}
            >

              <Popup>

                <div className="nerva-map-popup task-popup">

                  <div className="nerva-popup-title">

                    <ClipboardList
                      size={15}
                    />

                    <strong>
                      {task.id}
                    </strong>

                  </div>


                  <h3>
                    {task.title}
                  </h3>


                  <p>
                    {
                      task.department ||
                      "Response Team"
                    }

                    {" • "}

                    {
                      task.team ||
                      "Unassigned"
                    }
                  </p>


                  {task.location_name && (
                    <p>
                      <MapPin
                        size={13}
                      />

                      {
                        task.location_name
                      }
                    </p>
                  )}


                  <span>
                    Status:
                    {" "}
                    {task.status}
                  </span>


                  <strong>
                    Progress:
                    {" "}
                    {
                      task.progress ?? 0
                    }
                    %
                  </strong>

                </div>

              </Popup>

            </CircleMarker>
          )
        )}

      </MapContainer>


      {/* ---------------------------------------
          CURRENT VIEW MODE
      --------------------------------------- */}

      <div className="nerva-map-mode">

        {mode === "surface" && (
          <>
            <Building2
              size={15}
            />

            Surface Infrastructure
          </>
        )}


        {mode === "xray" && (
          <>
            <Activity
              size={15}
            />

            Underground Utilities
          </>
        )}


        {mode === "neural" && (
          <>
            <Network
              size={15}
            />

            Dependency Network
          </>
        )}

      </div>


      {/* ---------------------------------------
          WEATHER CARD
      --------------------------------------- */}

      {weather && (
        <div className="nerva-weather-card">

          <div className="weather-card-heading">

            <CloudRain
              size={18}
            />

            <div>
              <span>
                WEATHER DATA
              </span>

              <strong>
                External Forecast
              </strong>
            </div>

          </div>


          <div className="weather-values">

            <div>
              <strong>
                {
                  weather.temperature ??
                  "--"
                }
                °C
              </strong>

              <span>
                Temperature
              </span>
            </div>


            <div>
              <strong>
                {
                  weather.precipitation ??
                  0
                }
                {" mm"}
              </strong>

              <span>
                Precipitation
              </span>
            </div>


            <div>
              <strong>
                {
                  weather.maximumRainProbability ??
                  "--"
                }
                %
              </strong>

              <span>
                Rain probability
              </span>
            </div>

          </div>


          <div className="weather-wind">

            <Wind
              size={14}
            />

            <span>
              Wind
              {" "}
              {
                weather.windSpeed ??
                "--"
              }
              {" km/h"}
            </span>

          </div>


          <small>
            Source:
            {" "}
            {
              weather.source ||
              "External weather service"
            }
          </small>

        </div>
      )}


      {/* ---------------------------------------
          DATA LEGEND
      --------------------------------------- */}

      <div className="nerva-data-legend">

        <span>
          DATA LAYERS
        </span>


        <div>
          <i className="legend-open-map" />

          Open map context
        </div>


        <div>
          <i className="legend-modelled" />

          NERVA modelled
          infrastructure
        </div>


        {mapReports.length > 0 && (
          <div>
            <i className="legend-citizen" />

            Citizen signals
          </div>
        )}


        {mapTasks.length > 0 && (
          <div>
            <i className="legend-task" />

            Field operations
          </div>
        )}


        {weather && (
          <div>
            <i className="legend-weather" />

            External weather
          </div>
        )}


        {activeNodes.length > 0 && (
          <div>
            <i className="legend-impact" />

            Modelled impact
          </div>
        )}

      </div>


      {/* ---------------------------------------
          PROTOTYPE LABEL
      --------------------------------------- */}

      <div className="prototype-label">
        MODELLED DIGITAL TWIN
      </div>

    </div>
  );
}