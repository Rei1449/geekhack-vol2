import "../../index.css";
import type { HaiInfo } from "../../types/HaiInfo.tsx";
import { useState, useEffect } from "react";
import Player from "./Player.tsx";
import Oponent from "./Oponent.tsx";
import AgariButton from "./AgariButton.tsx";
import {
	GetHaiName,
	ShuffleArray,
	IsSameHai,
	SortHaiArray,
} from "./CommonMethods.tsx";
import { ENDPOINT_URL, UNDEFINED_HAI, aiNames } from "./Constants.tsx";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from "../../dialog";

import ViewTehai from "./ViewTehai";
import { Link } from "react-router-dom";
import UnTurnHai from "./UnTurnHai";
import { USER_NAME_KEY } from "./Constants";

const makeYama = (): HaiInfo[] => {
	const yama: HaiInfo[] = [];
	// 数牌
	for (let kind = 1; kind <= 3; kind++) {
		for (let number = 1; number <= 9; number++) {
			for (let i = 0; i < 4; i++) {
				yama.push({ kind: kind, number: number });
			}
		}
	}
	// 字牌
	for (let number = 1; number <= 7; number++) {
		for (let i = 0; i < 4; i++) {
			yama.push({ kind: 4, number: number });
		}
	}
	return ShuffleArray(yama);
};

