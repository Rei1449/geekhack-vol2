import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { ENDPOINT_URL, USER_NAME_KEY, WS_URL } from "./constants";
import { EntryRoom_T, GameStart_T } from "./types";

const MakeRoom = () => {
  const [userName, setUserName] = useState("");
  const [entryId, setEntryId] = useState("");
  let localUserName = localStorage.getItem(USER_NAME_KEY);
  const [users, setUsers] = useState<string[]>([]);
  const [canStart, setCanStart] = useState<boolean>(false);
  console.log(localUserName);
  console.log(users);

  const navigate = useNavigate();

  const createUser = () => {
    localStorage.setItem(USER_NAME_KEY, userName);
    localUserName = localStorage.getItem(USER_NAME_KEY);
  }

  const createRoom = async() => {
    const res = await fetch(ENDPOINT_URL+"create_room", {
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
      console.log(data);
      // navigate("/chat", {state: {roomId: data["room_id"]}})
    } else {
      console.log(await res.json());
    }
  }

  const gameStart = async() => {
    const res = await fetch(ENDPOINT_URL+"game_start", {
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
  }

  // webSocket
  const wb = new WebSocket(WS_URL+`ws/${localUserName}/room/${entryId}`);
  wb.addEventListener("message", function(event) {
    const data = JSON.parse(event.data);
    console.log("onmessage");
    console.log(data);
    if ("entry" in data) {catchParticipant(data); return;}
    if ("game_start" in data) {catchGameStart(data); return;}
    console.log("no appropriate type");
    console.log(data);
  });

  const catchParticipant = (data: EntryRoom_T) => {
    console.log("catch participant");
    const newUsers = [...users];
    newUsers.push(data.entry);
    if (newUsers.length == 4) {
      setCanStart(true);
    }
    setUsers(newUsers);
  }

  const catchGameStart = (data: GameStart_T) => {
    console.log("catch gamestart");
    console.log(data);
    navigate("/onlinegame", {state: {users: users, isGM: true, room_id: entryId}});
  };

  return (
    <div className="text-black">
      <div>ホーム</div>
      {localUserName === null ?
      <>
        <input value={userName} onChange={e => setUserName(e.target.value)}/>
        <button onClick={createUser}>名前を決定</button>
      </>
      :
      <>
        <button onClick={createRoom}>ルームを作成する</button>
        <input value={entryId} onChange={e => setEntryId(e.target.value)}/>
      </>
      }
      {users.map((user, i) => (
        <p key={i}>{user}</p>
      ))}
      {canStart ?
      <>
        <button onClick={gameStart}>ゲーム開始</button>
      </>
      :
      <>
      </>
      }
    </div>
  )
}

export default MakeRoom
