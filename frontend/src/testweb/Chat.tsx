import { useLocation } from "react-router-dom";
import SendText from "./SendText";

const Chat = () => {
	const location = useLocation();
	//console.log(location.state["roomId"])
	const userName = localStorage.getItem("name");
	const roomId = location.state["roomId"];

	const wb = new WebSocket(`ws://localhost:8081/ws/${userName}/room/${roomId}`);
	return (
		<>
			<div>ルームナンバー:{location.state["roomId"]}</div>
			<SendText wb={wb} userName={userName} roomId={roomId} />
		</>
	);
};

export default Chat;
