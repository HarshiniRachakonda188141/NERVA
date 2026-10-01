import {
  ArrowUp,
  Sparkles
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function AskNerva() {
  const navigate = useNavigate();

  return (
    <button
      className="ask-nerva"
      onClick={() =>
        navigate("/nerva")
      }
    >
      <div className="ask-left">
        <Sparkles size={18} />

        <span>
          What happens if...?
        </span>
      </div>

      <span className="ask-send">
        <ArrowUp size={17} />
      </span>
    </button>
  );
}