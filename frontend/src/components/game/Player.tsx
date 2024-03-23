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
			<div className="bg-black opacity-60 fixed  origin-middle rounded-[20px] w-[500px] min-h-[500px]">
				<Kawa kawa={kawa} />
			</div>

			<PlayerTehai tehai={tehai} discardMethod={discardMethod} />
		</div>
	);
};

export default Player;
