import type { HaiInfo } from "../../types/HaiInfo";
import Kawa from "./Kawa";
import OponentTehai from "./OponentTehai";

interface Props {
	tehai: HaiInfo[];
	kawa: HaiInfo[];
	rotate?: number;
}

const Oponent: React.VFC<Props> = ({ tehai, kawa, rotate = 0 }) => {
	return (
		<div className={"m-4 duration-500 rotate-" + rotate}>
			<Kawa kawa={kawa} />
			<div className="hidden">
				<OponentTehai tehai={tehai} />
			</div>
		</div>
	);
};

export default Oponent;
