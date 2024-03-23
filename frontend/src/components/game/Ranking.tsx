import { ENDPOINT_URL } from "./Constants";
import { useEffect, useState } from "react";
import Hai from "./Hai";
import { HaiInfo } from "../../types/HaiInfo";

type rankingData = {
	hand: string;
	id: number;
	score: number;
	user_name: string;
	ai: string;
	updated_at: string;
	created_at: string;
};
type rankingDatas = {
	high: rankingData[];
	low: rankingData[];
};

const defaultRankingDatas: rankingDatas = {
	high: [
		{
			hand: "1,2,3",
			id: 1,
			score: 10000,
			user_name: "user",
			ai: "AI",
			updated_at: "2024",
			created_at: "2024",
		},
	],
	low: [
		{
			hand: "1,2,3",
			id: 1,
			score: 10000,
			user_name: "user",
			ai: "AI",
			updated_at: "2024",
			created_at: "2024",
		},
	],
};

const Ranking = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [rankingDatas, SetRankingData] =
		useState<rankingDatas>(defaultRankingDatas);
	const getRanking = async () => {
		setIsLoading(true);
		const res = await fetch(ENDPOINT_URL + "ranking", {
			method: "GET",
		});
		if (res.ok) {
			const data: rankingDatas = await res.json();
			SetRankingData(data);
			console.log(data);
			setIsLoading(false);
		} else {
			console.log("error");
		}
	};

	useEffect(() => {
		getRanking();
	}, []);
	return (
		<div className="w-screen h-screen bg-[#151515] p-10">
			{isLoading ? (
				<p>ロード中</p>
			) : (
				<>
					{rankingDatas.high.map((rankingData) => {
						return (
							<div key={rankingData.id}>
								<p>{rankingData.user_name}</p>
								<p>{rankingData.score}</p>
								<p>{rankingData.ai}</p>
								<div>
									{rankingData.hand.split(",").map((hand, index) => {
										const haiInfo: HaiInfo = {
											kind: Number(hand[0]),
											number: Number(hand[1]),
										};
										return <Hai hai={haiInfo} key={index} />;
									})}
								</div>
							</div>
						);
					})}
				</>
			)}
		</div>
	);
};

export default Ranking;
