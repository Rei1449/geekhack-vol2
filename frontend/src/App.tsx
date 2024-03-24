import "./App.css";

import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Test from "./Test";

import Game from "./components/game/Game";

import Ranking from "./components/game/Ranking";
import Rule from "./Rule/Rule";
import User from "./User/User";
import Login from "./Login";
import Register from "./Register";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/test" element={<Test />} />
				<Route path="/game" element={<Game />} />
				<Route path="/ranking" element={<Ranking />} />
				<Route path="/rule" element={<Rule />} />
				<Route path="/user" element={<User />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
			</Routes>
		</>
	);
}

export default App;
