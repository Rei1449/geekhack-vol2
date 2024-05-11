import type { HaiInfo } from "../../types/HaiInfo";
import HaiInPlayerTehai from "./HaiInPlayerTehai";

interface Props {
	tehai: HaiInfo[];
	discardMethod: (hai: HaiInfo) => void;
}

const PlayerTehai: React.VFC<Props> = ({ tehai, discardMethod }) => {
	return (
		<div className="flex fixed bottom-[2%] left-[5%] opacity-90 overflow-x-scroll overflow-y-visible">
			{tehai.map((hai, index) => {
				if (index < 13) {
					return (
						<HaiInPlayerTehai
							hai={hai}
							key={index}
							discardMethod={() => discardMethod(hai)}
						/>
					);
				} else {
					return (
						<div
							className="ml-4 overflow-x-scroll overflow-y-visible"
							key={index}>
							<HaiInPlayerTehai
								hai={hai}
								discardMethod={() => discardMethod(hai)}
							/>
						</div>
					);
				}
			})}
		</div>
	);
};

export default PlayerTehai;
