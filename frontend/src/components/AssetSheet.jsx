import {
  motion
} from "framer-motion";

import {
  X,
  Network,
  Play
} from "lucide-react";


export default function AssetSheet({
  asset,
  onClose,
  onSimulate
}) {
  if (!asset) {
    return null;
  }

  return (
    <motion.div
      className="asset-sheet"
      initial={{
        y: 100,
        opacity: 0
      }}
      animate={{
        y: 0,
        opacity: 1
      }}
      exit={{
        y: 100,
        opacity: 0
      }}
    >
      <button
        className="sheet-close"
        onClick={onClose}
      >
        <X size={18} />
      </button>

      <span className="eyebrow">
        {asset.type.toUpperCase()}
        {" · "}
        {asset.zone.toUpperCase()}
      </span>

      <h2>
        {asset.id}
      </h2>

      <h3>
        {asset.name}
      </h3>

      <div className="asset-metrics">
        <div>
          <span>
            CONDITION
          </span>

          <strong>
            {asset.condition}%
          </strong>
        </div>

        <div>
          <span>
            CRITICALITY
          </span>

          <strong>
            {asset.criticality}/10
          </strong>
        </div>

        <div>
          <span>
            OWNER
          </span>

          <strong>
            {asset.department}
          </strong>
        </div>
      </div>

      <div className="asset-actions">
        <button
          className="secondary-button"
        >
          <Network size={16} />

          Connections
        </button>

        <button
          className="primary-button"
          onClick={onSimulate}
        >
          <Play size={15} />

          Run Scenario
        </button>
      </div>
    </motion.div>
  );
}
