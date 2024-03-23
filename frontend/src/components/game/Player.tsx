import type { HaiInfo } from "../../types/HaiInfo";
import Kawa from "./Kawa";
import PlayerTehai from "./PlayerTehai";

interface Props {
	tehai: HaiInfo[];
	kawa: HaiInfo[];
	discardMethod: (hai: HaiInfo) => void;
}

const Player: React.VFC<Props> = ({ tehai, kawa, discardMethod }) => {
	return (
		<div className="m-4">
			<div className="fixed top-[50%] left-[50%]">
				<Kawa kawa={kawa} />
			</div>

			<PlayerTehai tehai={tehai} discardMethod={discardMethod} />
		</div>
	);
};

export default Player;
