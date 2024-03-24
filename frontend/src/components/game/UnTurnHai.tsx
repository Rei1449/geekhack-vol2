//import type { HaiInfo } from "../../types/HaiInfo";
//import HaiInPlayerTehai from "./HaiInPlayerTehai";

import Kawa from "./Kawa";

export default function UnTurnHai(props: any) {
	const { tehai, kawa } = props;
	return (
		<div className="m-4">
			<div className="fixed fixed-element0 top-[55%] left-[50%]">
				<Kawa kawa={kawa} />
			</div>

			<div className="flex fixed bottom-[2%] left-[5%] opacity-70">
				{tehai.map((hai: any, index: number) => {
					if (index < 13) {
						return (
							<img
								src={"/hai-img/hai" + hai.kind + "_" + hai.number + ".png"}
								key={index}
								className="w-20 duration-300 cursor-pointer"
							/>
						);
					} else {
						return (
							<img
								src={"/hai-img/hai" + hai.kind + "_" + hai.number + ".png"}
								key={index}
								className="w-20 duration-300 cursor-pointer"
							/>
						);
					}
				})}
			</div>
		</div>
	);
}
