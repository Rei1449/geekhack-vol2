import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../dialog";

import { EntryRoom } from "../OnlineGame/EntryRoom";
import MakeRoom from "../OnlineGame/MakeRoom";

export default function Room() {
	return (
		<div className="w-screen h-screen bg-[#151515]">
			<h1 className="md:text-[220px] text-[100px] pt-[100px] font-bold text-[#9c4efb] m-auto w-fit leading-none">
				Three
			</h1>
			<p className="text-origin text-4xl m-auto w-fit">online game</p>
			<div className="flex flex-wrap justify-between md:w-[45%] w-[80%] m-auto mt-20">
				<Dialog>
					<DialogTrigger className="duration-200 hover:bg-[#38b48b] mt-5 text-2xl block border border-gray-500 rounded-[20px] w-[300px] text-center p-[20px]">
						entry room →
					</DialogTrigger>
					<DialogContent className="text-white overflow-y-scroll nobar bg-origin border-gray-800 md:min-w-[70%]  md:p-20 p-5 h-[80%]">
						<DialogHeader>
							<EntryRoom />
						</DialogHeader>
					</DialogContent>
				</Dialog>
				<Dialog>
					<DialogTrigger className="duration-200 hover:bg-[#38b48b] mt-5 text-2xl block border border-gray-500 rounded-[20px] w-[300px] text-center p-[20px]">
						make room →
					</DialogTrigger>
					<DialogContent className="text-white overflow-y-scroll nobar bg-origin border-gray-800 md:min-w-[70%] md:p-20 p-5 h-[80%]">
						<DialogHeader>
							<MakeRoom />
						</DialogHeader>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
