import { useState } from "react"
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [userName, setUserName] = useState("");
  const [entryId, setEntryId] = useState("");
  const localUserName = localStorage.getItem("name")
  console.log(localUserName)

  const navigate = useNavigate();

  const createUser = () => {
    localStorage.setItem("name", userName)
  }

  const createRoom = async() => {
    const res = await fetch("http://localhost:8081/create_room", {
      method: "POST",
      headers: {
				"Content-Type": "application/json",
			},
      body: JSON.stringify({
				user_name: localUserName,
			}),
    });
    const data = await res.json();
    console.log(data["room_id"])
    navigate("/chat", {state: {roomId: data["room_id"]}})
  }
  console.log(userName)

  const entryRoom = async() => {
    const res = await fetch("http://localhost:8081/entry_room", {
      method: "POST",
      headers: {
				"Content-Type": "application/json",
			},
      body: JSON.stringify({
				user_name: localUserName,
        room_id: entryId
			}),
    });
    const data = await res.json();
    console.log(data)
    navigate("/chat", {state: {roomId: entryId}})
  }

  return (
    <>
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
        <button onClick={entryRoom}>ルームに入る</button>
      </>
      }
    </>
  )
}

export default Home
