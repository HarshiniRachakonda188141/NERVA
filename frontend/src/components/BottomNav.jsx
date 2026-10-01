import {
  Activity,
  Map,
  Sparkles,
  Plus
} from "lucide-react";

import { NavLink } from "react-router-dom";

const items = [
  {
    label: "Pulse",
    path: "/pulse",
    icon: Activity
  },
  {
    label: "City",
    path: "/city",
    icon: Map
  },
  {
    label: "NERVA",
    path: "/nerva",
    icon: Sparkles
  },
  {
    label: "Report",
    path: "/report",
    icon: Plus
  }
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {items.map(
        ({
          label,
          path,
          icon: Icon
        }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <Icon size={19} />

            <span>
              {label}
            </span>
          </NavLink>
        )
      )}
    </nav>
  );
}