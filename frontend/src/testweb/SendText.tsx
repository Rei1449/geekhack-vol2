import { useState } from "react";

const SendText = (props) => {
	console.log(props);
	const { wb, userName, roomId } = props;
	const [text, setText] = useState("");
	const [messages, setMessages] = useState(["test"]);

	wb.onmessage = function (event) {
		console.log(event.data);
		setMessages([...messages, event.data]);
	};

	const sendMessage = async (event) => {
		event.preventDefault();
		const res = await fetch("http://localhost:8081/msg", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user_name: userName,
				room_id: roomId,
				message: text,
			}),
		});
		setText("");
	};
	return (
		<>
			<input
				type="text"
				value={text}
				onChange={(e) => setText(e.target.value)}
			/>
			<button onClick={sendMessage}>メッセージを送る</button>
			{messages.map((value) => (
				<>
					<div className="abc">{value}</div>
				</>
			))}
		</>
	);
};

export default SendText;
