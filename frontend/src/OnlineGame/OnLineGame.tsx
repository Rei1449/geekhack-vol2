import { useEffect, useRef, useState } from "react";
import { HaiInfo } from "../types/HaiInfo";
import makeYama from "./Functions/MakeYama";
import {
	AI_NAMES,
	ENDPOINT_URL,
	UNDEFINED_HAI,
	USER_NAME_KEY,
	WS_URL,
} from "./constants";
import { Link, useLocation } from "react-router-dom";
import { HaiToString } from "./Functions/HaiToString";
import { StringToHaiArray } from "./Functions/StringToHaiArray";
import { StringToHai } from "./Functions/StringToHai";
import { IsSameHai } from "./Functions/IsSameHai";
import { SortHaiArray } from "./Functions/SortHaiArray";
import { GetHaiName } from "./Functions/GetHaiName";
import { HaiArrayToString } from "./Functions/HaiArrayToString";
import Player from "../components/game/Player";
import Oponent from "../components/game/Oponent";
import UnTurnHai from "../components/game/UnTurnHai";
import { aiNames } from "../components/game/Constants";
import Hai from "../components/game/Hai";

import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../dialog";

import ViewTehai from "../components/game/ViewTehai";
type Input = {
	users: string[];
	isGM: boolean;
	room_id: string;
	// wb: WebSocket,
};

type NameAndTehai = {
	user_name: string;
	tehai: string;
};

type HaiPai = {
	room_id: string;
	haipai: NameAndTehai[];
};

type Result = {
	tehai: HaiInfo[];
	point: string;
	ai_id: number;
};

const sendHaipai = async (haipai: HaiPai) => {
	const res = await fetch(ENDPOINT_URL + "distribute_hand", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(haipai),
	});
	if (res.ok) {
		const data = await res.json();
		console.log(data);
	} else {
		console.log("error");
	}
};

const sendTumoHai = async (
	room_id: string,
	user_name: string,
	hai: HaiInfo
) => {
	console.log(hai);
	const res = await fetch(ENDPOINT_URL + "draw_tile", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			room_id: room_id,
			user_name: user_name,
			hai: HaiToString(hai),
		}),
	});
	if (res.ok) {
		const data = await res.json();
		console.log(data);
	} else {
		console.log("error");
	}
};

const sendDiscardHai = async (
	room_id: string,
	user_name: string,
	hai: HaiInfo
) => {
	const res = await fetch(ENDPOINT_URL + "discard", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			room_id: room_id,
			user_name: user_name,
			hai: HaiToString(hai),
		}),
	});
	if (res.ok) {
		const data = await res.json();
		console.log(data);
	} else {
		console.log("error");
	}
};

const sendAgariUser = async (room_id: string, user_name: string) => {
	const res = await fetch(ENDPOINT_URL + "done", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			room_id: room_id,
			user_name: user_name,
		}),
	});
	if (res.ok) {
		const data = await res.json();
		console.log(data);
	} else {
		console.log("error");
	}
};

const sendPoint = async (
	room_id: string,
	user_name: string,
	tehai: HaiInfo[],
	point: string,
	ai_id: number
) => {
	const res = await fetch(ENDPOINT_URL + "game_store", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			room_id: room_id,
			user_name: user_name,
			tehai: HaiArrayToString(tehai),
			point: point,
			ai_id: ai_id,
		}),
	});
	if (res.ok) {
		const data = await res.json();
		console.log(data);
	} else {
		console.log("error");
		sendPoint(room_id, user_name, tehai, point, ai_id);
	}
};

const calcPoint = async (
	room_id: string,
	user_name: string,
	tehai: HaiInfo[],
	ai_id: number
) => {
	const stringTehai: string[] = [];
	SortHaiArray(tehai);
	tehai.map((hai) => {
		stringTehai.push(GetHaiName(hai));
	});
	const res = await fetch(
		"https://geekhack-three-fa2gxhztza-an.a.run.app/" + `api/${ai_id}`,
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
		sendPoint(room_id, user_name, tehai, data, ai_id);
		console.log(data);
	} else {
		console.log("error");
	}
};

