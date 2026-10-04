import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  LayersControl,
  LayerGroup,
  useMap,
} from "react-leaflet";

import {
  ArrowLeft,
  Search,
  MapPin,
  Droplets,
  Zap,
  Hospital,
  Bus,
  CloudRain,
  Radio,
  Navigation,
  ChevronRight,
  X,
} from "lucide-react";

import "leaflet/dist/leaflet.css";

/* =========================================================
   INFRASTRUCTURE DATA
========================================================= */

const infrastructure = [
  {
    id: 1,
    name: "Hussain Sagar Drainage Zone",
    type: "drainage",
    status: "Watch",
    health: 72,
    position: [17.4239, 78.4738],
    description:
      "Storm-water drainage monitoring zone.",
  },
  {
    id: 2,
    name: "Khairatabad Mobility Corridor",
    type: "mobility",
    status: "Stable",
    health: 91,
    position: [17.4126, 78.4621],
    description:
      "Traffic and public transport dependency corridor.",
  },
  {
    id: 3,
    name: "Central Power Network",
    type: "power",
    status: "Stable",
    health: 96,
    position: [17.4065, 78.4772],
    description:
      "Modelled electricity distribution infrastructure.",
  },
  {
    id: 4,
    name: "Critical Medical Services",
    type: "critical",
    status: "Stable",
    health: 94,
    position: [17.3948, 78.4746],
    description:
      "Critical healthcare and emergency response services.",
  },
  {
    id: 5,
    name: "Secunderabad Transit Node",
    type: "mobility",
    status: "Stable",
    health: 89,
    position: [17.4399, 78.4983],
    description:
      "High-connectivity urban transit node.",
  },
  {
    id: 6,
    name: "Musi Flood Monitoring",
    type: "rainfall",
    status: "Elevated",
    health: 68,
    position: [17.385, 78.4867],
    description:
      "Rainfall and flood-risk monitoring zone.",
  },
];

/* =========================================================
   HYDERABAD LOCATION SEARCH DATA
========================================================= */

const cityLocations = [
  {
    id: "secunderabad",
    name: "Secunderabad",
    area: "Hyderabad, Telangana",
    position: [17.4399, 78.4983],
    zoom: 15,
  },
  {
    id: "secunderabad-station",
    name: "Secunderabad Railway Station",
    area: "Secunderabad, Telangana",
    position: [17.4338, 78.5018],
    zoom: 17,
  },
  {
    id: "paradise",
    name: "Paradise",
    area: "Secunderabad, Telangana",
    position: [17.4435, 78.4875],
    zoom: 16,
  },
  {
    id: "patny",
    name: "Patny",
    area: "Secunderabad, Telangana",
    position: [17.4424, 78.4967],
    zoom: 16,
  },
  {
    id: "tarnaka",
    name: "Tarnaka",
    area: "Secunderabad, Telangana",
    position: [17.4283, 78.5386],
    zoom: 16,
  },
  {
    id: "khairatabad",
    name: "Khairatabad",
    area: "Hyderabad, Telangana",
    position: [17.4126, 78.4621],
    zoom: 16,
  },
  {
    id: "banjara-hills",
    name: "Banjara Hills",
    area: "Hyderabad, Telangana",
    position: [17.4156, 78.4347],
    zoom: 15,
  },
  {
    id: "jubilee-hills",
    name: "Jubilee Hills",
    area: "Hyderabad, Telangana",
    position: [17.4326, 78.4071],
    zoom: 15,
  },
  {
    id: "ameerpet",
    name: "Ameerpet",
    area: "Hyderabad, Telangana",
    position: [17.4375, 78.4483],
    zoom: 16,
  },
  {
    id: "begumpet",
    name: "Begumpet",
    area: "Hyderabad, Telangana",
    position: [17.4448, 78.4668],
    zoom: 16,
  },
  {
    id: "hitech-city",
    name: "HITEC City",
    area: "Hyderabad, Telangana",
    position: [17.4435, 78.3772],
    zoom: 15,
  },
  {
    id: "madhapur",
    name: "Madhapur",
    area: "Hyderabad, Telangana",
    position: [17.4483, 78.3915],
    zoom: 15,
  },
  {
    id: "gachibowli",
    name: "Gachibowli",
    area: "Hyderabad, Telangana",
    position: [17.4401, 78.3489],
    zoom: 15,
  },
  {
    id: "kukatpally",
    name: "Kukatpally",
    area: "Hyderabad, Telangana",
    position: [17.4948, 78.3996],
    zoom: 15,
  },
  {
    id: "uppal",
    name: "Uppal",
    area: "Hyderabad, Telangana",
    position: [17.4058, 78.5591],
    zoom: 15,
  },
  {
    id: "dilsukhnagar",
    name: "Dilsukhnagar",
    area: "Hyderabad, Telangana",
    position: [17.3688, 78.5247],
    zoom: 16,
  },
  {
    id: "charminar",
    name: "Charminar",
    area: "Old City, Hyderabad",
    position: [17.3616, 78.4747],
    zoom: 17,
  },
  {
    id: "abids",
    name: "Abids",
    area: "Hyderabad, Telangana",
    position: [17.393, 78.4763],
    zoom: 16,
  },
  {
    id: "nampally",
    name: "Nampally",
    area: "Hyderabad, Telangana",
    position: [17.392, 78.4677],
    zoom: 16,
  },
  {
    id: "lakdikapul",
    name: "Lakdikapul",
    area: "Hyderabad, Telangana",
    position: [17.4039, 78.4622],
    zoom: 16,
  },
  {
    id: "himayatnagar",
    name: "Himayatnagar",
    area: "Hyderabad, Telangana",
    position: [17.4031, 78.484],
    zoom: 16,
  },
  {
    id: "mehdipatnam",
    name: "Mehdipatnam",
    area: "Hyderabad, Telangana",
    position: [17.3952, 78.4401],
    zoom: 16,
  },
  {
    id: "miyapur",
    name: "Miyapur",
    area: "Hyderabad, Telangana",
    position: [17.4969, 78.3614],
    zoom: 15,
  },
  {
    id: "lb-nagar",
    name: "LB Nagar",
    area: "Hyderabad, Telangana",
    position: [17.3457, 78.5522],
    zoom: 15,
  },
];

