import json
import networkx as nx

from config import ASSETS_FILE, RELATIONSHIPS_FILE


class GraphEngine:
    def __init__(self):
        self.graph = nx.DiGraph()
        self.assets = {}
        self._load_graph()

    def _load_json(self, path):
        with open(path, "r", encoding="utf-8") as file:
            return json.load(file)

    def _load_graph(self):
        assets = self._load_json(ASSETS_FILE)
        relationships = self._load_json(RELATIONSHIPS_FILE)

        for asset in assets:
            asset_id = asset["id"]
            self.assets[asset_id] = asset
            self.graph.add_node(asset_id, **asset)

        for relationship in relationships:
            self.graph.add_edge(
                relationship["source"],
                relationship["target"],
                relation=relationship["relation"],
                weight=relationship["weight"]
            )

    def get_all_assets(self):
        return list(self.assets.values())

    def get_asset(self, asset_id):
        return self.assets.get(asset_id)

    def get_neighbors(self, asset_id):
        if asset_id not in self.graph:
            return []

        return list(self.graph.successors(asset_id))

    def get_affected_assets(self, asset_id, max_depth=3):
        if asset_id not in self.graph:
            return []

        affected = []

        lengths = nx.single_source_shortest_path_length(
            self.graph,
            asset_id,
            cutoff=max_depth
        )

        for target, depth in lengths.items():
            if target == asset_id:
                continue

            affected.append({
                "asset": self.assets[target],
                "depth": depth
            })

        affected.sort(key=lambda item: item["depth"])
        return affected

    def get_path(self, source, target):
        try:
            path = nx.shortest_path(self.graph, source, target)
        except (nx.NetworkXNoPath, nx.NodeNotFound):
            return []

        result = []

        for index in range(len(path) - 1):
            current = path[index]
            next_node = path[index + 1]

            edge = self.graph.get_edge_data(current, next_node)

            result.append({
                "source": current,
                "target": next_node,
                "relation": edge["relation"],
                "weight": edge["weight"]
            })

        return result


graph_engine = GraphEngine()