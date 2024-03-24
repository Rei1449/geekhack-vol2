import "./App.css";

import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Test from "./Test";

import Game from "./components/game/Game";

import Ranking from "./components/game/Ranking";
import Rule from "./Rule/Rule";
import User from "./User/User";
import Login from "./Login";

import { USER_NAME_KEY } from "./components/game/Constants";

import Register from "./Register";

function App() {
	const item = localStorage.getItem(USER_NAME_KEY);
	console.log("item", item);
	return (
		<>
			<Routes>
				{item === null ? (
					<>
						<Route path="/" element={<Login />} />
						<Route path="/test" element={<Login />} />
						<Route path="/game" element={<Login />} />
						<Route path="/ranking" element={<Login />} />
						<Route path="/rule" element={<Rule />} />
						<Route path="/user" element={<Login />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
					</>
				) : (
					<>
						<Route path="/" element={<Home />} />
						<Route path="/test" element={<Test />} />
						<Route path="/game" element={<Game />} />
						<Route path="/ranking" element={<Ranking />} />
						<Route path="/rule" element={<Rule />} />
						<Route path="/user" element={<User />} />
						<Route path="/login" element={<Home />} />
						<Route path="/register" element={<Home />} />
					</>
				)}
			</Routes>
		</>
	);
}

export default App;
