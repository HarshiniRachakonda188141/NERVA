import {
  useEffect,
  useState
} from "react";

import {
  CloudRain,
  LoaderCircle,
  Sparkles
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
  runSimulation
} from "../services/api";


export default function Nerva() {
  const [
    loading,
    setLoading
  ] = useState(false);

  const [
    storm,
    setStorm
  ] = useState(false);

  const [
    result,
    setResult
  ] = useState(null);

  const [
    tab,
    setTab
  ] = useState("next");

  const [
    activeNodes,
    setActiveNodes
  ] = useState([]);

  const [
    error,
    setError
  ] = useState("");


  useEffect(() => {
    if (!result) {
      return;
    }

    setActiveNodes([]);

    const ids =
      result.cascade.map(
        (item) =>
          item.asset_id
      );

    const timers = [];

    ids.forEach(
      (id, index) => {
        const timer =
          setTimeout(() => {
            setActiveNodes(
              (previous) => [
                ...previous,
                id
              ]
            );
          }, index * 700);

        timers.push(timer);
      }
    );

    return () => {
      timers.forEach(
        clearTimeout
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

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            1800
          )
      );

      const data =
        await runSimulation(
          "RAIN_01"
        );

      setResult(data);

    } catch (error) {
      console.error(error);

      setStorm(false);

      setError(
        "NERVA Engine is unavailable."
      );

    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="app-shell simulation-shell">
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
              possible chain reaction
              through connected urban
              infrastructure.
            </p>

            <button
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
              <p className="error-text">
                {error}
              </p>
            )}
          </div>
        )}


        {result && (
          <CascadeSheet
            result={result}
            tab={tab}
            setTab={setTab}
          />
        )}
      </section>

      <BottomNav />
    </main>
  );
}