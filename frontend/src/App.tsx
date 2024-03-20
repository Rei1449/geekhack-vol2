import "./App.css";

import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Test from "./Test";

import TestApi from "./Testapi/TestApi";

import Game from "./components/game/Game";


function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/test" element={<Test />} />

				<Route path="/testapi" element={<TestApi />} />

				<Route path="/game" element={<Game />} />

			</Routes>
		</>
	);
}

export default App;
