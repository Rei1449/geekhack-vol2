interface Props {
	onClickMethod: () => void;
}

const AgariButton: React.VFC<Props> = ({ onClickMethod }) => {
	return (
		<button className="w-[200px] focus:border-none" onClick={onClickMethod}>
			あがり
		</button>
	);
};

export default AgariButton;