const Game = () => {
	const [yama, setYama] = useState<HaiInfo[]>([]);
	const popYama = (): HaiInfo => {
		const lastHai: HaiInfo | undefined = yama.pop();
		const newYama = [...yama];
		setYama(newYama);
		return lastHai || { kind: -1, number: -1 };
	};
	const [playerTehai, setPlayerTehai] = useState<HaiInfo[]>([]);
	const [oponent1Tehai, setopOponent1Tehai] = useState<HaiInfo[]>([]);
	const [oponent2Tehai, setopOponent2Tehai] = useState<HaiInfo[]>([]);
	const [oponent3Tehai, setopOponent3Tehai] = useState<HaiInfo[]>([]);
	const [playerKawa, setPlayerKawa] = useState<HaiInfo[]>([]);
	const [oponent1Kawa, setOponent1Kawa] = useState<HaiInfo[]>([]);
	const [oponent2Kawa, setOponent2Kawa] = useState<HaiInfo[]>([]);
	const [oponent3Kawa, setOponent3Kawa] = useState<HaiInfo[]>([]);

	const tumo = (): void => {
		setPlayerTehai([...playerTehai, popYama()]);
	};

	const discard = (targetHai: HaiInfo): boolean => {
		const newPlayerTehai = playerTehai;
		for (let i = 0; i < playerTehai.length; i++) {
			if (IsSameHai(targetHai, playerTehai[i])) {
				newPlayerTehai.splice(i, 1);
				SortHaiArray(newPlayerTehai);
				setPlayerTehai(newPlayerTehai);
				setPlayerKawa([...playerKawa, targetHai]);
				return true;
			}
		}
		return false;
	};
	const [lock, setLock] = useState(false);
	const progressTurn = (discardHai: HaiInfo): void => {
		setLock(true);
		discard(discardHai);
		// cpuはつもぎり
		setTimeout(() => {
			setLock(true);
			setOponent1Kawa([...oponent1Kawa, popYama()]);
		}, 500);
		setTimeout(() => {
			setLock(true);
			setOponent2Kawa([...oponent2Kawa, popYama()]);
		}, 1000);
		setTimeout(() => {
			setLock(true);
			setOponent3Kawa([...oponent3Kawa, popYama()]);
		}, 1500);

		if (yama.length == 0) {
			tryApi(playerTehai);
		}
		setTimeout(() => {
			setLock(true);
			tumo();
			setLock(false);
		}, 2000);
	};
	const [isGame, setIsGame] = useState(false);
	const startGame = (): void => {
		setTimeout(() => {
			setAddClass(true);
		}, 1000);
		setIsGame(true);
		const newYama = makeYama();
		const newPlayerTehai: HaiInfo[] = [];
		const newOponent1Tehai: HaiInfo[] = [];
		const newOponent2Tehai: HaiInfo[] = [];
		const newOponent3Tehai: HaiInfo[] = [];
		// 配牌
		for (let i = 0; i < 13; i++) {
			newPlayerTehai.push(newYama.pop() || UNDEFINED_HAI);
			newOponent1Tehai.push(newYama.pop() || UNDEFINED_HAI);
			newOponent2Tehai.push(newYama.pop() || UNDEFINED_HAI);
			newOponent3Tehai.push(newYama.pop() || UNDEFINED_HAI);
		}
		SortHaiArray(newPlayerTehai);
		newPlayerTehai.push(newYama.pop() || UNDEFINED_HAI);
		setYama(newYama);
		setPlayerTehai(newPlayerTehai);
		setopOponent1Tehai(newOponent1Tehai);
		setopOponent2Tehai(newOponent2Tehai);
		setopOponent3Tehai(newOponent3Tehai);
	};

	// ゲーム結果を計算
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [showData, setShowData] = useState<number | null>(null);
	const [num, setNum] = useState<number>(0);
	const handleAiNum = (num: number) => {
		setNum(num);
	};
	const tryApi = async (tehai: HaiInfo[]) => {
		setIsLoading(true);
		const stringTehai: string[] = [];
		SortHaiArray(tehai);
		tehai.map((hai) => {
			stringTehai.push(GetHaiName(hai));
		});
		const res = await fetch(
			`https://hack-fast-api-65ce6a3d3ac6.herokuapp.com/api/${num}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ arr: stringTehai }),
			}
		);
		if (res.ok) {
			const data = await res.json();
			console.log(data);
			setIsLoading(false);
			setShowData(data);
		} else {
			console.log("error");
		}
	};

	const [addClass, setAddClass] = useState<boolean>(false);

	const [isSuc, setIsSuc] = useState();
	const [isSaveLoad, setSaveLoad] = useState(false);

	// データベースに結果を保存する
	const saveResult = async (tehai: HaiInfo[]) => {
		setSaveLoad(true);
		const item = localStorage.getItem(USER_NAME_KEY);
		const tehaiForDB: string[] = [];
		tehai.map((hai) => {
			tehaiForDB.push(String(hai.kind) + String(hai.number));
		});
		const res = await fetch(ENDPOINT_URL + "store", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user_name: item,
				score: showData,
				arr: tehaiForDB,
				ai: aiNames[num - 1],
			}),
		});
		if (res.ok) {
			const data = await res.json();
			console.log(data);
			setIsSuc(data.success);
			setSaveLoad(false);
		} else {
			console.log("error");
		}
	};
	useEffect(() => {
		startGame();
	}, []);
	return (
		<div id="game" className="w-screen h-screen bg-[#151515] p-10">
			{isGame ? (
				<>
					<Dialog>
						<>
							{lock ? (
								<>
									<div className="duration-200 opacity-20 text-2xl block border border-gray-500 rounded-[20px] w-[300px] text-center p-[20px]">
										{isGame && (
											<>
												<p className="">select AI</p>
											</>
										)}
									</div>
								</>
							) : (
								<>
									<DialogTrigger className="duration-200 hover:bg-[#38b48b] text-2xl block border border-gray-500 rounded-[20px] w-[300px] text-center p-[20px]">
										{isGame && (
											<>
												<p className="">select AI</p>
											</>
										)}
									</DialogTrigger>
								</>
							)}
						</>

						<DialogContent className="bg-origin border-gray-800 min-w-[70%] min-h-[80%] p-20">
							<DialogHeader className="w-full overflow-x-scroll">
								<p className="text-white flex items-center">
									<span className="text-xl">Tehai</span>
								</p>
								<div className="flex">
									{playerTehai.map((hai, index) => {
										if (index < 13) {
											return <ViewTehai hai={hai} key={index} />;
										} else {
											return (
												<div className="ml-4" key={index}>
													<ViewTehai hai={hai} />
												</div>
											);
										}
									})}
								</div>
								{showData === null ? (
									<>
										{isLoading === true ? (
											<>
												<div className="text-white flex items-center ">
													<span className="mt-10 text-xl">Score</span>
												</div>
												<p className="text-[200px] load">Loading</p>
											</>
										) : (
											<>
												<div className="text-white flex items-center ">
													<span className="mt-10 text-xl">Select AI</span>
												</div>
												<div className="flex justify-between">
													<div
														onClick={() => handleAiNum(1)}
														className={
															num === 1
																? "hover:scale-95 duration-200  hover:bg-[#38b48b] mt-5 bg-[#38b48b] cursor-pointer  border-gray-800 border w-[32%] rounded-[20px] p-[20px] text-4xl font-bold text-white"
																: "hover:scale-95 duration-200  hover:bg-[#38b48b] mt-5 bg-[#131313] cursor-pointer  border-gray-800 border w-[32%] rounded-[20px] p-[20px] text-4xl font-bold text-white"
														}>
														LLaMA
													</div>
													<div
														onClick={() => handleAiNum(2)}
														className={
															num === 2
																? "hover:scale-95 duration-200  hover:bg-[#38b48b] mt-5 bg-[#38b48b] cursor-pointer  border-gray-800 border w-[32%] rounded-[20px] p-[20px] text-4xl font-bold text-white"
																: "hover:scale-95 duration-200  hover:bg-[#38b48b] mt-5 bg-[#131313] cursor-pointer  border-gray-800 border w-[32%] rounded-[20px] p-[20px] text-4xl font-bold text-white"
														}>
														{" "}
														chatGPT
													</div>
													<div
														onClick={() => handleAiNum(3)}
														className={
															num === 3
																? "hover:scale-95 duration-200  hover:bg-[#38b48b] mt-5 bg-[#38b48b] cursor-pointer  border-gray-800 border w-[32%] rounded-[20px] p-[20px] text-4xl font-bold text-white"
																: "hover:scale-95 duration-200  hover:bg-[#38b48b] mt-5 bg-[#131313] cursor-pointer  border-gray-800 border w-[32%] rounded-[20px] p-[20px] text-4xl font-bold text-white"
														}>
														{" "}
														Gemini
													</div>
												</div>
											</>
										)}
										<div className="">
											{num === 0 ? (
												<>
													<button className="m-auto block mt-20 text-xl opacity-30 border border-gray-500 rounded-[20px] w-[200px] text-center p-[10px]">
														和がる!!!
													</button>
												</>
											) : (
												<>
													{isLoading === true ? (
														<></>
													) : (
														<>
															<AgariButton
																onClickMethod={() => tryApi(playerTehai)}
															/>
														</>
													)}
												</>
											)}
										</div>
									</>
								) : (
									<>
										<div className="text-white flex items-center ">
											<span className="mt-10 text-xl">Score</span>
										</div>
										<p className="text-[200px]">{showData}</p>
										{isSuc ? (
											<></>
										) : (
											<>
												{isSaveLoad && (
													<>
														<p>loading</p>
													</>
												)}
												<button
													className="hover:bg-[#38b48b] duration-300 mt-10 border border-gray-700 p-[10px] w-[200px] text-center rounded-[20px]"
													onClick={() => saveResult(playerTehai)}>
													スコアを保存する→
												</button>
											</>
										)}

										{isSuc && <>{isSuc}!</>}
										<Link
											className="hover:bg-[#38b48b] duration-300 mt-10 border border-gray-700 p-[10px] w-[200px] text-center rounded-[20px]"
											to="/">
											home→
										</Link>
									</>
								)}
							</DialogHeader>
						</DialogContent>
					</Dialog>
				</>
			) : (
				<>
					<button
						className="duration-200  hover:bg-[#38b48b] text-2xl block border border-gray-500 rounded-[20px] w-[300px] text-center p-[20px]"
						onClick={() => {
							startGame();
						}}>
						Game Start
					</button>
				</>
			)}
			<div
				className={
					addClass
						? "opacity-100 duration-300 flex"
						: "opacity-0 duration-300 flex"
				}>
				{lock === true ? (
					<>
						<UnTurnHai
							tehai={playerTehai}
							kawa={playerKawa}
							// discardMethod={progressTurn}
						/>
					</>
				) : (
					<>
						<Player
							tehai={playerTehai}
							kawa={playerKawa}
							discardMethod={progressTurn}
						/>
					</>
				)}
			</div>

			<div className="">
				<div className="fixed right-[5%]">
					<Oponent tehai={oponent1Tehai} kawa={oponent1Kawa} />
				</div>
				<div className="fixed top-[5%] left-[50%]">
					<Oponent tehai={oponent2Tehai} kawa={oponent2Kawa} />
				</div>
				<div className="fixed">
					<Oponent tehai={oponent3Tehai} kawa={oponent3Kawa} />
				</div>
			</div>
		</div>
	);
};

export default Game;
