import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ENDPOINT_URL, USER_NAME_KEY, WS_URL } from "./constants";

export const EntryRoom = () => {
	const [userName, setUserName] = useState("");
	const [entryId, setEntryId] = useState("");
	const localUserName = localStorage.getItem(USER_NAME_KEY);
	const [users, setUsers] = useState<string[]>([]);
	const [error, setError] = useState<string>("");
	const [isEnter, setIsEnter] = useState(false);

	const navigate = useNavigate();

	const createUser = () => {
		localStorage.setItem(USER_NAME_KEY, userName);
	};

	const entryRoom = async () => {
		const res = await fetch(ENDPOINT_URL + "entry_room", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user_name: localUserName,
				room_id: entryId,
			}),
		});
		if (res.ok) {
			const data = await res.json();
			console.log(data);
			if (data.hasOwnProperty("success")) {
				setUsers(data.success);
				setIsEnter(true);
			} else {
				setError(data.fail);
			}
		} else {
			console.log("error");
		}
	};

	// webSocket
	useEffect(() => {
		if (entryId == "") {return;}
		const wb = new WebSocket(WS_URL+`ws/${localUserName}/room/${entryId}`);
		wb.addEventListener("message", function(event) {
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

	const catchParticipant = (data: any) => {
		console.log("catch participant");
		setUsers([...users, data.entry]);
	};

	const catchGameStart = (data: any) => {
		console.log("catch gamestart");
		console.log(data);
		navigate("/onlinegame", {
			state: { users: users, isGM: false, room_id: entryId },
		});
	};

	return (
		<div className="">
			<div className="text-4xl font-bold">HOME</div>
			<p>{error}</p>
			{isEnter && (
				<div className="flex items-center mt-10">
					<div className="loader"></div>
					<p className="text-[#d016ff] text-xs ml-5">
						メンバーが集まるのを待っています。モーダルを閉じないでください
					</p>
				</div>
			)}
			{isEnter === false && (
				<>
					{localUserName === null ? (
						<>
							<p className="mt-5">masterからコードをもらい、入力してください</p>
							<input
								value={userName}
								onChange={(e) => setUserName(e.target.value)}
								className="duration-200 mt-5 text-2xl block border rounded-[20px] w-[300px] text-center px-[20px] py-[10px] focus:outline-none"
							/>
							<button onClick={createUser}>名前を決定</button>
						</>
					) : (
						<>
							<p className="mt-5 text-xs">
								masterからコードをもらい、入力してください.
							</p>
							<input
								value={entryId}
								className="text-black duration-200 mt-5 text-2xl block border rounded-[20px] w-[300px] text-center px-[20px] py-[10px] focus:outline-none"
								onChange={(e) => setEntryId(e.target.value)}
							/>
							<button
								onClick={entryRoom}
								className="rounded-[20px] w-[300px] text-center px-[20px] py-[10px] block">
								ルームに入る
							</button>
						</>
					)}
				</>
			)}

			<div className="grid grid-cols-2 gap-3 w-full mt-5">
				{users.map((user, i) => (
					<div
						key={i}
						className="w-full border border-gray-700 rounded-[20px] p-10">
						<p className="text-md">player</p>
						<p className="text-6xl overflow-scroll">{user}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default EntryRoom;