/* =========================================================
   LAYER CONFIG
========================================================= */

const layerConfig = {
  drainage: {
    label: "Drainage",
    icon: Droplets,
  },
  mobility: {
    label: "Mobility",
    icon: Bus,
  },
  power: {
    label: "Power",
    icon: Zap,
  },
  critical: {
    label: "Critical Services",
    icon: Hospital,
  },
  rainfall: {
    label: "Rainfall",
    icon: CloudRain,
  },
};

/* =========================================================
   MAP CAMERA CONTROLLER
========================================================= */

function MapController({ selectedLocation }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedLocation) {
      return;
    }

    map.flyTo(
      selectedLocation.position,
      selectedLocation.zoom || 16,
      {
        duration: 1.2,
      }
    );
  }, [map, selectedLocation]);

  return null;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function CityMap() {
  const navigate = useNavigate();

  const searchRef = useRef(null);

  const [search, setSearch] = useState("");

  const [selectedNode, setSelectedNode] =
    useState(null);

  const [selectedLocation, setSelectedLocation] =
    useState(null);

  const [searchFocused, setSearchFocused] =
    useState(false);

  /* =======================================================
     LOCATION SEARCH
  ======================================================= */

  const locationSuggestions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return cityLocations
      .filter((location) => {
        return (
          location.name
            .toLowerCase()
            .includes(query) ||
          location.area
            .toLowerCase()
            .includes(query)
        );
      })
      .slice(0, 6);
  }, [search]);

  function selectLocation(location) {
    setSelectedLocation(location);

    setSearch(location.name);

    setSearchFocused(false);

    setSelectedNode(null);
  }

  function clearSearch() {
    setSearch("");

    setSelectedLocation(null);

    setSearchFocused(false);
  }

  /* =======================================================
     INFRASTRUCTURE NODE
  ======================================================= */

  function selectInfrastructure(item) {
    setSelectedNode(item);

    setSelectedLocation({
      id: `node-${item.id}`,
      name: item.name,
      area: "NERVA Infrastructure",
      position: item.position,
      zoom: 16,
    });
  }

  return (
    <main className="digital-twin-page">
      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="digital-twin-header">
        <div className="digital-twin-brand">
          <button
            className="map-back-button"
            onClick={() =>
              navigate("/command")
            }
            type="button"
          >
            <ArrowLeft size={19} />
          </button>

          <div className="digital-twin-logo">
            N
          </div>

          <div>
            <strong>
              NERVA
            </strong>

            <span>
              City Digital Twin
            </span>
          </div>
        </div>

        <div className="digital-live">
          <span />

          LIVE INFRASTRUCTURE MODEL
        </div>
      </header>

      {/* ===================================================
          MAIN LAYOUT
      =================================================== */}

      <section className="digital-twin-layout">
        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="map-sidebar">
          <span className="eyebrow">
            DIGITAL TWIN
          </span>

          <h1>
            Hyderabad
            <br />
            Infrastructure
          </h1>

          <p className="map-description">
            Explore modelled urban systems and understand
            how infrastructure dependencies connect across
            the city.
          </p>

          {/* ===============================================
              LOCATION SEARCH
          =============================================== */}

          <div
            className="city-map-location-search"
            ref={searchRef}
          >
            <div
              className={
                searchFocused
                  ? "map-search location-active"
                  : "map-search"
              }
            >
              <Search size={18} />

              <input
                value={search}
                onChange={(event) => {
                  setSearch(
                    event.target.value
                  );

                  setSearchFocused(true);

                  setSelectedLocation(null);
                }}
                onFocus={() =>
                  setSearchFocused(true)
                }
                placeholder="Search location in Hyderabad..."
                autoComplete="off"
              />

              {search && (
                <button
                  type="button"
                  className="map-search-clear"
                  onClick={clearSearch}
                  aria-label="Clear location"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* =============================================
                AUTOCOMPLETE
            ============================================= */}

            {searchFocused &&
              search.trim() &&
              locationSuggestions.length >
                0 && (
                <div className="city-map-suggestions">
                  {locationSuggestions.map(
                    (location) => (
                      <button
                        type="button"
                        key={location.id}
                        onClick={() =>
                          selectLocation(
                            location
                          )
                        }
                      >
                        <div className="city-location-icon">
                          <MapPin size={17} />
                        </div>

                        <div className="city-location-copy">
                          <strong>
                            {location.name}
                          </strong>

                          <span>
                            {location.area}
                          </span>
                        </div>

                        <ChevronRight
                          size={17}
                        />
                      </button>
                    )
                  )}
                </div>
              )}

            {searchFocused &&
              search.trim() &&
              locationSuggestions.length ===
                0 && (
                <div className="city-map-no-results">
                  <MapPin size={16} />

                  <span>
                    No matching Hyderabad
                    location found.
                  </span>
                </div>
              )}
          </div>

          {/* ===============================================
              STATS
          =============================================== */}

          <div className="map-stat-grid">
            <div>
              <strong>
                06
              </strong>

              <span>
                Systems
              </span>
            </div>

            <div>
              <strong>
                82
              </strong>

              <span>
                Resilience
              </span>
            </div>

            <div>
              <strong>
                01
              </strong>

              <span>
                Watch
              </span>
            </div>
          </div>

          {/* ===============================================
              DATA LAYERS
          =============================================== */}

          <div className="map-layer-title">
            DATA LAYERS
          </div>

          <div className="map-layer-list">
            {Object.entries(
              layerConfig
            ).map(([key, config]) => {
              const Icon = config.icon;

              return (
                <div
                  className="map-layer-item"
                  key={key}
                >
                  <Icon size={17} />

                  <span>
                    {config.label}
                  </span>

                  <i />
                </div>
              );
            })}
          </div>

          {/* ===============================================
              SELECTED LOCATION
          =============================================== */}

          {selectedLocation &&
            !selectedNode && (
              <div className="selected-node-card">
                <span className="eyebrow">
                  SELECTED LOCATION
                </span>

                <h3>
                  {selectedLocation.name}
                </h3>

                <p>
                  {selectedLocation.area}
                </p>

                <div className="selected-node-data">
                  <span>
                    MAP MODE
                    <strong>
                      Location
                    </strong>
                  </span>

                  <span>
                    STATUS
                    <strong>
                      Active
                    </strong>
                  </span>
                </div>
              </div>
            )}

          {/* ===============================================
              SELECTED NODE
          =============================================== */}

          {selectedNode && (
            <div className="selected-node-card">
              <span className="eyebrow">
                SELECTED NODE
              </span>

              <h3>
                {selectedNode.name}
              </h3>

              <p>
                {selectedNode.description}
              </p>

              <div className="selected-node-data">
                <span>
                  STATUS

                  <strong>
                    {selectedNode.status}
                  </strong>
                </span>

                <span>
                  HEALTH

                  <strong>
                    {selectedNode.health}%
                  </strong>
                </span>
              </div>
            </div>
          )}
        </aside>

        {/* =================================================
            MAP WORKSPACE
        ================================================= */}

        <section className="map-workspace">
          <div className="map-toolbar">
            <div>
              <MapPin size={18} />

              <span>
                {selectedLocation
                  ? `${selectedLocation.name}, Hyderabad`
                  : "Hyderabad, Telangana"}
              </span>
            </div>

            <div className="map-mode">
              <Radio size={16} />

              MODELLED CITY DATA
            </div>
          </div>

          {/* ===============================================
              LEAFLET MAP
          =============================================== */}

          <div className="nerva-map nerva-map-clear">
            <MapContainer
              center={[
                17.4126,
                78.4772,
              ]}
              zoom={13}
              minZoom={11}
              maxZoom={19}
              scrollWheelZoom
              zoomControl
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <MapController
                selectedLocation={
                  selectedLocation
                }
              />

              <LayersControl position="topright">
                {/* =========================================
                    CLEAR MAP
                ========================================= */}

                <LayersControl.BaseLayer
                  checked
                  name="Clear City Map"
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                  />
                </LayersControl.BaseLayer>

                {/* =========================================
                    DETAILED MAP
                ========================================= */}

                <LayersControl.BaseLayer
                  name="Detailed City Map"
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team"
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                    maxZoom={19}
                  />
                </LayersControl.BaseLayer>

                {/* =========================================
                    INFRASTRUCTURE
                ========================================= */}

                <LayersControl.Overlay
                  checked
                  name="NERVA Infrastructure"
                >
                  <LayerGroup>
                    {infrastructure.map(
                      (item) => (
                        <CircleMarker
                          key={item.id}
                          center={
                            item.position
                          }
                          radius={10}
                          pathOptions={{
                            color:
                              item.status ===
                              "Elevated"
                                ? "#ffbd4a"
                                : item.status ===
                                  "Watch"
                                ? "#ffd85a"
                                : "#45e6df",

                            fillColor:
                              item.status ===
                              "Elevated"
                                ? "#ffbd4a"
                                : item.status ===
                                  "Watch"
                                ? "#ffd85a"
                                : "#45e6df",

                            fillOpacity: 0.82,

                            weight: 3,
                          }}
                          eventHandlers={{
                            click: () =>
                              selectInfrastructure(
                                item
                              ),
                          }}
                        >
                          <Popup>
                            <div>
                              <strong>
                                {item.name}
                              </strong>

                              <p>
                                {
                                  item.description
                                }
                              </p>

                              <b>
                                {item.status}
                                {" · "}
                                {item.health}%
                              </b>
                            </div>
                          </Popup>
                        </CircleMarker>
                      )
                    )}
                  </LayerGroup>
                </LayersControl.Overlay>

                {/* =========================================
                    SEARCHED LOCATION
                ========================================= */}

                {selectedLocation && (
                  <LayersControl.Overlay
                    checked
                    name="Selected Location"
                  >
                    <LayerGroup>
                      <CircleMarker
                        center={
                          selectedLocation.position
                        }
                        radius={14}
                        pathOptions={{
                          color: "#ffffff",
                          fillColor:
                            "#42e1df",
                          fillOpacity: 0.9,
                          weight: 4,
                        }}
                      >
                        <Popup>
                          <div>
                            <strong>
                              {
                                selectedLocation.name
                              }
                            </strong>

                            <p>
                              {
                                selectedLocation.area
                              }
                            </p>

                            <b>
                              Selected location
                            </b>
                          </div>
                        </Popup>
                      </CircleMarker>
                    </LayerGroup>
                  </LayersControl.Overlay>
                )}
              </LayersControl>
            </MapContainer>
          </div>

          {/* ===============================================
              FOOTER
          =============================================== */}

          <div className="map-footer">
            <div>
              <Navigation size={17} />

              <span>
                Search a location or select an
                infrastructure node to inspect the
                city model.
              </span>
            </div>

            <span>
              NERVA DIGITAL TWIN · PROTOTYPE
            </span>
          </div>
        </section>
      </section>
    </main>
  );
}