const saveResult = async (tehai: HaiInfo[], point: string, ai_id: number) => {
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
			score: point,
			arr: tehaiForDB,
			ai: AI_NAMES[ai_id - 1],
		}),
	});
	if (res.ok) {
		const data = await res.json();
		console.log(data);
	} else {
		console.log("error");
	}
};

const OnLineGame = () => {
	const location = useLocation();

	// 定数定義
	const input = location.state as Input;
	const room_id = input["room_id"];
	const isGM = input["isGM"];
	const users = input["users"];
	// const wb = location.state as Input["wb"];
	const player_name: string = localStorage.getItem(USER_NAME_KEY) || "NoUser";
	let player_index = 4;
	users.map((user, i) => {
		if (user == player_name) {
			player_index = i;
		}
	});

	// const cyama = makeYama();
	// let cyama: any;
	// useEffect(() => {
	//     cyama = makeYama();
	// WebSocketオブジェクトの作成
	// const ws = new WebSocket('ws://example.com');

	// コンポーネントがアンマウントされたときにWebSocketをクローズする
	// return () => {
	//     ws.close();
	// };
	// }, []); // 初回レンダリング時のみ実行されるように空の依存配列を指定

	// state定義
	// const [yama, setYama] = useState<HaiInfo[]>([]);
	const [playerTehai, setPlayerTehai] = useState<HaiInfo[]>([]);
	const [isMyTurn, setIsMyTurn] = useState<boolean>(false);
	const [agariUsers, setAgariUsers] = useState<boolean[]>([
		false,
		false,
		false,
		false,
	]);
	const [kawas, setKawas] = useState<HaiInfo[][]>([[], [], [], []]);
	const [results, setResults] = useState<Result[] | null>(null);
	const [gameEnd, setGameEnd] = useState<boolean>(false);

	const ryama = useRef(makeYama());

	console.log(ryama);
	console.log(playerTehai);

	// console.log(yama);
	// WebSocket定義
	useEffect(() => {
		console.log("websocket open");
		const wb = new WebSocket(WS_URL + `ws/${player_name}/room/${room_id}`);
		wb.addEventListener("message", function (event) {
			const data = JSON.parse(event.data);
			console.log("onmessage");
			console.log(data);
			if ("tehai" in data) {
				catchHaipai(data);
			} else if ("tumo" in data) {
				catchTumoHai(data);
			} else if ("sutehai" in data) {
				catchDiscardHai(data.sutehai);
			} else if ("done_user" in data) {
				catchAgariUser(data);
			} else if ("done_game" in data) {
				setGameEnd(true);
			} else if ("return_result" in data) {
				catchResult(data);
			} else {
				console.log("no appropriate type");
				console.log(data);
			}
		});
		return () => {
			// wb.close();
			console.log("websocket closed");
		};
	}, [agariUsers, gameEnd]);

	const catchHaipai = (data: any) => {
		let tehai = StringToHaiArray(data.tehai);
		SortHaiArray(tehai);
		setPlayerTehai(tehai);
		console.log("catchHaipai");
		// console.log(yama);
		if (isGM) {
			// sendTumoHai(room_id, users[0], popYama());
			setTimeout(() => {
				console.log("exec timeout");
				sendTumoHai(room_id, users[0], popYama());
			}, 1000);
			// clearTimeout(timeoutId);
		}
	};

	const catchTumoHai = function (data: any) {
		if (gameEnd) {
			return;
		}
		// すでにあがっている場合の処理
		if (agariUsers[users.indexOf(player_name)]) {
			// setTimeout(() => {
			sendDiscardHai(room_id, player_name, StringToHai(data.tumo));
			// }, 1000);
			return;
		}
		console.log(data.tumo);
		// 通常時
		setPlayerTehai((playerTehai) => [...playerTehai, StringToHai(data.tumo)]);
		setIsMyTurn(true);
	};

	const catchDiscardHai = function (data: any) {
		if (gameEnd) {
			return;
		}
		const newKawas = [...kawas];
		const user_ind = users.indexOf(data.user_name);
		newKawas[user_ind].push(StringToHai(data.hai));
		setKawas(newKawas);
		if (isGM) {
			sendTumoHai(room_id, users[(user_ind + 1) % 4], popYama());
		}
	};

	const catchAgariUser = function (data: any) {
		const newAgariUsers = [...agariUsers];
		newAgariUsers[users.indexOf(data.done_user)] = true;
		setAgariUsers(newAgariUsers);
		if (isGM) {
			sendTumoHai(
				room_id,
				users[(users.indexOf(data.done_user) + 1) % 4],
				popYama()
			);
		}
	};

	const catchResult = function (data: any) {
		const defaultResult: Result = {
			tehai: [UNDEFINED_HAI],
			point: "mitei",
			ai_id: -1,
		};
		const newResults: Result[] = [
			defaultResult,
			defaultResult,
			defaultResult,
			defaultResult,
		];
		data.return_result.map((r: { user_name: string; result: string }) => {
			const [tehai, point, ai_id] = r.result.split(";");
			newResults[users.indexOf(r.user_name)] = {
				tehai: StringToHaiArray(tehai),
				point: point,
				ai_id: parseInt(ai_id),
			};
		});
		setResults(newResults);
	};

	// 関数定義
	const popYama = (): HaiInfo => {
		// console.log(yama);
		// const newYama = [...yama];
		// console.log(newYama);
		// const lastHai = newYama.pop();
		// setYama(newYama);
		// console.log(newYama);
		// console.log(lastHai);
		// return lastHai || UNDEFINED_HAI;
		return ryama.current.pop() || UNDEFINED_HAI;
	};

	const discard = (targetHai: HaiInfo): boolean => {
		const newPlayerTehai = playerTehai;
		for (let i = 0; i < playerTehai.length; i++) {
			if (IsSameHai(targetHai, playerTehai[i])) {
				newPlayerTehai.splice(i, 1);
				SortHaiArray(newPlayerTehai);
				setPlayerTehai(newPlayerTehai);
				sendDiscardHai(room_id, player_name, targetHai);
				setIsMyTurn(false);
				return true;
			}
		}
		return false;
	};
	const [isAgari, setIsAgari] = useState<boolean>(false);
	const agari = (ai_id: number) => {
		setIsMyTurn(false);
		sendAgariUser(room_id, player_name);
		calcPoint(room_id, player_name, playerTehai, ai_id);
		setIsAgari(true);
	};

	const startGame = (): void => {
		// const newYama = makeYama();
		const haipai: NameAndTehai[] = [];
		for (let i = 0; i < 4; i++) {
			let tmp: string[] = [];
			for (let j = 0; j < 13; j++) {
				const hai = ryama.current.pop();
				// const hai = newYama.pop();
				tmp.push(HaiToString(hai || UNDEFINED_HAI));
			}
			haipai.push({ user_name: users[i], tehai: tmp.join(",") });
		}
		// setYama(newYama);
		sendHaipai({ room_id: room_id, haipai: haipai });
		setIsNowGM(true);
	};
	const [num, setNum] = useState<number>(0);
	const handleAiNum = (num: number) => {
		setNum(num);
	};
	const [isNowGM, setIsNowGM] = useState(false);

	return (
		<div className="w-screen h-screen bg-[#151515] p-10">
			{results !== null && (
				<div className="fixed z-30 bg-black w-screen h-screen top-0 left-0"></div>
			)}

			{isGM && (
				<>
					{isNowGM ? (
						<></>
					) : (
						<>
							<button
								onClick={startGame}
								className="fixed z-40 top-[55%] left-[0%] right-[0%] m-auto duration-200 hover:bg-[#38b48b] mt-5 text-2xl block border border-gray-500 rounded-[20px] w-[300px] text-center p-[50px]">
								ゲーム開始
							</button>
						</>
					)}
				</>
			)}
			{isAgari && (
				<p className="text-[#38b48b] z-20 font-bold text-4xl fixed bottom-[20%] left-[5%]">
					あがりました！
				</p>
			)}
			{isMyTurn && !agariUsers[player_index] ? (
				<>
					{isMyTurn === true && (
						<p className="text-orange-500 font-bold md:text-4xl text-md fixed bottom-[20%] left-[5%]">
							Now your turn.
						</p>
					)}
					<div className="overflow-x-scroll w-full">
						<Player
							tehai={playerTehai}
							kawa={kawas[player_index]}
							discardMethod={discard}
						/>
					</div>

					<Dialog>
						<DialogTrigger className="fixed bottom-[20%] right-[5%] z-30 bg-[#151515] duration-200 hover:bg-[#38b48b] mt-5 text-2xl block border border-gray-500 rounded-[20px] md:w-[300px] w-[200px] text-center md:p-[20px] p-[10px]">
							あがる →
						</DialogTrigger>
						<DialogContent className="text-white overflow-y-scroll nobar bg-origin border-gray-800 min-w-[70%] md:p-20 p-5 h-[80%]">
							<DialogHeader>
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
								<div className="text-white flex items-center ">
									<span className="mt-10 text-xl">Select AI</span>
								</div>
								<div className="flex justify-between">
									<div
										onClick={() => handleAiNum(1)}
										className={
											num === 1
												? "hover:scale-95 duration-200  hover:bg-[#38b48b] mt-5 bg-[#38b48b] cursor-pointer  border-gray-800 border w-[32%] rounded-[20px] p-[10px] md:p-[20px] text-md md:text-4xl font-bold text-white"
												: "hover:scale-95 duration-200  hover:bg-[#38b48b] mt-5 bg-[#131313] cursor-pointer  border-gray-800 border w-[32%] rounded-[20px] p-[10px] md:p-[20px] text-md md:text-4xl font-bold text-white"
										}>
										LLaMA
									</div>
									<div
										onClick={() => handleAiNum(2)}
										className={
											num === 2
												? "hover:scale-95 duration-200  hover:bg-[#38b48b] mt-5 bg-[#38b48b] cursor-pointer  border-gray-800 border w-[32%] rounded-[20px] p-[10px] md:p-[20px] text-md md:text-4xl font-bold text-white"
												: "hover:scale-95 duration-200  hover:bg-[#38b48b] mt-5 bg-[#131313] cursor-pointer  border-gray-800 border w-[32%] rounded-[20px] p-[10px] md:p-[20px] text-md md:text-4xl font-bold text-white"
										}>
										{" "}
										chatGPT
									</div>
									<div
										onClick={() => handleAiNum(3)}
										className={
											num === 3
												? "hover:scale-95 duration-200  hover:bg-[#38b48b] mt-5 bg-[#38b48b] cursor-pointer  border-gray-800 border w-[32%] rounded-[20px] p-[10px] md:p-[20px] text-md md:text-4xl font-bold text-white"
												: "hover:scale-95 duration-200  hover:bg-[#38b48b] mt-5 bg-[#131313] cursor-pointer  border-gray-800 border w-[32%] rounded-[20px] p-[10px] md:p-[20px] text-md md:text-4xl font-bold text-white"
										}>
										{" "}
										Gemini
									</div>
								</div>
								<div className="">
									{num === 0 ? (
										<>
											<button className="m-auto block mt-20 text-xl opacity-30 border border-gray-500 rounded-[20px] w-[200px] text-center p-[10px]">
												あがる!!!
											</button>
										</>
									) : (
										<>
											<button
												className="duration-200 hover:bg-[#38b48b] text-2xl block border border-gray-500 rounded-[20px] w-[300px] m-auto mt-10 text-center p-[20px]"
												onClick={() => {
													agari(num);
												}}>
												あがり
											</button>
										</>
									)}
								</div>
							</DialogHeader>
						</DialogContent>
					</Dialog>
				</>
			) : (
				<>
					<div className="overflow-x-scroll">
						<UnTurnHai tehai={playerTehai} kawa={kawas[player_index]} />
					</div>
				</>
			)}
			<div className="relative z-20 bg-[#151515] md:w-[60%] w-[90%] overflow-scroll m-auto md:min-h-[580px] md:max-h-[580px] min-h-[560px]">
				{[0, 1, 2, 3].map((i) => (
					<div
						key={`oponent${i}`}
						className=" m-auto flex items-start border-b border-gray-600 pt-5">
						<div className="md:w-[200px] w-[70px] overflow-x-scroll nobar mt-5">
							<p className="text-xs">player</p>
							<p className="md:text-4xl text-xl">
								{users[(player_index + i) % 4]}
							</p>
						</div>
						<Oponent tehai={playerTehai} kawa={kawas[(player_index + i) % 4]} />
					</div>
				))}
			</div>

			{results === null ? (
				<>
					{gameEnd ? (
						<div className="z-50 flex items-center fixed top-[50%] left-[0%] right-[0%] w-fit m-auto">
							<div className="loader"></div>
							<p className="text-pink-700 ml-5">点数計算中</p>
						</div>
					) : (
						<></>
					)}
				</>
			) : (
				<div className="shadow rounded-[20px] z-50 text-white overflow-y-scroll nobar bg-origin border-gray-800 md:max-w-[70%] max-w-[90%] md:px-20 px-5 py-10 h-[80%] fixed top-[0%] bottom-[0%] m-auto left-[0%] right-[0%]">
					<div className="flex items-center justify-between">
						<h2 className="md:text-6xl text-xl">Result</h2>
						<div>
							<button
								className=" duration-200 hover:bg-[#38b48b] mt-5 text-md block border border-gray-500 rounded-[20px] md:w-[250px] w-[200px] text-center p-[10px]"
								onClick={() =>
									saveResult(
										results[player_index].tehai,
										results[player_index].point,
										results[player_index].ai_id
									)
								}>
								自分の結果を保存する
							</button>
							<Link
								className="duration-200  hover:bg-[#38b48b] mt-5 text-xl block border border-gray-500 rounded-[20px] md:w-[250px] w-[200px] text-center p-[10px]"
								to="/">
								HOME →
							</Link>
						</div>
					</div>

					{/* <div className="mt-5">
						<div className="flex items-center">
							<div>
								<p className="text-4xl">{player_name}</p>
								<p className="text-gray-400">
									{aiNames[results[player_index].ai_id - 1]}
								</p>
							</div>
							<p className="ml-5 text-4xl text-origin">
								{results[player_index].point}
							</p>
						</div>

						{results[player_index].tehai.map((hai, i) => (
							<div className="inline-block" key={i}>
								<Hai hai={hai} />
							</div>
						))}
					</div> */}
					{[0, 1, 2, 3]
						.map((i) => ({
							index: i,
							point: results[(player_index + i) % 4].point,
						}))
						.sort((a, b): number => Number(b.point) - Number(a.point))
						.map(({ index }) => (
							<div key={index} className="mt-5">
								<div className="flex items-center">
									<div>
										<p className="text-4xl">
											{users[(player_index + index) % 4]}
										</p>
										<p className="text-gray-400">
											{aiNames[results[(player_index + index) % 4].ai_id - 1]}
										</p>
									</div>

									<p className="ml-5 text-4xl text-origin">
										{results[(player_index + index) % 4].point}
									</p>
								</div>

								{results[(player_index + index) % 4].tehai.map((hai, i) => (
									<div className="inline-block">
										<Hai hai={hai} key={i} />
									</div>
								))}
							</div>
						))}
				</div>
			)}
		</div>
	);
};

export default OnLineGame;
