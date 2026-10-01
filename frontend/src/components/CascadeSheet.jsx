import {
  useState
} from "react";

import {
  motion
} from "framer-motion";

import {
  ShieldCheck,
  LoaderCircle,
  CheckCircle2
} from "lucide-react";

import {
  runIntervention
} from "../services/api";


export default function CascadeSheet({
  result,
  tab,
  setTab
}) {
  const [
    intervention,
    setIntervention
  ] = useState(null);

  const [
    preventing,
    setPreventing
  ] = useState(false);

  if (!result) {
    return null;
  }


  async function preventCascade() {
    try {
      setPreventing(true);

      const data =
        await runIntervention(
          "RAIN_01",
          "CLEAR_DRAIN"
        );

      setIntervention(
        data.result
      );
    } catch (error) {
      console.error(error);
    } finally {
      setPreventing(false);
    }
  }


  return (
    <motion.section
      className="cascade-sheet"
      initial={{
        y: 120,
        opacity: 0
      }}
      animate={{
        y: 0,
        opacity: 1
      }}
    >
      <div className="sheet-handle" />

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
            `risk-pill ${
              result.risk.level
                .toLowerCase()
            }`
          }
        >
          {result.risk.score}
          {" · "}
          {result.risk.level}
        </div>
      </div>


      <div className="analysis-tabs">
        {[
          "next",
          "why",
          "act"
        ].map((item) => (
          <button
            key={item}
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


      {tab === "next" && (
        <>
          <div className="cascade-list">
            {result.cascade.map(
              (item, index) => (
                <motion.div
                  className="cascade-item"
                  key={item.asset_id}
                  initial={{
                    opacity: 0,
                    x: -15
                  }}
                  animate={{
                    opacity: 1,
                    x: 0
                  }}
                  transition={{
                    delay:
                      index * 0.12
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
                      {item.asset_id}
                    </strong>

                    <span>
                      {item.name}
                    </span>
                  </div>

                  <span
                    className={
                      `state-tag ${
                        item.state
                      }`
                    }
                  >
                    {item.state
                      .replaceAll(
                        "_",
                        " "
                      )}
                  </span>
                </motion.div>
              )
            )}
          </div>

          {!intervention && (
            <button
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

          {intervention && (
            <motion.div
              className="prevention-result"
              initial={{
                opacity: 0,
                scale: 0.96
              }}
              animate={{
                opacity: 1,
                scale: 1
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
                        .before
                        .affected_assets
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
                        .after
                        .affected_assets
                    }
                  </strong>

                  <small>
                    affected assets
                  </small>
                </div>
              </div>

              <p>
                Modelled early action
                prevents{" "}
                <strong>
                  {
                    intervention
                      .impact_reduction
                  }
                </strong>{" "}
                downstream impacts in
                this prototype scenario.
              </p>
            </motion.div>
          )}
        </>
      )}


      {tab === "why" && (
        <div className="why-panel">
          <p>
            {
              result.explanation
                .summary
            }
          </p>

          <div className="evidence-chain">
            {result.explanation.path.map(
              (edge) => (
                <div
                  className="evidence-row"
                  key={
                    `${edge.source}-${edge.target}`
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


      {tab === "act" && (
        <div className="action-list">
          {result.coordination.map(
            (item) => (
              <div
                className="action-item"
                key={
                  item.department
                }
              >
                <span className="step-index">
                  {String(
                    item.priority
                  ).padStart(
                    2,
                    "0"
                  )}
                </span>

                <div>
                  <strong>
                    {item.department}
                  </strong>

                  <p>
                    {item.action}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      )}


      <p className="model-disclaimer">
        {result.disclaimer}
      </p>
    </motion.section>
  );
}