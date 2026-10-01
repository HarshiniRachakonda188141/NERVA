from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

ASSETS_FILE = DATA_DIR / "assets.json"
RELATIONSHIPS_FILE = DATA_DIR / "relationships.json"
SCENARIOS_FILE = DATA_DIR / "scenarios.json"