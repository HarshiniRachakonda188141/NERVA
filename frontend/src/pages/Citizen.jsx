import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  ArrowLeft,
  Bell,
  Bus,
  CheckCircle2,
  ChevronRight,
  CloudRain,
  Droplets,
  FileWarning,
  ImagePlus,
  MapPin,
  Navigation,
  Radio,
  Search,
  ShieldCheck,
  TrafficCone,
  Trash2,
  Upload,
  Waves,
  Zap,
} from "lucide-react";

/* =========================================================
   LOCATION SUGGESTIONS
========================================================= */

const locationSuggestions = [
  "Secunderabad, Telangana",
  "Secunderabad Railway Station, Telangana",
  "Secunderabad East Metro Station, Telangana",
  "Paradise, Secunderabad, Telangana",
  "Patny, Secunderabad, Telangana",
  "Tarnaka, Secunderabad, Telangana",
  "Maredpally, Secunderabad, Telangana",
  "Sainikpuri, Secunderabad, Telangana",
  "Begumpet, Hyderabad, Telangana",
  "Ameerpet, Hyderabad, Telangana",
  "Punjagutta, Hyderabad, Telangana",
  "Somajiguda, Hyderabad, Telangana",
  "Khairatabad, Hyderabad, Telangana",
  "Lakdikapul, Hyderabad, Telangana",
  "Nampally, Hyderabad, Telangana",
  "Abids, Hyderabad, Telangana",
  "Himayatnagar, Hyderabad, Telangana",
  "Narayanaguda, Hyderabad, Telangana",
  "Koti, Hyderabad, Telangana",
  "Charminar, Hyderabad, Telangana",
  "Mehdipatnam, Hyderabad, Telangana",
  "Tolichowki, Hyderabad, Telangana",
  "Banjara Hills, Hyderabad, Telangana",
  "Jubilee Hills, Hyderabad, Telangana",
  "Madhapur, Hyderabad, Telangana",
  "HITEC City, Hyderabad, Telangana",
  "Gachibowli, Hyderabad, Telangana",
  "Financial District, Hyderabad, Telangana",
  "Kondapur, Hyderabad, Telangana",
  "Kukatpally, Hyderabad, Telangana",
  "KPHB Colony, Hyderabad, Telangana",
  "Miyapur, Hyderabad, Telangana",
  "Bachupally, Hyderabad, Telangana",
  "Uppal, Hyderabad, Telangana",
  "Habsiguda, Hyderabad, Telangana",
  "Nagole, Hyderabad, Telangana",
  "LB Nagar, Hyderabad, Telangana",
  "Dilsukhnagar, Hyderabad, Telangana",
  "Malakpet, Hyderabad, Telangana",
  "Attapur, Hyderabad, Telangana",
  "Shamshabad, Hyderabad, Telangana",
  "Rajiv Gandhi International Airport, Hyderabad, Telangana",
  "Tank Bund, Hyderabad, Telangana",
  "Hussain Sagar, Hyderabad, Telangana",
  "Necklace Road, Hyderabad, Telangana",
  "JNTU Hyderabad, Kukatpally, Telangana",
];

/* =========================================================
   ISSUE CATEGORIES
========================================================= */

const categories = [
  {
    id: "waterlogging",
    title: "Waterlogging",
    description: "Flooded roads or standing water",
    icon: Waves,
  },
  {
    id: "drainage",
    title: "Drainage",
    description: "Blocked or overflowing drainage",
    icon: Droplets,
  },
  {
    id: "traffic",
    title: "Traffic",
    description: "Congestion or blocked roads",
    icon: TrafficCone,
  },
  {
    id: "power",
    title: "Power",
    description: "Power failure or electrical risk",
    icon: Zap,
  },
  {
    id: "transport",
    title: "Transport",
    description: "Public transport disruption",
    icon: Bus,
  },
  {
    id: "other",
    title: "Other",
    description: "Another local infrastructure issue",
    icon: FileWarning,
  },
];

/* =========================================================
   CITY ALERTS
========================================================= */

const cityAlerts = [
  {
    id: 1,
    title: "Heavy rainfall watch",
    area: "Central Hyderabad",
    level: "Advisory",
    icon: CloudRain,
  },
  {
    id: 2,
    title: "Waterlogging risk elevated",
    area: "Selected low-lying corridors",
    level: "Monitor",
    icon: Waves,
  },
  {
    id: 3,
    title: "Traffic response active",
    area: "Zone A mobility corridor",
    level: "Active",
    icon: TrafficCone,
  },
];

