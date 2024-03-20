import { useState } from "react";

export default function TestApi() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [showData, setShowData] = useState([]);
	const [arr, setArr] = useState({
		arr: [
			"八萬子",
			"八萬子",
			"八萬子",
			"八筒子",
			"八筒子",
			"八筒子",
			"八索子",
			"八索子",
			"八索子",
			"二萬子",
			"三萬子",
			"四萬子",
			"三索子",
			"三索子",
		],
	});
	const tryApi = async () => {
		const res = await fetch("http://localhost:8080/tumo", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(arr),
		});
		if (res.ok) {
			const data = await res.json();
			console.log(data.message.content);
			//setShowData(data.data.arr);
		} else {
			console.log("error");
		}
	};
	return (
		<div>
			<div>
				{isLoading && (
					<>
						<p>loading</p>
					</>
				)}
			</div>
			<div>
				{showData.map((data, index) => (
					<div key={index}>
						<p>{data}</p>
					</div>
				))}
			</div>
			<button onClick={tryApi}>try api</button>
		</div>
	);
}
