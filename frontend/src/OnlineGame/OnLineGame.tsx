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
import { useLocation } from "react-router-dom";
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
		"https://hack-fast-api-65ce6a3d3ac6.herokuapp.com/" + `api/${ai_id}`,
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

	const agari = (ai_id: number) => {
		setIsMyTurn(false);
		sendAgariUser(room_id, player_name);
		calcPoint(room_id, player_name, playerTehai, ai_id);
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
	};
	const [num, setNum] = useState<number>(0);
	const handleAiNum = (num: number) => {
		setNum(num);
	};
	return (
		<div className="w-screen h-screen bg-[#151515] p-10">
			{isGM ? <button onClick={startGame}>ゲーム開始</button> : <></>}
			{isMyTurn && !agariUsers[player_index] ? (
				<>
					<Player
						tehai={playerTehai}
						kawa={kawas[player_index]}
						discardMethod={discard}
					/>
					<Dialog>
						<DialogTrigger className="duration-200 hover:bg-[#38b48b] mt-5 text-2xl block border border-gray-500 rounded-[20px] w-[300px] text-center p-[20px]">
							あがる →
						</DialogTrigger>
						<DialogContent className="text-white overflow-y-scroll nobar bg-origin border-gray-800 min-w-[70%] p-20 h-[80%]">
							<DialogHeader>
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
					<UnTurnHai tehai={playerTehai} kawa={kawas[player_index]} />
				</>
			)}
			{[1, 2, 3].map((i) => (
				<div key={`oponent${i}`}>
					<p>{users[(player_index + i) % 4]}</p>
					<Oponent tehai={playerTehai} kawa={kawas[(player_index + i) % 4]} />
				</div>
			))}
			{results === null ? (
				<>{gameEnd ? <p>点数計算中</p> : <></>}</>
			) : (
				<>
					<h2>結果</h2>
					<button
						onClick={() =>
							saveResult(
								results[player_index].tehai,
								results[player_index].point,
								results[player_index].ai_id
							)
						}>
						自分の結果を保存する
					</button>
					<div>
						<p>{player_name}</p>
						<p>{aiNames[results[player_index].ai_id - 1]}</p>
						<p>{results[player_index].point}</p>
						{results[player_index].tehai.map((hai, i) => (
							<div className="inline-block" key={i}>
								<Hai hai={hai} />
							</div>
						))}
					</div>
					{[1, 2, 3].map((i) => (
						<div key={i}>
							<p>{users[(player_index + i) % 4]}</p>
							<p>{aiNames[results[(player_index + i) % 4].ai_id - 1]}</p>
							<p>{results[(player_index + i) % 4].point}</p>
							{results[(player_index + i) % 4].tehai.map((hai, i) => (
								<div className="inline-block">
									<Hai hai={hai} key={i} />
								</div>
							))}
						</div>
					))}
				</>
			)}
		</div>
	);
};

export default OnLineGame;