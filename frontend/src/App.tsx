import "./App.css";

import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Test from "./Test";
import TestApi from "./Testapi/TestApi";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/test" element={<Test />} />
				<Route path="/testapi" element={<TestApi />} />
			</Routes>
		</>
	);
}

export default App;
