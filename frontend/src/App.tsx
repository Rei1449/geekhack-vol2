import "./App.css";

import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Test from "./Test";

import Game from "./components/game/Game";
import Ranking from "./components/game/Ranking";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/test" element={<Test />} />
				<Route path="/game" element={<Game />} />
				<Route path="/ranking" element={<Ranking />} />
			</Routes>
		</>
	);
}

export default App;
