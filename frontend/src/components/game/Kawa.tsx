import type { HaiInfo } from "../../types/HaiInfo";
import Hai from "./Hai";

interface Props {
	kawa: HaiInfo[];
}

const Kawa: React.VFC<Props> = ({ kawa }) => {
	const splitKawa: HaiInfo[][] = [];
	for (let i = 0; i < kawa.length / 6; i++) {
		splitKawa.push(kawa.slice(i * 6, i * 6 + 6));
	}
	return (
		<div className="mb-4">
			{splitKawa.map((kawa, i) => (
				<div className="flex opacity-85" key={i}>
					{kawa.map((hai, j) => (
						<Hai hai={hai} key={j} />
					))}
				</div>
			))}
		</div>
	);
};

export default Kawa;
