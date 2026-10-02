import {
  useEffect,
  useState,
} from "react";

import {
  CloudRain,
  LoaderCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import BottomNav
  from "../components/BottomNav";

import CityNetwork
  from "../components/CityNetwork";

import CascadeSheet
  from "../components/CascadeSheet";

import RainLayer
  from "../components/RainLayer";

import {
  runSimulation,
} from "../services/api";


const DEFAULT_SCENARIO =
  "RAIN_01";


export default function Nerva() {
  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    storm,
    setStorm,
  ] = useState(false);

  const [
    result,
    setResult,
  ] = useState(null);

  const [
    tab,
    setTab,
  ] = useState("next");

  const [
    activeNodes,
    setActiveNodes,
  ] = useState([]);

  const [
    error,
    setError,
  ] = useState("");

  const [
    severity,
    setSeverity,
  ] = useState(8);


  /*
    Animate cascade assets one by one
    after simulation data arrives.
  */
  useEffect(() => {
    if (!result) {
      setActiveNodes([]);
      return;
    }

    const cascade =
      Array.isArray(result.cascade)
        ? result.cascade
        : [];

    setActiveNodes([]);

    const ids =
      cascade
        .map(
          (item) =>
            item.asset_id
        )
        .filter(Boolean);

    const timers = [];


    ids.forEach(
      (id, index) => {
        const timer =
          window.setTimeout(
            () => {
              setActiveNodes(
                (previous) => {
                  if (
                    previous.includes(id)
                  ) {
                    return previous;
                  }

                  return [
                    ...previous,
                    id,
                  ];
                }
              );
            },
            index * 700
          );

        timers.push(timer);
      }
    );


    return () => {
      timers.forEach(
        (timer) =>
          window.clearTimeout(
            timer
          )
      );
    };
  }, [result]);


  async function handleSimulation() {
    try {
      setError("");
      setResult(null);
      setActiveNodes([]);
      setLoading(true);
      setStorm(true);
      setTab("next");


      /*
        Small delay is intentionally
        retained for the prototype
        engine-reading animation.
      */
      await new Promise(
        (resolve) =>
          window.setTimeout(
            resolve,
            900
          )
      );


      const data =
        await runSimulation(
          DEFAULT_SCENARIO,
          severity
        );


      if (!data) {
        throw new Error(
          "Simulation returned no data."
        );
      }


      setResult(data);

    } catch (error) {
      console.error(
        "Simulation failed:",
        error
      );

      setStorm(false);

      setError(
        error.response?.data?.detail ||
        "NERVA Engine is unavailable."
      );

    } finally {
      setLoading(false);
    }
  }


  function resetSimulation() {
    setResult(null);
    setActiveNodes([]);
    setStorm(false);
    setTab("next");
    setError("");
  }


  return (
    <main
      className={
        "app-shell simulation-shell"
      }
    >

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="floating-header">
        <div>
          <span className="brand-mini">
            ASK NERVA
          </span>

          <p>
            Explore what could
            happen next.
          </p>
        </div>


        <div className="system-online">
          <span />

          MODEL MODE
        </div>
      </header>


      {/* ======================================
          SIMULATION ENVIRONMENT
      ====================================== */}

      <section className="simulation-page">

        <CityNetwork
          mode="neural"
          activeNodes={
            activeNodes
          }
        />


        <RainLayer
          active={storm}
        />


        {/* ==================================
            SCENARIO LAUNCHER
        ================================== */}

        {!result && (
          <div className="scenario-launcher">

            <Sparkles
              size={22}
            />

            <span className="eyebrow">
              WHAT HAPPENS IF...
            </span>


            <h1>
              Heavy rainfall hits
              Zone A?
            </h1>


            <p>
              Watch NERVA trace a
              modelled chain reaction
              through connected urban
              infrastructure.
            </p>


            {/* SEVERITY */}

            <div
              style={{
                width: "100%",
                marginTop: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  marginBottom:
                    "8px",
                }}
              >
                <span className="eyebrow">
                  EVENT SEVERITY
                </span>

                <strong>
                  {severity}/10
                </strong>
              </div>


              <input
                type="range"
                min="1"
                max="10"
                value={severity}
                disabled={loading}
                onChange={(event) =>
                  setSeverity(
                    Number(
                      event.target
                        .value
                    )
                  )
                }
                style={{
                  width: "100%",
                }}
              />
            </div>


            <button
              type="button"
              className="scenario-button"
              onClick={
                handleSimulation
              }
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle
                    className="spin"
                    size={18}
                  />

                  Reading city...
                </>
              ) : (
                <>
                  <CloudRain
                    size={18}
                  />

                  Trigger Rainfall
                </>
              )}
            </button>


            {error && (
              <div className="response-error">
                {error}
              </div>
            )}


            <small
              className="model-disclaimer"
            >
              Simulation outputs are
              modelled prototype
              information and are not
              guaranteed real-world
              forecasts.
            </small>

          </div>
        )}


        {/* ==================================
            SIMULATION RESULT
        ================================== */}

        {result && (
          <>
            <button
              type="button"
              className="response-center-trigger"
              onClick={
                resetSimulation
              }
              style={{
                position: "absolute",
                top: "90px",
                right: "20px",
                zIndex: 900,
              }}
            >
              <RotateCcw
                size={16}
              />

              New Simulation
            </button>


            <CascadeSheet
              result={result}
              tab={tab}
              setTab={setTab}
              scenarioId={
                result?.scenario?.id ||
                DEFAULT_SCENARIO
              }
            />
          </>
        )}

      </section>


      <BottomNav />

    </main>
  );
}