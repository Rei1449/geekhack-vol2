import { Key, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ENDPOINT_URL, USER_NAME_KEY } from "./components/game/Constants";
import Hai from "./components/game/Hai";
import { HaiInfo } from "./types/HaiInfo";
//import { ResultData } from "./types/ResultData";

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

const Login = () => {
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
	useEffect(() => {
		getRanking();
	}, []);
	const [userName, setUserName] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const checkLogin = async () => {
		setIsLoading(true);
		const res = await fetch(ENDPOINT_URL + "user/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: userName,
				password: password,
			}),
		});
		if (res.ok) {
			const data = await res.json();
			console.log(data);
			setIsLoading(false);
			if (userName == data) {
				localStorage.setItem(USER_NAME_KEY, data);

				setError("");
				document.location = "/";
			} else {
				setError(data.error);
			}
		} else {
			console.log("error");
		}
	};
	return (
		<>
			<div className="w-screen h-screen bg-[#151515]">
				<div className="flex items-center justify-between px-20 pt-[0%] h-screen">
					<div className="overflow-y-scroll nobar w-[45%] bg-origin-2 h-[85%] rounded-[20px] p-10">
						{isLoading ? (
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
								<p className="text-[50px] mt-5 ml-1 load">Loading</p>
							</>
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
								{stateRankingDatas.high.map(
									(rankingData: any, index: number) => {
										return (
											<div key={rankingData.id} className="">
												<div className="flex items-center mt-10">
													<p className="text-[50px] text-[#38b48b]">
														{index + 1}
													</p>
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
														.map(
															(hand: any[], index: Key | null | undefined) => {
																const haiInfo: HaiInfo = {
																	kind: Number(hand[0]),
																	number: Number(hand[1]),
																};
																return <Hai hai={haiInfo} key={index} />;
															}
														)}
												</div>
											</div>
										);
									}
								)}
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
							<div className="">
								<p>user name</p>
								<input
									type="text"
									className="duration-200 bg-[#151515]  mt-1 text-2xl block border border-gray-500 rounded-[20px] w-[300px] text-center p-[20px]"
									value={userName}
									onChange={(e) => {
										setUserName(e.target.value);
									}}
								/>
								<p className="mt-5">password</p>
								<input
									type="password"
									className="duration-200 bg-[#151515]  mt-1 text-2xl block border border-gray-500 rounded-[20px] w-[300px] text-center p-[20px]"
									value={password}
									onChange={(e) => {
										setPassword(e.target.value);
									}}
								/>
								<p>{error}</p>
								<button
									className="m-auto duration-200 bg-[#151515] hover:bg-[#38b48b] mt-10 text-2xl block border border-gray-500 rounded-[20px] w-[200px] text-center p-[10px]"
									onClick={checkLogin}>
									ログイン
								</button>
								<Link
									className="m-auto duration-200  hover:text-[#38b48b] mt-5 text-md block  rounded-[20px] w-[200px] text-center "
									to="/register">
									新規登録はこちら
								</Link>
							</div>
							<Link
								className="m-auto duration-200  hover:text-[#38b48b] mt-5 text-md block  rounded-[20px] w-[200px] text-center "
								to="/rule">
								Three's rule →
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
