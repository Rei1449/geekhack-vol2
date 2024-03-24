import { useState } from "react";
import { ENDPOINT_URL, USER_NAME_KEY } from "./components/game/Constants";

const Register = () => {
	const [userName, setUserName] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string>("");
	//const [isLoading, setIsLoading] = useState<boolean>(false);
	const resisterUser = async () => {
		//setIsLoading(true);
		const res = await fetch(ENDPOINT_URL + "user/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: userName,
				password: password,
			}),
		});
		if (res.ok) {
			const data = await res.json();
			console.log(data);
			//setIsLoading(false);
			if (userName == data) {
				localStorage.setItem(USER_NAME_KEY, data);
				setError("");
			} else {
				setError(data.error);
			}
		} else {
			console.log("error");
		}
	};
	return (
		<div className="bg-black">
			<p>ユーザー名</p>
			<input
				value={userName}
				onChange={(e) => {
					setUserName(e.target.value);
				}}
			/>
			<p>パスワード</p>
			<input
				value={password}
				onChange={(e) => {
					setPassword(e.target.value);
				}}
			/>
			<p>{error}</p>
			<button onClick={resisterUser}>新規登録</button>
		</div>
	);
};

export default Register;
