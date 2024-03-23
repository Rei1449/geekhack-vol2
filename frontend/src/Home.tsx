import { Key, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hai from "./components/game/Hai";

import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "./dialog";
import type { ResultData } from "./types/ResultData";
import {
	ENDPOINT_URL,
	UNDEFINED_RESULT_DATA,
} from "./components/game/Constants";
import type { HaiInfo } from "./types/HaiInfo";

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

export default function Home() {
	// interface UserData {
	// 	id: number;
	// 	user_name: string;
	// 	hand: string;
	// 	score: number;
	// 	created_at: string;
	// 	updated_at: string;
	// }
	// const getRecord = async () => {
	// 	const res = await fetch("http://localhost:8080/user/string");
	// 	if (res.ok) {
	// 		const data = await res.json();
	// 		console.log(data);
	// 		setUserData(data);
	// 	}
	// };
	// useEffect(() => {
	// 	getRecord();
	// }, []);
	// const [userData, setUserData] = useState([]);
	const [isLoadingUserResults, setIsLoadingUserResults] =
		useState<boolean>(true);
	const [userResults, setUserResults] = useState<ResultData[]>([
		UNDEFINED_RESULT_DATA,
	]);
	const getUserResults = async (userName: string) => {
		setIsLoadingUserResults(true);
		const res = await fetch(ENDPOINT_URL + "user/" + userName, {
			method: "Get",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (res.ok) {
			const data = await res.json();
			console.log(data);
			setIsLoadingUserResults(false);
			setUserResults(data);
		} else {
			console.log("error");
		}
	};
	// useEffect(() => {
	// 	getUserResults("user");
	// }, []);

	//const [userData, setUserData] = useState([]);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [stateRankingDatas, SetRankingData] =
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
		getUserResults("user");
		getRanking();
	}, []);
	return (
		<div className="w-screen h-screen bg-[#151515]">
			<div className="flex items-center justify-between px-10 pt-10">
				<div className="w-[45%] bg-black h-[300px] rounded-[20px] p-10">
					{isLoading ? (
						<p>ロード中</p>
					) : (
						<>
							{stateRankingDatas.high.map((rankingData: any) => {
								return (
									<div key={rankingData.id}>
										<div className="flex items-center">
											<p className="text-xl">{rankingData.user_name}:</p>
											<p>{rankingData.ai}</p>
										</div>
										<p className="text-4xl">{rankingData.score}</p>
										<div className="flex">
											{rankingData.hand
												.split(",")
												.map((hand: any[], index: Key | null | undefined) => {
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
							{stateRankingDatas.low.map((rankingData: any) => {
								return (
									<div key={rankingData.id}>
										<p>{rankingData.user_name}</p>
										<p className="text-xl">{rankingData.score}</p>
										<p>{rankingData.ai}</p>
										<div className="flex">
											{rankingData.hand
												.split(",")
												.map((hand: any[], index: Key | null | undefined) => {
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
				<div className="w-[45%]">
					<h1 className="text-[200px] text-[#9c4efb] m-auto w-fit">Three</h1>
					<div className="m-auto w-[300px]">
						<Link
							className="duration-200  hover:bg-[#38b48b] text-2xl block border border-gray-500 rounded-[20px] w-[300px] text-center p-[20px]"
							to="/game">
							Play Three →
						</Link>

						<Dialog>
							<DialogTrigger className="duration-200  hover:bg-[#38b48b] mt-5 text-2xl block border border-gray-500 rounded-[20px] w-[300px] text-center p-[20px]">
								show record →
							</DialogTrigger>
							<DialogContent className="bg-origin border-gray-800 min-w-[70%] p-20 max-h-[600px] h-[80%]">
								<DialogHeader>
									{isLoadingUserResults ? (
										<p>読み込み中</p>
									) : (
										userResults.map((data: ResultData) => (
											<div key={data.id} className="">
												<p>{data.user_name}</p>
												<p className="mt-5">{data.score}</p>
												<p>{data.ai}</p>
												<div className="flex">
													{data.hand.split(",").map((hand, index) => {
														const haiInfo: HaiInfo = {
															kind: Number(hand[0]),
															number: Number(hand[1]),
														};
														return <Hai hai={haiInfo} key={index} />;
													})}
												</div>
											</div>
										))
									)}
								</DialogHeader>
								<div></div>
							</DialogContent>
						</Dialog>
						<Link
							className="duration-200  hover:bg-[#38b48b] mt-5 text-2xl block border border-gray-500 rounded-[20px] w-[300px] text-center p-[20px]"
							to="/rule">
							Three's rule →
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
