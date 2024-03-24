import { Key, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hai from "./components/game/Hai";

import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "./dialog";
import type { ResultData } from "./types/ResultData";
import {
	ENDPOINT_URL,
	UNDEFINED_RESULT_DATA,
	USER_NAME_KEY,
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
	const getUserResults = async (userName: string | null) => {
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

			setIsLoading(false);
		} else {
			console.log("error");
		}
	};
	const getAIRank = async (aiID: string) => {
		setIsLoading(true);
		const res = await fetch(ENDPOINT_URL + `ranking/${aiID}`);
		if (res.ok) {
			const data: rankingDatas = await res.json();
			SetRankingData(data);
			setIsLoading(false);
		} else {
			console.log("error");
		}
	};
	const [isChoose, setIsChoose] = useState<number>(1);
	const item = localStorage.getItem(USER_NAME_KEY);
	useEffect(() => {
		getUserResults(item);
		getRanking();
	}, []);
	return (
		<div className="w-screen h-screen bg-[#151515]">
			<div className="flex items-center justify-between px-20 pt-[0%] h-screen">
				<div className="overflow-y-scroll w-[45%] bg-origin-2 h-[85%] rounded-[20px] p-10">
					{isLoading ? (
						<p>Loading</p>
					) : (
						<>
							<div className="flex border border-gray-800 p-[8px] rounded-[10px] justify-between">
								<div
									onClick={() => {
										getRanking();
										setIsChoose(1);
									}}
									className={
										isChoose === 1
											? "border border-gray-800 cursor-pointer bg-[#38b48b] hover:bg-[#38b48b] duration-300 p-1 rounded-[10px] w-[90px] text-center"
											: "border border-gray-800 cursor-pointer hover:bg-[#38b48b] duration-300 p-1 rounded-[10px] w-[90px] text-center"
									}>
									All(High)
								</div>
								<div
									onClick={() => {
										getAIRank("llama");
										setIsChoose(2);
									}}
									className={
										isChoose === 2
											? "border border-gray-800 cursor-pointer bg-[#38b48b] hover:bg-[#38b48b] duration-300 p-1 rounded-[10px] w-[90px] text-center"
											: "border border-gray-800 cursor-pointer hover:bg-[#38b48b] duration-300 p-1 rounded-[10px] w-[90px] text-center"
									}>
									{" "}
									llama
								</div>
								<div
									onClick={() => {
										getAIRank("chatgpt");
										setIsChoose(3);
									}}
									className={
										isChoose === 3
											? "border border-gray-800 cursor-pointer bg-[#38b48b] hover:bg-[#38b48b] duration-300 p-1 rounded-[10px] w-[90px] text-center"
											: "border border-gray-800 cursor-pointer hover:bg-[#38b48b] duration-300 p-1 rounded-[10px] w-[90px] text-center"
									}>
									{" "}
									chatgpt
								</div>
								<div
									onClick={() => {
										getAIRank("gemini");
										setIsChoose(4);
									}}
									className={
										isChoose === 4
											? "border border-gray-800 cursor-pointer bg-[#38b48b] hover:bg-[#38b48b] duration-300 p-1 rounded-[10px] w-[90px] text-center"
											: "border border-gray-800 cursor-pointer hover:bg-[#38b48b] duration-300 p-1 rounded-[10px] w-[90px] text-center"
									}>
									{" "}
									gemini
								</div>
								<div className="border border-gray-800 cursor-pointer hover:bg-[#38b48b] duration-300 p-1 rounded-[10px] w-[90px] text-center">
									All(Low)
								</div>
							</div>
							{stateRankingDatas.high.map((rankingData: any, index: number) => {
								return (
									<div key={rankingData.id} className="">
										<div className="flex items-center mt-10">
											<p className="text-[50px] text-[#38b48b]">{index + 1}</p>
											<div className="flex items-center ml-5">
												<p
													className={
														index === 0
															? "text-4xl text-origin leading-none"
															: "text-4xl leading-none"
													}>
													{rankingData.user_name}
												</p>
												<p className="text-gray-700 text-2xl leading-none">
													:{rankingData.ai}
												</p>
											</div>
										</div>

										<p className="text-xl">{rankingData.score}</p>
										<div className="flex mt-1">
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
							{/* {stateRankingDatas.low.map((rankingData: any) => {
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
							})} */}
						</>
					)}
				</div>
				<div className="w-[50%]">
					<h1 className="text-[220px] font-bold text-[#9c4efb] m-auto w-fit leading-none">
						Three
					</h1>
					<div className="m-auto mt-10 w-[300px]">
						<Link
							className="duration-200  hover:bg-[#38b48b] text-2xl block border border-gray-500 rounded-[20px] w-[300px] text-center p-[20px]"
							to="/game">
							Play Three →
						</Link>

						<Dialog>
							<DialogTrigger className="duration-200 hover:bg-[#38b48b] mt-5 text-2xl block border border-gray-500 rounded-[20px] w-[300px] text-center p-[20px]">
								show record →
							</DialogTrigger>
							<DialogContent className="overflow-y-scroll bg-origin border-gray-800 min-w-[70%] p-20 h-[80%]">
								<DialogHeader>
									{isLoadingUserResults ? (
										<p>読み込み中</p>
									) : (
										<>
											<p className="text-[50px] font-bold">{item}</p>
											<p>record</p>
											{userResults.map((data: ResultData) => (
												<div key={data.id} className="">
													<p className="mt-20 text-[100px]">{data.score}</p>
													<p className="mt-1">{data.ai}</p>
													<div className="flex mt-1">
														{data.hand.split(",").map((hand, index) => {
															const haiInfo: HaiInfo = {
																kind: Number(hand[0]),
																number: Number(hand[1]),
															};
															return <Hai hai={haiInfo} key={index} />;
														})}
													</div>
												</div>
											))}
										</>
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
