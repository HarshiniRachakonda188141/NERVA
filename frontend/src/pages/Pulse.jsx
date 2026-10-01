import {
  Droplets,
  Zap,
  Route,
  HeartPulse
} from "lucide-react";

import BottomNav from "../components/BottomNav";
import CityPulse from "../components/CityPulse";
import AskNerva from "../components/AskNerva";

const systems = [
  {
    name: "Mobility",
    status: "Stable",
    icon: Route
  },
  {
    name: "Drainage",
    status: "Watch",
    icon: Droplets
  },
  {
    name: "Power",
    status: "Stable",
    icon: Zap
  },
  {
    name: "Critical",
    status: "Stable",
    icon: HeartPulse
  }
];

export default function Pulse() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <span className="brand-mini">
            NERVA
          </span>

          <p>
            Neural city intelligence
          </p>
        </div>

        <div className="system-online">
          <span />
          ONLINE
        </div>
      </header>

      <section className="pulse-page">
        <div className="welcome">
          <span className="eyebrow">
            CITY STATUS
          </span>

          <h1>
            Your city is stable.
          </h1>

          <p>
            One infrastructure system
            requires attention.
          </p>
        </div>

        <CityPulse value={82} />

        <div className="system-strip">
          {systems.map(
            ({
              name,
              status,
              icon: Icon
            }) => (
              <div
                className="system-item"
                key={name}
              >
                <Icon size={18} />

                <div>
                  <strong>
                    {name}
                  </strong>

                  <span
                    className={
                      status === "Watch"
                        ? "watch"
                        : ""
                    }
                  >
                    {status}
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        <AskNerva />
      </section>

      <BottomNav />
    </main>
  );
}