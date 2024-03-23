import "../../index.css";
import type { HaiInfo } from "../../types/HaiInfo.tsx";
import { useEffect, useState } from "react";
import Player from "./Player.tsx";
import Oponent from "./Oponent.tsx";
import AgariButton from "./AgariButton.tsx";
import {
	GetHaiName,
	ShuffleArray,
	IsSameHai,
	SortHaiArray,
} from "./CommonMethods.tsx";
import { UNDEFINED_HAI } from "./Constants.tsx";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from "../../dialog";

import ViewTehai from "./ViewTehai";
import { Link } from "react-router-dom";

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

	const progressTurn = (discardHai: HaiInfo): void => {
		discard(discardHai);
		// cpuはつもぎり
		setOponent1Kawa([...oponent1Kawa, popYama()]);
		setOponent2Kawa([...oponent2Kawa, popYama()]);
		setOponent3Kawa([...oponent3Kawa, popYama()]);
		if (yama.length == 0) {
			window.alert("Game End");
		}
		tumo();
	};
	const [isGame, setIsGame] = useState(false);
	const startGame = (): void => {
		setAddClass(true);
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
	const [num, setNum] = useState(0);
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
		const res = await fetch(`http://localhost:8080/api/${num}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ arr: stringTehai }),
		});
		if (res.ok) {
			const data = await res.json();
			console.log(data);
			setIsLoading(false);
			setShowData(data);
		} else {
			console.log("error");
		}
	};
	useEffect(() => {
		VANTA.DOTS({
			el: "#game",
			mouseControls: true,
			touchControls: true,
			gyroControls: false,
			minHeight: 200.0,
			minWidth: 200.0,
			scale: 1.0,
			scaleMobile: 1.0,
			color: 0x6e20ff,
			color2: 0x6e20ff,
			size: 3,
			spacing: 14.0,
			showLines: false,
		});
	}, []);
	const [addClass, setAddClass] = useState<boolean>(false);
	// const timeoutId = setTimeout(() => {
	// 	setAddClass(true);
	// }, 700);

	return (
		<div id="game" className="w-screen h-screen">
			{isGame ? (
				<>
					<p>ゲーム中</p>
				</>
			) : (
				<>
					<button
						onClick={() => {
							startGame();
						}}>
						Game Start
					</button>
				</>
			)}
			<div
				className={
					addClass ? "opacity-100 duration-300" : "opacity-0 duration-300"
				}>
				<Player
					tehai={playerTehai}
					kawa={playerKawa}
					discardMethod={progressTurn}
				/>
			</div>

			<div className="">
				<Oponent tehai={oponent1Tehai} kawa={oponent1Kawa} />
				<Oponent tehai={oponent2Tehai} kawa={oponent2Kawa} />
				<Oponent tehai={oponent3Tehai} kawa={oponent3Kawa} />
			</div>

			<Dialog>
				<DialogTrigger>
					<p>select AI</p>
					<div>
						{isLoading && (
							<>
								<p>loading</p>
							</>
						)}
					</div>
				</DialogTrigger>
				<DialogContent className="bg-origin border-gray-900 min-w-[70%] p-20">
					<DialogHeader className="w-full overflow-scroll">
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
								<div className="text-white flex items-center ">
									<span className="mt-10 text-xl">Select AI</span>
								</div>
								<div className="flex justify-between">
									<div
										onClick={() => handleAiNum(1)}
										className={
											num === 1
												? "hover:scale-95 duration-200  hover:bg-slate-600 mt-5 bg-slate-500 cursor-pointer  border-gray-800 border w-[32%] rounded-[20px] p-[20px] text-4xl font-bold text-white"
												: "hover:scale-95 duration-200  hover:bg-slate-600 mt-5 bg-[#131313] cursor-pointer  border-gray-800 border w-[32%] rounded-[20px] p-[20px] text-4xl font-bold text-white"
										}>
										LLaMA
									</div>
									<div
										onClick={() => handleAiNum(2)}
										className={
											num === 2
												? "hover:scale-95 duration-200  hover:bg-slate-600 mt-5 bg-slate-500 cursor-pointer  border-gray-800 border w-[32%] rounded-[20px] p-[20px] text-4xl font-bold text-white"
												: "hover:scale-95 duration-200  hover:bg-slate-600 mt-5 bg-[#131313] cursor-pointer  border-gray-800 border w-[32%] rounded-[20px] p-[20px] text-4xl font-bold text-white"
										}>
										{" "}
										chatGPT
									</div>
									<div
										onClick={() => handleAiNum(3)}
										className={
											num === 3
												? "hover:scale-95 duration-200  hover:bg-slate-600 mt-5 bg-slate-500 cursor-pointer  border-gray-800 border w-[32%] rounded-[20px] p-[20px] text-4xl font-bold text-white"
												: "hover:scale-95 duration-200  hover:bg-slate-600 mt-5 bg-[#131313] cursor-pointer  border-gray-800 border w-[32%] rounded-[20px] p-[20px] text-4xl font-bold text-white"
										}>
										{" "}
										xxxxx
									</div>
								</div>
								{num === 0 ? (
									<>
										<button>agaru</button>
									</>
								) : (
									<>
										<AgariButton onClickMethod={() => tryApi(playerTehai)} />
									</>
								)}
							</>
						) : (
							<>
								<div className="text-white flex items-center ">
									<span className="mt-10 text-xl">Score</span>
								</div>
								<p className="text-[200px]">{showData}</p>
								<Link
									className="mt-10 border border-gray-700 p-[10px] w-[200px] text-center rounded-[20px]"
									to="/">
									home→
								</Link>
							</>
						)}
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Game;
