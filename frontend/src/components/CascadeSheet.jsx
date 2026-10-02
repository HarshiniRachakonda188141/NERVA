import {
  useEffect,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  ShieldCheck,
  LoaderCircle,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

import {
  runIntervention,
} from "../services/api";


export default function CascadeSheet({
  result,
  tab,
  setTab,
  scenarioId = "RAIN_01",
}) {
  const [
    intervention,
    setIntervention,
  ] = useState(null);

  const [
    preventing,
    setPreventing,
  ] = useState(false);

  const [
    interventionError,
    setInterventionError,
  ] = useState("");


  /*
    When a new simulation is run,
    remove the previous intervention result.
  */
  useEffect(() => {
    setIntervention(null);
    setInterventionError("");
  }, [result]);


  if (!result) {
    return null;
  }


  const cascade =
    Array.isArray(result.cascade)
      ? result.cascade
      : [];


  const coordination =
    Array.isArray(result.coordination)
      ? result.coordination
      : [];


  const explanation =
    result.explanation || {};


  const explanationPath =
    Array.isArray(explanation.path)
      ? explanation.path
      : [];


  const risk =
    result.risk || {
      score: "--",
      level: "Unknown",
    };


  async function preventCascade() {
    try {
      setPreventing(true);
      setInterventionError("");

      const data =
        await runIntervention(
          scenarioId,
          ["CLEAR_DRAIN"]
        );

      /*
        Backend response:

        {
          system: "NERVA",
          mode: "MODELLED INTERVENTION",
          selected_interventions: [...],
          comparison: {...}
        }

        Therefore we use data.comparison,
        NOT data.result.
      */
      setIntervention(
        data?.comparison || null
      );

      if (!data?.comparison) {
        setInterventionError(
          "Intervention comparison was not returned."
        );
      }

    } catch (error) {
      console.error(
        "Intervention failed:",
        error
      );

      setInterventionError(
        error.response?.data?.detail ||
        "Unable to model the intervention."
      );

    } finally {
      setPreventing(false);
    }
  }


  function resetIntervention() {
    setIntervention(null);
    setInterventionError("");
  }


  const riskLevel =
    String(
      risk.level || "unknown"
    )
      .toLowerCase()
      .replaceAll(" ", "-");


  return (
    <motion.section
      className="cascade-sheet"
      initial={{
        y: 120,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
    >
      <div className="sheet-handle" />


      {/* ======================================
          HEADING
      ====================================== */}

      <div className="sheet-heading">
        <div>
          <span className="eyebrow">
            NERVA ANALYSIS
          </span>

          <h2>
            Potential cascade detected
          </h2>
        </div>

        <div
          className={
            `risk-pill ${riskLevel}`
          }
        >
          {risk.score}
          {" · "}
          {risk.level}
        </div>
      </div>


      {/* ======================================
          ANALYSIS TABS
      ====================================== */}

      <div className="analysis-tabs">
        {[
          "next",
          "why",
          "act",
        ].map((item) => (
          <button
            key={item}
            type="button"
            className={
              tab === item
                ? "analysis-tab active"
                : "analysis-tab"
            }
            onClick={() =>
              setTab(item)
            }
          >
            {item === "next" &&
              "WHAT NEXT"}

            {item === "why" &&
              "WHY"}

            {item === "act" &&
              "WHO ACTS"}
          </button>
        ))}
      </div>


      {/* ======================================
          WHAT NEXT
      ====================================== */}

      {tab === "next" && (
        <>
          <div className="cascade-list">

            {cascade.length === 0 && (
              <div className="response-empty">
                No cascade assets were
                returned by the model.
              </div>
            )}


            {cascade.map(
              (item, index) => (
                <motion.div
                  className="cascade-item"
                  key={
                    item.asset_id ||
                    index
                  }
                  initial={{
                    opacity: 0,
                    x: -15,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.12,
                  }}
                >
                  <span className="step-index">
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <div>
                    <strong>
                      {
                        item.asset_id ||
                        "UNKNOWN"
                      }
                    </strong>

                    <span>
                      {
                        item.name ||
                        "Infrastructure asset"
                      }
                    </span>
                  </div>

                  <span
                    className={
                      `state-tag ${
                        item.state ||
                        "unknown"
                      }`
                    }
                  >
                    {String(
                      item.state ||
                      "unknown"
                    ).replaceAll(
                      "_",
                      " "
                    )}
                  </span>
                </motion.div>
              )
            )}

          </div>


          {/* INTERVENTION */}

          {!intervention && (
            <button
              type="button"
              className="prevent-button"
              onClick={
                preventCascade
              }
              disabled={
                preventing
              }
            >
              {preventing ? (
                <>
                  <LoaderCircle
                    className="spin"
                    size={17}
                  />

                  Testing intervention...
                </>
              ) : (
                <>
                  <ShieldCheck
                    size={17}
                  />

                  Prevent the Cascade
                </>
              )}
            </button>
          )}


          {interventionError && (
            <div className="response-error">
              <AlertTriangle
                size={15}
              />

              {interventionError}
            </div>
          )}


          {intervention && (
            <motion.div
              className="prevention-result"
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
            >
              <div className="prevention-title">
                <CheckCircle2
                  size={19}
                />

                <div>
                  <span className="eyebrow">
                    INTERVENTION MODEL
                  </span>

                  <h3>
                    Clear Central Drain
                  </h3>
                </div>
              </div>


              <div className="before-after">

                <div>
                  <span>
                    BEFORE
                  </span>

                  <strong>
                    {
                      intervention
                        ?.before
                        ?.affected_assets ??
                      "--"
                    }
                  </strong>

                  <small>
                    affected assets
                  </small>
                </div>


                <div className="impact-arrow">
                  →
                </div>


                <div className="protected">
                  <span>
                    AFTER
                  </span>

                  <strong>
                    {
                      intervention
                        ?.after
                        ?.affected_assets ??
                      "--"
                    }
                  </strong>

                  <small>
                    affected assets
                  </small>
                </div>

              </div>


              {intervention
                ?.impact_reduction !==
                undefined && (
                <p>
                  Modelled early action
                  reduces downstream
                  impact by{" "}

                  <strong>
                    {
                      intervention
                        .impact_reduction
                    }
                  </strong>

                  {" "}in this prototype
                  scenario.
                </p>
              )}


              <button
                type="button"
                className="prevent-button"
                onClick={
                  resetIntervention
                }
              >
                <RotateCcw
                  size={16}
                />

                Reset Intervention
              </button>

            </motion.div>
          )}
        </>
      )}


      {/* ======================================
          WHY
      ====================================== */}

      {tab === "why" && (
        <div className="why-panel">

          <p>
            {
              explanation.summary ||
              "No explanation was returned."
            }
          </p>


          <div className="evidence-chain">

            {explanationPath.length ===
              0 && (
              <div className="response-empty">
                No dependency evidence
                was returned.
              </div>
            )}


            {explanationPath.map(
              (edge, index) => (
                <div
                  className="evidence-row"
                  key={
                    `${
                      edge.source
                    }-${
                      edge.target
                    }-${index}`
                  }
                >
                  <strong>
                    {edge.source}
                  </strong>

                  <span>
                    {edge.relation}
                  </span>

                  <strong>
                    {edge.target}
                  </strong>
                </div>
              )
            )}

          </div>
        </div>
      )}


      {/* ======================================
          WHO ACTS
      ====================================== */}

      {tab === "act" && (
        <div className="action-list">

          {coordination.length ===
            0 && (
            <div className="response-empty">
              No department actions were
              returned.
            </div>
          )}


          {coordination.map(
            (item, index) => (
              <div
                className="action-item"
                key={
                  `${
                    item.department
                  }-${index}`
                }
              >
                <span className="step-index">
                  {String(
                    item.priority ??
                    index + 1
                  ).padStart(
                    2,
                    "0"
                  )}
                </span>

                <div>
                  <strong>
                    {
                      item.department ||
                      "Response Team"
                    }
                  </strong>

                  <p>
                    {
                      item.action ||
                      "Review modelled impact."
                    }
                  </p>
                </div>
              </div>
            )
          )}

        </div>
      )}


      <p className="model-disclaimer">
        {
          result.disclaimer ||
          (
            "This is modelled " +
            "decision-support data, " +
            "not a guaranteed " +
            "real-world forecast."
          )
        }
      </p>

    </motion.section>
  );
}