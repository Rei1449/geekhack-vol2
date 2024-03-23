interface Props {
	onClickMethod: () => void;
}

const AgariButton: React.VFC<Props> = ({ onClickMethod }) => {
	return (
		<button
			onClick={onClickMethod}
			className="hover:bg-[#38b48b] mt-20 duration-300 m-auto text-xl block border border-gray-500 rounded-[20px] w-[200px] text-center p-[10px]">
			和がる!!!
		</button>
	);
};

export default AgariButton;
