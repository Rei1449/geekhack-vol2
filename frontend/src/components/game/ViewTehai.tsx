import type { HaiInfo } from "../../types/HaiInfo";

interface Props {
	hai: HaiInfo;
}

const HaiInPlayerTehai: React.VFC<Props> = ({ hai }) => {
	const imgSrc = "/hai-img/hai" + hai.kind + "_" + hai.number + ".png";
	return (
		<>
			<img src={imgSrc} className="w-[40px] " />
		</>
	);
};

export default HaiInPlayerTehai;
