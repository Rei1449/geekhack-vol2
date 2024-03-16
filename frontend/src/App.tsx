import "./App.css";

import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Test from "./Test";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/test" element={<Test />} />
			</Routes>
		</>
	);
}

export default App;
