import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  Layers3,
  ScanLine,
  Network
} from "lucide-react";

import BottomNav
  from "../components/BottomNav";

import CityNetwork
  from "../components/CityNetwork";

import AssetSheet
  from "../components/AssetSheet";

import {
  getAssets
} from "../services/api";


export default function City() {
  const navigate =
    useNavigate();

  const [mode, setMode] =
    useState("surface");

  const [assets, setAssets] =
    useState([]);

  const [
    selectedAsset,
    setSelectedAsset
  ] = useState(null);


  useEffect(() => {
    getAssets()
      .then((data) => {
        setAssets(
          data.assets
        );
      })
      .catch(console.error);
  }, []);


  function selectAsset(
    assetId
  ) {
    const asset =
      assets.find(
        (item) =>
          item.id === assetId
      );

    if (asset) {
      setSelectedAsset(
        asset
      );
    }
  }


  const controls = [
    {
      id: "surface",
      label: "Surface",
      icon: Layers3
    },
    {
      id: "xray",
      label: "X-Ray",
      icon: ScanLine
    },
    {
      id: "neural",
      label: "Neural",
      icon: Network
    }
  ];


  return (
    <main className="app-shell">
      <header className="floating-header">
        <div>
          <span className="brand-mini">
            NERVA CITY
          </span>

          <p>
            Zone A · Living model
          </p>
        </div>

        <div className="view-switcher">
          {controls.map(
            ({
              id,
              label,
              icon: Icon
            }) => (
              <button
                key={id}
                onClick={() =>
                  setMode(id)
                }
                className={
                  mode === id
                    ? "active"
                    : ""
                }
              >
                <Icon size={15} />

                {label}
              </button>
            )
          )}
        </div>
      </header>

      <section className="city-page">
        <CityNetwork
          mode={mode}
          activeNodes={[]}
          onNodeClick={
            selectAsset
          }
        />

        {!selectedAsset && (
          <div className="city-hint">
            <span className="eyebrow">
              {mode.toUpperCase()}
              {" MODE"}
            </span>

            <strong>
              Tap an infrastructure
              node.
            </strong>
          </div>
        )}

        <AssetSheet
          asset={selectedAsset}
          onClose={() =>
            setSelectedAsset(null)
          }
          onSimulate={() =>
            navigate("/nerva")
          }
        />
      </section>

      <BottomNav />
    </main>
  );
}