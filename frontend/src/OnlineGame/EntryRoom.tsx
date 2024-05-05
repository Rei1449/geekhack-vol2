import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { ENDPOINT_URL, USER_NAME_KEY, WS_URL } from "./constants";

const EntryRoom = () => {
  const [userName, setUserName] = useState("");
  const [entryId, setEntryId] = useState("");
  const localUserName = localStorage.getItem(USER_NAME_KEY);
  const [users, setUsers] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const createUser = () => {
    localStorage.setItem(USER_NAME_KEY, userName)
  }

  const entryRoom = async() => {
    const res = await fetch(ENDPOINT_URL+"entry_room", {
      method: "POST",
      headers: {
				"Content-Type": "application/json",
			},
      body: JSON.stringify({
				user_name: localUserName,
        room_id: entryId
			}),
    });
    if (res.ok) {
      const data = await res.json();
      console.log(data);
      if (data.hasOwnProperty('success')) {
        setUsers(data.success);
      } else {
        setError(data.fail);
      }
    } else {
      console.log("error");
    }
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

  const catchParticipant = (data: any) => {
    console.log("catch participant");
    setUsers([...users, data.entry]);
  }

  const catchGameStart = (data: any) => {
    console.log("catch gamestart");
    console.log(data);
    navigate("/onlinegame", {state: {users: users, isGM: false, room_id: entryId}});
  };

  return (
    <div className="text-black">
      <div>ホーム</div>
      <p>{error}</p>
      {localUserName === null ?
      <>
        <input value={userName} onChange={e => setUserName(e.target.value)}/>
        <button onClick={createUser}>名前を決定</button>
      </>
      :
      <>
        <input value={entryId} onChange={e => setEntryId(e.target.value)}/>
        <button onClick={entryRoom}>ルームに入る</button>
      </>
      }
      {users.map((user, i) => (
        <p key={i}>{user}</p>
      ))}
    </div>
  )
}

export default EntryRoom
