import type { HaiInfo } from "../../types/HaiInfo";

interface Props {
	hai: HaiInfo;
	discardMethod: (hai: HaiInfo) => void;
}

const HaiInPlayerTehai: React.VFC<Props> = ({ hai, discardMethod }) => {
	const imgSrc = "/hai-img/hai" + hai.kind + "_" + hai.number + ".png";
	return (
		<>
			<img
				src={imgSrc}
				className="w-20 duration-300 cursor-pointer hover:-translate-y-4"
				onClick={() => discardMethod(hai)}
			/>
		</>
	);
};

export default HaiInPlayerTehai;
