import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "./dialog";

export default function Home() {
	interface UserData {
		id: number;
		user_name: string;
		hand: string;
		score: number;
		created_at: string;
		updated_at: string;
	}
	const getRecord = async () => {
		const res = await fetch("http://localhost:8080/user/string");
		if (res.ok) {
			const data = await res.json();
			console.log(data);
			setUserData(data);
		}
	};
	useEffect(() => {
		getRecord();
	}, []);
	const [userData, setUserData] = useState([]);
	return (
		<div className="w-screen h-screen bg-[#151515]">
			<div className="flex items-center justify-between px-10 pt-10">
				<div className="w-[45%] bg-black h-[300px]"></div>
				<div className="w-[45%]">
					<h1 className="text-[200px] text-[#9c4efb]">Three</h1>
					<div className="m-auto ">
						<Link
							className="duration-200  hover:bg-[#38b48b] text-2xl block border border-gray-500 rounded-[20px] w-[300px] text-center p-[20px]"
							to="/game">
							Play Three →
						</Link>

						<Dialog>
							<DialogTrigger className="duration-200  hover:bg-[#38b48b] mt-5 text-2xl block border border-gray-500 rounded-[20px] w-[300px] text-center p-[20px]">
								show record →
							</DialogTrigger>
							<DialogContent className="bg-origin border-gray-800 min-w-[70%] p-20 max-h-[600px] h-[80%]">
								<DialogHeader>
									{userData.map((data: UserData) => (
										<div key={data.id} className="">
											<p className="mt-5">{data.score}</p>
											<p></p>
										</div>
									))}
								</DialogHeader>
							</DialogContent>
						</Dialog>
						<Link
							className="duration-200  hover:bg-[#38b48b] mt-5 text-2xl block border border-gray-500 rounded-[20px] w-[300px] text-center p-[20px]"
							to="/rule">
							Three's rule →
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
