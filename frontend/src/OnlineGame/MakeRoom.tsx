import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ENDPOINT_URL, USER_NAME_KEY, WS_URL } from "./constants";
import { EntryRoom_T, GameStart_T } from "./types";

const MakeRoom = () => {
	const [userName, setUserName] = useState("");
	const [entryId, setEntryId] = useState("");
	let localUserName = localStorage.getItem(USER_NAME_KEY);
	const [users, setUsers] = useState<string[]>([]);
	const [canStart, setCanStart] = useState<boolean>(false);
	const [isEnter, setIsEnter] = useState(false);
	console.log(localUserName);
	console.log(users);

	const navigate = useNavigate();

	const createUser = () => {
		localStorage.setItem(USER_NAME_KEY, userName);
		localUserName = localStorage.getItem(USER_NAME_KEY);
	};

	const createRoom = async () => {
		const res = await fetch(ENDPOINT_URL + "create_room", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user_name: localUserName,
			}),
		});
		if (res.ok) {
			const data = await res.json();
			setUsers([...users, localUserName || "NoUser"]);
			const newEntryId = data.room_id;
			// const wb = new WebSocket(WS_URL+`ws/${localUserName}/room/${newEntryId}`);
			// connectWS(newEntryId);
			setEntryId(newEntryId);
			// console.log(data["room_id"]);
			setIsEnter(true);
			console.log(data);
			// navigate("/chat", {state: {roomId: data["room_id"]}})
		} else {
			console.log(await res.json());
		}
	};

	const gameStart = async () => {
		const res = await fetch(ENDPOINT_URL + "game_start", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user_name: localUserName,
				room_id: entryId,
			}),
		});
		const data = await res.json();
		console.log(data);
	};

	// webSocket
	useEffect(() => {
		if (entryId == "") {
			return;
		}
		const wb = new WebSocket(WS_URL + `ws/${localUserName}/room/${entryId}`);
		wb.addEventListener("message", function (event) {
			const data = JSON.parse(event.data);
			console.log("onmessage");
			console.log(data);
			if ("entry" in data) {
				catchParticipant(data);
				return;
			}
			if ("game_start" in data) {
				catchGameStart(data);
				return;
			}
			console.log("no appropriate type");
			console.log(data);
		});
	}, [users, entryId]);

	const catchParticipant = (data: EntryRoom_T) => {
		console.log("catch participant");
		const newUsers = [...users];
		newUsers.push(data.entry);
		if (newUsers.length == 4) {
			setCanStart(true);
		}
		setUsers(newUsers);
	};

	const catchGameStart = (data: GameStart_T) => {
		console.log("catch gamestart");
		console.log(data);
		navigate("/onlinegame", {
			state: { users: users, isGM: true, room_id: entryId },
		});
	};

	return (
		<div className="">
			<div className="flex justify-between items-center">
				<div className="text-4xl font-bold">HOME</div>
				{canStart ? (
					<>
						<button
							onClick={gameStart}
							className="duration-200 hover:bg-[#38b48b] mt-5 text-2xl block border border-gray-500 rounded-[20px] w-[300px] text-center p-[20px]">
							ゲーム開始
						</button>
					</>
				) : (
					<></>
				)}
			</div>

			{isEnter && (
				<div className="flex items-center mt-10">
					<div className="loader"></div>
					<p className="text-[#d016ff] text-xs ml-5">
						メンバーが集まるのを待っています。モーダルを閉じないでください。また、下記のコードをメンバーに共有してください
					</p>
				</div>
			)}
			{localUserName === null ? (
				<>
					<input
						value={userName}
						onChange={(e) => setUserName(e.target.value)}
						className="text-black duration-200 mt-5 text-2xl block border rounded-[20px] w-[300px] text-center px-[20px] py-[10px] focus:outline-none"
					/>
					<button onClick={createUser}>名前を決定</button>
				</>
			) : (
				<>
					{isEnter === false && (
						<>
							{/* <input
								value={entryId}
								onChange={(e) => setEntryId(e.target.value)}
								className="text-black duration-200 mt-5 text-2xl block border rounded-[20px] w-[300px] text-center px-[20px] py-[10px] focus:outline-none"
							/> */}
							<button
								onClick={createRoom}
								className="text-origin font-bold text-4xl mt-10">
								ルームを作成する →
							</button>
						</>
					)}
					<p className="mt-10 text-4xl">{entryId}</p>
				</>
			)}
			<div className="grid grid-cols-2 gap-3 w-full mt-5">
				{users.map((user, i) => (
					<div
						key={i}
						className="w-full border border-gray-700 rounded-[20px] p-10">
						<p className="text-md">player</p>
						<p className="text-6xl overflow-scroll nobar">{user}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default MakeRoom;