export default function Citizen() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [showLocationSuggestions, setShowLocationSuggestions] =
    useState(false);

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoError, setPhotoError] = useState("");

  const [submittedReport, setSubmittedReport] = useState(null);

  /* =======================================================
     SELECTED CATEGORY
  ======================================================= */

  const selectedCategory = useMemo(() => {
    return categories.find((item) => item.id === category);
  }, [category]);

  /* =======================================================
     LOCATION AUTOCOMPLETE
  ======================================================= */

  const filteredLocations = useMemo(() => {
    const query = location.trim().toLowerCase();

    if (query.length < 2) {
      return [];
    }

    const startsWithMatches = locationSuggestions.filter((place) =>
      place.toLowerCase().startsWith(query)
    );

    const containsMatches = locationSuggestions.filter((place) => {
      const lowerPlace = place.toLowerCase();

      return (
        !lowerPlace.startsWith(query) &&
        lowerPlace.includes(query)
      );
    });

    return [...startsWithMatches, ...containsMatches].slice(0, 6);
  }, [location]);

  /* =======================================================
     PHOTO URL CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  /* =======================================================
     LOCATION FUNCTIONS
  ======================================================= */

  function usePrototypeLocation() {
    setLocation("Central Hyderabad, Telangana");
    setShowLocationSuggestions(false);
  }

  function selectLocation(place) {
    setLocation(place);
    setShowLocationSuggestions(false);
  }

  /* =======================================================
     PHOTO FUNCTIONS
  ======================================================= */

  function handlePhotoUpload(event) {
    const file = event.target.files
      ? event.target.files[0]
      : null;

    event.target.value = "";

    if (!file) {
      return;
    }

    setPhotoError("");

    const acceptedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!acceptedTypes.includes(file.type)) {
      setPhotoError(
        "Please select a JPG, PNG or WEBP image."
      );
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setPhotoError(
        "Photo must be smaller than 5 MB."
      );
      return;
    }

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setPhoto(file);
    setPhotoPreview(previewUrl);
  }

  function removePhoto() {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhoto(null);
    setPhotoPreview("");
    setPhotoError("");
  }

  /* =======================================================
     SUBMIT REPORT
  ======================================================= */

  function submitReport(event) {
    event.preventDefault();

    if (
      !category ||
      !location.trim() ||
      !description.trim()
    ) {
      return;
    }

    const randomNumber = Math.floor(
      1000 + Math.random() * 9000
    );

    const reportId = "NRV-C-" + randomNumber;

    setSubmittedReport({
      id: reportId,
      category: selectedCategory
        ? selectedCategory.title
        : "Citizen Report",
      location: location,
      description: description,
      photoName: photo ? photo.name : null,
      hasPhoto: Boolean(photo),
      status: "Received",
    });

    setShowLocationSuggestions(false);
  }

  /* =======================================================
     RESET REPORT
  ======================================================= */

  function resetReport() {
    setCategory("");
    setLocation("");
    setDescription("");
    setSubmittedReport(null);
    setShowLocationSuggestions(false);
    removePhoto();
  }

  return (
    <main className="citizen-page">
      {/* HEADER */}

      <header className="citizen-header">
        <div className="citizen-brand">
          <button
            type="button"
            className="citizen-back"
            onClick={() => navigate("/")}
            aria-label="Back to NERVA"
          >
            <ArrowLeft size={19} />
          </button>

          <div className="citizen-logo">
            <Radio size={23} />
          </div>

          <div>
            <strong>NERVA</strong>
            <span>Citizen Access</span>
          </div>
        </div>

        <div className="citizen-network">
          <span />
          CITY NETWORK ONLINE
        </div>
      </header>

      <div className="citizen-container">
        {/* HERO */}

        <motion.section
          className="citizen-hero"
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          <div>
            <span className="citizen-eyebrow">
              CITIZEN SIGNAL NETWORK
            </span>

            <h1>
              Your city.
              <span> Your signal.</span>
            </h1>

            <p>
              Report local infrastructure issues, view important
              city alerts and track how your signal enters the
              NERVA response network.
            </p>
          </div>

          <div className="citizen-safety-card">
            <ShieldCheck size={28} />

            <div>
              <span>PUBLIC ACCESS</span>

              <strong>
                No government verification required
              </strong>

              <p>
                Citizen reports provide an additional signal for
                operational awareness.
              </p>
            </div>
          </div>
        </motion.section>

        {/* STATS */}

        <section className="citizen-stats">
          <div>
            <Radio size={20} />
            <strong>18</strong>
            <span>Signals Today</span>
          </div>

          <div>
            <CheckCircle2 size={20} />
            <strong>12</strong>
            <span>Resolved</span>
          </div>

          <div>
            <Bell size={20} />
            <strong>03</strong>
            <span>City Alerts</span>
          </div>

          <div>
            <MapPin size={20} />
            <strong>Zone A</strong>
            <span>Prototype Area</span>
          </div>
        </section>

        {/* MAIN GRID */}

        <section className="citizen-grid">
          {/* REPORT PANEL */}

          <article className="citizen-panel citizen-report-panel">
            <div className="citizen-panel-heading">
              <div>
                <span>SEND A CITY SIGNAL</span>
                <h2>Report an Issue</h2>
              </div>

              <FileWarning size={22} />
            </div>

            <AnimatePresence mode="wait">
              {!submittedReport ? (
                <motion.form
                  key="report-form"
                  className="citizen-form"
                  onSubmit={submitReport}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* CATEGORY */}

                  <div className="citizen-field">
                    <label>Issue category</label>

                    <div className="citizen-categories">
                      {categories.map((item) => {
                        const Icon = item.icon;

                        return (
                          <button
                            type="button"
                            key={item.id}
                            className={
                              category === item.id
                                ? "citizen-category active"
                                : "citizen-category"
                            }
                            onClick={() =>
                              setCategory(item.id)
                            }
                          >
                            <Icon size={19} />

                            <div>
                              <strong>{item.title}</strong>
                              <span>
                                {item.description}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* LOCATION */}

                  <div className="citizen-field">
                    <label>Location</label>

                    <div className="citizen-location-search">
                      <div className="citizen-location-input">
                        <MapPin size={18} />

                        <input
                          type="text"
                          value={location}
                          onChange={(event) => {
                            setLocation(event.target.value);
                            setShowLocationSuggestions(true);
                          }}
                          onFocus={() => {
                            setShowLocationSuggestions(true);
                          }}
                          onBlur={() => {
                            window.setTimeout(() => {
                              setShowLocationSuggestions(false);
                            }, 150);
                          }}
                          placeholder="Search area, road or landmark"
                          autoComplete="off"
                          required
                        />

                        <button
                          type="button"
                          onClick={usePrototypeLocation}
                        >
                          <Navigation size={15} />
                          Use location
                        </button>
                      </div>

                      <AnimatePresence>
                        {showLocationSuggestions &&
                          filteredLocations.length > 0 && (
                            <motion.div
                              className="citizen-location-suggestions"
                              initial={{
                                opacity: 0,
                                y: -6,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              exit={{
                                opacity: 0,
                                y: -6,
                              }}
                              transition={{
                                duration: 0.16,
                              }}
                            >
                              {filteredLocations.map((place) => {
                                const parts =
                                  place.split(",");

                                const primary =
                                  parts[0].trim();

                                const secondary =
                                  parts
                                    .slice(1)
                                    .join(",")
                                    .trim();

                                return (
                                  <button
                                    type="button"
                                    key={place}
                                    onMouseDown={(event) => {
                                      event.preventDefault();
                                    }}
                                    onClick={() => {
                                      selectLocation(place);
                                    }}
                                  >
                                    <div className="location-suggestion-icon">
                                      <MapPin size={16} />
                                    </div>

                                    <div>
                                      <strong>
                                        {primary}
                                      </strong>

                                      <span>
                                        {secondary}
                                      </span>
                                    </div>

                                    <ChevronRight
                                      size={15}
                                    />
                                  </button>
                                );
                              })}
                            </motion.div>
                          )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* DESCRIPTION */}

                  <div className="citizen-field">
                    <label>
                      What is happening?
                    </label>

                    <textarea
                      value={description}
                      onChange={(event) => {
                        setDescription(
                          event.target.value
                        );
                      }}
                      placeholder="Describe the issue clearly..."
                      rows={5}
                      required
                    />
                  </div>

                  {/* PHOTO */}

                  <div className="citizen-field">
                    <label>
                      Supporting photo
                      <span className="citizen-optional">
                        {" "}
                        · Optional
                      </span>
                    </label>

                    {!photoPreview ? (
                      <label className="citizen-upload citizen-upload-clickable">
                        <Upload size={21} />

                        <div>
                          <strong>
                            Add supporting photo
                          </strong>

                          <span>
                            JPG, PNG or WEBP · Maximum 5 MB
                          </span>
                        </div>

                        <div className="citizen-upload-button">
                          <ImagePlus size={15} />
                          Add Photo
                        </div>

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handlePhotoUpload}
                          hidden
                        />
                      </label>
                    ) : (
                      <motion.div
                        className="citizen-photo-preview"
                        initial={{
                          opacity: 0,
                          y: 8,
                          scale: 0.98,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                      >
                        <div className="citizen-photo-image">
                          <img
                            src={photoPreview}
                            alt="Citizen report evidence"
                          />
                        </div>

                        <div className="citizen-photo-info">
                          <div>
                            <span>
                              EVIDENCE ATTACHED
                            </span>

                            <strong>
                              {photo
                                ? photo.name
                                : ""}
                            </strong>

                            <small>
                              {photo
                                ? (
                                    photo.size /
                                    1024 /
                                    1024
                                  ).toFixed(2) +
                                  " MB"
                                : ""}
                            </small>
                          </div>

                          <button
                            type="button"
                            onClick={removePhoto}
                            aria-label="Remove uploaded photo"
                          >
                            <Trash2 size={15} />
                            Remove
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {photoError && (
                      <motion.p
                        className="citizen-photo-error"
                        initial={{
                          opacity: 0,
                          y: -4,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                      >
                        {photoError}
                      </motion.p>
                    )}
                  </div>

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    className="citizen-submit"
                    disabled={
                      !category ||
                      !location.trim() ||
                      !description.trim()
                    }
                  >
                    <Radio size={18} />

                    Send Signal to NERVA

                    <ChevronRight size={18} />
                  </button>
                </motion.form>
              ) : (
                /* SUCCESS */

                <motion.div
                  key="success"
                  className="citizen-success"
                  initial={{
                    opacity: 0,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                >
                  <div className="citizen-success-icon">
                    <CheckCircle2 size={36} />
                  </div>

                  <span>SIGNAL RECEIVED</span>

                  <h2>Report submitted.</h2>

                  <p>
                    Your report has entered the NERVA citizen
                    signal network.
                  </p>

                  <div className="citizen-report-id">
                    <span>REPORT ID</span>

                    <strong>
                      {submittedReport.id}
                    </strong>
                  </div>

                  <div className="citizen-submission-summary">
                    <div>
                      <span>CATEGORY</span>

                      <strong>
                        {submittedReport.category}
                      </strong>
                    </div>

                    <div>
                      <span>LOCATION</span>

                      <strong>
                        {submittedReport.location}
                      </strong>
                    </div>

                    <div>
                      <span>EVIDENCE</span>

                      <strong>
                        {submittedReport.hasPhoto
                          ? "Photo attached"
                          : "No photo"}
                      </strong>
                    </div>
                  </div>

                  <div className="citizen-tracking">
                    <div className="active">
                      <span />
                      <strong>Received</strong>
                      <small>
                        Signal registered
                      </small>
                    </div>

                    <div>
                      <span />
                      <strong>
                        Verification
                      </strong>
                      <small>
                        Awaiting review
                      </small>
                    </div>

                    <div>
                      <span />
                      <strong>Response</strong>
                      <small>Pending</small>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="citizen-new-report"
                    onClick={resetReport}
                  >
                    Report Another Issue
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </article>

          {/* CITY ALERTS */}

          <aside className="citizen-panel citizen-alert-panel">
            <div className="citizen-panel-heading">
              <div>
                <span>PUBLIC AWARENESS</span>
                <h2>City Alerts</h2>
              </div>

              <Bell size={21} />
            </div>

            <div className="citizen-search">
              <Search size={16} />
              <span>Hyderabad · Zone A</span>
            </div>

            <div className="citizen-alert-list">
              {cityAlerts.map((alert) => {
                const Icon = alert.icon;

                return (
                  <motion.div
                    key={alert.id}
                    className="citizen-alert"
                    whileHover={{ x: 4 }}
                  >
                    <div className="citizen-alert-icon">
                      <Icon size={19} />
                    </div>

                    <div>
                      <span>{alert.level}</span>

                      <strong>
                        {alert.title}
                      </strong>

                      <small>
                        <MapPin size={11} />
                        {alert.area}
                      </small>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="citizen-awareness">
              <ShieldCheck size={21} />

              <div>
                <strong>Stay aware</strong>

                <p>
                  Follow official emergency instructions when a
                  serious public-safety alert is issued.
                </p>
              </div>
            </div>
          </aside>
        </section>

        <p className="citizen-disclaimer">
          NERVA is currently a prototype. Alerts, reports and
          response information shown here are simulated
          demonstration data.
        </p>
      </div>
    </main>
  );
}